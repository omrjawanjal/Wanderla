const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

// const imageSchema = new Schema({
//     filename: String,
//     url: String,
//   });

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: String,

  image: {
  // imageSchema,
    type : String,
  //   url : String,
  //   filename: String,
    default:
      "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60",
    set: (v) =>
      v === ""
        ? "https://images.unsplash.com/photo-1625505826533-5c80aca7d157?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTJ8fGdvYXxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=800&q=60"
        : v,
  },

  // image: {
  //   type: String, // Store the URL of the image
  //   default: "https://via.placeholder.com/300", // Default image URL if not provided
  // },

  price: Number,
  location: String,
  country: String,
  reviews:[
    {
      type :Schema.Types.ObjectId,
      ref:"Review",
    },
  ],
  owner:{
    type : Schema.Types.ObjectId,
    ref:"User",
  },
});

//DELETE LISTING
listingSchema.post("findOneAndDelete",async(listing)=>{
  if(listing){
    await Review.deleteMany({_id :{$in:listing.reviews}});
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
