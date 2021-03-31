/* eslint-disable consistent-return */
import express from 'express';
import dotenv from 'dotenv';
import AWS from 'aws-sdk';
import passport from 'passport';

dotenv.config({ path: './config/.env' });
const router = express.Router();
export default router;

// S3configuraton
const S3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_BUCKET_REGION,
});

router.get('/:imageId', (req, res) => {
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: req.params.imageId,
  };
  S3.getObject(params, (err, data) => {
    if (err) {
      console.log(err);
      return res
        .status(400)
        .json({ errors: [{ msg: 'Error retrieving file' }] });
    }
    res.write(data.Body, 'binary');
    res.end(null, 'binary');
  });
});
