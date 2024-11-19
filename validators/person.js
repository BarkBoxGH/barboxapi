
import Joi from 'joi';

export const createPersonValidator = Joi.object({
    firstName: Joi.string().required().trim(),
    lastName: Joi.string().required().trim(),
    email: Joi.string().required().trim().email(),
    password: Joi.string().required(),
    role: Joi.string().valid('admin', 'user', 'vendor').default('user'),
    storeName: Joi.string(),
    storeLocation: Joi.string(),
    storeDescription: Joi.string(),
    storeContact: Joi.string()
});





export const updatePersonValidator = Joi.object({
    firstName: Joi.string().trim(),
    lastName: Joi.string().trim(),
    email: Joi.string().trim().email(),
    password: Joi.string(),
    role: Joi.string().valid('admin', 'user', 'vendor')
});




