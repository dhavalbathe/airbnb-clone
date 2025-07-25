if(process.env.NODE_ENV != "production") {
    require('dotenv').config();
}

const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync.js');
const ExpressError = require('../utils/ExpressError.js');
const Listing = require('../models/listing.js');
const { reviewSchema } = require('../Schema.js');
const { isLoggedIn, isOwner } = require("../middleware.js");
const multer = require('multer');
const {storage} = require('../cloudConfig.js');
const upload = multer({ storage });

const listingController = require('../controllers/listings.js');

//index route
router.route('/')
.get(wrapAsync(listingController.index))
.post(isLoggedIn, upload.single("listing[image]"), wrapAsync(listingController.createListing));

//new listing route
router.get('/new', isLoggedIn, listingController.renderNewListing);

// listing id route
router.route('/:id')
.get(listingController.showListing)
.put(isLoggedIn, isOwner , wrapAsync(listingController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingController.destroyListing))

//edit listing route
router.get('/:id/edit', isLoggedIn, wrapAsync(listingController.renderEditForm));

module.exports = router;