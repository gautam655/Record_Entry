const mongoose=require('mongoose');
const visitorSchema=mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true
    },
    phone:{
        type:Number,
    //   trim:true
        // required:true
    },
    email :{
        type:String,
        required:true
        },

        address:{
            type:String,
            trim:true,
            required:true
        }
});

const Visitor=mongoose.model('Visitor',visitorSchema);

module.exports=Visitor;