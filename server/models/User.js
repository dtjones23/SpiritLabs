const { Schema, model } = require('mongoose');

const bcrypt = require("bcrypt");

const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Must match an email address!"],
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  favoriteDrinks: [
    {
      name: {
        type: String,
        required: true,
      },
      icon: {
        type: String,
        required: false,
      },
      ingredients: {
        alcohol: [
          {
            name: String,
            amount: String,
            technique: String,
          },
        ],
        liquid: [
          {
            name: String,
            amount: String,
            technique: String,
          },
        ],
        garnish: [
          {
            name: String,
            amount: String,
            technique: String,
          },
        ],
      },
    },
  ],
});

userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }

  next();
});

userSchema.methods.isCorrectPassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", userSchema);

module.exports = User;