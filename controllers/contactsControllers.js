import contactsService from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactsSchemas.js';
import Contact from '../models/contact.js';
import { isValidObjectId } from 'mongoose';

export const getAllContacts = async (req, res) => {
    try {
        const arrContacts = await Contact.find();
        res.json(arrContacts);
    } catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            throw HttpError(400);
        }
        const contactById = await Contact.findById(id);
        if (!contactById) {
            throw HttpError(404);
        }
        res.json(contactById);
    } catch (error) {
        next(error);
    }
};

export const deleteContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            throw HttpError(400);
        }
        const removeContact = await Contact.findByIdAndDelete(id);
        if (!removeContact) {
            throw HttpError(404);
        }

        res.status(200).json(removeContact);
    } catch (error) {
        next(error);
    }
};

export const createContact = async (req, res, next) => {
    try {
        const { error } = createContactSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const newAddContact = await Contact.create(newAddContact);
        res.status(201).json(newAddContact);
    } catch (error) {
        next(error);
    }
};

export const updateContact = async (req, res, next) => {
    try {
        const { error } = updateContactSchema.validate(req.body);
        if (error) {
            throw HttpError(400, error.message);
        }
        const key = Object.keys(req.body);
        if (key.length === 0) {
            throw HttpError(404, 'Body must have at least one field');
        }
        const { id } = req.params;
        if (!isValidObjectId(id)) {
            throw HttpError(400);
        }
        const newUpdateContact = await Contact.findByIdAndUpdate(id, req.body, { new: true });
        if (!newUpdateContact) {
            throw HttpError(404);
        }
        res.status(200).json(newUpdateContact);
    } catch (error) {
        next(error);
    }
};
