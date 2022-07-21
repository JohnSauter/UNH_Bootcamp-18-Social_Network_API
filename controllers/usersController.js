/* Subroutines to respond to users routes.  */

// ObjectId() method for converting userId string
// into an ObjectId for querying database
const { ObjectId } = require("mongoose").Types;

const { User, Thought } = require("../models");

/* Create an aggregate function to get the number of users overall
 */
const headCount = async () =>
  User.aggregate()
    .group({ _id: null, count: { $sum: 1 } })
    .then((numberOfUsers) => {
      if (numberOfUsers.length < 1) {
        return 0;
      } else {
        return numberOfUsers[0].count;
      }
    });

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        const userObj = {
          users,
          headCount: await headCount(),
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // Get a single user.
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID." })
          : res.status(200).json(user)
      )
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  // create a new user.  Give a good error message if the email
  // address is not unique.
  createUser(req, res) {
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        res.status(400).json({ message: "Duplicate email address." });
        return;
      }
      User.create(req.body)
        .then((user) => res.status(200).json(user))
        .catch((err) => res.status(500).json(err));
    });
  },

  // Modify a user.  Give a good error message if the email
  // address is not unique.
  modifyUser(req, res) {
    const userId_text = req.params.userId;
    const userId = ObjectId(userId_text);
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          res.status(400).json({ message: "Duplicate email address." });
          return;
        }
        User.findOneAndUpdate(
          { _id: userId },
          { $set: req.body },
          { runValidators: true, new: true }
        ).then((user) => {
          if (!user) {
            res.status(404).json({ message: "No such user exists." });
            return;
          }
          res.status(200).json(user);
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Delete a user and all his thoughts.
  deleteUser(req, res) {
    const userId_text = req.params.userId;
    const userId = ObjectId(userId_text);
    User.findOneAndRemove({ _id: userId })
      .then((user) => {
        if (!user) {
          res.status(404).json({ message: "No such user exists." });
          return;
        }
        const thoughts = user.thoughts;
        for (i = 0; i < thoughts.length; i++) {
          const thoughtId_text = thoughts[i];
          const thoughtId = ObjectId(thoughtId_text);
          /* It would be better to collect all these promises and
           * make sure they resolve positively before returning
           * success.  My excuse for not doing that is that we
           * are deleting the user, so any undeletable thoughts
           * of his won't matter.  Note that we are not yet removing
           * explicitly deleted thoughts from the user who thought
           * them.  */
          Thought.findByIdAndRemove(thoughtId);
        }
        res
          .status(200)
          .json({ message: "User and thoughts successfully deleted." });
      })
      .catch((err) => {
        res.status(500).json(err);
      });
  },

  // Add a friend to a user.
  addFriend(req, res) {
    const userId_text = req.params.userId;
    const userId = ObjectId(userId_text);
    const friendId_text = req.params.friendId;
    const friendId = ObjectId(friendId_text);
    User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { friends: friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID." })
          : res.status(200).json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Remove a friend from a user.
  removeFriend(req, res) {
    const userId_text = req.params.userId;
    const userId = ObjectId(userId_text);
    const friendId_text = req.params.friendId;
    const friendId = ObjectId(friendId_text);
    User.findOneAndUpdate(
      { _id: userId },
      { $pull: { friends: friendId } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID." })
          : res.status(200).json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
