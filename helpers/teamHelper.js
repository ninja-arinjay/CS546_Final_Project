const { ObjectId } = require("mongodb");

//common function to check all input parameters for both route and data
function checkTeamInput(input, val, variableName, routeFlag = false) {
  const errorObject = {
    status: 400,
  };
  if (!val) {
    throw `${variableName || "Provided variable"} is required.`;
  }
  let inputRegExp = "";
  let valid = false;
  switch (input) {
    case "name":
      if (typeof val !== "string") {
        errorObject.error = `${
          variableName || "Provided variable"
        } must be a string.`;
        throw errorObject;
      }
      val = val.trim();
      if (!val) {
        errorObject.error = `${
          variableName || "Provided variable"
        } must not be empty.`;
        throw errorObject;
      }
      inputRegExp = /\d*[a-zA-Z][a-zA-Z0-9 ]*$/;
      valid = inputRegExp.test(val);
      if (!valid) {
        errorObject.error = `${
          variableName || "Provided variable"
        }   must be a valid Name.`;
        throw errorObject;
      }
      break;
    case "id":
      if (typeof val !== "string") {
        errorObject.error = `${
          variableName || "Provided variable"
        } must be a string.`;
        throw errorObject;
      }
      val = val.trim();
      if (!val) {
        errorObject.error = `${
          variableName || "Provided variable"
        } must not be empty.`;
        throw errorObject;
      }
      if (!ObjectId.isValid(val)) {
        throw "Invalid Team.";
      }
      break;
    default:
      errorObject.error = "Invalid Data encountered";
      throw errorObject;
  }
  return true;
}

module.exports = {
  checkTeamInput,
};
