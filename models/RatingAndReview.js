const mongoose = require("mongoose");

const ratingAndReviewSchema = new mongoose({

    user:{
        type:mongoose.Schema.Types.ObjectId,
        require:true,
        ref:"User",
    },
    rating:{
        type:Number,
        required:true,
    },
    review:{
        type:String,
        required:true,
    }

});

module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);