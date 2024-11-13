const { ValidateSignature } = require('../../utils');
const { UnauthorizedError } = require('../../utils/app-errors');

module.exports = async (req, res, next) => {
    try {
        const isAuthorized = await ValidateSignature(req);
        if (isAuthorized) {
            return next();
        }
        // Nếu không có token hoặc token không hợp lệ, tiếp tục mà không gán req.user
        return next();
    } catch (error) {
        return res.status(401).json({
            status: 'fail',
            message: error.message || 'Authorization failed'
        });
    }
};