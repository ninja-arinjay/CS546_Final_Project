const express = require("express");
const data = require("../data");
const userData = data.users;
const feedData = data.feed;
const router = express.Router();
const path = require("path");
const helpers = require("./../helpers/userHelper");
const { title } = require("process");
const xss = require("xss");

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
      //console.log(result);
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
    let result = req.body;
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
