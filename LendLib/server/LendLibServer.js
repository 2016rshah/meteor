var Meteor;
var lists;

//if(Meteor.isServer) {
   Meteor.startup(function () {
      // code to run on server at startup
   });
   Meteor.publish("Categories", function(){
      return lists.find({}, {fields:{Category:1}});
   });
   Meteor.publish("listdetails", function(category_id){
      return lists.find({_id:category_id});
   });
//