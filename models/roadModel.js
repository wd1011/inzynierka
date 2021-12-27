const mongoose = require('mongoose');
const roadSchema = new mongoose.Schema(
  {
    droga: {
      type: String,
    },
    odcinek: {
      type: String,
    },
    wojewodztwo: {
      type: String,
    },
    rodzaj: {
      type: String,
    },
    rozpoczecie: {
      type: String,
    },
    zakonczenie: {
      type: String,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
roadSchema.pre(/^find/, function (next) {
  this.start = Date.now();
  next();
});

roadSchema.post(/^find/, function (docs, next) {
  next();
});

const Road = mongoose.model('Road', roadSchema);
module.exports = Road;
