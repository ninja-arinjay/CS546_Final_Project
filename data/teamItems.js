const mongoCollections = require("../config/mongoCollections");
const teamItems = mongoCollections.teamItems;
const { ObjectId } = require("mongodb");
const helper = require("../helpers/userHelper");
const e = require("express");

const createTeamItem = async (createdBy, dateStart, dateEnd, title, content, location, done, type) =>{
    helper.checkInputString(createdBy);
    //Input validation of dates is still not complete
    let d = new Date();
    let dateCreated = d.getMonth()+1 +"/"+ d.getDate() +"/"+d.getFullYear();
    // Date Start => 11/28/2022
    helper.checkInputString(dateStart);
    //Date Start can not be before date created
    helper.dateCheck(dateCreated,dateStart);
    helper.checkInputString(dateEnd);
    //Date End can not be before date start
    helper.dateCheck(dateEnd,dateEnd);
    helper.checkInputString(title);
    helper.checkInputString(content);
    helper.checkBoolean(done);
    helper.checkInputString(type);
    if(type === 'Event' || type === 'Task'){
        if(type === 'Task'){
            location = undefined;
        }
        else{
            helper.checkInputString(location);
        }
    }else{
        throw 'Invalid Type!';
    }
    let comments =[];
    let newTeamItemInfo = {
        createdBy : createdBy.trim(),
        dateCreated : dateCreated.trim(),
        dateStart : dateStart.trim(),
        dateEnd : dateEnd.trim(),
        title : title.trim(),
        content : content.trim(),
        location : location.trim(),
        done : done,
        type : type,
        comments : comments
      };
      const teamItemsCollection = await teamItems();
      const insertInfo = await teamItemsCollection.insertOne(newTeamItemInfo);
      if (!insertInfo.acknowledged || insertInfo.insertedCount === 0) {
        throw "ERROR: COULD NOT CREATE TEAM ITEM";
      }
      const newId = insertInfo.insertedId;
      const newTeamItem = await teamItemsCollection.findOne(newId);
      if (!newTeamItem) {
        throw "ERROR: UNABLE TO FIND TEAM ITEM";
      }
      newTeamItem._id = newTeamItem._id.toString();
      return newTeamItem;
};

const deleteTeamItem = async(id) =>{
    helper.checkId(id);
    id = id.trim();
    const teamItemsCollection = await teamItems();
    const deleteId = await teamItemsCollection.deleteOne({
      _id: ObjectId(id),
    });
    if (deleteId.deletedCount === 0) {
      throw `ERROR: CAN'T DELETE TEAM ITEM WITH ID OF ${id}`;
    }
    return `Team Item has been successfully deleted!`;
};

const updateTeamItem = async(id, createdBy, dateCreated, dateStart, dateEnd, title, content, location, done, type) =>{
    helper.checkId(id);
    helper.checkInputString(createdBy);
    //Input validation of dates is still not complete
    let d = new Date();
    let dateCreated = d.getMonth()+1 +"/"+ d.getDate() +"/"+d.getFullYear();
    // Date Start => 11/28/2022
    helper.checkInputString(dateStart);
    //Date Start can not be before date created
    helper.dateCheck(dateCreated,dateStart);
    helper.checkInputString(dateEnd);
    //Date End can not be before date start
    helper.dateCheck(dateEnd,dateEnd);
    helper.checkInputString(title);
    helper.checkInputString(content);
    helper.checkBoolean(done);
    helper.checkInputString(type);
    if(type === 'Event' || type === 'Task'){
        if(type === 'Task'){
            location = undefined;
        }
        else{
            helper.checkInputString(location);
        }
    }else{
        throw 'Invalid Type!';
    }
    const teamItemsCollection = await teamItems();
    const updatedInfo = await teamItemsCollection.findOne(
        {_id : ObjectId(id)}
      );
      if(!updatedInfo){
        throw "ERROR: NO Team Item Is Present For That ID";
      };
      let teamItemsUpdateInfo = {
        createdBy : createdBy.trim(),
        dateCreated : dateCreated.trim(),
        dateStart : dateStart.trim(),
        dateEnd : dateEnd.trim(),
        title : title.trim(),
        content : content.trim(),
        location : location.trim(),
        done : done,
        type : type,
        comments : updatedInfo.comments
      };
      const updateI = await teamItemsCollection.updateOne(
        {_id: ObjectId(id)},
        {$set: teamItemsUpdateInfo}
      ) 
      if (!updateI.matchedCount && !updateI.modifiedCount) {
          throw "ERROR: UPDATE FAILED!"
      }
      return await getTeamItemById(id);
};
const getTeamItemById = async(id) =>{
    helper.checkId(id);
    const teamItemsCollection = await teamItems();
    id = id.trim();
    const getTeamItem = await teamItemsCollection.findOne({
      _id: ObjectId(id.trim()),
    });
    if (!getTeamItem) {
      throw "ERROR: CAN'T FIND TEAM ITEM BY ID";
    }
    getTeamItem._id = getTeamItem._id.toString();
    return getTeamItem;
};
const getAllTeamItem = async(teamID) =>{
    const teamItemsCollection = await teamItems();
    const getAllTeamItems = await teamItemsCollection.find({}).toArray();
    if (!getAllTeamItems) {
        throw "ERROR: UNABLE TO GET ALL TEAM ITEMS";
    }
    for (let i = 0; i < getAllTeamItems.length; i++) {
        getAllTeamItems[i]["_id"] = getAllTeamItems[i]["_id"].toString();
    }
    return getAllTeamItems;
};

module.exports ={
    createTeamItem,
    deleteTeamItem,
    updateTeamItem,
    getAllTeamItem,
    getTeamItemById
}