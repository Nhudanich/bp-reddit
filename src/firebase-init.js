// Initialize Firebase
const config = {
  apiKey: "AIzaSyCcW3uHlaet4Ql1ZDCuBrw0NNQ9J9Bm0r0",
  authDomain: "bp-mini-reddit.firebaseapp.com",
  databaseURL: "https://bp-mini-reddit.firebaseio.com",
  projectId: "bp-mini-reddit",
  storageBucket: "bp-mini-reddit.appspot.com",
  messagingSenderId: "444483323688"
};
firebase.initializeApp(config);

// initialize the firebase global variable
const Firebase = {};

Firebase.loadPosts = async function loadPosts() {
  const ref = firebase.database().ref("posts");
  const snapshot = await ref.once("value");
  return snapshot.val();
};

Firebase.storePost = async function storePost(post_object) {
  // create a new reference child (with a random hash)
  // for the new post to be stored
  const ref = firebase.database().ref("posts");
  const new_child_ref = ref.push();

  // store the new post object into that reference
  new_child_ref.set(post_object);
};

Firebase.updateUserVoteToPost = async function updateUserVoteToPost(post_id, username, vote) {
  const ref = firebase.database().ref(`posts/${post_id}/votes/${username}`);
  // if vote = 0 (i.e. no vote), then this will result
  // in removing that username from the vote
  ref.set(vote ? vote : null);
};

Firebase.activateListeningToPosts = function activateListeningToPosts() {
  const ref = firebase.database().ref("posts");
  ref.on("value", App.loadFeed);
};