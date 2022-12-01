const mongoCollections = require("../config/mongoCollections");
const teams = mongoCollections.teams;
const feed = mongoCollections.feed;
const teamItems = mongoCollections.teamItems;
const { ObjectId } = require("mongodb");
const userHelper = require("../helpers/userHelper");

const createComment = async (postID, createdByID, content, type) => {
  userHelper.checkInputString(content);
  userHelper.checkInputString(type);
  userHelper.checkId(postID);
  userHelper.checkId(createdByID);

  content = content.trim();
  type = type.trim();
  postID = postID.trim();
  createdByID = createdByID.trim();

  let collection;

  if (type === "feed") {
    collection = await feed();
  } else if (type === "team") {
    collection = await teams();
  } else if (type === "teamItem") {
    collection = await teamItems();
  } else {
    throw "ERROR: INVALID TYPE";
  }

  if (collection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  let reviewDate = mm + "/" + dd + "/" + yyyy;

  let newComment = {
    _id: new ObjectId(),
    dateCreated: reviewDate,
    creatorID: createdByID,
    postID: postID,
    content: content,
  };

  const findPost = await collection.findOne({ _id: ObjectId(postID) });
  if (findPost === null) {
    throw "ERROR: POST NOT FOUND";
  }

  const updatedInfo = await collection.updateOne(
    { _id: ObjectId(postID) },
    { $push: { comments: newComment } }
  );

  if (updatedInfo.modifiedCount === 0) {
    throw "ERROR: COULD NOT ADD COMMENT";
  }

  const newId = newComment._id.toString();
  // change id to string version only for display purposes
  newReview._id = newId;
  findPost.comments.push(newComment);

  return findPost;
};

const getAllComments = async (postID, type) => {
  // TODO: get all comments for a post
  userHelper.checkInputString(type);
  userHelper.checkId(postID);

  type = type.trim();
  postID = postID.trim();

  let collection;

  if (type === "feed") {
    collection = await feed();
  } else if (type === "team") {
    collection = await teams();
  } else if (type === "teamItem") {
    collection = await teamItems();
  } else {
    throw "ERROR: INVALID TYPE";
  }

  if (collection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  const findPost = await collection.findOne({ _id: ObjectId(postID) });
  if (findPost === null) {
    throw "ERROR: POST NOT FOUND";
  }

  let comms = findPost.comments;
  comms.forEach((element) => {
    element._id = element._id.toString();
  });

  return comms;
};

const getCommentById = async (postID, type) => {
  // TODO: get comment by id
  userHelper.checkInputString(type);
  userHelper.checkId(postID);

  type = type.trim();
  postID = postID.trim();

  let collection;

  if (type === "feed") {
    collection = await feed();
  } else if (type === "team") {
    collection = await teams();
  } else if (type === "teamItem") {
    collection = await teamItems();
  } else {
    throw "ERROR: INVALID TYPE";
  }

  if (collection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  const findPost = await collection.findOne({
    comments: { $elemMatch: { _id: ObjectId(postID) } },
  });
  if (findPost === null) {
    throw "ERROR: COMMENT NOT FOUND";
  }

  let comms = findPost.comments;
  let found = comms.find((element) => {
    return element._id.toString() === postID;
  });
  comms.forEach((element) => {
    element._id = element._id.toString();
  });

  return comms;
};

const updateComment = async (id, content, type) => {
  // TODO: update comment
  userHelper.checkInputString(type);
  userHelper.checkInputString(content);
  userHelper.checkId(id);

  type = type.trim();
  id = id.trim();
  content = content.trim();

  let collection;

  if (type === "feed") {
    collection = await feed();
  } else if (type === "team") {
    collection = await teams();
  } else if (type === "teamItem") {
    collection = await teamItems();
  } else {
    throw "ERROR: INVALID TYPE";
  }

  if (collection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  const findComment = await collection.findOne({ _id: ObjectId(id) });
  if (findComment === null) {
    throw "ERROR: COMMENT NOT FOUND";
  }

  let comms = findComment.comments;
  let foundComment = comms.find((element) => {
    return element._id.toString() === id;
  });

  let today = new Date();
  let dd = String(today.getDate()).padStart(2, "0");
  let mm = String(today.getMonth() + 1).padStart(2, "0");
  let yyyy = today.getFullYear();

  let commentDate = mm + "/" + dd + "/" + yyyy;

  if (foundComment.content === content) {
    throw "ERROR: MUST CHANGE CONTENT";
  }

  foundComment.content = content;
  foundComment.dateCreated = commentDate;

  const updatedInfo = await collection.updateOne(
    { _id: ObjectId(findComment._id), "comments._id": ObjectId(id) },
    { $set: { "comments.$._id": foundComment } }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "Could not update comment.";
  }
  foundComment._id = foundComment._id.toString();
  return foundComment;
};

const deleteComment = async (id, type) => {
  // TODO: delete comment
  userHelper.checkId(id);
  userHelper.checkInputString(type);

  type = type.trim();
  id = id.trim();

  let collection;

  if (type === "feed") {
    collection = await feed();
  } else if (type === "team") {
    collection = await teams();
  } else if (type === "teamItem") {
    collection = await teamItems();
  } else {
    throw "ERROR: INVALID TYPE";
  }

  if (collection === undefined) {
    throw "ERROR: DATABASE COULD NOT BE REACHED.";
  }

  const findComment = await collection.findOne({
    comments: { $elemMatch: { _id: ObjectId(id) } },
  });
  if (findComment === null) {
    throw "Could not find review connected with that Id.";
  }

  const updatedInfo = await collection.updateOne(
    { _id: findComment._id },
    { $pull: { comments: { _id: ObjectId(id) } } }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "Could not delete comment.";
  }

  const deletedComment = await collection.findOne({ _id: findComment._id });
  if (deletedComment === null) {
    throw "Error finding comments.";
  }

  return deletedComment;
};

module.exports = {
  createComment,
  getAllComments,
  getCommentById,
  updateComment,
  deleteComment,
};
