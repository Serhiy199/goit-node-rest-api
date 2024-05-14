import contactsService from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';
import { createContactSchema, updateContactSchema } from '../schemas/contactsSchemas.js';

export const getAllContacts = async (req, res) => {
    try {
        const arrContacts = await contactsService.listContacts();
        res.json(arrContacts);
    } catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contactById = await contactsService.getContactById(id);
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
        const removeContact = await contactsService.removeContact(id);
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
        const newAddContact = await contactsService.addContact(req.body);
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
        const newUpdateContact = await contactsService.updateContact(id, req.body);
        if (!newUpdateContact) {
            throw HttpError(404);
        }
        res.status(200).json(newUpdateContact);
    } catch (error) {
        next(error);
    }
};
