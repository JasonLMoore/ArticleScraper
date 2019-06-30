// When you go to connect your mongo database to mongoose, do so the following way://
// If deployed, use the deployed database. Otherwise use the local mongoHeadlines database//
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoHeadlines";

mongoose.connect(MONGODB_URI);
////////////////////////////////////////////////////////////////////////////////////////////////