const mongoCollections = require("../config/mongoCollections");
const teamItems = mongoCollections.teamItems;
const teams = mongoCollections.teams;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const helper = require("../helpers/userHelper");
const e = require("express");

const createTeamItem = async (
  createdBy,
  dateStart,
  dateEnd,
  title,
  content,
  teamID
) => {
  helper.checkId(teamID);
  helper.checkId(createdBy);
  //Input validation of dates is still not complete
  let d = new Date();
  let dateCreated =
    d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
  // Date Start => 11/28/2022
  helper.checkInputString(dateStart);
  //Date Start can not be before date created
  helper.dateCheckTask(dateCreated, dateStart);
  helper.checkInputString(dateEnd);
  //Date End can not be before date start
  helper.dateCheckTask(dateStart, dateEnd);
  helper.checkInputString(title);
  helper.checkInputString(content);
  let comments = [];
  let newTeamItemInfo = {
    createdBy: createdBy.trim(),
    dateCreated: dateCreated.trim(),
    dateStart: dateStart.trim(),
    dateEnd: dateEnd.trim(),
    title: title.trim(),
    content: content.trim(),
    teamID: teamID.trim(),
    comments: comments,
  };

  const teamCollection = await teams();
  const team = await teamCollection.findOne({ _id: ObjectId(teamID) });
  if (!team) {
    throw "ERROR: TEAM NOT FOUND";
  }

  if (team.creatorID != createdBy) {
    throw "ERROR: CANNOT ADD A TASK";
  }

  const teamItemsCollection = await teamItems();
  const insertInfo = await teamItemsCollection.insertOne(newTeamItemInfo);
  if (!insertInfo.acknowledged || insertInfo.insertedCount === 0) {
    throw "ERROR: COULD NOT CREATE TEAM ITEM";
  }
  const newId = insertInfo.insertedId;
  const newTeamItem = await teamItemsCollection.findOne(newId);
  if (!newTeamItem) {
    throw "ERROR: UNABLE TO FIND TEAM ITEM";
  }
  newTeamItem._id = newTeamItem._id.toString();
  const updateTeam = await teamCollection.updateOne(
    { _id: ObjectId(teamID) },
    { $push: { teamItems: newTeamItem._id } }
  );
  if (updateTeam.modifiedCount === 0) {
    throw "ERROR: UPDATE FAILED!";
  }
  return newTeamItem;
};

const deleteTeamItem = async (id) => {
  helper.checkId(id);
  id = id.trim();
  const teamItemsCollection = await teamItems();
  const deleteId = await teamItemsCollection.deleteOne({
    _id: ObjectId(id),
  });
  if (deleteId.deletedCount === 0) {
    throw `ERROR: CAN'T DELETE TEAM ITEM WITH ID OF ${id}`;
  }
  const teamCollection = await teams();
  const removeTeamItem = await teamCollection.updateMany(
    {},
    { $pull: { teamItems: id } }
  );
  if (removeTeamItem.modifiedCount === 0) {
    throw `ERROR: CAN'T DELETE TEAM ITEM WITH ID OF ${id}`;
  }

  return `Team Item has been successfully deleted!`;
};

const updateTeamItem = async (
  id,
  createdBy,
  dateCreated,
  dateStart,
  dateEnd,
  title,
  content,
  location,
  done,
  type
) => {
  helper.checkId(id);
  helper.checkInputString(createdBy);
  //Input validation of dates is still not complete
  let d = new Date();
  dateCreated = d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
  // Date Start => 11/28/2022
  helper.checkInputString(dateStart);
  //Date Start can not be before date created
  helper.dateCheck(dateCreated, dateStart);
  helper.checkInputString(dateEnd);
  //Date End can not be before date start
  helper.dateCheck(dateEnd, dateEnd);
  helper.checkInputString(title);
  helper.checkInputString(content);
  helper.checkBoolean(done);
  helper.checkInputString(type);
  if (type === "Event" || type === "Task") {
    if (type === "Task") {
      location = undefined;
    } else {
      helper.checkInputString(location);
    }
  } else {
    throw "Invalid Type!";
  }
  const teamItemsCollection = await teamItems();
  const updatedInfo = await teamItemsCollection.findOne({ _id: ObjectId(id) });
  if (!updatedInfo) {
    throw "ERROR: NO Team Item Is Present For That ID";
  }
  let teamItemsUpdateInfo = {
    createdBy: createdBy.trim(),
    dateCreated: dateCreated.trim(),
    dateStart: dateStart.trim(),
    dateEnd: dateEnd.trim(),
    title: title.trim(),
    content: content.trim(),
    location: location.trim(),
    teamID: updatedInfo.teamID,
    done: done,
    type: type,
    comments: updatedInfo.comments,
  };
  const updateI = await teamItemsCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: teamItemsUpdateInfo }
  );
  if (!updateI.matchedCount && !updateI.modifiedCount) {
    throw "ERROR: UPDATE FAILED!";
  }
  return await getTeamItemById(id);
};
const getTeamItemById = async (id) => {
  helper.checkId(id);
  const teamItemsCollection = await teamItems();
  id = id.trim();
  const getTeamItem = await teamItemsCollection.findOne({
    _id: ObjectId(id.trim()),
  });
  if (!getTeamItem) {
    throw "ERROR: CAN'T FIND TEAM ITEM BY ID";
  }
  getTeamItem._id = getTeamItem._id.toString();
  return getTeamItem;
};
const getAllTeamItem = async () => {
  const teamItemsCollection = await teamItems();
  const getAllTeamItems = await teamItemsCollection.find({}).toArray();
  if (!getAllTeamItems) {
    throw "ERROR: UNABLE TO GET ALL TEAM ITEMS";
  }
  for (let i = 0; i < getAllTeamItems.length; i++) {
    getAllTeamItems[i]["_id"] = getAllTeamItems[i]["_id"].toString();
  }
  return getAllTeamItems;
};

const getTeamItemByTeam = async (teamID) => {
  const teamItemsCollection = await teamItems();
  const getAllTeamItems = await teamItemsCollection
    .find({ teamID: { $in: [teamID] } })
    .toArray();
  if (!getAllTeamItems) {
    throw "ERROR: UNABLE TO GET ALL TEAM ITEMS";
  }
  for (let i = 0; i < getAllTeamItems.length; i++) {
    getAllTeamItems[i]["_id"] = getAllTeamItems[i]["_id"].toString();
  }
  return getAllTeamItems;
};

const addComment = async (id, comment, currentUser) => {
  let row = await getTeamItemById(id);
  const teamCollection = await teams();
  const userCollection = await users();
  const team = await teamCollection.findOne({ _id: ObjectId(row.teamID) });
  if (!team) {
    throw "ERROR: TEAM NOT FOUND";
  }
  if (!team.members.includes(currentUser)) {
    throw "ERROR: USER NO ACCESS";
  }
  const user = await userCollection.findOne({ _id: ObjectId(currentUser) });
  let commentArray = row.comments;
  let d = new Date();
  let dateCreated =
    d.getMonth() + 1 + "/" + d.getDate() + "/" + d.getFullYear();
  if (
    Date.parse(row.startDate) > Date.parse(dateCreated) ||
    Date.parse(row.endDate) < dateCreated
  ) {
    throw "ERROR: CANNOT ADD COMMENT AS TASK IS NOT ACTIVE";
  }
  commentArray.push({
    _id: new ObjectId(),
    name: user.firstName + " " + user.lastName,
    comment: comment,
    createdAt: dateCreated,
  });
  if (!user) {
    throw "ERROR: USER NO FOUND";
  }
  const teamItemsCollection = await teamItems();
  const updateInfo = await teamItemsCollection.updateOne(
    { _id: ObjectId(id) },
    { $push: { comment: commentArray } }
  );
  if (updateInfo.modifiedCount === 0) {
    {
      errorObject.status = 500;
      errorObject.error = "COULD NOT ADD Comment TO TASK";
      throw errorObject;
    }
  }
};

module.exports = {
  createTeamItem,
  deleteTeamItem,
  updateTeamItem,
  getAllTeamItem,
  getTeamItemById,
  getTeamItemByTeam,
  addComment,
};
