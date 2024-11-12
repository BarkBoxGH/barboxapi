
import { DogListingModel } from "../models/dog-listings.js";
import { VendorModel } from "../models/vendor.js";
import { createDogListingSchema, updateDogListingSchema } from "../validators/dog-listings.js";

// Create a new dog listing
export const createDogListing = async (req, res) => {
    try {
        const { error } = createDogListingSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const dogListing = new DogListingModel(req.body);
        await dogListing.save();
        res.status(201).json(dogListing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all dog listings
export const getAllDogListings = async (req, res) => {
    try {
        const dogListings = await DogListingModel.find();
        res.status(200).json(dogListings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single dog listing by ID
export const getDogListingById = async (req, res) => {
    try {
        const dogListing = await DogListingModel.findById(req.params.id);
        if (!dogListing) {
            return res.status(404).json({ message: "Dog listing not found" });
        }
        res.status(200).json(dogListing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a dog listing
export const updateDogListing = async (req, res) => {
    try {
        const { error } = updateDogListingSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ message: error.details[0].message });
        }

        const dogListing = await DogListingModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        if (!dogListing) {
            return res.status(404).json({ message: "Dog listing not found" });
        }
        res.status(200).json(dogListing);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a dog listing
export const deleteDogListing = async (req, res) => {
    try {
        const dogListing = await DogListingModel.findByIdAndDelete(req.params.id);
        if (!dogListing) {
            return res.status(404).json({ message: "Dog listing not found" });
        }
        res.status(200).json({ message: "Dog listing deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
