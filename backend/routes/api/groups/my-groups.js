import express from 'express';
import { createRequire } from 'module';
import path from 'path';
export const router = express.Router();
import auth from '../../../middleware/auth.js';
import { splitwisedb } from '../../../config/database.js';
const __dirname = path.resolve(path.dirname(''));

const require = createRequire(import.meta.url);
const { check, validationResult } = require('express-validator/');
import multer from 'multer';
const destPath = __dirname + '/public/uploaded_images/groups';
const storage = multer.diskStorage({
  destination: destPath,
  filename: (req, file, cb) => {
    cb(null, 'group_' + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === 'image/jpeg' ||
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg'
  ) {
    cb(null, true);
  } else {
    cb(null, false);
    return cb(
      new Error(
        'File type not supported. Allowed extensions are .jpb, .jpeg, .png'
      )
    );
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter,
});

// @route GET api/my-groups
// @desc Get current user's groups
// @access Private
router.get('/', auth, async (req, res) => {
  try {
    let mygroupList = await splitwisedb.getGroupsList(req.user.key);

    if (!mygroupList.length) {
      return res.status(400).json({
        errors: [
          {
            msg: `Create a group to get started!`,
          },
        ],
      });
    }
    res.json(mygroupList);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

const getUniqueListBy = (arr, key) => {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
};

// @route post api/my-groups/accept-invitation
// @desc accept group invitation
// @access Private
router.post('/accept-invitation', auth, async (req, res) => {
  const groupID = req.body.groupID;
  const groupName = await splitwisedb.getGroupName(groupID);
  try {
    const acceptInvitation = await splitwisedb.acceptInvitation(
      groupID,
      req.user.key
    );
    const userName = await splitwisedb.getUserName(req.user.id);

    const activity = await splitwisedb.addActivity(
      'accepted invitation',
      groupID,
      groupName[0].groupName,
      userName[0].userName,
      req.user.key,
      userName[0].userName,
      req.user.key
    );
    return res.json('Updated');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// @route post api/my-groups/reject-invitation
// @desc reject group invitation
// @access Private
router.post('/reject-invitation', auth, async (req, res) => {
  const groupID = req.body.groupID;

  try {
    const checkBalance = await splitwisedb.getGroupBalances(groupID);
    const stringifyBal = JSON.stringify(checkBalance);
    const jsonBal = JSON.parse(stringifyBal);
    if (jsonBal && jsonBal.length > 0) {
      const found = jsonBal.find(
        (element) => element.memberEmail === req.user.key
      );
      if (found && Math.abs(found.total) > 0.5) {
        return res.status(400).json({
          errors: [
            {
              msg: `Settle up all the balances before leaving the group`,
            },
          ],
        });
      }
    }

    const createdBy = await splitwisedb.getCreatedBy(groupID);

    if (createdBy) {
      if (createdBy.createdBy === req.user.id && jsonBal.length > 0) {
        return res.status(400).json({
          errors: [
            {
              msg: `Delete the group if balances with other group members are not settled up`,
            },
          ],
        });
      }
    }
    const rejectInvitation = await splitwisedb.rejectInvitation(
      groupID,
      req.user.key
    );

    return res.json('Rejected Invitation');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server error');
  }
});

// @route GET api/my-groups/acc-groups
// @desc Get current user's groups
// @access Private
router.get('/acc-groups', auth, async (req, res) => {
  try {
    const mygroupList = await splitwisedb.getAcceptedGroups(req.user.key);

    if (!mygroupList.length) {
      return res.status(400).json({
        errors: [
          {
            msg: `Whoops! You dont belong to any groups yet!`,
          },
        ],
      });
    }
    const stringifyGroupList = JSON.stringify(mygroupList);
    const jsonGroupList = JSON.parse(stringifyGroupList);

    const unresolvedPromises = jsonGroupList.map(async (val) => {
      return await splitwisedb.getAcceptedMembers(val.groupID);
    });
    const acceptedMembers = await Promise.all(unresolvedPromises);
    const stringifyAcceptedMembers = JSON.stringify(acceptedMembers);
    const jsonMemberList = JSON.parse(stringifyAcceptedMembers);
    const merge = jsonMemberList.flat(1);
    const uniqueMembers = getUniqueListBy(merge, 'memberEmail');

    const individualGroupMembers = Object.values(
      merge.reduce(
        (result, { memberName, memberEmail, userPicture, groupID }) => {
          // Create new group
          if (!result[groupID])
            result[groupID] = {
              groupID,
              details: [],
            };
          // Append to group
          result[groupID].details.push({
            memberName,
            memberEmail,
            userPicture,
          });
          return result;
        },
        {}
      )
    );

    res.json({
      mygroupList: jsonGroupList,
      acceptedMembers: uniqueMembers,
      individualGroupMembers: individualGroupMembers,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

// @route POST api/my-groups/update-group/:group_id
// @desc Update group information
// @access Private

router.post(
  '/update-group/:group_id',
  [
    upload.single('selectedFile'),
    auth,
    [check('groupName', "First name can't be blank").not().isEmpty()],
  ],
  async (req, res) => {
    let selectedFile;
    const userID = req.user.id;

    const { groupName: name } = req.body;
    if (req.file) {
      selectedFile = req.file.filename;
    }

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      let checkUniqueGroupName = await splitwisedb.checkGroupName(name, userID);
      if (checkUniqueGroupName.length > 0) {
        return res.status(400).json({
          errors: [
            {
              msg: `Whoops! ${name} group already exists`,
            },
          ],
        });
      }
      let updatedGroup = await splitwisedb.updateGroup(
        req.params.group_id,
        name,
        selectedFile
      );

      return res.json(updatedGroup);
    } catch (error) {
      console.error(error);
      res.status(500).send('Server error');
    }
  }
);
