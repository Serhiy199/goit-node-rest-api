import Joi from 'joi';

export const authSchemas = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// export const updateContactSchema = Joi.object({
//     name: Joi.string(),
//     email: Joi.string().email(),
//     phone: Joi.string(),
// });

// export const newUpdateStatusSchema = Joi.object({
//     favorite: Joi.boolean().required(),
// });
