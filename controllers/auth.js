import HttpError from '../helpers/HttpError.js';
import User from '../models/user.js';
import { authSchemas } from '../schemas/authSchemas.js';

export const AuthControllers = async (req, res, next) => {
    try {
        const { error } = authSchemas.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const newAddContact = await Contact.create(req.body);
        res.status(201).json(newAddContact);
    } catch (error) {
        next(error);
    }
};
