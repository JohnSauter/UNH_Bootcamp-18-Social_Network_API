/* Subroutines to respond to thoughts routes  */

const { User, Thought } = require("../models");
const { ObjectId } = require("mongoose").Types;

module.exports = {
  // Get all thoughts.
  getThoughts(req, res) {
    Thought.find()
      .then((thoughts) => res.json(thoughts))
      .catch((err) => res.status(500).json(err));
  },

  // Get a thought.
  getSingleThought(req, res) {
    Thought.findOne({ _id: req.params.thoughtId })
      .select("-__v")
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with that ID." })
          : res.json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Create a thought and add it to the specified user.
  createThought(req, res) {
    const userId_text = req.body.userId;
    const userId = ObjectId(userId_text);
    Thought.create(req.body)
      .then((thought) => {
        User.findOneAndUpdate(
          { _id: userId },
          { $push: { thoughts: thought._id } },
          { new: true }
        ).then((new_user) => {
          res.status(201).json(new_user);
        });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  // Update a thought.
  updateThought(req, res) {
    const thoughtId_text = req.params.thoughtId;
    const thoughtId = ObjectId(thoughtId_text);
    Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this ID." })
          : res.status(200).json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Delete a thought.
  deleteThought(req, res) {
    const thoughtId_text = req.params.thoughtId;
    const thoughtId = ObjectId(thoughtId_text);
    Thought.findOneAndDelete({ _id: thoughtId })
      .then((thought) => {
        if (!thought) {
          res.status(404).json({ message: "No thought with that ID." });
          return;
        }
        res.status(200).json(thought);
      })
      .catch((err) => res.status(500).json(err));
  },

  // Create a reaction.  The body must contain reactionBody and username.
  createReaction(req, res) {
    const thoughtId_text = req.params.thoughtId;
    const thoughtId = ObjectId(thoughtId_text);
    Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this ID." })
          : res.status(200).json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Remove a reaction.
  removeReaction(req, res) {
    const thoughtId_text = req.params.thoughtId;
    const thoughtId = ObjectId(thoughtId_text);
    const reactionId_text = req.params.reactionId;
    const reactionId = ObjectId(reactionId_text);
    Thought.findOneAndUpdate(
      { _id: thoughtId },
      { $pull: { reactions: { reactionId: reactionId } } },
      { runValidators: true, new: true }
    )
      .then((thought) =>
        !thought
          ? res.status(404).json({ message: "No thought with this ID." })
          : res.status(200).json(thought)
      )
      .catch((err) => res.status(500).json(err));
  },
};
