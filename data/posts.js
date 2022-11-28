const mongoCollections = require("../config/mongoCollections");
const posts = mongoCollections.posts;
const { ObjectId } = require("mongodb");
const helper = require("../helpers/userHelper")

const exportedMethods = {
    //Create Post
    async createPost(teamID, createdByID, title, description, private, memberLimit, ageMin){
        try{
            //Input Validations
            helper.checkId(teamID);
            helper.checkId(createdByID);
            //What else can we check in the title
            helper.checkInputString(title);
            helper.checkInputString(description);
            let d = new Date();
            let datePosted = d.getMonth()+1 +"/"+ d.getDate() +"/"+d.getFullYear();
            helper.checkBoolean(private);
            if(!memberLimit){
                memberLimit = -1;
            }else{
                if(typeof memberLimit !== 'number') throw "Error : Member Limit must be a number.";
                if(memberLimit <= 0) throw "Error : Member Limit can not be negative or zero."
                if(!Number.isInteger(memberLimit)) throw "Error : Member Limit should be a whole number."
            }
            if(!ageMin){
                ageMin =-1;
            }
            else{
                if(typeof input !== 'number') throw "Error : Age must be a number."
                //We can keep a lower bound if we wish to
                if(ageMin <= 0) throw "Error : Minimum Age can not be negative or zero."
                if(!Number.isInteger(ageMin)) throw "Error : Minimum Age should be a whole number."
            }
            let comments = [];
            const postCollection = await posts();
            let newPostInfo = {
                teamID : teamID.trim(),
                createdByID : createdByID.trim(),
                title : title.trim(),
                description : description.trim(),
                datePosted : datePosted,
                private : private,
                memberLimit : memberLimit,
                ageMin : ageMin,
                comments : comments
              };
              const insertInfo = await postCollection.insertOne(newPostInfo);
              if (
                !insertInfo.acknowledged ||
                insertInfo.insertedCount === 0
              ) {
                throw "ERROR: COULD NOT CREATE POST";
              }
              const newId = insertInfo.insertedId;
              const newPost = await postCollection.findOne(newId);
              if (!newPost) {
                throw "ERROR: UNABLE TO FIND POST";
              }
              newPost._id = newPost._id.toString();
              return newPost;
            
        } catch (e){
            console.log(e);
        }
    }
};