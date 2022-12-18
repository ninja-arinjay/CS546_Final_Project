const { ObjectId } = require("mongodb");

function checkEmail(email) {
  //email error checking
  let re = /^[^\s@]+@([^\s@.,]+\.)+[^\s@.,]{2,}$/;
  if (re.test(email.trim()) === false) {
    throw "INVALID EMAIL! TRY AGAIN!";
  }
}

function validatePhone(phone) {
  //Validate Phone number
  let re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
  if (re.test(phone.trim()) === false) {
    throw "INVALID PHONE NUMBER! TRY AGAIN!";
  }
}
function checkInputString(input) {
  if (!input) throw "ERROR: ALL FIELDS MUST HAVE AN INPUT!";
  if (typeof input !== "string") throw "ERROR: INPUT MUST BE A STRING!";
  if (input.trim().length === 0)
    throw "INPUT CANNOT BE AN EMPTY STRING OR STRING WITH JUST SPACES";
}
function checkInputPassword(input) {
  if (!input) {
    throw "ERROR: PASSWORD MUST BE INPUTTED";
  }
  if (typeof input !== "string") {
    throw "ERROR: PASSWORD MUST BE A STRING!";
  }
  let rePass = /^[a-zA-Z0-9.\-_$#&@*!]{6,}$/;
  if (rePass.test(input) === false) {
    throw "ERROR: Not a valid password!";
  }
}
function checkAge(input) {
  if (!input) throw "Error : Age must have an input.";
  if (typeof input !== "number") throw "Error : Age must be a number.";
  if (input < 16 || input > 90) throw "Error : Invalid Age";
}
function checkId(input) {
  if (!input) throw "ERROR: ID DOES NOT EXIST";
  if (typeof input !== "string") {
    throw "ERROR: ID MUST BE A STRING";
  }
  if (input.trim().length === 0) {
    throw "ERROR: ID CAN'T BE EMPTY STRING";
  }
  if (!ObjectId.isValid(input.trim())) {
    throw "ERROR: NOT A VALID ID - DOESN'T EXIST!";
  }
}
function checkBoolean(input) {
  if (!input) throw "ERROR: ALL FIELDS MUST HAVE AN INPUT!";
  if (typeof input !== "boolean") throw "ERROR: INPUT MUST BE A BOOLEAN!";
}
function dateCheck(d1, d2) {
  let inp1 = d1.split("/");
  let inp2 = d2.split("/");
  let date1 = parseInt(inp1[1]);
  let month1 = parseInt(inp1[0]);
  let year1 = parseInt(inp1[2]);
  let date2 = parseInt(inp2[1]);
  let month2 = parseInt(inp2[0]);
  let year2 = parseInt(inp2[2]);
  if (year1 <= year2) {
    if (year1 == year2) {
      if (month1 <= month2) {
        if (month1 == month2) {
          if (date1 > date2) {
            throw "Invalid Date";
          }
        } else {
          return;
        }
      } else {
        return;
      }
    } else {
      return;
    }
  } else {
    throw "Invalid Date";
  }
}

//common function to check all input parameters for both route and data
function checkInput(input, val, variableName, routeFlag = false) {
  const errorObject = {
    status: 400,
  };
  if (!val) {
    throw `${variableName || "Provided variable"} is required.`;
  }
  let inputRegExp = "";
  let valid = false;
  switch (input) {
    case "email":
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
      inputRegExp = /^[+a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
      valid = inputRegExp.test(val);
      if (!valid) {
        errorObject.error = `${
          variableName || "Provided variable"
        }   must be a valid email.`;
        throw errorObject;
      }
      break;

    case "password":
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
      inputRegExp =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{4,20}$/;
      valid = inputRegExp.test(val);
      if (!valid) {
        errorObject.error = `${
          variableName || "Provided variable"
        }  must have a small letter, a capital letter, a digit and a special character and must have between 4-20 characters.`;
        throw errorObject;
      }
      break;

    case "firstName":
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
      inputRegExp = /^[A-Za-z0-9 ]*$/;
      valid = inputRegExp.test(val);
      if (!valid) {
        errorObject.error = `${
          variableName || "Provided variable"
        }   must be a valid Name.`;
        throw errorObject;
      }
      break;

    case "lastName":
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
      inputRegExp = /^[A-Za-z0-9 ]*$/;
      valid = inputRegExp.test(val);
      if (!valid) {
        errorObject.error = `${
          variableName || "Provided variable"
        }   must be a valid Name.`;
        throw errorObject;
      }
      break;

    case "location":
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
      inputRegExp = /^[A-Za-z0-9 ]*$/;
      valid = inputRegExp.test(val);
      if (!valid) {
        errorObject.error = `${
          variableName || "Provided variable"
        }   must be a valid Location.`;
        throw errorObject;
      }

      if (val.length < 3) {
        errorObject.error = `${
          variableName || "Provided variable"
        } must be atleast of 3 characters.`;
        throw errorObject;
      }
      break;

    case "bio":
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

    case "age":
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

    default:
      errorObject.error = "Invalid Data encountered";
      throw errorObject;
  }
  return true;
}

module.exports = {
  checkEmail,
  validatePhone,
  checkInputString,
  checkInputPassword,
  checkAge,
  checkId,
  checkBoolean,
  dateCheck,
  checkInput,
};
