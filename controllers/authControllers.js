import * as fs from 'node:fs/promises';
import HttpError from '../helpers/HttpError.js';
import User from '../models/user.js';
import authSchemas from '../schemas/authSchemas.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import path from 'node:path';
import gravatar from 'gravatar';
import jimp from 'jimp';

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
        const avatarURL = gravatar.url(emailToLowerCase);

        const newUser = await User.create({
            email: emailToLowerCase,
            password: passwordHash,
            avatarURL,
        });

        res.status(201).json({
            user: {
                email: newUser.email,
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

        res.status(204).end();
    } catch (error) {
        next(error);
    }
};

export const userCurrent = async (req, res, next) => {
    try {
        const user = {
            email: req.user.email,
            subscription: req.user.subscription,
        };

        res.json(user);
    } catch (error) {
        next(error);
    }
};

export const uploadAvatars = async (req, res, next) => {
    const { originalname } = req.file;

    try {
        if (!req.file) {
            throw HttpError(400, 'Avatar not uploaded');
        }

        const userAvatar = await jimp.read(req.file.path);
        await userAvatar.cover(250, 250).writeAsync(req.file.path);

        await fs.rename(req.file.path, path.resolve('public/avatars', req.file.filename));

        const avatarURL = path.join('avatars', req.file.filename);

        const user = await User.findByIdAndUpdate(req.user.id, { avatarURL });

        res.status(200).send({ avatarURL });
    } catch (error) {
        next(error);
    }
};
