const UserService = require('../services/user-service');
const { BadRequestError } = require('../utils/app-errors');
const authMiddleware = require('./middlewares/auth');

module.exports = (app) => {
    const service = new UserService();

    // Register endpoint
    app.post('/auth/register', async (req, res, next) => {
        try {
            const { fullName, phone, password, confirmPassword } = req.body;
            const result = await service.register({
                fullName,
                phone,
                password,
                confirmPassword
            });
            res.json(result);
        } catch (err) {
            next(err);
        }
    });

    // Login endpoint
    app.post('/auth/login', async (req, res, next) => {
        try {
            const { phone, password } = req.body;
            const result = await service.login({ phone, password });
            res.json(result);
        } catch (err) {
            next(err);
        }
    });

    // Test protected route
    app.get('/auth/profile', authMiddleware, (req, res) => {
        res.json({
            status: 'success',
            data: {
                user: req.user
            }
        });
    });
};