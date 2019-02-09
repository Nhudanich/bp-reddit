// initialize the firebase global variable and define functions
// to be used by this Firebase global object. These functions
// are used inside of main.js.
const Firebase = {};

/**
 * loads all posts from the Firebase database
 * @return {Object<String, Object>} : keys are string ids of
 *         posts, and values are the actual post contents
 * @async
 * */
Firebase.loadPosts = async function loadPosts() {
  // todo - to be implemented
};

/**
 * stores a new post in the database
 * @param post_object {Object} : an object with keys value pairs:
 *        (text, String), (posted_on, Number), (username, String)
 * @void
 * @async
 * */
Firebase.storePost = async function storePost(post_object) {
  // todo - to be implemented
};

/**
 * updates a post with a new vote value
 * @param post_id {String} : id of the post
 * @param username {String} : username that has voted
 * @param vote {Number} : their vote, either 1, 0, of -1.
 * @void
 * @async
 * */
Firebase.updateUserVoteToPost = async function updateUserVoteToPost(post_id, username, vote) {
  // todo - to be implemented
};

/**
 * this activates listening to changes in the database so that
 * we update the application every time a change happens. for
 * instance, if other users upvote something or post something
 * @void
 * */
Firebase.activateListeningToPosts = function activateListeningToPosts() {
  // todo - to be implemented
};