// controllers/personController.js
import { PersonModel } from '../models/person.js';
import { UserModel } from '../models/user.js';
import { VendorModel } from '../models/vendor.js';
import { createPerson } from '../service/person.js';
import { getPersonById } from '../service/person.js';
import { comparePassword } from '../middlewares/authenticator.js';
import { hashPassword } from '../middlewares/authenticator.js';
import { generateToken } from '../middlewares/authenticator.js';
import { authenticateToken } from '../middlewares/authenticator.js';
import { verifyToken } from '../middlewares/authenticator.js';

import bcrypt from 'bcryptjs';

// import Admin from '../models/Admin.js';

// Function to create a person based on role
// export async function createPerson(role, data) {
//   try {
//     let newPerson;
//     switch (role) {
//       case 'user':
//         newPerson = new UserModel(data);
//         break;
//       case 'vendor':
//         newPerson = new VendorModel(data);
//         break;
//     //   case 'admin':
//     //     newPerson = new Admin(data);
//     //     break;
//       default:
//         throw new Error('Invalid role');
//     }

//     const savedPerson = await newPerson.save();
//     console.log(`${role.charAt(0).toUpperCase() + role.slice(1)} saved successfully:`, savedPerson);
//     return {
//         success: true,
//         data: savedPerson,
//         message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`
//     };
//   } catch (error) {
//     console.error('Error saving person:', error);
//     throw error;
//   }
// }

export async function registerPerson(req, res, next) {
  try {
      const { role, email, password, ...data } = req.body;
      
      // Hash the password using authenticator middleware
      const hashedPassword = await hashPassword(password);
      
      // Create person with hashed password
      const result = await createPerson(role, { ...data, email, password: hashedPassword });
      
      // Generate JWT token using authenticator middleware
      const token = generateToken({ id: result.data._id, role: role });
      
      res.status(201).json({
        ...result,
        token
      });
  } catch (error) {
      next(error);
  }

};// write a function to get all persons
export async function getAllPersons(req, res, next) {
  try {
    const persons = await PersonModel.find();
    res.status(200).json(persons);
  } catch (error) {
    next(error);
  }
}

// write function to login person
export async function loginPerson(req, res, next) {
  try {
    const { email, password } = req.body;
    const person = await PersonModel.findOne({ email });
    
    if (!person) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await comparePassword(password, person.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({ id: person._id, role: person.role });

    return res.status(200).json({
      success: true,
      data: person,
      token,
      message: 'Login successful'
    });
  } catch (error) {
    next(error);
  };

}// write function to login user
export async function loginUser(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user || !user.comparePassword(password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.status(200).json({
      success: true,
      data: user,
      message: 'User logged in successfully'
    });
  } catch (error) {
    next(error);
  }
};

// write function to login vendor
export async function loginVendor(req, res, next) {
  try {
    const { email, password } = req.body;
    const vendor = await VendorModel.findOne({ email });
    if (!vendor || !vendor.comparePassword(password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    return res.status(200).json({
      success: true,
      data: vendor,
      message: 'Vendor logged in successfully'
    });
  } catch (error) {
    next(error);
  }
};

