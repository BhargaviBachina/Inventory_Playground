// // jwt.js (middleware)
// const jwt = require('jsonwebtoken');

// const verifyToken = (req, res, next) => {
//   // Extract token from the Authorization header
//   const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

//   // If no token, return 403
//   if (!token) {
//     return res.status(403).json({ message: 'No token provided' });
//   }

//   // Verify the token
//   jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: 'Unauthorized' });
//     }
    
//     // Attach decoded user data to the request object
//     req.user = decoded;
//     next();  // Pass control to the next middleware or controller
//   });
// };

// module.exports = verifyToken;

const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(403).json({ message: 'No token provided or malformed token' });
    }

    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Unauthorized', error: err.message });
      }

      req.user = decoded; // Attach decoded payload to `req.user`
      next(); // Proceed to the next middleware or controller
    });
  } catch (error) {
    res.status(500).json({ message: 'Internal server error during token verification', error });
  }
};

module.exports = verifyToken;
