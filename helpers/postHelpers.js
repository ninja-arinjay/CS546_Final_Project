const { ObjectId } = require("mongodb");

function validObjectID(id) {
  if (!id) throw "ERROR: ID IS REQUIRED";
  if (typeof id !== "string") throw "ERROR: ID MUST BE A STRING";
  if (id.trim().length === 0) throw "ERROR: ID CAN'T BE EMPTY STRING";

  return ObjectId.isValid(id.trim());
}

module.exports = {
  validObjectID,
};
