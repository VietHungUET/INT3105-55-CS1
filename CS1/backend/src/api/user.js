const UserService = require('../services/user-service');
const { BadRequestError } = require('../utils/app-errors');
const authMiddleware = require('./middlewares/auth');

module.exports = (app) => {
    const service = new UserService();

    // Register endpoint
    app.post('/register', async (req, res, next) => {
        try {
            const { username, phone, password, confirmPassword } = req.body;
            const result = await service.register({
                username,
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
    app.post('/login', async (req, res, next) => {
        try {
            const { username, password } = req.body;
            const result = await service.login({ username, password });
            res.json(result);
        } catch (err) {
            next(err);
        }
    });

    // Test protected route
    // app.get('/auth/profile', authMiddleware, (req, res) => {
    //     res.json({
    //         status: 'success',
    //         data: {
    //             user: req.user
    //         }
    //     });
    // });
};