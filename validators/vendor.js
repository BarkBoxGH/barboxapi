import Joi from "joi";

import { createPersonValidator } from "./person.js";
import { updatePersonValidator } from "./person.js";


export const createVendorValidator = createPersonValidator.keys({
    storeName: Joi.string().required().trim(),
    storeDescription: Joi.string().required().trim(),
    storeLocation: Joi.string().required().trim(),
    storeContact: Joi.string().required()
});

export const updateVendorValidator = updatePersonValidator.keys({
    storeName: Joi.string().trim(),
    storeDescription: Joi.string().trim(),
    storeLocation: Joi.string().trim(),
    storeContact: Joi.string()
});
