const router = require("express").Router();
const apiRoutes = require("./api");

/* All the routes in /api are reached through the api path.  */
router.use("/api", apiRoutes);

/* All other routes are invalid.  */
router.use((req, res) => res.send("Wrong route!"));

module.exports = router;
