import Joi from "joi";
import { createPersonValidator } from "./person.js";
import { updatePersonValidator } from "./person.js";

export const createUserValidator = createPersonValidator.keys({
    favoriteBreed: Joi.array().items(Joi.string()).default([])
});

export const updateUserValidator = updatePersonValidator.keys({
    favoriteBreed: Joi.array().items(Joi.string())
});