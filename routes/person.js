import { Router } from 'express';
import { loginPerson, registerPerson } from '../controllers/person.js';
import { getPersonById } from '../controllers/person.js';

export const personRouter = Router();

personRouter.post('/register', registerPerson);

personRouter.post('/login', loginPerson);

personRouter.get('/:id', getPersonById);

personRouter.delete('/:id', delete

