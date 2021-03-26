/* eslint-disable import/extensions */
import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import passport from 'passport';
import cors from 'cors';
import connectDB from './config/db.js';
import ps from './config/passport.js';

// Define routes
import usersRouter from './routes/api/users/users.js';
import loginRouter from './routes/api/users/login.js';
import profileRouter from './routes/api/users/profile.js';
import createGroupRouter from './routes/api/groups/new-group.js';
import mygroupsRouter from './routes/api/groups/my-groups.js';

dotenv.config({ path: './config/.env' });

const app = express();
const dirname = path.resolve(path.dirname(''));
app.use('/static', express.static(path.join(dirname, 'public')));
connectDB();
// passport configure
app.use(passport.initialize());

// eslint-disable-next-line no-unused-vars
const passportJwt = ps(passport);

// import { router as groupsRouter } from './routes/api/groups/groups.js';
// import { router as dashboardRouter } from './routes/api/dashboard/dashboard.js';
// import { router as settleRouter } from './routes/api/groups/settleUp.js';
// import { router as activityRouter } from './routes/api/groups/activity.js';

app.get('/', (req, res) => {
  res.send('API running');
});

// // Init middleware
app.use(express.json({ extended: false }));
app.use(cors({}));
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use('/api/me', profileRouter);
app.use('/api/new-group', createGroupRouter);
app.use('/api/my-groups', mygroupsRouter);
// app.use('/api/groups', groupsRouter);
// app.use('/api/dashboard', dashboardRouter);
// app.use('/api/settle', settleRouter);
// app.use('/api/activity', activityRouter);

const port = process.env.PORT || 8000;

app.listen(port, () => {
  // eslint-dis able-next-line no-console
  console.log(`running on port ${port}`);
});

export default app;
