const mongoCollections = require("../config/mongoCollections");
const teams = mongoCollections.teams;
const feed = mongoCollections.feed;
const teamItems = mongoCollections.teamItems;
const { ObjectId } = require("mongodb");
const userHelper = require("../helpers/userHelper");

const createComment = async (postID, createdByID, content, type) => {
  if (!postID) throw "ERROR: POST ID IS REQUIRED";
  if (!createdByID) throw "ERROR: CREATED BY ID IS REQUIRED";
  if (!content) throw "ERROR: CONTENT IS REQUIRED";
  if (!type) throw "ERROR: TYPE IS REQUIRED";

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
};

const getCommentById = async (id, type) => {
  // TODO: get comment by id
};

const updateComment = async (id, updatedComment, type) => {
  // TODO: update comment
};

const deleteComment = async (id) => {
  // TODO: delete comment
};

module.exports = {
  createComment,
};
