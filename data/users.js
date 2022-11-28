const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs/dist/bcrypt");
const saltRounds = 10;
const helper = require("../helpers/userHelper")

const exportedMethods = {
    async createUser(userName, password, email, firstName, lastName, location, bio, age, teamsCreated, teamsJoined){
        try{
            //Input Validations
            helper.checkInputString(userName);
            helper.checkInputPassword(password);
            const hashedPass = await bcrypt.hash(password, saltRounds);
            email = email.toLowerCase;
            helper.checkEmail(email);
            helper.checkInputString(firstName);
            helper.checkInputString(lastName);
            helper.checkInputString(location);
            // What else can we check on location
            helper.checkInputString(bio);
            helper.checkAge(age);
            // Teams Created and Teams Joined still pending
            const userCollection = await users();
            let duplicateUser = await userCollection.findOne({
                userName : userName
            });
            if(duplicateUser != null){
                throw `User already exits - ${JSON.stringify(duplicateUser)}`
            }
            let newUserInfo = {
                userName: userName.trim(),
                password: hashedPass,
                email: email.trim(),
                firstName: firstName.trim(),
                lastName: lastName.trim(),
                location: location.trim(),
                bio: bio.trim(),
                age: age,
                // teamsCreated and teamsJoined still left
              };
              const insertInfo = await userCollection.insertOne(newUserInfo);
              if (
                !insertInfo.acknowledged ||
                insertInfo.insertedCount === 0
              ) {
                throw "ERROR: COULD NOT CREATE USER";
              }
              const newId = insertInfo.insertedId;
              const newUser = await userCollection.findOne(newId);
              if (!newUser) {
                throw "ERROR: UNABLE TO FIND USER";
              }
              newUser._id = newUser._id.toString();
              return newUser;
        } catch (e){
            console.log(e);
        }
    }
};

module.exports = exportedMethods;