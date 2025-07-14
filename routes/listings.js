const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const { reviewSchema } = require('../Schema.js');
const { isLoggedIn, isOwner } = require("../middleware.js");

const listingController = require('../controllers/listings.js');

//Index Route
router.get('/', wrapAsync(listingController.index));


//new listing route
router.get('/new', isLoggedIn, listingController.renderNewListing);


//Show Route
router.get('/:id', listingController.showListing);

//create new listing route
router.post('/', isLoggedIn, wrapAsync(listingController.createListing));

//edit listing route
router.get('/:id/edit', isLoggedIn, wrapAsync(listingController.renderEditForm));

//update listing route
router.put('/:id', isLoggedIn, isOwner , wrapAsync(listingController.updateListing));

// Delete listing
router.delete('/:id', isLoggedIn, isOwner, wrapAsync(listingController.destroyListing));


module.exports = router;