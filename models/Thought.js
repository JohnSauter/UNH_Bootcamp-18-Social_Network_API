/* Schema for Thought */

const { Schema, model, Types } = require("mongoose");
const { reactionSchema } = require("./Reaction");

const thoughtSchema = new Schema(
  {
    thoughtId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(),
    },
    thoughtText: {
      type: String,
      required: true,
      maxlength: 280,
      minlength: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema],
  },
  {
    toJSON: {
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

const Thought = model("thought", thoughtSchema);

module.exports = { Thought, thoughtSchema };
