/* The Reaction, Thought and User files in the
 * models directory provide both the
 * schema and the model.  Here we care only about the
 * User and Thought models.
 */
const { User } = require("./User");
const { Thought } = require("./Thought");

module.exports = { User, Thought };
