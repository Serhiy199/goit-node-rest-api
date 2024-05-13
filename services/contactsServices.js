import * as fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const contactsPath = path.resolve('db', 'contacts.json');

async function listContacts() {
    const arrContacts = await fs.readFile(contactsPath, { encoding: 'utf-8' });
    return JSON.parse(arrContacts);
}

function writeContact(contacts) {
    return fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
}

async function getContactById(contactId) {
    const arrContacts = await listContacts();
    const contact = arrContacts.find(contact => contact.id === contactId);

    if (contact === undefined) {
        return null;
    }
    return contact;
}

async function removeContact(contactId) {
    const arrContacts = await listContacts();

    const index = arrContacts.findIndex(contact => contact.id === contactId);
    if (index === -1) {
        return null;
    }
    const removeContact = arrContacts[index];

    const newArrContacts = [...arrContacts.slice(0, index), ...arrContacts.slice(index + 1)];

    await writeContact(newArrContacts);

    return removeContact;
}

async function addContact(name, email, phone) {
    const arrContacts = await listContacts();
    const addContact = { id: crypto.randomUUID(), name, email, phone };
    arrContacts.push(addContact);
    await writeContact(arrContacts);
    return addContact;
}

export default { listContacts, getContactById, removeContact, addContact };
