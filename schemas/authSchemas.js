import Joi from 'joi';

export const authRegisterSchemas = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const authLoginSchemas = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
