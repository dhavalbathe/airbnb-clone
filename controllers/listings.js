const Listing = require('../models/listing');

module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index', {allListings});
};

module.exports.renderNewListing = (req, res) => {
    res.render('listings/new');
};

module.exports.showListing = async (req, res) => {
    console.log(req.url, "Working");
    const { id } = req.params;
    const listing = await Listing.findById(id).populate({path: 'reviews', populate: { path: "author"} }).populate('owner');
    
    if(!listing) {
        req.flash("error", "Lising you request for does not exists");
        res.redirect('/listings');
    }
    res.render('listings/show', {listing});
};

module.exports.createListing = async (req, res) => {
    const url = req.file.url;
    const filename = req.file.filename;

    const listing = new Listing(req.body.listing);
    listing.owner = req.user._id;
    listing.image = {url, filename};
    
    listing.save();
    req.flash("success", "New Listing Added");
    res.redirect('/listings');
};

module.exports.renderEditForm = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    if(!listing) {
        req.flash("error", "Lising you request for does not exists");
        res.redirect('/listings');
    }
    console.log(listing);
    res.render('listings/edit', {listing});
};

module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing}, { new: true});
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};