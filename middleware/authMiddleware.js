import HttpError from '../helpers/HttpError.js';
import jwt from 'jsonwebtoken';

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

        jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
            if (err) {
                throw HttpError(401, 'Not authorized');
            }

            req.user = {
                id: decode.id,
            };
        });

        next();
    } catch (error) {
        next(error);
    }
};

export default authMiddleware;
