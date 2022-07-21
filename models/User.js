/* Schema and model for User */

const { Schema, model, SchemaTypes, Types } = require("mongoose");
const validator = require("validator");
require("mongoose-type-email");

// Schema to create User model
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: SchemaTypes.Email,
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
    thoughts: [{ type: Schema.Types.ObjectId, ref: "Thought" }],
    friends: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
  }
);

/* Create a virtual property friendCount that gets the
 * number of friends of this user.  */
userSchema.virtual("friendCount").get(function () {
  return this.friends.length;
});

const User = model("user", userSchema);

module.exports = { User, userSchema };
