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
  // FB-READY - this gets the snapshot and returns its value, which in this case is the posts as an object
  const ref = firebase.database().ref("posts");
  const snapshot = await ref.once("value");
  return snapshot.val();
};

/**
 * stores a new post in the database
 * @param post_object {Object} : an object with keys value pairs:
 *        (text, String), (posted_on, Number), (username, String)
 * @void
 * @async
 * */
Firebase.storePost = async function storePost(post_object) {
  // create a new reference child (with a random hash)
  // for the new post to be stored
  // TODO-FB - to be implemented

  // store the new post object into that reference
  // TODO-FB - to be implemented
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
  // get the ref for this post and username's vote
  // TODO-FB - to be implemented
  // if vote = 0 (i.e. no vote), then this will result in
  // removing that username from the vote because
  // JS automatically casts 0 into a boolean false
  // TODO-FB - to be implemented
};

/**
 * this activates listening to changes in the database so that
 * we update the application every time a change happens. for
 * instance, if other users upvote something or post something
 * @void
 * */
Firebase.activateListeningToPosts = function activateListeningToPosts() {
  // TODO-FB - to be implemented - complete the dots
  const ref = ...;
  ref.on("value", App.loadFeed);
};