/* Schema and model for Thought */

const { Schema, model, Types } = require("mongoose");
const { format_date_time } = require("../utils/helpers.js");

const { reactionSchema } = require("./Reaction.js");

const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280,
      minlength: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      get: format_date_time,
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
      virtuals: true,
      getters: true,
    },
    id: false,
  }
);

/* Create a virtual property reactionCount that gets the
 * number of reactions to this thought.  */
thoughtSchema.virtual("reactionCount").get(function () {
  return this.reactions.length;
});

const Thought = model("Thought", thoughtSchema);

module.exports = { Thought, thoughtSchema };
