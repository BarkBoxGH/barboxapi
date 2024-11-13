import { Router } from 'express';
import { deletePerson, getPersonByIdentifier, loginPerson, registerPerson, updatePerson } from '../controllers/person.js';

export const personRouter = Router();

personRouter.post('/register', registerPerson);

personRouter.post('/login', loginPerson);

personRouter.get('/:id', getPersonByIdentifier);

personRouter.delete('/:id', deletePerson);

personRouter.patch('/:id', updatePerson);

