import contactsService from '../services/contactsServices.js';
import contacts from '../services/contactsServices.js';
import HttpError from '../helpers/HttpError.js';

export const getAllContacts = async (req, res) => {
    try {
        const arrContacts = await contacts.listContacts();
        res.json(arrContacts);
    } catch (error) {
        next(error);
    }
};

export const getOneContact = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contactById = await contacts.getContactById(id);
        if (!contactById) {
            // return res.status(404).json({ message: 'Not Found' });
            throw HttpError(404);
        }
        res.json(contactById);
    } catch (error) {
        next(error);
    }
};

export const deleteContact = (req, res) => {};

export const createContact = (req, res) => {};

export const updateContact = (req, res) => {};
