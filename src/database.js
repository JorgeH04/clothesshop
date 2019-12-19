const mongoose = require('mongoose');

mongoose.set('useFindAndModify', false);
mongoose.connect('mongodb://localhost/clotheshop', {
 useCreateIndex: true,
 useNewUrlParser: true
})
  .then(db => console.log('DB is connected'))
  .catch(err => console.error(err));


 // mongoose.connect('mongodb://<grandma>:<terremototo001>@ds253398.mlab.com:53398/grandma', {
 // useCreateIndex: true,
 // useNewUrlParser: true
//})
  //.then(db => console.log('DB is connected'))
  //.catch(err => console.error(err));