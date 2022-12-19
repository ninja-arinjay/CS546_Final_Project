const express = require("express");
const data = require("../data");
const userData = data.users;
const teamData = data.teams;
const feedData = data.feed;
const router = express.Router();
const path = require("path");
const helpers = require("./../helpers/userHelper");
const aes256 = require("aes256");
const config = require("config");
const { Console } = require("console");
const { title } = require("process");
const xss = require("xss");
const logger = require("../utils/logger");

router.route("/").get(async (req, res) => {
  if (req.session.user) {
    let userCount = await userData.getAllUsers();
    userCount = userCount.length;
    let userRow = await userData.getUserById(
      aes256.decrypt(config.get("aes_key"), req.session.user.id)
    );
    let allTeams = await teamData.getAllTeams();
    let otherTeams = allTeams.length;
    allTeams = await teamData.getAllUserTeams(userRow.teamsJoined);
    let myTeams = allTeams.length;
    let successMessage = req.session.success;
    req.session.success = "";
    return res.status(200).render("dashboard/index", {
      title: "Dashboard",
      page: "Dashboard",
      activeClass: "dashboard-active",
      teams: allTeams,
      userData: aes256.decrypt(config.get("aes_key"), req.session.user.id),
      success: successMessage,
      userCount: userCount,
      myTeams: myTeams,
      teamCount: otherTeams,
    });
  } else {
    return res.render("static/static",{
      title :"Team Up",
      layout: "../static/static"
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
      let result = xss(req.body);
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
      console.log("working");
      logger.info("User Registered");
      await userData.createUser(result);
      res.redirect("/login");
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
          error: e.error,
          layout: "auth",
        });
      } else {
        return res.status(400).render("user/register", {
          title: "Register",
          error: e,
          layout: "auth",
        });
      }
    }
  });

router
  .route("/login")
  .get(async (req, res) => {
    if (req.session.user) {
      return res.redirect("/");
    } else {
      return res.status(200).render("user/login", {
        title: "Login",
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
      let result = xss(req.body);
      let objKeys = ["email", "password"];
      objKeys.forEach((element) => {
        helpers.checkInput(
          element,
          result[element],
          element + " of the user",
          true
        );
      });
      let userRow = await userData.checkUser(req.body.email, req.body.password);
      req.session.user = {
        email: aes256.encrypt(
          config.get("aes_key"),
          req.body.email.toLowerCase()
        ),
        id: aes256.encrypt(config.get("aes_key"), userRow.id),
      };
      logger.info("User Logged In");
      return res.redirect("/");
    } catch (e) {
      if (
        typeof e === "object" &&
        e !== null &&
        !Array.isArray(e) &&
        "status" in e &&
        "error" in e
      ) {
        return res.status(e.status).render("user/login", {
          title: "Login",
          error: e.error,
          layout: "auth",
        });
      } else {
        return res.status(400).render("user/login", {
          title: "Login",
          error: e,
          layout: "auth",
        });
      }
    }
  });

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
        let result = xss(req.body);
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

router.route("/logout").get(async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

router.route("/createfeed").post(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    //Input Checking
    if (typeof req.body !== "object") {
      errorObject.error = "Invalid Data Posted.";
      throw errorObject;
    }
    let result = xss(req.body);
    let objKeys = ["title", "description"];
    objKeys.forEach((element) => {
      helpers.checkInput(
        element,
        result[element],
        element + "of the feed",
        true
      );
    });
    //retreiving teamID and userID - pending
    result.teamID = "";
    result.createdByID = "";
    await feedData.createFeed(
      result[title],
      result[description],
      result[teamID],
      result[createdByID]
    );
    res.redirect("user/feed");
  } catch (e) {
    if (
      typeof e === "object" &&
      e !== null &&
      !Array.isArray(e) &&
      "status" in e &&
      "error" in e
    ) {
      return res.status(e.status).render("user/createFeed", {
        title: "Create Feed",
        error: [e.error],
        layout: "auth",
      });
    } else {
      return res.status(400).render("user/createFeed", {
        title: "Create Feed",
        error: [e],
        layout: "auth",
      });
    }
  }
});

router.route("/feed").get(async (req, res) => {
  try {
    const errorObject = {
      status: 404,
    };
    const feedList = await feedData.getAllFeeds();
    if (feedList.length === 0) {
      errorObject.error = "No feeds found.";
      throw errorObject;
    }
    // only get what is needed for the feed
    let feedProjection = feedList.map(async (feedItem) => {
      let userName = await userData.getUserById(feedItem.createdByID);
      let firstLast = "deleted user";
      if (userName) {
        firstLast = userName.firstName + " " + userName.lastName;
      }
      return {
        _id: feedItem._id.toString(),
        title: feedItem.title,
        description: feedItem.description,
        createdByID: firstLast,
        dataPosted: feedItem.dataPosted,
        comments: feedItem.comments,
      };
    });
    res.status(200).render("feed", { title: "Feed", feedList: feedProjection });
  } catch (e) {
    if (
      typeof e === "object" &&
      e !== null &&
      !Array.isArray(e) &&
      "status" in e &&
      "error" in e
    ) {
      return res.status(e.status).render("user/feed", {
        title: "Feed",
        error: [e.error],
      });
    } else {
      return res.status(400).render("user/feed", {
        title: "Feed",
        error: [e],
      });
    }
  }
});

module.exports = router;
