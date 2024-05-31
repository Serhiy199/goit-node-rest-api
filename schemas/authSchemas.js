import Joi from 'joi';

export const authSchemas = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export const emailSchemas = Joi.object({
    email: Joi.string().email().required(),
});
