const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.user_signup = (req, res, next) => {
    console.log("============>>>>", req.body)
  User.find({ email: req.body.emailID})
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              emailID: req.body.emailID,
              password: hash,
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              mobileNumber: req.body.mobileNumber,
              age: req.body.age,
              userType: req.body.userType ? req.body.userType : 'Editor'
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created"
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
};


exports.user_login = (req, res, next) => {
    console.log(" BODY", req.body)
    User.find({ 'emailID': req.body.emailID })
      .exec()
      .then(user => {
          console.log("=========#####", user)
        if (user.length < 1) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
          if (err) {
            return res.status(401).json({
              message: "Auth failed"
            });
          }
          if (result) {
            const token = jwt.sign(
              {
                email: user[0].email,
                userId: user[0]._id
              },
              "Screate_Key",
              {
                expiresIn: "1h"
              }
            );
            console.log("============== USER TYPE: ", user[0].userType);
            console.log("==========>>>>>", user[0].userType === "Admin")
            if(user[0].userType === "Admin") {
                User.find({ })
                .select("_id emailID firstName lastName mobileNumber age")
                .exec()
                .then(users => {
                    return res.status(200).json({
                        message: "Auth successful",
                        userProfile: {
                            firstName: user[0].firstName,
                            lastName: user[0].lastName,
                            age: user[0].age,
                            emailID: user[0].emailID,
                            mobileNumber: user[0].mobileNumber,
                            userType: user[0].userType
                        },
                        listOfUsers: users,
                        token: token
                    });
                })
                console.log("===========>>>>>, IF user", user);
            }
            if(user[0].userType !== "Admin") {
                console.log("===========>>>>>,ELSE  user", user);
                return res.status(200).json({
                message: "Auth successful",
                userProfile: {
                    firstName: user[0].firstName,
                    lastName: user[0].lastName,
                    age: user[0].age,
                    emailID: user[0].emailID,
                    mobileNumber: user[0].mobileNumber,
                    userType: user[0].userType
                },
                token: token
                });
            }
          }
        //   res.status(401).json({
        //     message: "Auth failed"
        //   });
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };

  exports.get_all_users = (req, res, next) => {
    User.find({ })
    .select("_id emailID firstName lastName mobileNumber age")
    .exec()
    .then(users => {
      res.status(200).json({
          users: users,
      })
    })
    .catch(error => {
      res.status(500).json({
          message: error
      });
    })
  };