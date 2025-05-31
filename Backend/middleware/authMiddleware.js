import jwt from 'jsonwebtoken';

function authMiddleware(req, res, next){

  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ message: 'Token missing' });
  }

  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Token is invalid' });
  }
};

export default authMiddleware;
