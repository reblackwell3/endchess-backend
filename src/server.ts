import app from './app';
import { connectDB, closeDB } from './config/db';

const start = async (port: number) => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    await closeDB();
    console.error(err);
    process.exit();
  }
};

const PORT = parseInt(process.env.PORT ?? '5000');

start(PORT);
