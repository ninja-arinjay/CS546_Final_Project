const mongoCollections = require("../config/mongoCollections");
const teams = mongoCollections.teams;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const helper = require("../helpers/userHelper");

// createTeam, getTeamById, getAllTeams, getTeamByName, updateTeam, deleteTeam
// removeMember, addMember, removeAdmin, addAdmin

const createTeam = async (teamName, creatorID) => {
  helper.checkInputString(teamName);
  helper.checkId(creatorID);

  teamName = teamName.trim();
  creatorID = creatorID.trim();

  // get access to the database
  const teamCollection = await teams();
  if (teamCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
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
    members: [creatorID],
    admins: [creatorID],
    teamItems: [],
    comments: [],
  };

  // insert the team into the database
  const insertInfo = await teamCollection.insertOne(newTeam);
  if (!insertInfo.acknowledged || insertInfo.insertedCount === 0) {
    throw "ERROR: COULD NOT CREATE TEAM";
  }

  // now we need to update the user's created team list
  const userCollection = await users();
  if (userCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }
  const updateUser = await userCollection.updateOne(
    { _id: ObjectId(creatorID) },
    { $push: { teamsCreated: insertInfo.insertedId.toString() } }
  );
  if (updateUser.modifiedCount === 0) {
    throw "ERROR: COULD NOT UPDATE USER";
  }

  const newId = insertInfo.insertedId.toString();
  // const newer = await getTeamById(newId);
  newTeam._id = newId;
  return newTeam;
};

const getAllTeams = async () => {
  const teamCollection = await teams();
  if (teamCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  let allTeams = await teamCollection.find({}).toArray();
  allTeams.forEach((element) => {
    element._id = element._id.toString();
  });

  return allTeams;
};

// get a team by its id
const getTeamById = async (id) => {
  helper.checkId(id);

  id = id.trim();

  const teamCollection = await teams();
  if (teamCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  const findTeam = await teamCollection.findOne({ _id: ObjectId(id) });
  if (!findTeam) throw "ERROR: TEAM NOT FOUND";

  findTeam._id = findTeam._id.toString();
  return findTeam;
};

// get a team by its name
const getTeamByName = async (teamName) => {
  helper.checkInputString(teamName);

  const teamCollection = await teams();
  if (teamCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  const findTeam = await teamCollection.findOne({ teamName: teamName });
  if (!findTeam) throw "ERROR: TEAM NOT FOUND";

  findTeam._id = findTeam._id.toString();
  return findTeam;
};

// update a teams name
const updateTeam = async (id, teamName) => {
  helper.checkId(id);
  helper.checkInputString(teamName);

  const teamCollection = await teams();
  if (teamCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  const findTeam = await teamCollection.findOne({ _id: ObjectId(id) });
  if (!findTeam) throw "ERROR: TEAM NOT FOUND";

  const updateInfo = await teamCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: { teamName: teamName } }
  );
  if (updateInfo.modifiedCount === 0) {
    throw "ERROR: COULD NOT UPDATE TEAM";
  }

  const updatedTeam = await teamCollection.findOne({ _id: ObjectId(id) });

  updatedTeam._id = updatedTeam._id.toString();
  return updatedTeam;
};

// delete a team, remove it from all users
const deleteTeam = async (id) => {
  helper.checkId(id);

  const teamCollection = await teams();
  if (teamCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  const findTeam = await teamCollection.findOne({ _id: ObjectId(id) });
  if (!findTeam) throw "ERROR: TEAM NOT FOUND";

  const deletionInfo = await teamCollection.deleteOne({ _id: ObjectId(id) });
  if (deletionInfo.deletedCount === 0) {
    throw `ERROR: COULD NOT DELETE TEAM WITH ID OF ${id}`;
  }

  const userCollection = await users();
  if (userCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  // now we need to update the creator user's created team list
  const updateUser = await userCollection.updateOne(
    { _id: ObjectId(findTeam.creatorID) },
    { $pull: { teamsCreated: id } }
  );
  if (updateUser.modifiedCount === 0) {
    throw "ERROR: COULD NOT UPDATE USER";
  }

  // remove the team from all users
  const updateUsers = await userCollection.updateMany(
    { teamsJoined: { teamID: id } },
    { $pull: { teamsJoined: { teamID: id } } }
  );
  if (updateUsers.modifiedCount === 0) {
    throw "ERROR: COULD NOT UPDATE USERS";
  }

  return { teamName: findTeam.teamName, deleted: true };
};

// add a user to a team
const addMember = async (teamId, userId) => {
  helper.checkId(teamId);
  helper.checkId(userId);

  const teamCollection = await teams();
  if (teamCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  // make sure team exists
  const findTeam = await teamCollection.findOne({ _id: ObjectId(teamId) });
  if (!findTeam) throw "ERROR: TEAM NOT FOUND";

  const userCollection = await users();
  if (userCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  // make sure user exists
  const findUser = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!findUser) throw "ERROR: USER NOT FOUND";

  // add the user to the team list
  const updateInfo = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $push: { members: userId } }
  );
  if (updateInfo.modifiedCount === 0) {
    throw "ERROR: COULD NOT ADD MEMBER TO TEAM";
  }

  // add the team to the user's list
  const updateInfo2 = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $push: { teamsJoined: { teamID: teamId, admin: false } } }
  );
  if (updateInfo2.modifiedCount === 0) {
    throw "ERROR: COULD NOT ADD TEAM TO USER";
  }

  // update the number of members
  const updateInfo3 = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $inc: { numMembers: 1 } }
  );
  if (updateInfo3.modifiedCount === 0) {
    throw "ERROR: COULD NOT UPDATE TEAM MEMBER COUNT";
  }

  return { teamName: findTeam.teamName, added: true };
};

// remove a user from a team
const removeMember = async (teamId, userId) => {
  helper.checkId(teamId);
  helper.checkId(userId);

  const teamCollection = await teams();
  if (teamCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  const findTeam = await teamCollection.findOne({ _id: ObjectId(teamId) });
  if (!findTeam) throw "ERROR: TEAM NOT FOUND";

  const userCollection = await users();
  if (userCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }
  const findUser = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!findUser) throw "ERROR: USER NOT FOUND";

  // remove the user from the team list
  const updateInfo = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $pull: { members: userId } }
  );
  if (updateInfo.modifiedCount === 0) {
    throw "ERROR: COULD NOT REMOVE MEMBER FROM TEAM";
  }

  // remove the team from the user's list
  const updateInfo2 = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $pull: { teamsJoined: { teamID: teamId } } }
  );
  if (updateInfo2.modifiedCount === 0) {
    throw "ERROR: COULD NOT REMOVE TEAM FROM USER";
  }

  // update the number of members
  const updateInfo3 = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $inc: { numMembers: -1 } }
  );
  if (updateInfo3.modifiedCount === 0) {
    throw "ERROR: COULD NOT UPDATE TEAM MEMBER COUNT";
  }

  return { teamName: findTeam.teamName, removed: true };
};

// make a user an admin of a team
const addAdmin = async (teamId, userId) => {
  helper.checkId(teamId);
  helper.checkId(userId);

  const teamCollection = await teams();
  if (teamCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  const findTeam = await teamCollection.findOne({ _id: ObjectId(teamId) });
  if (!findTeam) throw "ERROR: TEAM NOT FOUND";

  const userCollection = await users();
  if (userCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  const findUser = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!findUser) throw "ERROR: USER NOT FOUND";

  // add the user to the team admin list
  const updateInfo = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $push: { admins: userId } }
  );
  if (updateInfo.modifiedCount === 0) {
    throw "ERROR: COULD NOT ADD ADMIN TO TEAM";
  }

  // update the admin status in the user's list
  const updateInfo2 = await userCollection.updateOne(
    { _id: ObjectId(userId), "teamsJoined.teamID": teamId },
    { $set: { "teamsJoined.$.admin": true } }
  );
  if (updateInfo2.modifiedCount === 0) {
    throw "ERROR: COULD NOT ADD USER TO ADMINS";
  }

  return { teamName: findTeam.teamName, added: true };
};

// remove a user from the admin list of a team
const removeAdmin = async (teamId, userId) => {
  helper.checkId(teamId);
  helper.checkId(userId);

  const teamCollection = await teams();
  if (teamCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  const findTeam = await teamCollection.findOne({ _id: ObjectId(teamId) });
  if (!findTeam) throw "ERROR: TEAM NOT FOUND";

  const userCollection = await users();
  if (userCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  const findUser = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!findUser) throw "ERROR: USER NOT FOUND";

  // remove the user from the team admin list
  const updateInfo = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $pull: { admins: userId } }
  );
  if (updateInfo.modifiedCount === 0) {
    throw "ERROR: COULD NOT REMOVE ADMIN FROM TEAM";
  }

  // update the admin status in the user's list
  const updateInfo2 = await userCollection.updateOne(
    { _id: ObjectId(userId), "teamsJoined.teamID": teamId },
    { $set: { "teamsJoined.$.admin": false } }
  );
  if (updateInfo2.modifiedCount === 0) {
    throw "ERROR: COULD NOT REMOVE USER FROM ADMINS";
  }

  return { teamName: findTeam.teamName, removed: true };
};

// check if user is in a team
const userStatus = async (teamId, userId) => {
  helper.checkId(teamId);
  helper.checkId(userId);

  const teamCollection = await teams();
  if (teamCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  const findTeam = await teamCollection.findOne({ _id: ObjectId(teamId) });
  if (!findTeam) throw "ERROR: TEAM NOT FOUND";

  const userCollection = await users();
  if (userCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  const findUser = await userCollection.findOne({ _id: ObjectId(userId) });
  if (!findUser) throw "ERROR: USER NOT FOUND";

  // check if the user is in the team
  const userInTeam = findUser.teamsJoined.find((team) => {
    return team.teamID === teamId;
  });
  // if user is not in team return false
  if (!userInTeam) return { teamName: findTeam.teamName, inTeam: false };

  // return the user's status in the team
  return { teamName: findTeam.teamName, inTeam: true, admin: userInTeam.admin };
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
};
