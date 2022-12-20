const express = require("express");
const data = require("../data");
const teamData = data.teams;
const userData = data.users;
const commentData = data.comments;
const teamItemData = data.teamItems;
const router = express.Router();
const path = require("path");
const helpers = require("./../helpers/teamHelper");
const userHelpers = require("./../helpers/userHelper");
const aes256 = require("aes256");
const config = require("config");
const { Console } = require("console");
const { teamItems } = require("../data");
const xss = require("xss");

router.route("/create/:id").post(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (req.session.user) {
      helpers.checkTeamInput("id", req.params.id.trim(), "Team Id");
      let teamRow = await teamData.getTeamById(req.params.id.trim());
      req.body.title = xss(req.body.title.trim());
      req.body.content = xss(req.body.content.trim());
      helpers.checkTeamInput("name", req.body.title, "Task Title");
      helpers.checkTeamInput("description", req.body.content, "Task Content");
      userHelpers.dateCheckTask(req.body.startDate, req.body.endDate);
      await teamItemData.createTeamItem(
        teamRow.creatorID,
        req.body.startDate.trim(),
        req.body.endDate.trim(),
        req.body.title.trim(),
        req.body.content.trim(),
        teamRow._id
      );
      req.session.success = "Task Created Successfully";
      res.redirect("/team/info/" + teamRow._id);
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
      return res.status(400).render("error/error", {
        title: "Error",
        error: e,
        status: 400,
        layout: "error",
      });
    }
  }
});

router.route("/deleteComment/:id/:teamId").get(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (req.session.user) {
      let id = xss(req.params.id.trim());
      let teamId = xss(req.params.teamId.trim());
      userHelpers.checkId(id);
      let commentRow = await commentData.getCommentById(id, "teamItem");
      if(commentRow === null){
        req.session.error = "Comment Does Not Exist";
        return res.status(404).redirect("/task/info/" + commentRow.teamID);
      }
      try {
        await commentData.deleteComment(id, "teamItem");
        //console.log("Comment Deleted Successfully")
      } catch (error) {
        req.session.error = "Comment Does Not Exist";
        return res.redirect("/task/info/" + teamId);
      }
      //console.log(commentRow)
      req.session.success = "Comment Deleted Successfully";
      return res.redirect("/task/info/" + teamId);
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
      return res.status(400).render("error/error", {
        title: "Error",
        error: e,
        status: 400,
        layout: "error",
      });
    }
  }
});

router.route("/addComment/:id").post(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (req.session.user) {
      //helpers.checkTeamInput("id", req.params.id.trim(), "Team Id");
      userHelpers.checkId(req.params.id.trim());
      let teamRow = await teamItemData.getTeamItemById(req.params.id.trim());
      //console.log(teamRow);
      userHelpers.checkInputString(xss(req.body.comment.trim()));
      let comm = xss(req.body.comment.trim());
      let d = new Date();
      let dateCreated =
      d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();

      //console.log(dateCreated, teamRow.dateStart, teamRow.dateEnd);

      if (
        Date.parse(teamRow.dateStart) > Date.parse(dateCreated) ||
        Date.parse(teamRow.dateEnd) < dateCreated
      ) {
        req.session.error = "Task is Not Active";
        return res.status(400).redirect("/task/info/" + teamRow.teamID);
      }
      await commentData.createComment(
        teamRow._id,
        aes256.decrypt(config.get("aes_key"), req.session.user.id),
        comm,
        "teamItem"
      );
      req.session.success = "Comment Created Successfully";
      res.redirect("/task/info/" + teamRow.teamID);
    } else {
      errorObject.status = 403;
      errorObject.error = "Unauthorized Access";
      throw errorObject;
    }
  } catch (e) {
    //console.log(e);
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
      return res.status(400).render("error/error", {
        title: "Error",
        error: e,
        status: 400,
        layout: "error",
      });
    }
  }
});

router.route("/info/:id").get(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (req.session.user) {
      helpers.checkTeamInput("id", req.params.id.trim(), "Team Id");
      let teamRow = await teamData.getTeamById(req.params.id.trim());
      let userInTeam = await teamData.userStatus(
        req.params.id.trim(),
        aes256.decrypt(config.get("aes_key"), req.session.user.id)
      );
      let teamUser = false;
      let adminUser = false;
      let creatorUser = false;
      if (userInTeam.inTeam) {
        teamUser = true;
        if (
          userInTeam.admin.includes(
            aes256.decrypt(config.get("aes_key"), req.session.user.id)
          )
        ) {
          adminUser = true;
        }
        if (
          teamRow.creatorID ==
          aes256.decrypt(config.get("aes_key"), req.session.user.id)
        ) {
          creatorUser = true;
        }
      } else {
        errorObject.status = 403;
        errorObject.error = "Unauthorized Access";
        throw errorObject;
      }

      if (
        !teamRow.members.includes(
          aes256.decrypt(config.get("aes_key"), req.session.user.id)
        )
      ) {
        errorObject.status = 403;
        errorObject.error = "Unauthorized Access";
        throw errorObject;
      }
      let d = new Date();
      d = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
      let taskRows = await teamItemData.getTeamItemByTeam(teamRow._id);
      for (let i = 0; i < taskRows.length; i++) {
        let comms = await commentData.getAllComments(
          taskRows[i]._id,
          "teamItem"
        );
        if (!comms) {
          comms = [];
        } else {
          for (let j = 0; j < comms.length; j++) {
            let user = await userData.getUserById(comms[j].creatorID);
            if (user) {
              comms[j].creatorID = user.firstName + " " + user.lastName;
            } else {
              comms[j].creatorID = "deleted user";
            }
          }
        }
        taskRows[i].comments = comms;
      }
      //console.log(adminUser);
      return res.status(200).render("task/info", {
        title: "Task Info",
        page: "Task Info",
        activeClass: "team-active",
        teamUser: teamUser,
        adminUser: adminUser,
        creatorUser: creatorUser,
        teamId: req.params.id.trim(),
        taskData: taskRows,
        success: "",
        currentDate: d,
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
      return res.status(e.status).render("error/error", {
        title: "Error",
        error: e.error,
        status: e.status,
        layout: "error",
      });
    } else {
      return res.status(400).render("error/error", {
        title: "Error",
        error: e,
        status: 400,
        layout: "error",
      });
    }
  }
});

router.route("/addComment/:id").get(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (req.session.user) {
      helpers.checkTeamInput("id", req.params.id.trim(), "Team Id");
      let teamItemRow = await teamItemData.getTeamItemById(
        req.params.id.trim()
      );
      if (!teamItemRow) {
        errorObject.status = 500;
        errorObject.error = "INVALID DATA";
        throw errorObject;
      }
      let teamRow = await teamData.getTeamById(teamItemRow.teamID);
      if (
        !teamRow.members.includes(
          aes256.decrypt(config.get("aes_key"), req.session.user.id)
        )
      ) {
        errorObject.status = 403;
        errorObject.error = "Unauthorized Access";
        throw errorObject;
      }
      return res.status(200).render("task/create", {
        title: "Task Comment Info",
        page: "Task Comment Info",
        activeClass: "team-active",
        taskID: teamItemRow._id,
        layout: "main",
        teamID: teamItemRow.teamID,
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
      return res.status(e.status).render("error/error", {
        title: "Error",
        error: e.error,
        status: e.status,
        layout: "error",
      });
    } else {
      return res.status(400).render("error/error", {
        title: "Error",
        error: e,
        status: 400,
        layout: "error",
      });
    }
  }
});
module.exports = router;
