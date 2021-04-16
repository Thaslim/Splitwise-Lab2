import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config({ path: './config/.env' });

const db = process.env.mongoURI;

const connectDB = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      poolSize: 10,
    });
    console.log('MongoDB connected...');
  } catch (error) {
    console.error(error.message);
    // Exit process with failure
    process.exit(1);
  }
};

export default connectDB;
