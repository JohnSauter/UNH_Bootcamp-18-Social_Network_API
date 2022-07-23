/* Schema and (unused) model for Reaction */

const { Schema, model, Types } = require("mongoose");
const { format_date_time } = require("../utils/helpers.js");

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280,
    },
    userName: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: format_date_time,
    },
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

const Reaction = model("Reaction", reactionSchema);

module.exports = { Reaction, reactionSchema };
