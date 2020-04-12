const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

const UserController = require('../controllers/user');

router.get('/', UserController.get_all_users);

router.post("/signup", UserController.user_signup);

router.post("/login", UserController.user_login);

// router.get("/:userId", checkAuth, UserController.user_delete);

module.exports = router;
