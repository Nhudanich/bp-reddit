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
  const ref = firebase.database().ref("posts");
  // this is called a snapshot because it captures the state
  // of the database reference at that moment in time. it's
  // like a picture of what the database looks like when this
  // function is called.
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
  const ref = firebase.database().ref("posts");
  // create a new reference child (with a random hash)
  // for the new post to be stored
  const new_child_ref = ref.push();

  // store the new post object into that reference
  new_child_ref.set(post_object);
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
  const ref = firebase.database().ref(`posts/${post_id}/votes/${username}`);
  // if vote = 0 (i.e. no vote), then this will result in
  // removing that username from the vote because
  // JS automatically casts 0 into a boolean false
  ref.set(vote ? vote : null);
};

/**
 * this activates listening to changes in the database so that
 * we update the application every time a change happens. for
 * instance, if other users upvote something or post something
 * @void
 * */
Firebase.activateListeningToPosts = function activateListeningToPosts() {
  const ref = firebase.database().ref("posts");
  // every time there is a change in the ref, we run the
  // App.loadFeed method
  ref.on("value", App.loadFeed);
};