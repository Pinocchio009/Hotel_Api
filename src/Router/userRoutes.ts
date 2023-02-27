import { Router } from 'express';
import { signup, login, allowIfLoggedIn, getUser, grantAccess, getUsers, updateUser, deleteUser } from '../Controllers/userController';

const router = Router();

router.post('/signup', signup);

router.post('/login', login);

router.get('/user/:userId', allowIfLoggedIn, getUser);

router.get('/users', allowIfLoggedIn, grantAccess('readAny', 'profile'), getUsers);

router.put('/user/:userId', allowIfLoggedIn, grantAccess('updateAny', 'profile'), updateUser);

router.delete('/user/:userId', allowIfLoggedIn, grantAccess('deleteAny', 'profile'), deleteUser);

export default router;
