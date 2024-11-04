const bcrypt = require('bcrypt');
const { createUser, findUserByPhone, GenerateToken } = require('../utils');
const { APIError, BadRequestError } = require('../utils/app-errors');

class UserService {
    async register(userInput) {
        const { fullName, phone, password, confirmPassword } = userInput;

        try {
            // Validate input
            if (!fullName || !phone || !password || !confirmPassword) {
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
            const existingUser = await findUserByPhone(phone);
            if (existingUser) {
                throw new BadRequestError('Phone number already registered');
            }

            // Hash password
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            // Create user
            const userId = await createUser(fullName, phone, hashedPassword);

            // Generate token
            const token = await GenerateToken({ userId, phone });

            return {
                status: 'success',
                data: {
                    token,
                    user: {
                        id: userId,
                        fullName,
                        phone
                    }
                }
            };
        } catch (err) {
            throw new APIError(err.message || 'Error during registration', err);
        }
    }

    async login(userInput) {
        const { phone, password } = userInput;

        try {
            // Validate input
            if (!phone || !password) {
                throw new BadRequestError('Phone and password are required');
            }

            // Find user
            const user = await findUserByPhone(phone);
            if (!user) {
                throw new BadRequestError('Invalid credentials');
            }

            // Verify password
            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) {
                throw new BadRequestError('Invalid credentials');
            }

            // Generate token
            const token = await GenerateToken({ userId: user.id, phone: user.phone });

            return {
                status: 'success',
                data: {
                    token,
                    user: {
                        id: user.id,
                        fullName: user.fullName,
                        phone: user.phone
                    }
                }
            };
        } catch (err) {
            throw new APIError(err.message || 'Error during login', err);
        }
    }
}

module.exports = UserService;