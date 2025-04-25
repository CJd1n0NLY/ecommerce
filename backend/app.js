import express, { json } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import router from './routes/index.js';  
import './models/associations.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(json());

app.get('/', (req, res) => {
  res.send('Backend is running!');
});

app.use('/api', router);

const PORT = 5002;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});