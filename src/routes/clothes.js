const express = require('express');
const router = express.Router();

// Models
const Clothe = require('../models/clothes');
const Cart = require('../models/cart');
const Order = require('../models/order');
// Helpers
const { isAuthenticated } = require('../helpers/auth');

// New Note
router.get('/clothes/add', isAuthenticated, async (req, res) => {
  const clothes = await Clothe.find();
  res.render('clothes/new-clothe',  { clothes });
});



router.post('/clothes/new-clothe',  async (req, res) => {
  const { imagePath, product, price } = req.body;
  const errors = [];
  if (!imagePath) {
    errors.push({text: 'Please Write a Title.'});
  }
  if (!product) {
    errors.push({text: 'Please Write a Description'});
  }
  if (!price) {
    errors.push({text: 'Please Write a Description'});
  }
  if (errors.length > 0) {
    res.render('clothes/new-clothe', {
      errors,
      imagePath,
      product,
      price
    });
  } else {
    const newClothe = new Clothe({imagePath, product, price});
    newClothe.user = req.user.id;
    await newClothe.save();
    req.flash('success_msg', 'Note Added Successfully');
    res.redirect('clothes/new-clothe');
  }
});

// Get All Notes  {user: req.user.id}).sort({date: 'desc'}
router.get('/clothes', isAuthenticated, async (req, res) => {
  const clothes = await Clothe.find();
  res.render('clothes/all-clothes', { clothes });
});

// Edit Notes
router.get('/clothes/edit/:id', isAuthenticated, async (req, res) => {
  const clothes = await Clothe.findById(req.params.id);
  if(note.user != req.user.id) {
    req.flash('error_msg', 'Not Authorized');
    return res.redirect('/clothes');
  } 
  res.render('clothes/edit-clothe', { clothes });
});

router.put('/clothes/edit-clothe/:id', isAuthenticated, async (req, res) => {
  const { title, description } = req.body;
  await Clothe.findByIdAndUpdate(req.params.id, {title, description});
  req.flash('success_msg', 'Note Updated Successfully');
  res.redirect('/clothes');
});

// Delete Notes
router.delete('/clothes/delete/:id', async (req, res) => {
  await Clothe.findByIdAndDelete(req.params.id);
  req.flash('success_msg', 'Note Deleted Successfully');
  res.redirect('/clothes');
});

router.get('/addtocard/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {items: {}});

  Clothe.findById(productId, function(err, product){
    if(err){
      return res-redirect('/');
    }
    cart.add(product, product.id);
    req.session.cart = cart;
    console.log(req.session.cart);
    res.redirect('/');

  });
});

router.get('/reduce/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.reduceByOne(productId);
  req.session.cart = cart;
  res.redirect('/shopcart');
});

router.get('/remove/:id', function(req, res, next){
  var productId = req.params.id;
  var cart = new Cart(req.session.cart ? req.session.cart : {});

  cart.removeItem(productId);
  req.session.cart = cart;
  res.redirect('/shopcart');
});


router.get('/shopcart', function (req, res, next){
  if(!req.session.cart){
    return res.render('/', {products:null})
  }
  var cart = new Cart(req.session.cart);
  res.render('clothes/shopcart', {products: cart.generateArray(), totalPrice: cart.totalPrice})
});


router.get('/checkout',isAuthenticated, function (req, res, next){
  
  var cart = new Cart(req.session.cart);
  res.render('clothes/checkout', {total: cart.totalPrice})
});


router.post('/checkout', isAuthenticated, async (req, res, next)=>{
  if(!req.session.cart){
    return res.render('/', {products:null})
  }
  const cart = new Cart(req.session.cart);

  const order = new Order({
    user: req.user,
    cart: cart,
    address: req.body.address,
    name: req.body.name

  });
  await order.save();
  req.flash('success_msg', 'Note Added Successfully');
  res.redirect('/clothes');
  
})

module.exports = router;
