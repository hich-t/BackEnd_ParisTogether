const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const eventSchema = new Schema({
  id: { type: String, required: true },
  comments : {
    type : mongoose.Schema.Types.ObjectId, ref : 'Comments',required : true
},

});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;


// mongoose.Types.ObjectId()