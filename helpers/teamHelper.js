const { ObjectId } = require("mongodb");

//common function to check all input parameters for both route and data
function checkTeamInput(
  input,
  val,
  variableName,
  routeFlag = false,
  ignoreRequired = false
) {
  const errorObject = {
    status: 400,
  };
  if (!val && !ignoreRequired) {
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
    case "description":
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

      if (val.length < 5) {
        errorObject.error = `${
          variableName || "Provided variable"
        } must be atleast of 5 characters.`;
        throw errorObject;
      }
      break;

    case "ageMin":
      if (routeFlag) {
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

        inputRegExp = /^[0-9]+$/;
        valid = inputRegExp.test(val);
        if (!valid) {
          errorObject.error = `${
            variableName || "Provided variable"
          }   must be a valid Age.`;
          throw errorObject;
        }

        val = parseInt(val);
      }

      if (isNaN(val)) {
        errorObject.error = `${
          variableName || "Provided variable"
        }   must be a valid Age.`;
        throw errorObject;
      }

      if (val < 12 || val > 120) {
        errorObject.error = `${
          variableName || "Provided variable"
        }   must be a valid Age.`;
        throw errorObject;
      }
      break;

    case "memberLimit":
      if (routeFlag) {
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

        inputRegExp = /^[0-9]+$/;
        valid = inputRegExp.test(val);
        if (!valid) {
          errorObject.error = `${
            variableName || "Provided variable"
          }   must be a valid Age.`;
          throw errorObject;
        }

        val = parseInt(val);
      }

      if (isNaN(val)) {
        errorObject.error = `${
          variableName || "Provided variable"
        }   must be a valid Age.`;
        throw errorObject;
      }

      if (val < 2 || val > 200) {
        errorObject.error = `${
          variableName || "Provided variable"
        }   must be a valid Member Limit.`;
        throw errorObject;
      }
      break;
    case "private":
      if (typeof val !== "boolean") {
        errorObject.error = "Invalid Private Option Selected";
        throw errorObject;
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
