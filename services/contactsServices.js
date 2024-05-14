import * as fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';

const contactsPath = path.resolve('db', 'contacts.json');

async function listContacts() {
    const arrContacts = await fs.readFile(contactsPath, { encoding: 'utf-8' });

    return JSON.parse(arrContacts);
}
listContacts();

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

async function addContact(data) {
    const arrContacts = await listContacts();
    const addContact = { id: crypto.randomUUID(), ...data };
    arrContacts.push(addContact);
    await writeContact(arrContacts);
    return addContact;
}

async function updateContact(id, data) {
    const contacts = await listContacts();
    const index = contacts.findIndex(contact => contact.id === id);

    if (index === -1) {
        return null;
    }

    const oldContactsIngorm = contacts[index];

    contacts[index] = { id, ...oldContactsIngorm, ...data };

    await fs.writeFile(contactsPath, JSON.stringify(contacts, undefined, 2));
    return contacts[index];
}

export default { listContacts, getContactById, removeContact, addContact, updateContact };
