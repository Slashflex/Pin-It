const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: false
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String
    },
    created_on: {
      type: Date,
      default: Date.now
    }
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
  }
);

// Expand on LinksSchema
UserSchema.virtual('links', {
  ref: 'Links',
  localField: '_id',
  foreignField: 'user'
});

UserSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

UserSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
