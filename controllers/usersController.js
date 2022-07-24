/* Subroutines to respond to users routes.  */

// ObjectId() method for converting userId string
// into an ObjectId for querying database
const { ObjectId } = require("mongoose").Types;

/* The MongoDB models  */
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
      .populate("friends")
      .populate("thoughts")
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
      .populate("thoughts")
      .populate("friends")
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
        res.status(400).json({ message: "Duplicate email address.", user });
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
      .then((other_user) => {
        if (other_user) {
          res
            .status(400)
            .json({ message: "Duplicate email address.", other_user });
          return;
        }
        User.findOneAndUpdate(
          { _id: userId },
          { $set: req.body },
          { runValidators: true, new: true }
        )
          .then((user) => {
            if (!user) {
              res.status(404).json({ message: "No such user exists." });
              return;
            }
            res.status(200).json(user);
          })
          .catch((err) =>
            res.status(500).json({ err, request_body: req.body })
          );
      })
      .catch((err) => {
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

        /* The user may have an arbitrary number of thoughts, and
         * removing a thought is an asynchronous process.  Remember
         * the remove promises in an array and wait for them all
         * to resolve.  We don't much care if a remove is unsuccessful
         * because we are removing the user.  */
        const promise_array = [];
        for (i = 0; i < thoughts.length; i++) {
          const thoughtId_text = thoughts[i];
          const thoughtId = ObjectId(thoughtId_text);
          const the_promise = Thought.findByIdAndRemove(thoughtId);
          promise_array.push(the_promise);
        }

        Promise.allSettled(promise_array).then((thought_removal_results) =>
          res.status(200).json({
            message: "User and his thoughts successfully deleted.",
            user,
            thought_removal_results,
          })
        );
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
