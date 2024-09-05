// backend/server.js
import express from 'express';
import analyzeRoutes from './analyze/analyzeRoutes';

const app = express();
app.use(express.json());

app.use('/', analyzeRoutes);

const PORT = 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
