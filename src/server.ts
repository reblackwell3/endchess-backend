import app from './app';

const start = (port: number) => {
  try {
    app.listen(port, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
    process.exit();
  }
};

const PORT = parseInt(process.env.PORT ?? '5000');

start(PORT);
