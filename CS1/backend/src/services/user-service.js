const { models: { User } } = require('../database/models');
const bcrypt = require('bcrypt');
const { GenerateToken } = require('../utils');
const { APIError, BadRequestError } = require('../utils/app-errors');

class UserService {
    async register(userInput) {
        const { username, phone, password, confirmPassword } = userInput;

        try {
            // Validate input
            if (!username || !phone || !password || !confirmPassword) {
                throw new BadRequestError('All fields are required');
            }

            if (password !== confirmPassword) {
                throw new BadRequestError('Passwords do not match');
            }

            // Validate phone format (VN)
            const phoneRegex = /^(0|84)(3|5|7|8|9)[0-9]{8}$/;
            if (!phoneRegex.test(phone)) {
                throw new BadRequestError('Invalid phone number format');
            }

            // Check existing user
            const existingUser = await User.findOne({ where: { username } })
            if (existingUser) {
                throw new BadRequestError('Username already registered');
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const newUser = await User.create({ username, phone, password: hashedPassword });

            return {
                status: 'success',
                data: {
                    user: {
                        id: newUser.id,
                        username,
                        phone
                    }
                }
            };
        } catch (err) {
            throw new APIError(err.message || 'Error during registration', err);
        }
    }

    async login(userInput) {
        const { username, password } = userInput;

        try {
            // Validate input
            if (!username || !password) {
                throw new BadRequestError('Username and password are required');
            }

            // Find user
            const user = await User.findOne({ where: { username } });
            if (!user) {
                throw new BadRequestError('Invalid credentials');
            }

            // Verify password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                throw new BadRequestError('Invalid credentials');
            }

            // Generate token
            const token = await GenerateToken({ userId: user.id, username: user.username });

            return {
                status: 'success',
                data: {
                    token: token,
                    user: {
                        id: user.id,
                        username: user.username
                    }
                }
            };
        } catch (err) {
            throw new APIError(err.message || 'Error during login', err);
        }
    }
}

module.exports = UserService;