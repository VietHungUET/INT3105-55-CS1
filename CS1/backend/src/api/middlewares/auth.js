const { ValidateSignature } = require('../../utils');
const { UnauthorizedError } = require('../../utils/app-errors');

module.exports = async (req, res, next) => {
    try {
        const isAuthorized = await ValidateSignature(req);
        if (isAuthorized) {
            return next();
        }
        throw new UnauthorizedError('Not Authorized');
    } catch (error) {
        return res.status(401).json({
            status: 'fail',
            message: error.message || 'Authorization failed'
        });
    }
};