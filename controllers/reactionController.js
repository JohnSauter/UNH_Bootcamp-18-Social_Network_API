const { User, Thought, Reaction } = require("../models");

module.exports = {
  // Get all reactions.
  getReactions(req, res) {
    Reaction.find()
      .then((reactions) => res.json(reactions))
      .catch((err) => res.status(500).json(err));
  },
  // Get a reaction.
  getSingleReaction(req, res) {
    Reaction.findOne({ _id: req.params.reactionId })
      .select("-__v")
      .then((reaction) =>
        !reaction
          ? res.status(404).json({ message: "No reaction with that ID." })
          : res.json(reaction)
      )
      .catch((err) => res.status(500).json(err));
  },
  // Create a reaction.
  createReaction(req, res) {
    Reaction.create(req.body)
      .then((reaction) => res.json(reaction))
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Delete a reaction.
  deleteReaction(req, res) {
    Reaction.findOneAndDelete({ _id: req.params.reactionId })
      .then((reaction) => {
        if (!reaction) {
          res.status(404).json({ message: "No reaction with that ID." });
        }
        res.json({ message: "Reaction deleted." });
      })
      .catch((err) => res.status(500).json(err));
  },
  // Update a reaction
  updateReaction(req, res) {
    Reaction.findOneAndUpdate(
      { _id: req.params.reactionId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((reaction) =>
        !reaction
          ? res.status(404).json({ message: "No reaction with this id!" })
          : res.json(reaction)
      )
      .catch((err) => res.status(500).json(err));
  },
};
