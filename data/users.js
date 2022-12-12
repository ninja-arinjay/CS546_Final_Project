const mongoCollections = require("./../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const helper = require("./../helpers/userHelper");

const exportedMethods = {

  //Create a User
  
  async createUser(result) {
    const errorObject = {
      status: 400,
    };

    //Input Validations

    if (typeof result !== "object") {
      errorObject.error = "Invalid Data Posted.";
      throw errorObject;
    }
    let objKeys = ['email','password','firstName','lastName','age','bio','location'];
    objKeys.forEach((element) => {
      helper.checkInput(
        element,
        result[element],
        element + " of the user",
      );
      if (element !== "age") {
        result[element] = result[element].trim();
      }
    });

    let hashedPass = await bcrypt.hash(result.password, saltRounds);
    result.password = hashedPass;
    result.email = result["email"].toLowerCase();
    result.teamsCreated = [];
    result.teamsJoined = [];
    const userCollection = await users();
    let duplicateUser = await userCollection.findOne({
      email: result.email,
    });
    if (duplicateUser != null) {
      errorObject.error = "User with this email already exists.";
      throw errorObject;
    }

    // when a user is created, teamsCreated and teamsJoined are empty

    const insertInfo = await userCollection.insertOne(result);
    if (!insertInfo.acknowledged || insertInfo.insertedCount === 0) {
      errorObject.status = 500;
      errorObject.error = "Could not create user.";
      throw errorObject;
    }
    const newId = insertInfo.insertedId;
    const newUser = await userCollection.findOne(newId);
    newUser._id = newUser._id.toString();
    return newUser;
  },

  //Search A User

  async checkUser(userName, password) {
    // Input Validation
    helper.checkInputString(userName);
    helper.checkInputPassword(password);

    const userCollection = await users();

    let Query; // query the db
    let compareFoundUser; // compare the passwords
    try {
      Query = await userCollection.findOne({
        userName: userName,
      });

      if (Object.keys(Query).length === 0) {
        throw "Either the username or password is invalid";
      } else {
        compareFoundUser = await bcrypt.compare(password, Query.password);
        if (!compareFoundUser) {
          throw "Either the username or password is invalid";
        } else {
          return {
            authenticated: true,
            id: Query["_id"].toString(),
          };
        }
      }
    } catch (e) {
      throw e;
    }
  },
  //Get All users
  async getAllUsers() {
    const userCollection = await users();
    const getAllUser = await userCollection.find({}).toArray();
    if (!getAllUser) {
      throw "ERROR: UNABLE TO GET ALL USERS";
    }
    for (let i = 0; i < getAllUser.length; i++) {
      getAllUser[i]["_id"] = getAllUser[i]["_id"].toString();
    }
    return getAllUser;
  },
  //Search profile
  async getUserById(id) {
    helper.checkId(id);
    const userCollection = await users();
    id = id.trim();
    if (!ObjectId.isValid(id)) {
      throw "ERROR: NOT A VALID ID - DOESN'T EXIST!";
    }
    const getuser = await userCollection.findOne({
      _id: ObjectId(id.trim()),
    });
    if (!getuser) {
      throw "ERROR: CAN'T FIND USER BY ID";
    }
    getuser._id = getuser._id.toString();
    return getuser;
  },
  //Delete a User
  async removeUserById(id) {
    helper.checkId(id);
    id = id.trim();
    const userCollection = await users();
    const userID = await this.getUserById(id);
    const user_name = userID.username;
    const deleteId = await userCollection.deleteOne({
      _id: ObjectId(id),
    });
    if (deleteId.deletedCount === 0) {
      throw `ERROR: CAN'T DELETE USER WITH ID OF ${id}`;
    }
    return `${user_name} has been successfully deleted!`;
  },
  //Update a User
  async updateUser(
    id,
    userName,
    password,
    email,
    firstName,
    lastName,
    location,
    bio,
    age
  ) {
    helper.checkInputString(userName);
    helper.checkInputPassword(password);
    helper.checkEmail(email);
    helper.checkInputString(firstName);
    helper.checkInputString(lastName);
    helper.checkInputString(location);
    helper.checkInputString(bio);
    helper.checkAge(age);
    const userCollection = await users();
    const updateInfo = await userCollection.findOne({ _id: ObjectId(id) });
    if (!updateInfo) {
      throw "Error : No user present for that user Id.";
    }
    let userUpdateInfo = {
      userName: userName,
      password: password,
      email: email,
      firstName: firstName,
      lastName: lastName,
      location: location,
      bio: bio,
      age: age,
      //teams created and teams joined pending
    };
    const updateI = await userCollection.updateOne(
      { _id: ObjectId(id) },
      { $set: userUpdateInfo }
    );
    if (!updateI.matchedCount && !updateI.modifiedCount) {
      throw "ERROR: UPDATE FAILED!";
    }
    return await this.getUserById(id);
<<<<<<< HEAD
  },
=======
  }
>>>>>>> main
};

module.exports = exportedMethods;
