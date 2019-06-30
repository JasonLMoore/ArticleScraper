const mongoose = require("mongoose");

//ref to Schema constructor//
const Schema = mongoose.Schema;

//Schema constructor//
const CommentSchema = new Schema({
  title: String,
  body: String
});

//creates model for CommentSchema//
const Comment = mongoose.model("Comment", CommentSchema);

module.exports = Comment;