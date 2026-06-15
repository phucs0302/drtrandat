const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  console.log('TOKEN:', token);

  if (!token) {
    console.log('KHÔNG CÓ TOKEN');
    return res.status(401).json({
      message: 'Không có token xác thực'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log('DECODED:', decoded);

    req.user = decoded;
    next();

  } catch (err) {
    console.log('JWT ERROR:', err.message);

    return res.status(401).json({
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

module.exports = { authenticate };