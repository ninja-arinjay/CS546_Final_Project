const express = require("express");
const data = require("../data");
const teamData = data.teams;
const userData = data.users;
const teamItemData = data.teamItems;
const router = express.Router();
const path = require("path");
const helpers = require("./../helpers/teamHelper");
const userHelpers = require("./../helpers/userHelper");
const aes256 = require("aes256");
const config = require("config");
const { Console } = require("console");
const { teamItems } = require("../data");

router.route("/task/create/:id").post(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (req.session.user) {
      helpers.checkTeamInput("id", req.params.id.trim(), "Team Id");
      let teamRow = await teamData.getTeamById(req.params.id.trim());
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

router.route("/task/addComment/:id").post(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (req.session.user) {
      helpers.checkTeamInput("id", req.params.id.trim(), "Team Id");
      let teamRow = await teamItemData.getTeamItemById(req.params.id.trim());
      helpers.checkTeamInput("description", req.body.comment, "Task Comment");
      let d = new Date();
      let dateCreated =
        d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
      if (
        Date.parse(teamRow.startDate) > Date.parse(dateCreated) ||
        Date.parse(teamRow.endDate) < dateCreated
      ) {
        errorObject.status = 500;
        errorObject.error = "ERROR: CANNOT ADD COMMENT AS TASK IS NOT ACTIVE";
        throw errorObject;
      }
      await teamItemData.addComment(
        teamRow._id,
        req.body.comment,
        aes256.decrypt(config.get("aes_key"), req.session.user.id)
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

router.route("/task/info/:id").get(async (req, res) => {
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

router.route("/task/addComment/:id").get(async (req, res) => {
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
        title: "Taks Comment Info",
        page: "Taks Comment Info",
        activeClass: "team-active",
        taskID: teamItemRow._id,
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
