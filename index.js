/* Startup for Social Network API */

const express = require("express");
const db = require("./config/connection");

/* If there is an environment variable named PORT, 
 * use its value for the port to listen on.
 * Otherwise use port 3001.  */
const PORT = process.env.PORT || 3001;

const app = express();

const activity = "Social Network API";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const routes = require("./routes");
app.use(routes);

/* When we have the database open and running,
 * print a message giving our name and port.
 */
db.once("open", () => {
  app.listen(PORT, () => {
    console.log(`API server for ${activity} running on port ${PORT}!`);
  });
});
