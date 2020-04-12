const express = require('express');
const router = express.Router();

const UserController = require('../controllers/user');

router.get('/', (req, res, next) => {
    res.status(200).json({message: "It's working"})
});

router.post("/signup", UserController.user_signup);


module.exports = router;