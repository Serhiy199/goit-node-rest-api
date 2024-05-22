import HttpError from '../helpers/HttpError.js';
import User from '../models/user.js';
import authSchemas from '../schemas/authSchemas.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const userRegister = async (req, res, next) => {
    try {
        const { error } = authSchemas.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }

        const { email, password } = req.body;

        const emailToLowerCase = email.toLowerCase();

        const user = await User.findOne({ email: emailToLowerCase });

        if (user !== null) {
            throw HttpError(409, 'Email in use');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            email: emailToLowerCase,
            password: passwordHash,
        });

        res.status(201).json({
            user: {
                email: newUser,
                email,
                subscription: newUser.subscription,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const userLogin = async (req, res, next) => {
    try {
        const { error } = authSchemas.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }

        const { email, password } = req.body;

        const emailToLowerCase = email.toLowerCase();

        const user = await User.findOne({ email: emailToLowerCase });

        if (user === null) {
            throw HttpError(401, 'Email or password is wrong');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch === false) {
            throw HttpError(401, 'Email or password is wrong');
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60,
        });

        await User.findByIdAndUpdate(user._id, { token });
        res.send({
            token: token,
            user: {
                email: user.email,
                subscription: user.subscription,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const userLogout = async (req, res, next) => {
    try {
        const userLogout = await User.findByIdAndUpdate(req.user.id, { token: null });

        if (!userLogout) {
            throw HttpError(404, 'Not authorized');
        }

        res.status(200).end();
    } catch (error) {
        next(error);
    }
};

export const userCurrent = async (req, res, next) => {
    try {
        const userById = await User.findOne({ _id: req.user.id });

        if (!userById) {
            throw HttpError(401, 'Not authorized');
        }

        res.json(userById);
    } catch (error) {
        next(error);
    }
};
