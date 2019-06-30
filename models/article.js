const mongoose = require("mongoose");

//ref to Schema constructor//
const Schema = mongoose.Schema;

//Schema constructor//
const ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  comment: {
    type: Schema.Types.ObjectId,
    ref: "Comment"
  }
});

//creates model for ArticleSchema//
const Article = mongoose.model("Article", ArticleSchema);

module.exports = Article;
