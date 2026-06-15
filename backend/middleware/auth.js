const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      message: 'Không có token xác thực'
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({
      message: 'Token không hợp lệ hoặc đã hết hạn'
    });
  }
};

const authorize = (...roles) => {
  return (req, res, next) => {

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        message: 'Bạn không có quyền truy cập'
      });
    }

    next();
  };
};

module.exports = {
  authenticate,
  authorize
};