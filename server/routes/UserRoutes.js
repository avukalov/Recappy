const express = require('express');
const router = express.Router();

const AuthMiddleware = require('../middleware/AuthMiddleware');
const UserController = require('../controllers/UserController');

router.route('/').get(AuthMiddleware, UserController.getUserByToken);

router.route('/register').post(UserController.register);

router.route('/login').post(UserController.login);

module.exports = router;
