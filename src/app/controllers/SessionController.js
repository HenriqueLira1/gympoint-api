import Jwt from 'jsonwebtoken';

import AuthConfig from '../../config/auth';
import User from '../models/User';

class SessionController {
    async store(req, res) {
        const { email, password } = req.body;

        const user = await User.findOne({ where: { email } });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        if (!(await user.checkPassword(password))) {
            return res.status(401).json('Password does not match');
        }

        const { id, name } = user;

        return res.json({
            user: {
                id,
                name,
                email,
            },
            token: Jwt.sign({ id }, AuthConfig.secret, {
                expiresIn: AuthConfig.expiresIn,
            }),
        });
    }
}

export default new SessionController();
