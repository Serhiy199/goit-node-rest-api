import HttpError from '../helpers/HttpError.js';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const authMiddleware = async (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (typeof authorizationHeader === 'undefined') {
            throw HttpError(401, 'Not authorized');
        }

        const [bearer, token] = authorizationHeader.split(' ', 2);

        if (bearer !== 'Bearer') {
            throw HttpError(401, 'Not authorized');
        }

        jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
            if (err) {
                throw HttpError(401, 'Not authorized');
            }
            try {
                const user = await User.findById(decode.id);

                if (user === null) {
                    throw HttpError(401, 'Not authorized');
                }

                if (user.token !== token) {
                    throw HttpError(401, 'Not authorized');
                }

                req.user = {
                    id: user.id,
                };
                next();
            } catch (error) {
                next(error);
            }
        });
    } catch (error) {
        next(error);
    }
};

export default authMiddleware;
