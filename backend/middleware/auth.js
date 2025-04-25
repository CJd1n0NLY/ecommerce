import jwt from 'jsonwebtoken';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const config = require('../config/config.json');  

export default (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token is not valid' });
  }
};
