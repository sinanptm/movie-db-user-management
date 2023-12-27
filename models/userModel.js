const mongoose = require('mongoose')

const signSchema =new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    file:{
            type:String,
            required:true
    },
    is_admin:{
        type:Boolean,
        default:false
    }
})


const movieSchema = new mongoose.Schema({
  category: String,
  name: String,
  description: String,
  src: String,
});

const Show = mongoose.model('Show', movieSchema);
const User = mongoose.model('User',signSchema)


module.exports = {
    User,
    Show
}