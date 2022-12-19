const express = require("express");
const data = require("../data");
const teamData = data.teams;
const userData = data.users;
const router = express.Router();
const path = require("path");
const helpers = require("./../helpers/teamHelper");
const userHelpers = require("./../helpers/userHelper");
const aes256 = require("aes256");
const config = require("config");
const logger = require("../utils/logger");
const { Console } = require("console");

router.route("/team").get(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (req.session.user) {
      let userRow = await userData.getUserById(
        aes256.decrypt(config.get("aes_key"), req.session.user.id)
      );
      let allTeams = await teamData.getAllUserTeams(userRow.teamsJoined, false);
      let successMessage = req.session.success;
      req.session.success = "";
      return res.status(200).render("team/index", {
        title: "Teams",
        page: "Teams",
        activeClass: "team-active",
        teams: allTeams,
        userData: aes256.decrypt(config.get("aes_key"), req.session.user.id),
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

router
  .route("/team/create")
  .get(async (req, res) => {
    try {
      const errorObject = {
        status: 400,
      };
      if (req.session.user) {
        return res.status(200).render("team/create", {
          title: "Create Team",
          page: "Create Team",
          activeClass: "team-active",
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
        let privateFlag = false;
        if (result.private) {
          privateFlag = true;
        }
        helpers.checkTeamInput("name", result.name, "Team Name", true);
        helpers.checkTeamInput(
          "description",
          result.description,
          "Team Description"
        );
        helpers.checkTeamInput(
          "private",
          privateFlag,
          "Private option for Team",
          true,
          true
        );
        helpers.checkTeamInput(
          "memberLimit",
          result.memberLimit,
          "Team Member Limit",
          true
        );
        helpers.checkTeamInput(
          "ageMin",
          result.ageMin,
          "Team Member Minimum Count",
          true
        );
        let teamRow = await teamData.createTeam(
          result.name.trim(),
          result.description.trim(),
          privateFlag,
          parseInt(result.memberLimit),
          parseInt(result.ageMin),
          aes256.decrypt(config.get("aes_key"), req.session.user.id)
        );
        logger.info("User Created Team");
        req.session.success = "Team Created Successfully";
        if (req.body.addUser != 0) {
          return res.redirect("/team/addUser/" + teamRow._id);
        } else {
          return res.redirect("/team");
        }
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
        if (e.status == 500 || e.status == 403 || e.status == 404) {
          return res.status(e.status).render("error/error", {
            title: "Error",
            error: e.error,
            status: e.status,
            layout: "error",
          });
        } else {
          return res.status(e.status).render("team/create", {
            title: "Create Team",
            page: "Create Team",
            activeClass: "team-active",
            error: e.error,
          });
        }
      } else {
        return res.status(400).render("team/create", {
          title: "Create Team",
          page: "Create Team",
          activeClass: "team-active",
          error: e,
        });
      }
    }
  });

router
  .route("/team/edit/:id")
  .get(async (req, res) => {
    try {
      const errorObject = {
        status: 400,
      };
      if (req.session.user) {
        let successMessage = req.session.success;
        req.session.success = "";
        helpers.checkTeamInput("id", req.params.id, "Team");
        let userInTeam = await teamData.userStatus(
          req.params.id.trim(),
          aes256.decrypt(config.get("aes_key"), req.session.user.id)
        );
        if (!userInTeam.inTeam) {
          errorObject.status = 403;
          errorObject.error = "Unauthorized Access";
          throw errorObject;
        } else if (
          !userInTeam.admin.includes(
            aes256.decrypt(config.get("aes_key"), req.session.user.id)
          )
        ) {
          errorObject.status = 403;
          errorObject.error = "Unauthorized Access";
          throw errorObject;
        }
        let team = await teamData.getTeamById(req.params.id.trim());
        let users = await userData.getUsersByTeam(team.members);
        let minAgeUser = await userData.getMinAgeUser(team._id);
        let minAgeValue = minAgeUser ? minAgeUser[0].age : 120;
        return res.status(200).render("team/edit", {
          title: "Edit Team",
          page: "Edit Team",
          activeClass: "team-active",
          teamData: team,
          users: users,
          currentUser: aes256.decrypt(
            config.get("aes_key"),
            req.session.user.id
          ),
          minAgeValue: minAgeValue,
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
  })
  .post(async (req, res, next) => {
    try {
      const errorObject = {
        status: 400,
      };
      if (req.session.user) {
        helpers.checkTeamInput("id", req.params.id.trim(), "Team");
        let userInTeam = await teamData.userStatus(
          req.params.id,
          aes256.decrypt(config.get("aes_key"), req.session.user.id)
        );
        if (!userInTeam.inTeam) {
          errorObject.status = 403;
          errorObject.error = "Unauthorized Access";
          throw errorObject;
        } else if (
          !userInTeam.admin.includes(
            aes256.decrypt(config.get("aes_key"), req.session.user.id)
          )
        ) {
          errorObject.status = 403;
          errorObject.error = "Unauthorized Access";
          throw errorObject;
        }

        let result = xss(req.body);
        let privateFlag = false;
        if (result.private) {
          privateFlag = true;
        }
        helpers.checkTeamInput("name", result.name, "Team Name", true);
        helpers.checkTeamInput(
          "description",
          result.description,
          "Team Description"
        );
        helpers.checkTeamInput(
          "private",
          privateFlag,
          "Private option for Team",
          true,
          true
        );
        helpers.checkTeamInput(
          "memberLimit",
          result.memberLimit,
          "Team Member Limit",
          true
        );
        helpers.checkTeamInput(
          "ageMin",
          result.ageMin,
          "Team Member Minimum Count",
          true
        );
        const teamRow = await teamData.updateTeam(
          req.params.id.trim(),
          result.name.trim(),
          result.description.trim(),
          privateFlag,
          parseInt(result.memberLimit),
          parseInt(result.ageMin),
          aes256.decrypt(config.get("aes_key"), req.session.user.id)
        );
        return res.json({ teamRow });
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
        return res.status(400).json(e.error);
      } else {
        return res.status(400).json(e);
      }
    }
  });

router.route("/team/addMember/:id").get(async (req, res, next) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (req.session.user) {
      helpers.checkTeamInput("id", req.params.id.trim(), "Team");
      await teamData.addMember(
        req.params.id.trim(),
        aes256.decrypt(config.get("aes_key"), req.session.user.id)
      );
      req.session.success = "Team joined Successfully";
      res.redirect("/team");
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

router.route("/team/delete/:id").get(async (req, res, next) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (req.session.user) {
      helpers.checkTeamInput("id", req.params.id.trim(), "Team");
      await teamData.deleteTeam(
        req.params.id.trim(),
        aes256.decrypt(config.get("aes_key"), req.session.user.id)
      );
      req.session.success = "Team deleted Successfully";
      res.redirect("/team");
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

router.route("/team/makeAdmin/:id/:userID").get(async (req, res, next) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (req.session.user) {
      helpers.checkTeamInput("id", req.params.id, "Team");
      userHelpers.checkInput("id", req.params.userID, "User");
      await teamData.addAdmin(
        req.params.id.trim(),
        req.params.userID.trim(),
        aes256.decrypt(config.get("aes_key"), req.session.user.id)
      );
      req.session.success = "Admin Added Successfully";
      res.redirect("/team/edit/" + req.params.id.trim());
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

router.route("/team/removeAdmin/:id/:userID").get(async (req, res, next) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (req.session.user) {
      helpers.checkTeamInput("id", req.params.id, "Team");
      userHelpers.checkInput("id", req.params.userID, "User");
      await teamData.removeAdmin(
        req.params.id.trim(),
        req.params.userID.trim(),
        aes256.decrypt(config.get("aes_key"), req.session.user.id)
      );
      req.session.success = "Admin Status Removed Successfully";
      res.redirect("/team/edit/" + req.params.id.trim());
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

router.route("/team/removeUser/:id/:userID").get(async (req, res, next) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (req.session.user) {
      helpers.checkTeamInput("id", req.params.id, "Team");
      userHelpers.checkInput("id", req.params.userID, "User");
      await teamData.removeMember(
        req.params.id.trim(),
        req.params.userID.trim(),
        aes256.decrypt(config.get("aes_key"), req.session.user.id)
      );
      req.session.success = "User Removed Successfully";
      res.redirect("/team/edit/" + req.params.id.trim());
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

router.route("/team/addUser/:id").get(async (req, res, next) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (req.session.user) {
      helpers.checkTeamInput("id", req.params.id.trim(), "Team");
      let teamRow = await teamData.getTeamById(req.params.id.trim());
      let userInTeam = await teamData.userStatus(
        req.params.id.trim(),
        aes256.decrypt(config.get("aes_key"), req.session.user.id)
      );
      if (!userInTeam.inTeam) {
        errorObject.status = 403;
        errorObject.error = "Unauthorized Access";
        throw errorObject;
      } else if (
        !userInTeam.admin.includes(
          aes256.decrypt(config.get("aes_key"), req.session.user.id)
        )
      ) {
        errorObject.status = 403;
        errorObject.error = "Unauthorized Access";
        throw errorObject;
      }

      let usersData = await userData.getNonTeamUsers(teamRow._id);
      return res.status(200).render("team/addUser", {
        title: "Add Team User",
        page: "Add Team user",
        activeClass: "team-active",
        team: teamRow._id,
        userData: usersData,
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
      return res.status(e.status).render("team/addUser", {
        title: "Add Team User",
        page: "Add Team user",
        activeClass: "team-active",
        error: e.error,
        status: e.status,
      });
    } else {
      return res.status(400).render("team/addUser", {
        title: "Add Team User",
        page: "Add Team user",
        activeClass: "team-active",
        error: e,
        status: 400,
      });
    }
  }
});

router.route("/team/adminAddMember/:id/:userId").get(async (req, res, next) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (req.session.user) {
      helpers.checkTeamInput("id", req.params.id.trim(), "Team");
      userHelpers.checkInput("id", req.params.userId, "User");
      let teamRow = await teamData.getTeamById(req.params.id.trim());
      let userInTeam = await teamData.userStatus(
        req.params.id.trim(),
        aes256.decrypt(config.get("aes_key"), req.session.user.id)
      );
      if (!userInTeam.inTeam) {
        errorObject.status = 403;
        errorObject.error = "Unauthorized Access";
        throw errorObject;
      } else if (
        !userInTeam.admin.includes(
          aes256.decrypt(config.get("aes_key"), req.session.user.id)
        )
      ) {
        errorObject.status = 403;
        errorObject.error = "Unauthorized Access";
        throw errorObject;
      }

      await teamData.addMember(
        req.params.id.trim(),
        req.params.userId.trim(),
        true
      );
      return res.redirect("/team/addUser/" + req.params.id.trim());
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

router.route("/team/info/:id").get(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (req.session.user) {
      let successMessage = req.session.success;
      req.session.success = "";
      helpers.checkTeamInput("id", req.params.id.trim(), "Team");
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
      }

      let teamMembers = await userData.getUsersByTeam(teamRow.members);
      return res.status(200).render("team/info", {
        title: "Team Info",
        page: "Team Info",
        activeClass: "team-active",
        teamUser: teamUser,
        adminUser: adminUser,
        creatorUser: creatorUser,
        teamId: req.params.id.trim(),
        teamData: teamRow,
        teamMembers: teamMembers,
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

router.route("/team/addComment/:id").post(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (req.session.user) {
      helpers.checkTeamInput("id", req.params.id.trim(), "Team");
      let teamRow = await teamData.getTeamById(req.params.id.trim());
      let userInTeam = await teamData.userStatus(
        req.params.id.trim(),
        aes256.decrypt(config.get("aes_key"), req.session.user.id)
      );
      if (!userInTeam.inTeam) {
        errorObject.status = 403;
        errorObject.error = "Unauthorized Access";
        throw errorObject;
      }
      await teamData.addComment(
        teamRow._id,
        aes256.decrypt(config.get("aes_key"), req.session.user.id),
        req.body.comment.trim()
      );
      req.session.success = "Comment Added Successfully";
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

router.route("/team/deleteComment/:id/:teamId").get(async (req, res) => {
  try {
    const errorObject = {
      status: 400,
    };
    if (req.session.user) {
      helpers.checkTeamInput("id", req.params.id.trim(), "Team");
      helpers.checkTeamInput("id", req.params.teamId.trim(), "Team");
      let teamRow = await teamData.getTeamById(req.params.teamId.trim());
      let userInTeam = await teamData.userStatus(
        req.params.teamId.trim(),
        aes256.decrypt(config.get("aes_key"), req.session.user.id)
      );
      if (!userInTeam.inTeam) {
        errorObject.status = 403;
        errorObject.error = "Unauthorized Access";
        throw errorObject;
      } else if (
        !userInTeam.admin.includes(
          aes256.decrypt(config.get("aes_key"), req.session.user.id)
        )
      ) {
        errorObject.status = 403;
        errorObject.error = "Unauthorized Access";
        throw errorObject;
      }
      await teamData.deleteComment(
        req.params.id.trim(),
        req.params.teamId.trim(),
        aes256.decrypt(config.get("aes_key"), req.session.user.id)
      );
      req.session.success = "Comment Deleted Successfully";
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
module.exports = router;
