
import Joi from "joi";

export const createDogListingSchema = Joi.object({
    breed: Joi.string().required(),
    age: Joi.number().required(),
    price: Joi.number().required(),
    location: Joi.string().required(),
    image: Joi.string().required()
});

export const updateDogListingSchema = Joi.object({
    breed: Joi.string(),
    age: Joi.number(),
    price: Joi.number(),
    location: Joi.string(),
    image: Joi.string()
});
