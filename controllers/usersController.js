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
      .select("-__v")
      .lean()
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID." })
          : res.json({ user })
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },

  // create a new user.
  createUser(req, res) {
    User.findOne({ email: req.body.email }).then((user) => {
      if (user) {
        res.status(400).json({ message: "Duplicate email address." });
        return;
      }
      User.create(req.body)
        .then((user) => res.json(user))
        .catch((err) => res.status(500).json(err));
    });
  },

  // Modify a user.
  modifyUser(req, res) {
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (user) {
          res.status(400).json({ message: "Duplicate email address." });
          return;
        }
        User.findOneAndUpdate(
          { _id: req.params.userId },
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
    const userId = new ObjectId(userId_text);
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
          Thought.findByIdAndRemove(thoughtId).then((thought) => {
            if (!thought) {
              res.status(404).json({ message: "No thought with that ID." });
              return;
            }
          });
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
    const userId = new ObjectId(userId_text);
    const friendId_text = req.params.friendId;
    User.findOneAndUpdate(
      { _id: userId },
      { $addToSet: { friends: friendId_text } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID." })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },

  // Remove a friend from a user.
  removeFriend(req, res) {
    const userId_text = req.params.userId;
    const userId = new ObjectId(userId_text);
    const friendId_text = req.params.friendId;
    const friendId = new ObjectId(friendId_text);
    User.findOneAndUpdate(
      { _id: userId },
      { $pull: { friends: friendId_text } },
      { runValidators: true, new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({ message: "No user found with that ID." })
          : res.json(user)
      )
      .catch((err) => res.status(500).json(err));
  },
};
