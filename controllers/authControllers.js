import HttpError from '../helpers/HttpError.js';
import User from '../models/user.js';
import { authRegisterSchemas, authLoginSchemas } from '../schemas/authSchemas.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const userRegister = async (req, res, next) => {
    try {
        const { error } = authRegisterSchemas.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }

        const { name, email, password } = req.body;

        const emailToLowerCase = email.toLowerCase();

        const user = await User.findOne({ email: emailToLowerCase });

        if (user !== null) {
            throw HttpError(409, 'Email in use');
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email: emailToLowerCase,
            password: passwordHash,
        });

        res.status(201).json(newUser);
    } catch (error) {
        next(error);
    }
};

export const userLogin = async (req, res, next) => {
    try {
        const { error } = authLoginSchemas.validate(req.body);
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

        const token = jwt.sign({ id: user._id, name: user.name }, process.env.JWT_SECRET, {
            expiresIn: 60 * 60,
        });

        res.send({ token });
    } catch (error) {
        next(error);
    }
};
