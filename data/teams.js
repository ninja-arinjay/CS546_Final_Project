const mongoCollections = require("../config/mongoCollections");
const teams = mongoCollections.teams;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const helper = require("../helpers/teamHelper");
const userhelper = require("../helpers/userHelper");

// createTeam, getTeamById, getAllTeams, getTeamByName, updateTeam, deleteTeam
// removeMember, addMember, removeAdmin, addAdmin

const createTeam = async (
  teamName,
  description,
  private,
  memberLimit,
  ageMin,
  creatorID
) => {
  const errorObject = {
    status: 400,
  };
  helper.checkTeamInput("name", teamName, "Team Name");
  helper.checkTeamInput("description", description, "Team Description");
  helper.checkTeamInput(
    "private",
    private,
    "Private option for Team",
    false,
    true
  );
  helper.checkTeamInput("memberLimit", memberLimit, "Team Member Limit");
  helper.checkTeamInput("ageMin", ageMin, "Team Member Minimum");
  helper.checkTeamInput("id", creatorID, "User");

  teamName = teamName.trim().toLowerCase();
  creatorID = creatorID.trim();
  description = description.trim();

  // get access to the database
  const teamCollection = await teams();
  if (teamCollection === undefined) {
    errorObject.status = 500;
    errorObject.error = "DATABASE COULD NOT BE REACHED.";
    throw errorObject;
  }

  //check team name
  const findTeam = await teamCollection.findOne({ teamName: teamName });
  if (findTeam) {
    errorObject.error = "Team with this name already exists.";
    throw errorObject;
  }

  // get the current date
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  let createdDate = mm + "/" + dd + "/" + yyyy;

  let newTeam = {
    teamName: teamName,
    creatorID: creatorID,
    dateCreated: createdDate,
    numMembers: 1,
    description: description,
    private: private,
    memberLimit: memberLimit,
    ageMin: ageMin,
    members: [creatorID],
    admins: [creatorID],
    teamItems: [],
    comments: [],
  };

  // insert the team into the database
  const insertInfo = await teamCollection.insertOne(newTeam);
  if (!insertInfo.acknowledged || insertInfo.insertedCount === 0) {
    errorObject.status = 500;
    errorObject.error = "COULD NOT CREATE TEAM";
    throw errorObject;
  }

  // now we need to update the user's created team list
  const userCollection = await users();
  if (userCollection === undefined) {
    errorObject.status = 500;
    errorObject.error = "DATABASE COULD NOT BE REACHED.";
    throw errorObject;
  }
  const updateUser = await userCollection.updateOne(
    { _id: ObjectId(creatorID) },
    {
      $push: {
        teamsCreated: insertInfo.insertedId.toString(),
        teamsJoined: insertInfo.insertedId.toString(),
      },
    }
  );
  if (updateUser.modifiedCount === 0) {
    errorObject.status = 500;
    errorObject.error = "COULD NOT UPDATE USER";
    throw errorObject;
  }

  const newId = insertInfo.insertedId.toString();
  newTeam._id = newId;
  return newTeam;
};

const getAllTeams = async () => {
  const errorObject = {
    status: 400,
  };
  const teamCollection = await teams();
  if (teamCollection === undefined) {
    errorObject.status = 500;
    errorObject.error = "DATABASE COULD NOT BE REACHED.";
    throw errorObject;
  }

  let allTeams = await teamCollection.find({}).toArray();
  allTeams.forEach((element) => {
    element._id = element._id.toString();
  });

  return allTeams;
};

const getAllUserTeams = async (array, flag = true) => {
  const errorObject = {
    status: 400,
  };
  if (!Array.isArray(array)) {
    errorObject.status = 500;
    errorObject.error = "Invalid Data";
    throw errorObject;
  }
  const teamCollection = await teams();
  if (teamCollection === undefined) {
    errorObject.status = 500;
    errorObject.error = "DATABASE COULD NOT BE REACHED.";
    throw errorObject;
  }
  let allTeams = [];
  array = array.map(function (element) {
    return ObjectId(element);
  });
  if (flag) {
    allTeams = await teamCollection.find({ _id: { $in: array } }).toArray();
  } else {
    allTeams = await teamCollection.find({ _id: { $nin: array } }).toArray();
  }
  allTeams.forEach((element) => {
    element._id = element._id.toString();
  });

  return allTeams;
};

// get a team by its id
const getTeamById = async (id) => {
  const errorObject = {
    status: 400,
  };
  helper.checkTeamInput("id", id, "Team");
  id = id.trim();

  const teamCollection = await teams();
  if (teamCollection === undefined) {
    errorObject.status = 500;
    errorObject.error = "DATABASE COULD NOT BE REACHED.";
    throw errorObject;
  }

  const findTeam = await teamCollection.findOne({ _id: ObjectId(id) });
  if (!findTeam) {
    errorObject.status = 500;
    errorObject.error = "TEAM NOT FOUND";
    throw errorObject;
  }

  findTeam._id = findTeam._id.toString();
  return findTeam;
};

// get a team by its name
const getTeamByName = async (teamName) => {
  const errorObject = {
    status: 400,
  };
  helper.checkTeamInput("name", teamName, "Team Name");

  const teamCollection = await teams();
  if (teamCollection === undefined) {
    {
      errorObject.status = 500;
      errorObject.error = "DATABASE COULD NOT BE REACHED.";
      throw errorObject;
    }
  }

  const findTeam = await teamCollection.findOne({ teamName: teamName });
  if (!findTeam) {
    errorObject.status = 500;
    errorObject.error = "TEAM NOT FOUND";
    throw errorObject;
  }
  findTeam._id = findTeam._id.toString();
  return findTeam;
};

// update a teams name
const updateTeam = async (
  id,
  teamName,
  description,
  private,
  memberLimit,
  ageMin,
  currentUserID
) => {
  const errorObject = {
    status: 400,
  };

  helper.checkTeamInput("id", id, "Team");
  helper.checkTeamInput("name", teamName, "Team Name");
  helper.checkTeamInput("description", description, "Team Description");
  helper.checkTeamInput(
    "private",
    private,
    "Private option for Team",
    false,
    true
  );
  helper.checkTeamInput("memberLimit", memberLimit, "Team Member Limit");
  helper.checkTeamInput("ageMin", ageMin, "Team Member Minimum");
  helper.checkTeamInput("id", currentUserID, "User");

  teamName = teamName.trim().toLowerCase();
  description = description.trim();
  const teamCollection = await teams();
  if (teamCollection === undefined) {
    {
      errorObject.status = 500;
      errorObject.error = "DATABASE COULD NOT BE REACHED.";
      throw errorObject;
    }
  }

  const findTeam = await teamCollection.findOne({ _id: ObjectId(id) });
  if (!findTeam) {
    errorObject.status = 500;
    errorObject.error = "TEAM NOT FOUND";
    throw errorObject;
  }

  //check if some other team has same name
  const findOtherTeam = await teamCollection.findOne({
    _id: { $ne: ObjectId(id) },
    teamName: teamName,
  });
  if (findOtherTeam) {
    errorObject.status = 500;
    errorObject.error = "Team with this name already exists";
    throw errorObject;
  }

  //check if user changing is admin or not
  if (!findTeam.admins.includes(currentUserID)) {
    errorObject.status = 500;
    errorObject.error = "Unauthorized Access";
    throw errorObject;
  }

  //check if minimum age is fullfill by all members leaving creator
  const userCollection = await users();
  let usersData = await userCollection
    .find({
      teamsJoined: { $in: [id] },
      teamsCreated: { $nin: [id] },
    })
    .sort({ age: 1 })
    .limit(1)
    .toArray();

  if (usersData) {
    if (ageMin > usersData[0].age) {
      errorObject.error = "Team has user whose age is less than " + ageMin;
      throw errorObject;
    }
  }

  //check if max member requirement is fullfill
  if (findTeam.numMembers > memberLimit) {
    errorObject.error = "Team has members more than " + memberLimit;
    throw errorObject;
  }

  const updateInfo = await teamCollection.updateOne(
    { _id: ObjectId(id) },
    {
      $set: {
        teamName: teamName,
        description: description,
        private: private,
        memberLimit: memberLimit,
        ageMin: ageMin,
      },
    }
  );
  if (updateInfo.modifiedCount === 0) {
    {
      errorObject.status = 500;
      errorObject.error = "Team Values Same as Old One";
      throw errorObject;
    }
  }

  const updatedTeam = await teamCollection.findOne({ _id: ObjectId(id) });

  updatedTeam._id = updatedTeam._id.toString();
  return updatedTeam;
};

// delete a team, remove it from all users
const deleteTeam = async (id, userid) => {
  const errorObject = {
    status: 400,
  };
  helper.checkTeamInput("id", id, "Team");

  const teamCollection = await teams();
  if (teamCollection === undefined) {
    {
      errorObject.status = 500;
      errorObject.error = "DATABASE COULD NOT BE REACHED.";
      throw errorObject;
    }
  }

  const findTeam = await teamCollection.findOne({ _id: ObjectId(id) });
  if (!findTeam) {
    errorObject.status = 500;
    errorObject.error = "TEAM NOT FOUND";
    throw errorObject;
  }

  //check if creator of team is deleting Team
  userhelper.checkInput("id", userid, "User");
  if (findTeam.creatorID !== userid) {
    errorObject.status = 403;
    errorObject.error = "Unauthorized Access";
    throw errorObject;
  }

  const deletionInfo = await teamCollection.deleteOne({ _id: ObjectId(id) });
  if (deletionInfo.deletedCount === 0) {
    throw `COULD NOT DELETE TEAM WITH ID OF ${id}`;
  }

  const userCollection = await users();
  if (userCollection === undefined) {
    {
      errorObject.status = 500;
      errorObject.error = "DATABASE COULD NOT BE REACHED.";
      throw errorObject;
    }
  }

  // now we need to update the creator user's created team list
  const updateUser = await userCollection.updateOne(
    { _id: ObjectId(findTeam.creatorID) },
    { $pull: { teamsCreated: id } }
  );
  if (updateUser.modifiedCount === 0) {
    {
      errorObject.status = 500;
      errorObject.error = "COULD NOT UPDATE USER";
      throw errorObject;
    }
  }

  // remove the team from all users
  const updateUsers = await userCollection.updateMany(
    {},
    { $pull: { teamsJoined: id } }
  );
  if (updateUsers.modifiedCount === 0) {
    {
      errorObject.status = 500;
      errorObject.error = "COULD NOT UPDATE USERS";
      throw errorObject;
    }
  }

  return { teamName: findTeam.teamName, deleted: true };
};

// add a user to a team
const addMember = async (teamId, userId, isAdmin = false) => {
  const errorObject = {
    status: 400,
  };
  helper.checkTeamInput("id", teamId, "Team");
  userhelper.checkInput("id", userId, "User");

  const teamCollection = await teams();
  if (teamCollection === undefined) {
    {
      errorObject.status = 500;
      errorObject.error = "DATABASE COULD NOT BE REACHED.";
      throw errorObject;
    }
  }

  // make sure team exists
  const findTeam = await teamCollection.findOne({ _id: ObjectId(teamId) });
  if (!findTeam) {
    errorObject.status = 500;
    errorObject.error = "TEAM NOT FOUND";
    throw errorObject;
  }
  const userCollection = await users();
  if (userCollection === undefined) {
    {
      errorObject.status = 500;
      errorObject.error = "DATABASE COULD NOT BE REACHED.";
      throw errorObject;
    }
  }

  // make sure user exists
  const findUser = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!findUser) {
    errorObject.status = 500;
    errorObject.error = "USER NOT FOUND";
    throw errorObject;
  }

  //check if user is already a member
  if (findTeam.members.includes(findUser._id.toString())) {
    errorObject.status = 500;
    errorObject.error = "User is already a member";
    throw errorObject;
  }

  //check if user is of valid age
  if (findTeam.ageMin > findUser.age) {
    errorObject.error = "User does not meet age Criteria to join Team";
    throw errorObject;
  }

  //check if team has reached capacity
  if (findTeam.numMembers >= findTeam.memberLimit) {
    errorObject.error = "Team has reached its maximum member capacity";
    throw errorObject;
  }

  //check if team is private
  if (findTeam.private && !isAdmin) {
    errorObject.status = 500;
    errorObject.error = "Team is Private";
    throw errorObject;
  }

  // add the user to the team list
  const updateInfo = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $push: { members: userId } }
  );
  if (updateInfo.modifiedCount === 0) {
    {
      errorObject.status = 500;
      errorObject.error = "COULD NOT ADD MEMBER TO TEAM";
      throw errorObject;
    }
  }

  // add the team to the user's list
  const updateInfo2 = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $push: { teamsJoined: teamId } }
  );
  if (updateInfo2.modifiedCount === 0) {
    {
      errorObject.status = 500;
      errorObject.error = "COULD NOT ADD TEAM TO USER";
      throw errorObject;
    }
  }

  // update the number of members
  const updateInfo3 = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $inc: { numMembers: 1 } }
  );
  if (updateInfo3.modifiedCount === 0) {
    {
      errorObject.status = 500;
      errorObject.error = "COULD NOT UPDATE TEAM MEMBER COUNT";
      throw errorObject;
    }
  }

  return { teamName: findTeam.teamName, added: true };
};

// remove a user from a team
const removeMember = async (teamId, userId, currentUserID) => {
  const errorObject = {
    status: 400,
  };
  helper.checkTeamInput("id", teamId, "Team");
  userhelper.checkInput("id", userId, "User");
  if (userId == currentUserID) {
    errorObject.status = 500;
    errorObject.error = "Cannot Delete Self.";
    throw errorObject;
  }
  const teamCollection = await teams();
  if (teamCollection === undefined) {
    {
      errorObject.status = 500;
      errorObject.error = "DATABASE COULD NOT BE REACHED.";
      throw errorObject;
    }
  }

  const findTeam = await teamCollection.findOne({ _id: ObjectId(teamId) });
  if (!findTeam) {
    errorObject.status = 500;
    errorObject.error = "TEAM NOT FOUND";
    throw errorObject;
  }
  const userCollection = await users();
  if (userCollection === undefined) {
    {
      errorObject.status = 500;
      errorObject.error = "DATABASE COULD NOT BE REACHED.";
      throw errorObject;
    }
  }
  const findUser = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!findUser) {
    errorObject.status = 500;
    errorObject.error = "USER NOT FOUND";
    throw errorObject;
  }

  //check if user is member of team
  if (!findTeam.members.includes(findUser._id.toString())) {
    errorObject.status = 500;
    errorObject.error = "USER NOT MEMBER OF TEAM";
    throw errorObject;
  }

  //check if user that is removing admin status is creator or admin
  let creatorFlag = false;
  if (findTeam.creatorID !== currentUserID) {
    if (!findTeam.admins.includes(currentUserID)) {
      errorObject.status = 500;
      errorObject.error = "Unauthorized Access";
      throw errorObject;
    }
  } else {
    creatorFlag = true;
  }

  //check if user is admin
  if (findTeam.admins.includes(userId) && !creatorFlag) {
    errorObject.status = 500;
    errorObject.error = "Unauthorized Access";
    throw errorObject;
  }

  // remove the user from the team list
  const updateInfo = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $pull: { members: userId } }
  );
  if (updateInfo.modifiedCount === 0) {
    {
      errorObject.status = 500;
      errorObject.error = "COULD NOT REMOVE MEMBER FROM TEAM";
      throw errorObject;
    }
  }

  // remove the team from the user's list
  const updateInfo2 = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $pull: { teamsJoined: teamId } }
  );
  if (updateInfo2.modifiedCount === 0) {
    {
      errorObject.status = 500;
      errorObject.error = "COULD NOT REMOVE TEAM FROM USER";
      throw errorObject;
    }
  }

  // update the number of members
  const updateInfo3 = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $inc: { numMembers: -1 } }
  );
  if (updateInfo3.modifiedCount === 0) {
    {
      errorObject.status = 500;
      errorObject.error = "COULD NOT UPDATE TEAM MEMBER COUNT";
      throw errorObject;
    }
  }

  return { teamName: findTeam.teamName, removed: true };
};

// make a user an admin of a team
const addAdmin = async (teamId, userId, currentUserID) => {
  const errorObject = {
    status: 400,
  };
  helper.checkTeamInput("id", teamId, "Team");
  userhelper.checkInput("id", userId, "User");

  const teamCollection = await teams();
  if (teamCollection === undefined) {
    {
      errorObject.status = 500;
      errorObject.error = "DATABASE COULD NOT BE REACHED.";
      throw errorObject;
    }
  }

  const findTeam = await teamCollection.findOne({ _id: ObjectId(teamId) });
  if (!findTeam) {
    errorObject.status = 500;
    errorObject.error = "TEAM NOT FOUND";
    throw errorObject;
  }
  const userCollection = await users();
  if (userCollection === undefined) {
    {
      errorObject.status = 500;
      errorObject.error = "DATABASE COULD NOT BE REACHED.";
      throw errorObject;
    }
  }

  const findUser = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!findUser) {
    errorObject.status = 500;
    errorObject.error = "USER NOT FOUND";
    throw errorObject;
  }

  //check if user is member of team
  if (!findTeam.members.includes(findUser._id.toString())) {
    errorObject.status = 500;
    errorObject.error = "USER NOT MEMBER OF TEAM";
    throw errorObject;
  }

  //check if user is already admin
  if (findTeam.admins.includes(userId)) {
    errorObject.status = 500;
    errorObject.error = "User is Already Admin";
    throw errorObject;
  }

  //check if user that is adding is creator
  if (findTeam.creatorID !== currentUserID) {
    errorObject.status = 403;
    errorObject.error = "Unauthorized Access";
    throw errorObject;
  }

  // add the user to the team admin list
  const updateInfo = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $push: { admins: userId } }
  );
  if (updateInfo.modifiedCount === 0) {
    {
      errorObject.status = 500;
      errorObject.error = "COULD NOT ADD ADMIN TO TEAM";
      throw errorObject;
    }
  }

  return { teamName: findTeam.teamName, added: true };
};

// remove a user from the admin list of a team
const removeAdmin = async (teamId, userId, currentUserID) => {
  const errorObject = {
    status: 400,
  };
  helper.checkTeamInput("id", teamId, "Team");
  userhelper.checkInput("id", userId, "User");
  if (userId == currentUserID) {
    errorObject.status = 500;
    errorObject.error = "Cannot Remove Self Status.";
    throw errorObject;
  }
  const teamCollection = await teams();
  if (teamCollection === undefined) {
    {
      errorObject.status = 500;
      errorObject.error = "DATABASE COULD NOT BE REACHED.";
      throw errorObject;
    }
  }

  const findTeam = await teamCollection.findOne({ _id: ObjectId(teamId) });
  if (!findTeam) {
    errorObject.status = 500;
    errorObject.error = "TEAM NOT FOUND";
    throw errorObject;
  }
  const userCollection = await users();
  if (userCollection === undefined) {
    {
      errorObject.status = 500;
      errorObject.error = "DATABASE COULD NOT BE REACHED.";
      throw errorObject;
    }
  }

  const findUser = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!findUser) {
    errorObject.status = 500;
    errorObject.error = "USER NOT FOUND";
    throw errorObject;
  }

  //check if user is member of team
  if (!findTeam.members.includes(findUser._id.toString())) {
    errorObject.status = 500;
    errorObject.error = "USER NOT MEMBER OF TEAM";
    throw errorObject;
  }

  //check if user is not admin
  if (!findTeam.admins.includes(userId)) {
    errorObject.status = 500;
    errorObject.error = "User is Not Admin";
    throw errorObject;
  }

  //check if user that is removing admin status is creator
  if (findTeam.creatorID !== currentUserID) {
    errorObject.status = 403;
    errorObject.error = "Unauthorized Access";
    throw errorObject;
  }

  // remove the user from the team admin list
  const updateInfo = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $pull: { admins: userId } }
  );
  if (updateInfo.modifiedCount === 0) {
    {
      errorObject.status = 500;
      errorObject.error = "COULD NOT REMOVE ADMIN FROM TEAM";
      throw errorObject;
    }
  }

  return { teamName: findTeam.teamName, removed: true };
};

// check if user is in a team
const userStatus = async (teamId, userId) => {
  const errorObject = {
    status: 400,
  };
  helper.checkTeamInput("id", teamId, "Team");
  helper.checkTeamInput("id", userId, "User");

  const teamCollection = await teams();
  if (teamCollection === undefined) {
    errorObject.status = 500;
    errorObject.error = "DATABASE COULD NOT BE REACHED.";
    throw errorObject;
  }

  const findTeam = await teamCollection.findOne({ _id: ObjectId(teamId) });
  if (!findTeam) {
    errorObject.status = 500;
    errorObject.error = "TEAM NOT FOUND";
    throw errorObject;
  }

  const userCollection = await users();
  if (userCollection === undefined) {
    errorObject.status = 500;
    errorObject.error = "DATABASE COULD NOT BE REACHED.";
    throw errorObject;
  }

  const findUser = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!findUser) {
    errorObject.status = 500;
    errorObject.error = "USER NOT FOUND";
    throw errorObject;
  }

  // check if the user is in the team
  const userInTeam = findUser.teamsJoined.includes(teamId);
  // if user is not in team return false
  if (!userInTeam) return { teamName: findTeam.teamName, inTeam: false };

  // return the user's status in the team
  return { teamName: findTeam.teamName, inTeam: true, admin: findTeam.admins };
};

const addComment = async (teamId, userId, comment) => {
  const errorObject = {
    status: 400,
  };
  helper.checkTeamInput("id", teamId, "Team");
  helper.checkTeamInput("id", userId, "User");
  helper.checkTeamInput("description", comment, "Team Comment");
  teamId = teamId.trim();
  userId = userId.trim();
  comment = comment.trim();

  const teamCollection = await teams();
  if (teamCollection === undefined) {
    errorObject.status = 500;
    errorObject.error = "DATABASE COULD NOT BE REACHED.";
    throw errorObject;
  }

  const findTeam = await teamCollection.findOne({ _id: ObjectId(teamId) });
  if (!findTeam) {
    errorObject.status = 500;
    errorObject.error = "TEAM NOT FOUND";
    throw errorObject;
  }

  const userCollection = await users();
  if (userCollection === undefined) {
    errorObject.status = 500;
    errorObject.error = "DATABASE COULD NOT BE REACHED.";
    throw errorObject;
  }

  const findUser = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!findUser) {
    errorObject.status = 500;
    errorObject.error = "USER NOT FOUND";
    throw errorObject;
  }

  // check if the user is in the team
  const userInTeam = findUser.teamsJoined.includes(teamId);

  // if user is not in team return false
  if (!userInTeam) {
    errorObject.status = 500;
    errorObject.error = "USER NOT FOUND";
    throw errorObject;
  }

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  today = mm + "/" + dd + "/" + yyyy;
  let commentObjectId = new ObjectId();
  let newComment = {
    _id: commentObjectId.toString(),
    comment: comment.trim(),
    userId: userId,
    userName: findUser.firstName + " " + findUser.lastName,
    createdAt: today,
  };
  let teamComments = findTeam.comments;
  teamComments.push(newComment);
  const updatedTeam = {
    comments: teamComments,
  };
  const updatedInfo = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $set: updatedTeam }
  );
  if (updatedInfo.modifiedCount === 0) {
    errorObject.status = 500;
    errorObject.error = "Could not update team comment successfully.";
    throw errorObject;
  }

  return await getTeamById(teamId);
};

const deleteComment = async (commentId, teamId, userId) => {
  const errorObject = {
    status: 400,
  };
  helper.checkTeamInput("id", teamId, "Team");
  helper.checkTeamInput("id", userId, "User");
  helper.checkTeamInput("id", commentId, "Comment");
  teamId = teamId.trim();
  userId = userId.trim();
  commentId = commentId.trim();

  const teamCollection = await teams();
  if (teamCollection === undefined) {
    errorObject.status = 500;
    errorObject.error = "DATABASE COULD NOT BE REACHED.";
    throw errorObject;
  }

  const findTeam = await teamCollection.findOne({ _id: ObjectId(teamId) });
  if (!findTeam) {
    errorObject.status = 500;
    errorObject.error = "TEAM NOT FOUND";
    throw errorObject;
  }

  const userCollection = await users();
  if (userCollection === undefined) {
    errorObject.status = 500;
    errorObject.error = "DATABASE COULD NOT BE REACHED.";
    throw errorObject;
  }

  const findUser = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!findUser) {
    errorObject.status = 500;
    errorObject.error = "USER NOT FOUND";
    throw errorObject;
  }

  // check if the user is in the team admin
  const userInTeam = findTeam.admins.includes(userId);
  if (!userInTeam) {
    errorObject.status = 403;
    errorObject.error = "Unauthorized Access";
    throw errorObject;
  }
  let teamComments = findTeam.comments;
  const indexOfObject = teamComments.findIndex((object) => {
    return object._id == commentId;
  });
  teamComments.splice(indexOfObject, 1);

  const updatedTeam = {
    comments: teamComments,
  };
  const updatedInfo = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $set: updatedTeam }
  );
  if (updatedInfo.modifiedCount === 0) {
    errorObject.status = 500;
    errorObject.error = "Could not update team comment successfully.";
    throw errorObject;
  }

  return await getTeamById(teamId);
};

module.exports = {
  createTeam,
  getTeamById,
  getTeamByName,
  getAllTeams,
  updateTeam,
  deleteTeam,
  addMember,
  removeMember,
  addAdmin,
  removeAdmin,
  userStatus,
  addComment,
  deleteComment,
  getAllUserTeams,
};
