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

  const teamCollection = await teams();
  if (teamCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

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

  const insertInfo = await teamCollection.insertOne(newTeam);
  if (!insertInfo.acknowledged || insertInfo.insertedCount === 0) {
    throw "ERROR: COULD NOT CREATE TEAM";
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

  return { teamName: findTeam.teamName, deleted: true };
};

const addMember = async (teamId, userId) => {
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

  const updateInfo = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $push: { members: userId } }
  );
  if (updateInfo.modifiedCount === 0) {
    throw "ERROR: COULD NOT ADD MEMBER TO TEAM";
  }

  const updateInfo2 = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $push: { teamsJoined: { teamID: teamId, admin: false } } }
  );
  if (updateInfo2.modifiedCount === 0) {
    throw "ERROR: COULD NOT ADD TEAM TO USER";
  }

  const updateInfo3 = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $inc: { numMembers: 1 } }
  );
  if (updateInfo3.modifiedCount === 0) {
    throw "ERROR: COULD NOT UPDATE TEAM MEMBER COUNT";
  }

  return { teamName: findTeam.teamName, added: true };
};

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

  const updateInfo = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $pull: { members: userId } }
  );
  if (updateInfo.modifiedCount === 0) {
    throw "ERROR: COULD NOT REMOVE MEMBER FROM TEAM";
  }

  const updateInfo2 = await userCollection.updateOne(
    { _id: ObjectId(userId) },
    { $pull: { teamsJoined: { teamID: teamId } } }
  );
  if (updateInfo2.modifiedCount === 0) {
    throw "ERROR: COULD NOT REMOVE TEAM FROM USER";
  }

  const updateInfo3 = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $inc: { numMembers: -1 } }
  );
  if (updateInfo3.modifiedCount === 0) {
    throw "ERROR: COULD NOT UPDATE TEAM MEMBER COUNT";
  }

  return { teamName: findTeam.teamName, removed: true };
};

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

  const updateInfo = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $push: { admins: userId } }
  );
  if (updateInfo.modifiedCount === 0) {
    throw "ERROR: COULD NOT ADD ADMIN TO TEAM";
  }

  const updateInfo2 = await userCollection.updateOne(
    { _id: ObjectId(userId), "teamsJoined.teamID": teamId },
    { $set: { "teamsJoined.$.admin": true } }
  );
  if (updateInfo2.modifiedCount === 0) {
    throw "ERROR: COULD NOT ADD USER TO ADMINS";
  }

  return { teamName: findTeam.teamName, added: true };
};

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

  const updateInfo = await teamCollection.updateOne(
    { _id: ObjectId(teamId) },
    { $pull: { admins: userId } }
  );
  if (updateInfo.modifiedCount === 0) {
    throw "ERROR: COULD NOT REMOVE ADMIN FROM TEAM";
  }

  const updateInfo2 = await userCollection.updateOne(
    { _id: ObjectId(userId), "teamsJoined.teamID": teamId },
    { $set: { "teamsJoined.$.admin": false } }
  );
  if (updateInfo2.modifiedCount === 0) {
    throw "ERROR: COULD NOT REMOVE USER FROM ADMINS";
  }

  return { teamName: findTeam.teamName, removed: true };
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
};
