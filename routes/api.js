const express = require('express');
const router = express.Router();

const RegisterController = require('../app/Http/Controllers/RegisterController');
const LoginController = require('../app/Http/Controllers/LoginController');
const UserController = require('../app/Http/Controllers/UserController');

router.post('/signup', RegisterController.store);
router.post('/signin', LoginController.store);
router.get('/users/:id', UserController.show);

module.exports = router;