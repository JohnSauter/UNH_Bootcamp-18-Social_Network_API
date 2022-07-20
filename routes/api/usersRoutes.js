
/* Routes that start with /api/users/ */

const router = require("express").Router();
const {
  getUsers,
  getSingleUser,
  createUser,
  modifyUser,
  deleteUser,
  addFriend,
  removeFriend,
} = require("../../controllers/usersController");

// /api/users
router.route("/").get(getUsers).post(createUser);

// /api/users/:userId
router.route("/:userId").get(getSingleUser).put(modifyUser).delete(deleteUser);

// /api/users/:userId/friends/:friendId
router.route("/:userId/friends/:friendId").post(addFriend).delete(removeFriend);

module.exports = router;
