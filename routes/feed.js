const express = require("express");
const data = require("../data");
//const userData = data.users;
const feedData = data.feed;
const router = express.Router();
const path = require("path");
const helpers = require("./../helpers/userHelper");
//const { title } = require("process");
const xss = require("xss");

router.route("/:id").get(async (req, res) => {
  if (!req.session.user) {
    return res.redirect("/");
  }
  try {
    let id = xss(req.params.id);
    helpers.checkId(id);
    let feedPost = await feedData.getUserById(id);
    if (!feedPost) throw "No such post exists";
    return res
      .status(200)
      .render("feed/post", { feedPost: feedPost, title: feedPost.title });
  } catch (e) {
    return res
      .status(404)
      .render("error", { title: "Error", layout: "main", error: e });
  }
});

module.exports = router;
