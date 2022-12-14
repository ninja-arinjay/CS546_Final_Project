const express = require("express");
const data = require("../data");
const feedData = data.feed;
const userData = data.users;
const commentData = data.comments;
const router = express.Router();
//const path = require("path");
const aes256 = require("aes256");
const config = require("config");
const helpers = require("./../helpers/userHelper");
//const { title } = require("process");
const xss = require("xss");
//const { feed } = require("../data");
const logger = require("../utils/logger");

router.route("/").get(async (req, res) => {
  logger.info("User Feed Accessed");
  if (!req.session.user) {
    return res.redirect("/");
  }
  try {
    const errorObject = {
      status: 404,
    };
    const feedList = await feedData.getAllFeed();
    if (!feedList) {
      errorObject.error = "No feeds found.";
      throw errorObject;
    }
    if (feedList.length === 0) {
      errorObject.error = "No feeds found.";
      throw errorObject;
    }
    //console.log(feedList);
    // only get what is needed for the feed
    let feedProjection = [];
    for (let i = 0; i < feedList.length; i++) {
      let feedItem = feedList[i];
      let userName;
      try {
        userName = await userData.getUserById(feedItem.createdByID);
      } catch (e) {
        userName = null;
      }
      let firstLast = "deleted user";
      if (userName) {
        firstLast = userName.firstName + " " + userName.lastName;
      }
      let curr = {
        _id: feedItem._id.toString(),
        title: feedItem.title,
        description: feedItem.description,
        createdByID: firstLast,
        userId: userName ? userName._id : null,
        dataPosted: feedItem.datePosted,
        comments: feedItem.comments,
      };
      feedProjection.push(curr);
    }

    return res.status(200).render("user/feed", {
      title: "Feed",
      feedList: feedProjection,
      page: "Feed",
      layout: "main",
      activeClass: "feed-active",
    });
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
        page: "Feed",
        error: [e.error],
      });
    } else {
      return res.status(400).render("user/feed", {
        title: "Feed",
        page: "Feed",
        error: [e],
      });
    }
  }
});

router.route("/post/:id").get(async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  try {
    let id = xss(req.params.id);
    helpers.checkId(id);
    let feedPost = await feedData.getFeedById(id);
    if (!feedPost) throw "No such post exists";
    let userName = await userData.getUserById(feedPost.createdByID);
    let userId = feedPost.createdByID;
    if (!userName) throw "No such user exists";
    feedPost.createdByID = userName.firstName + " " + userName.lastName;
    let comments = await commentData.getAllComments(id, "feed");
    if (!comments) throw "No comments found";
    if (comments.length === 0) {
      comments = null;
    } else {
      for (let i = 0; i < comments.length; i++) {
        let curr = comments[i];
        let userName;
        try {
          userName = await userData.getUserById(curr.creatorID);
        } catch (error) {
          userName = "deleted user";
        }
        if (!userName) throw "No such user exists";
        if (userName !== "deleted user") {
          comments[i].creatorID = userName.firstName + " " + userName.lastName;
        } else {
          comments[i].creatorID = userName;
        }
      }
    }
    return res.status(200).render("user/feedPost", {
      feedPost: feedPost,
      title: feedPost.title,
      comments: comments,
      userId: userId,
      page: "Post",
    });
  } catch (e) {
    return res
      .status(404)
      .render("error/error", { title: "Error", layout: "error", error: e });
  }
});

router
  .route("/createfeed")
  .post(async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/");
    }
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
      if (!result.title || !result.description) {
        errorObject.error = "Please fill out all fields.";
        throw errorObject;
      }

      //retreiving teamID and userID - pending
      result.createdByID = aes256.decrypt(
        config.get("aes_key"),
        req.session.user.id
      );
      result.description = xss(result.description.trim());
      result.title = xss(result.title.trim());

      let newFeed = await feedData.createFeed(
        result.title,
        result.description,
        result.createdByID
      );

      logger.info("User Created Feed.");
      res.redirect("/feed");
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
          page: "Create Feed",
          error: e.error,
          layout: "main",
        });
      } else {
        return res.status(400).render("user/createFeed", {
          title: "Create Feed",
          page: "Create Feed",
          error: e.error,
          layout: "main",
        });
      }
    }
  })
  .get(async (req, res) => {
    if (!req.session.user) {
      return res.redirect("/");
    }
    res.render("user/createFeed", {
      title: "Create Feed",
      page: "Create Feed",
      activeClass: "feed-active",
    });
  });

router.route("/addComment/:id").post(async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  let id = xss(req.params.id.trim());
  let comment = xss(req.body.comment.trim());
  helpers.checkId(id);
  helpers.checkInputString(comment);
  try {
    let feedPost = await feedData.getFeedById(id);
    if (!feedPost) throw "No such post exists";
    let commentCreate = await commentData.createComment(
      id,
      aes256.decrypt(config.get("aes_key"), req.session.user.id),
      comment,
      "feed"
    );
    if (!commentCreate) throw "Comment not created";
    req.session.success = "Comment Added Successfully";
    res.redirect("/feed/post/" + id);
  } catch (e) {
    return res
      .status(404)
      .render("error/error", { title: "Error", layout: "error", error: e });
  }
});

module.exports = router;
