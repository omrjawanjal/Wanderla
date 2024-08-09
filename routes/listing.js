const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");

//VALIDATION FOR SCHEMA (MIDDLEWARE)(15)
const validateListing = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

//INDEX ROUTE-connected with index.ejs (7)
router.get("/", wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
}));

//NEW ROUTE(9)
router.get("/new", isLoggedIn, (req, res) => { 
   res.render("listings/new.ejs");
});

//SHOW ROUTE(8)
router.get("/:id", 
wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show.ejs", { listing });
})
);

//CREATE ROUTE(10)
router.post(
    "/", 
    isLoggedIn,
    validateListing,
    wrapAsync(async (req, res, next) => {
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        req.flash("success","New Listing Created!");
        res.redirect("/listings");
    })
);

//EDIT ROUTE(11)
router.get("/:id/edit",
    isLoggedIn,
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs", { listing });
}));

//UPDATE ROUTE(12)
router.put("/:id",
isLoggedIn,
validateListing, 
wrapAsync(async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    if(!listing.owner.equals(currUser._id)){
        req.flash("error","You dont have permission to edit");
        res.redirect(`/listings/${id}`);
    }
    
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success","Listing Updated");
    res.redirect(`/listings/${id}`);
    })
);

//DELETE ROUTE(13)
router.delete(
    "/:id",
    isLoggedIn, 
    wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success","Listing Deleted");
    res.redirect("/listings");
})
);

module.exports = router;
