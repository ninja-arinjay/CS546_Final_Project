const express = require("express");
const data = require("../data");
const userData = data.users;
const router = express.Router();
const path = require("path");
const helpers = require("./../helpers/userHelper");

router.route("/").get(async (req, res) => {
  if (req.session.user) {
    return res.redirect("/");
  } else {
    return res.status(200).render("user/login", {
      title: "Login",
      layout: "auth",
    });
  }
});

router
  .route("/register")
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect("/");
    } else {
      return res.status(200).render("user/register", {
        title: "Register",
        layout: "auth",
      });
    }
  })
  .post(async (req, res) => {
    try {
      const errorObject = {
        status: 400,
      };
      if (typeof req.body !== "object") {
        errorObject.error = "Invalid Data Posted.";
        throw errorObject;
      }
      let result = req.body;
      let objKeys = ['email','password','firstName','lastName','age','bio','location'];
      objKeys.forEach((element) => {
       helpers.checkInput(
          element,
          result[element],
          element + " of the user",
          true
        );
        if (element === "age") {
          result[element] = parseInt(result[element]);
        }
      });
      await userData.createUser(result);
      res.redirect("/");
    } catch (e) {
      if (
        typeof e === "object" &&
        e !== null &&
        !Array.isArray(e) &&
        "status" in e &&
        "error" in e
      ) {
        return res.status(e.status).render("user/register", {
          title: "Register",
          error: [e.error],
          layout: "auth",
        });
      } else {
        return res.status(400).render("user/register", {
          title: "Register",
          error: [e],
          layout: "auth",
        });
      }
    }
  });

module.exports = router;
