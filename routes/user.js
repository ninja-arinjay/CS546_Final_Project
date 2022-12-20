const express = require("express");
const data = require("../data");
const userData = data.users;
// const teamData = data.teams;
// const feedData = data.feed;
const router = express.Router();
const path = require("path");
const helpers = require("./../helpers/userHelper");
const aes256 = require("aes256");
const config = require("config");
// const { Console } = require("console");
// const { title } = require("process");
const xss = require("xss");
const logger = require("../utils/logger");

router
  .route("/account")
  .get(async (req, res) => {
    try {
      const errorObject = {
        status: 400,
      };
      if (req.session.user) {
        let usersData = await userData.getUserById(
          aes256.decrypt(config.get("aes_key"), req.session.user.id)
        );
        let successMessage = req.session.success;
        req.session.success = "";
        return res.status(200).render("user/account", {
          title: "Account",
          page: "Account",
          activeClass: "profile-active",
          userData: usersData,
          success: successMessage,
        });
      } else {
        errorObject.status = 403;
        errorObject.error = "Unauthorized Access";
        throw errorObject;
      }
    } catch (e) {
      if (
        typeof e === "object" &&
        e !== null &&
        !Array.isArray(e) &&
        "status" in e &&
        "error" in e
      ) {
        if (e.status == 500 || e.status == 403) {
          return res.status(e.status).render("error/error", {
            title: "Error",
            error: e.error,
            status: e.status,
            layout: "error",
          });
        } else {
          return res.status(e.status).render("user.account", {
            title: "Account",
            error: e.error,
          });
        }
      } else {
        return res.status(400).render("user/account", {
          title: "Account",
          error: e,
        });
      }
    }
  })
  .post(async (req, res) => {
    try {
      const errorObject = {
        status: 400,
      };
      if (req.session.user) {
        if (typeof req.body !== "object") {
          errorObject.error = "Invalid Data Posted.";
          throw errorObject;
        }
        let result = (req.body);
        result.email = xss(result.email.trim());
        result.password = xss(result.password.trim());
        result.firstName = xss(result.firstName.trim());
        result.lastName = xss(result.lastName.trim());
        result.location = xss(result.location.trim());
        result.age = xss(result.age.trim());
        result.bio = xss(result.bio.trim());
        let objKeys = [
          "email",
          "password",
          "firstName",
          "lastName",
          "age",
          "bio",
          "location",
        ];
        objKeys.forEach((element) => {
          if (element === "password") {
            helpers.checkInput(
              element,
              result[element],
              element + " of the user",
              true,
              false
            );
          } else {
            helpers.checkInput(
              element,
              result[element],
              element + " of the user",
              true
            );
          }
          if (element === "age") {
            result[element] = parseInt(result[element]);
          }
        });

        await userData.updateUser(
          aes256.decrypt(config.get("aes_key"), req.session.user.id),
          result.password,
          result.email,
          result.firstName,
          result.lastName,
          result.location,
          result.bio,
          result.age
        );
        logger.info("User Updated Profile");
        req.session.success = "Profile Udated Successfully";
        return res.redirect("/account");
      } else {
        errorObject.status = 403;
        errorObject.error = "Unauthorized Access";
        throw errorObject;
      }
    } catch (e) {
      if (
        typeof e === "object" &&
        e !== null &&
        !Array.isArray(e) &&
        "status" in e &&
        "error" in e
      ) {
        return res.status(e.status).render("error/error", {
          title: "Error",
          error: e.error,
          status: e.status,
          layout: "error",
        });
      } else {
        return res.status(400).render("user/account", {
          title: "Account",
          error: e,
        });
      }
    }
  });

module.exports = router;
