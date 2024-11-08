import { UserModel } from '../models/user.js';
import { VendorModel } from '../models/vendor.js';
import { PersonModel } from '../models/person.js';

// Function to create a person based on role
export async function createPerson(role, data) {
  try {
    let newPerson;
    switch (role) {
      case 'user':
        newPerson = new UserModel(data);
        break;
      case 'vendor':
        newPerson = new VendorModel(data);
        break;
    //   case 'admin':
    //     newPerson = new Admin(data);
    //     break;
      default:
        throw new Error('Invalid role');
    }

    const savedPerson = await newPerson.save();
    console.log(`${role.charAt(0).toUpperCase() + role.slice(1)} saved successfully:`, savedPerson);
    return {
        success: true,
        data: savedPerson,
        message: `${role.charAt(0).toUpperCase() + role.slice(1)} created successfully`
    };
  } catch (error) {
    console.error('Error saving person:', error);
    throw error;
  }
};

export async function getAllPersons(options = {}) {
    try {
        const { 
            role, 
            page = 1, 
            limit = 10, 
            sort = '-createdAt' 
        } = options;

        let query = PersonModel.find();

        // Add role filter if specified
        if (role) {
            query = query.where('__t').equals(role);
        }

        // Add pagination
        const skip = (page - 1) * limit;
        query = query.skip(skip).limit(parseInt(limit));

        // Add sorting
        query = query.sort(sort);

        const [persons, total] = await Promise.all([
            query.exec(),
            PersonModel.countDocuments(role ? { __t: role } : {})
        ]);

        return {
            success: true,
            data: persons,
            pagination: {
                total,
                pages: Math.ceil(total / limit),
                currentPage: parseInt(page),
                limit: parseInt(limit)
            },
            message: 'Persons retrieved successfully'
        };
    } catch (error) {
        console.error('Error fetching persons:', error);
        throw error;
    }
};

// get person by id
export async function getPersonById(id) {
    try {
        const person = await PersonModel.findById(id);
        if (!person) {
            throw new Error('Person not found');
        }
        return {
            success: true,
            data: person,
            message: 'Person retrieved successfully'
        };
    } catch (error) {
        console.error('Error fetching person:', error);
        throw error;
    }
}

