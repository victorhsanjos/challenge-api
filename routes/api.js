const express = require('express');
const router = express.Router();

const Authenticate = require('../app/Http/Middleware/Authenticate');
const LastLogin = require('../app/Http/Middleware/LastLogin');

const RegisterController = require('../app/Http/Controllers/RegisterController');
const LoginController = require('../app/Http/Controllers/LoginController');
const UserController = require('../app/Http/Controllers/UserController');

const { check } = require('express-validator');

const User = require('../app/User');

router.post('/signup', [
    check('name').exists().withMessage('Field is required'),
    check('email').exists().withMessage('Field is required').bail().isEmail().withMessage('Must be a valid email address').bail().custom(value => {
        return User.findByEmail(value).then(user => {
            if (user) {
                return Promise.reject('E-mail already in use');
            }
        });
    }),
    check('password').exists().withMessage('Field is required').bail().isLength({ min: 6 }).withMessage('Must be at least 6').bail(),
    check('zipcode').exists().withMessage('Field is required').bail().isPostalCode('BR').withMessage('Must be a valid postal code').bail(),
], RegisterController.store);

router.post('/signin', [
    check('email').exists().withMessage('Field is required').bail().isEmail().withMessage('Must be a valid email address').bail(),
    check('password').exists().withMessage('Field is required').bail().isLength({ min: 6 }).withMessage('Must be at least 6').bail()
], LoginController.store);

router.get('/user/:id', [Authenticate, LastLogin], UserController.show);

module.exports = router;