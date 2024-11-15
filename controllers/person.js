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
import { sendMail } from '../utils/mail.js';
import { welcomeEmailTemplate } from '../utils/emailTemplates.js';
import { createPersonValidator } from '../validators/person.js';


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
    // Validate input using Joi validator
    const { error } = createPersonValidator.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message
      });
    }

      const { role, email, password, ...data } = req.body;

      // Check if user already exists
    const existingPerson = await PersonModel.findOne({ email });
    if (existingPerson) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }
      
      // Hash the password using authenticator middleware
      const hashedPassword = await hashPassword(password);
      
      // Create person with hashed password
      const result = await createPerson(role, { 
        ...data, 
        email, 
        password: hashedPassword 
      });
      
      // Generate JWT token using authenticator middleware
      const token = generateToken({ 
        id: result.data._id, 
        role: role 
      });

       // Send welcome email (asynchronously, doesn't block registration)
    try {
      await sendMail({
        to: email,
        subject: 'Welcome to BarkBox!',
        html: welcomeEmailTemplate(result.data)
      });
    } catch (emailError) {
      console.error('Welcome email sending failed:', emailError);
      // Non-blocking email error
    }

    // Remove password from response
    const { password: removedPassword, ...personResponse } = result.data;
      
      res.status(201).json({
        success: true,
        data: personResponse,
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

export const deletePerson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedPerson = await PersonModel.findByIdAndDelete(id);
    if (!deletedPerson) {
      return res.status(404).json({ message: 'Person not found' });
    }
    return res.status(200).json({
      success: true,
      data: deletedPerson,
      message: 'Person deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const updatePerson = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedPerson = await PersonModel.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedPerson) {
      return res.status(404).json({ message: 'Person not found' });
    }
    return res.status(200).json({
      success: true,
      data: updatedPerson,
      message: 'Person updated successfully'
    });
  } catch (error) {
    next(error);
  }
};

export const getPersonByIdentifier = async (req, res, next) => {
  try {
    const { id } = req.params;
    const person = await PersonModel.findById(id);
    if (!person) {
      return res.status(404).json({ message: 'Person not found' });
    }
    return res.status(200).json({
      success: true,
      data: person,
      message: 'Person retrieved successfully'
    });
  } catch (error) {
    next(error);
  }
};
