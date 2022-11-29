const mongoCollections = require("../config/mongoCollections");
const feed = mongoCollections.feed;
const { ObjectId } = require("mongodb");
const userHelper = require("../helpers/userHelper");

const createFeed = async (teamID, createdByID, title, description) => {
  if (!teamID) throw "ERROR: TEAM ID IS REQUIRED";
  if (!createdByID) throw "ERROR: CREATED BY ID IS REQUIRED";
  if (!title) throw "ERROR: TITLE IS REQUIRED";
  if (!description) throw "ERROR: DESCRIPTION IS REQUIRED";

  userHelper.checkInputString(title);
  userHelper.checkInputString(description);
  userHelper.checkId(teamID);
  userHelper.checkId(createdByID);

  title = title.trim();
  description = description.trim();
  teamID = teamID.trim();
  createdByID = createdByID.trim();

  const feedCollection = await feed();
  if (feedCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  let reviewDate = mm + "/" + dd + "/" + yyyy;

  let newFeed = {
    teamID: teamID,
    createdByID: createdByID,
    title: title,
    description: description,
    datePosted: reviewDate,
    comments: [],
  };
  const insertInfo = await feedCollection.insertOne(newFeed);
  if (!insertInfo.acknowledged || insertInfo.insertedCount === 0) {
    throw "ERROR: COULD NOT CREATE POST";
  }
  // get the new id and return the newly created post
  const newId = insertInfo.insertedId.toString();
  const newPost = await getFeedById(newId);
  newPost._id = newId;
  return newPost;
};

const getFeedById = async (id) => {
  if (!id) throw "ERROR: ID IS REQUIRED";
  userHelper.checkInputString(id);
  userHelper.checkId(id);

  id = id.trim();

  const feedCollection = await feed();
  if (feedCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  const feedPost = await feedCollection.findOne({ _id: ObjectId(id) });
  if (!feedPost) throw "ERROR: POST NOT FOUND";

  feedPost._id = feedPost._id.toString();

  return feedPost;
};

const getAllFeed = async () => {
  const feedCollection = await feed();
  if (feedCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  const allFeed = await feedCollection.find({}).toArray();
  if (!allFeed) throw "ERROR: NO POSTS FOUND";

  allFeed.forEach((element) => {
    element._id = element._id.toString();
  });

  return allFeed;
};

const removeFeed = async (id) => {
  if (!id) throw "ERROR: ID IS REQUIRED";
  userHelper.checkInputString(id);
  userHelper.checkId(id);

  id = id.trim();

  const feedCollection = await feed();
  if (feedCollection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  const feedPost = await feedCollection.findOne({ _id: ObjectId(id) });
  if (!feedPost) throw "ERROR: POST NOT FOUND";

  const deletionInfo = await feedCollection.deleteOne({ _id: ObjectId(id) });
  if (deletionInfo.deletedCount === 0) {
    throw "ERROR: COULD NOT DELETE POST";
  }

  return { deleted: true, data: feedPost };
};

module.exports = {
  createFeed,
  getFeedById,
  getAllFeed,
  removeFeed,
};
