const { Schema, model } = require("mongoose");
const thoughtSchema = require("./Thought");
const friendSchema = require("./Friend");
const validator = require("validator");
require("mongoose-type-email");

// Schema to create User model
const usersSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: mongoose.SchemaTypes.Email,
      required: true,
      unique: true,
      /*
      validate: {
        validator: validator.isEmail,
        message: "Please provide a valid email address",
        isAsync: false,
      },
      */
    },
    thoughts: [thoughtSchema],
    friends: [friendSchema],
  },
  {
    toJSON: {
      getters: true,
    },
  }
);

/* Create a virtual property friendCount that gets the
 * number of friends of this user.  */
usersSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const Users = model("users", usersSchema);

module.exports = Users;
