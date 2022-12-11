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
                if(ageMin <= 16) throw "Error : Minimum Age can not be negative or zero."
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
    },
    //Get Post by Id
    async getPostById(id) {
        helper.checkId(id);
        const postCollection = await posts();
        id = id.trim();
        if (!ObjectId.isValid(id)) {
        throw "ERROR: NOT A VALID ID - DOESN'T EXIST!";
        }
        const getPost = await postCollection.findOne({
        _id: ObjectId(id.trim()),
        });
        if (!getPost) {
        throw "ERROR: CAN'T FIND POST BY ID";
        }
        getPost._id = getPost._id.toString();
        return getPost;
    },
    //Get Post By Title
    async getPostByTitle(title) {
        helper.checkInputString(title);
        const postCollection = await posts();
        const titlePost = await postCollection.findOne({title : title});
        if(titlePost === null) throw 'No Post with that title';
        return titlePost;
    },
    //Get all post
    async getAllPosts() {
        const postCollection = await posts();
        const getAllPost = await postCollection.find({}).toArray();
        if (!getAllPost) {
          throw "ERROR: UNABLE TO GET ALL POSTS";
        }
        for (let i = 0; i < getAllUser.length; i++) {
          getAllUser[i]["_id"] = getAllUser[i]["_id"].toString();
        }
        return getAllUser;
    },
    //Search post by Title

    //Update Post by Id
    async updatePost(
        id,
        teamID,
        createdByID,
        title,
        description,
        private,
        memberLimit,
        ageMin
      ) {
        //Input Validations
        helper.checkId(teamID);
        helper.checkId(createdByID);
        helper.checkInputString(title);
        helper.checkInputString(description);
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
            if(ageMin <= 16) throw "Error : Minimum Age can not be negative or zero."
            if(!Number.isInteger(ageMin)) throw "Error : Minimum Age should be a whole number."
        }
        let d = new Date();
        let datePosted = d.getMonth()+1 +"/"+ d.getDate() +"/"+d.getFullYear();
        const postCollection = await posts();
        const updateInfo = await postCollection.findOne({ _id: ObjectId(id) });
        if (!updateInfo) {
          throw "Error : No post present for that user Id.";
        }
        let postUpdateInfo = {
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
        const updateI = await postCollection.updateOne(
          { _id: ObjectId(id) },
          { $set: postUpdateInfo }
        );
        if (!updateI.matchedCount && !updateI.modifiedCount) {
          throw "ERROR: UPDATE FAILED!";
        }
        return await this.getPostById(id);
      }
};