const mongoose = require("mongoose"); // Erase if already required

//Export the model
module.exports = mongoose.model("Date", new mongoose.Schema({}), "dates");
