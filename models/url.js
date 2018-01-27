let mongoose = require('mongoose');
let Schema = mongoose.Schema;


let urlsSchema = new Schema({
    userUrl:String,
    shortUrl:String
})

 mongoose.model('urls',urlsSchema);