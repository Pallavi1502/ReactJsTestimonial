const mongoose= require("mongoose");
require("dotenv").config({path: 'backend/.env'});

console.log("printing mongo url", process.env.MONGODB_URL)
console.log("printing mongo url", process.env.CLOUD_NAME)


exports.connect = async () => {
    await mongoose.connect(process.env.MONGODB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology:true,
    })
    .then( () => console.log("DB connected successfully") )
    .catch( (error) => {
        console.log("DB connection failed", error );
        console.error(error);
        process.exit(1);
    } )
};