/* The Reaction, Thought and User files in the
 * models directory provide both the
 * schema and the model.  
 */
const { User, userSchema } = require("./User.js");
const { Thought, thoughtSchema } = require("./Thought.js");

module.exports = { User, userSchema, Thought, thoughtSchema };
