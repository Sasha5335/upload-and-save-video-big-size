const { Schema, model } = require("mongoose");

const File = new Schema({
  filename: { type: String, required: true },
  type: { type: String, required: true },
  dateUpload: { type: "date" },
});

module.exports = model("File", File);
