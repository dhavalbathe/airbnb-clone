const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const { reviewSchema } = require('../Schema.js');
const { isLoggedIn, isOwner } = require("../middleware.js");


//Index Route
router.get('/', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index', {allListings});
}));


//new listing route
router.get('/new', isLoggedIn, (req, res) => {
    res.render('listings/new');
})


//Show Route
router.get('/:id', async (req, res) => {
    console.log(req.url, "Working");
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path: 'reviews', populate: { path: "author"} }).populate('owner');
    
    if(!listing) {
        req.flash("error", "Lising you request for does not exists");
        res.redirect('/listings');
    }
    res.render('listings/show', {listing});
})

//edit listing route
router.get('/:id/edit', isLoggedIn, wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing) {
        req.flash("error", "Lising you request for does not exists");
        res.redirect('/listings');
    }
    console.log(listing);
    res.render('listings/edit', {listing});
}));

//update listing route
router.put('/:id', isLoggedIn, isOwner , wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}, { new: true});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
}));


//create new listing route
router.post('/', isLoggedIn, wrapAsync(async (req, res) => {
    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.save();
    req.flash("success", "New Listing Added");
    res.redirect('/listings');
}));

// Delete listing
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}));


module.exports = router;