/**************************************************************
 * everything in this application happens within this function
 * and uses some other functions defined in firebase-init.js.
 **************************************************************/

/**
 * App contains multiple things related to this web application
 * it's often good practice to wrap all declared variables within
 * an object in order to avoid variable conflicts.
 * */
const App = {};
/* variables may change throughout the application. we use these
 * variables to display the HTML. */
App.Vars = {
  username: null,
  posts: [],
  votes: {},
  active_feed_style: "chronological",
};
/* constants never change throughout the application */
App.Constants = {
  // how long it takes an animation in the HTML to change
  animation_transition_time: 100,
  // we use these integers as global constant variables to identify
  // votes values
  Votes: {
    up: 1,
    neutral: 0,
    down: -1,
  },
  // some sample posts to see what the post object looks like
  sample_posts: [
    {
      text: "I love this mini-reddit app",
      votes: {a: 1, b: 1, c: 1, d: 1, e: 1, f: -1, g: -1, h: -1, i: -1},
      posted_on: 1549531526751,
      username: "YourAverageCoder",
      id: "SAMPLE_ID_1",
    },
    {
      text: "Eww Harvard",
      votes: {a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: -1},
      posted_on: 1548521537614,
      username: "MIT_Student23",
      id: "SAMPLE_ID_2",
    },
    {
      text: "Eww Harvard really sucks!",
      votes: {a: 1, b: 1, c: 1, d: 1, e: 1, f: 1, g: 1, h: 1, i: 1, j: 1, k: -1, l: 1},
      posted_on: 1548621537614,
      username: "MIT_Student23",
      id: "SAMPLE_ID_3",
    },
    {
      text: "I really wish I went to MIT! It's so much better there!",
      votes: {a: 1, b: 1, c: 1, i: -1},
      posted_on: 1548921537614,
      username: "AverageHarvardStudent42",
      id: "SAMPLE_ID_4",
    },
  ],
  // sorting methods for how we sort the posts in the HTML
  SortingMethod: {
    // sort posts by when it was posted, we have this by default
    chronological: "chronological",
    // sort posts randomly
    random: "random",
    // best up-voted - down-voted ranked
    ranked: "ranked",
  },
  // when the length of a post has less than this number of character
  // we write the post in a bigger font
  big_font_character_limit: 85,
};

/* main function to run when the window loads */
App.main = function main() {
  // todo - remove this when Firebase is implemented
  App.Constants.sample_posts.forEach((post) => App.Vars.posts.push(post));
  App.loadFeed();
  App.activateSortingSelection();
  App.activateModalFunctions();
};

// when the window loads, run APP.main
window.addEventListener("load", App.main);

/**
 * The Builder object will have methods related to creating
 * various HTML elements. these methods are defined at the
 * below after all App methods, but we must initialize the
 * Builder object because some of the methods use it.
 */
const Builder = {};

/******************************
 * stuffs related to the feed *
 ******************************/

App.loadFeed = function loadFeed() {

  // reinitialize the upvotes and downvotes
  App.Vars.votes = {};
  // get the sorted posts based on the sorting method

  const feed_posts = document.querySelector("#feed-posts");
  Utils.removeAllChildren(feed_posts);
  App.getSortedPosts(App.Vars.posts).forEach((post) => {
    // make sure that if we pick a username that has
    // voted, we're able to take that username's vote
    App.copyOverAppUsernameVotes(post);
    App.addPostToHTML(post);
    App.updatePostOnView(post);
  });
};

App.getSortedPosts = function getSortedPosts(posts) {
  const sorting_method = App.getSortingMethod();
  switch (sorting_method) {
    case App.Constants.SortingMethod.random:
      return Utils.getRandomArray(posts);
    case App.Constants.SortingMethod.ranked:
      return Utils.getRankedPosts(posts);
    case App.Constants.SortingMethod.chronological:
      return Utils.getChronologicalPosts(posts);
    default:
      console.warn("sorting method has been altered. defaulting to chronological.");
      App.Vars.active_feed_style = App.Constants.SortingMethod.chronological;
      return Utils.getChronologicalPosts(posts);
  }
};

App.getSortingMethod = function getSortingMethod() {
  switch (App.Vars.active_feed_style) {
    // multiple cases without breaks will fall back to the
    // last one with a break or a return statement
    case App.Constants.SortingMethod.random:
    case App.Constants.SortingMethod.ranked:
    case App.Constants.SortingMethod.chronological:
      return App.Vars.active_feed_style;
    // if the active feed style is none of the allowed ones,
    // return the chronological one
    default:
      return App.Constants.SortingMethod.chronological;
  }
};

/**
 * when we first get posts from Firebase or even from the
 * sample posts, the current username could be the one that
 * has upvoted (or downvoted) one of those posts. we want
 * to make sure that that post is highlighted as "upvote"
 * or "downvote" by copying over the voting into the
 * App.Vars.votes variable so that they can be rendered
 * properly. */
App.copyOverAppUsernameVotes = function copyOverAppUsernameVotes(post) {
  Object.keys(post.votes || {}).forEach(key => {
    if (key === App.Vars.username) {
      App.Vars.votes[post.id] = post.votes[key];
    }
  });
};

App.addPostToHTML = function addPost(post) {
  const post_elm = App.createPostHTMLElement(post);
  const feed_posts = document.querySelector("#feed-posts");
  feed_posts.appendChild(post_elm);
};

/**
 * the following methods is really long. what you need to keep
 * in mind is that it's creating an HTML object with multiple
 * classes and ids, and that's why it's so long because it's
 * creating each of those elements manually and doing various
 * checks and initializing various functions. */
App.createPostHTMLElement = function createPostObject(post) {
  const post_text = Builder.elementWithClass("feed-posts-post-text", post.text);
  if (post.text.length <= App.Constants.big_font_character_limit) {
    post_text.className = "feed-posts-post-text feed-posts-post-text-big-font";
  }
  const post_username = Builder.elementWithClass("feed-posts-post-username", `u/${post.username}`);
  const post_date = Builder.elementWithClass(
    "feed-posts-post-date",
    Utils.convertToDate(post.posted_on)
  );
  const post_user_indicator = Builder.elementWithClass("feed-posts-post-information");
  post_user_indicator.appendChild(document.createTextNode("Posted by "));
  post_user_indicator.appendChild(post_username);
  post_user_indicator.appendChild(document.createTextNode(" on "));
  post_user_indicator.appendChild(post_date);
  const [post_up_count, post_down_count] = Utils.computeVoteCounts(post);
  const post_ups = Builder.elementWithClass("feed-posts-post-ups", post_up_count + "");
  const post_up_button = Builder.elementWithClass("feed-posts-post-upvote", "upvote");
  post_up_button.onclick = function () {
    App.upvotePostToggleWithId(post);
  };
  const post_downs = Builder.elementWithClass("feed-posts-post-downs", post_down_count + "");
  const post_down_button = Builder.elementWithClass("feed-posts-post-downvote", "downvote");
  post_down_button.onclick = function () {
    App.downvotePostToggleWithId(post);
  };
  const post_up_down_wrapper = Builder.elementWithClass("feed-posts-post-up-down-wrapper");
  post_up_down_wrapper.appendChild(post_up_button);
  post_up_down_wrapper.appendChild(post_ups);
  post_up_down_wrapper.appendChild(post_down_button);
  post_up_down_wrapper.appendChild(post_downs);
  const post_elem_init = Builder.elementWithClass("feed-posts-post-init");
  post_elem_init.appendChild(post_user_indicator);
  post_elem_init.appendChild(post_text);
  post_elem_init.appendChild(post_up_down_wrapper);
  const post_elem = Builder.elementWithClass("feed-posts-post-card");
  post_elem.appendChild(post_elem_init);
  post_elem.id = post.id;
  return post_elem;
};

/**
 * Javascript converts +1 and -1 into true when placed
 * in an if condition and converts 0, null, and undefined
 * into false. since the vote up or down are +1 and -1,
 * the first condition will pass only if the vote is
 * not neutral. Then, if the vote is up, then we want to
 * toggle it off to neutral. Otherwise, if it's a downvote,
 * we change it to an upvote. downvoting works similarly. */
App.upvotePostToggleWithId = function upvotePostToggleWithId(post) {
  if (!App.Vars.username) {
    const elm = Builder.elementWithId("modal-must-sign-in", "You must put a username to upvote");
    App.displayModal(elm);
    return;
  }
  if (App.Vars.votes[post.id]) {
    App.Vars.votes[post.id] = App.Vars.votes[post.id] === App.Constants.Votes.up
      ? App.Constants.Votes.neutral
      : App.Constants.Votes.up;
  } else {
    App.Vars.votes[post.id] = App.Constants.Votes.up;
  }
  App.updatePostOnView(post);
  App.sendAppVotesToFirebase();
};

/* see App.upvotePostToggleWithId above */
App.downvotePostToggleWithId = function downvotePostToggleWithId(post) {
  if (!App.Vars.username) {
    const elm = Builder.elementWithId("modal-must-sign-in", "You must put a username to downvote");
    App.displayModal(elm);
    return;
  }
  if (App.Vars.votes[post.id]) {
    App.Vars.votes[post.id] = App.Vars.votes[post.id] === App.Constants.Votes.down
      ? App.Constants.Votes.neutral
      : App.Constants.Votes.down;
  } else {
    App.Vars.votes[post.id] = App.Constants.Votes.down;
  }
  App.updatePostOnView(post);
  App.sendAppVotesToFirebase();
};


/**
 * if someone clicks on a new sorting method, we want to
 * redisplay the posts sorted the way the user just chose. */
App.activateSortingSelection = function activateSortingSelection() {
  const feed_style_options = document.querySelectorAll(".feed-style-option");
  feed_style_options.forEach((feed_style_option_elm) => {
    feed_style_option_elm.onclick = function onFeedStyleClick(e) {
      const selected_feed_style = e.target.innerHTML.toLowerCase();
      App.setSortingMethod(selected_feed_style);
    }
  });
};

App.setSortingMethod = function setSortingMethod(sorting_method) {
  if (
    sorting_method === App.Constants.SortingMethod.random
    || sorting_method === App.Constants.SortingMethod.ranked
    || sorting_method === App.Constants.SortingMethod.chronological
  ) {
    // the sorting method we're setting must be one
    // of the above
    App.Vars.active_feed_style = sorting_method;
    App.updateView();
  }
};


/****************************************
 * textarea stuffs for making new posts *
 ****************************************/

App.createNewPostElement = function createNewPostElement() {
  const feed_new_post_wrapper = Builder.elementWithId("feed-new-post-wrapper");
  const input_text = Builder.textarea("feed-new-post-input");
  const submit_btn = Builder.input("button", "feed-new-post-submit", function () {
    if (input_text.value) {
      App.addNewPost(input_text.value);
      input_text.value = null;
    }
  });
  submit_btn.value = "Add Post";
  feed_new_post_wrapper.appendChild(input_text);
  feed_new_post_wrapper.appendChild(submit_btn);
  return feed_new_post_wrapper;
};

App.addNewPost = function addNewPost(text) {
  const post_obj = { text, posted_on: Date.now(), username: App.Vars.username };
  App.Vars.posts.push(post_obj);
  App.loadFeed();
};

/*******************
 * username stuffs *
 *******************/

App.promptUsernameInput = function promptUsernameInput() {
  App.displayModal(App.createUsernameInputBox());
};

App.createUsernameInputBox = function createUsernameInputBox() {
  const username_error = Builder.elementWithId("modal-username-input-error");
  username_error.style.visibility = "hidden";
  const username_prompt = Builder.elementWithId(
    "modal-username-input-prompt",
    "please choose a username"
  );
  const input_username = Builder.input("text", "modal-username-input-text");
  // this statement is long because it contains the onclick function
  // for the submit button.
  const input_submit = Builder.input(
    "submit",
    "modal-username-input-submit",
    function onClickFunc() {
      App.Vars.username = document.querySelector("#modal-username-input-text").value;
      App.hideModal();
      App.updateView();
    }
  );
  const username_box = Builder.elementWithId("modal-username-input");
  username_box.appendChild(username_error);
  username_box.appendChild(username_prompt);
  username_box.appendChild(input_username);
  username_box.appendChild(input_submit);
  return username_box;
};

/***********************************************
 * methods used to update the application view *
 ***********************************************/

/**
 * based on whether the post has been upvoted or downvoted,
 * we update the html to reflect that. */
App.updatePostOnView = function updatePostOnView(post) {
  const post_up_down_wrapper = document.querySelector(`#${post.id}`).children[0].children[2];
  const upvote_button = post_up_down_wrapper.children[0];
  const upvote_count = post_up_down_wrapper.children[1];
  const downvote_button = post_up_down_wrapper.children[2];
  const downvote_count = post_up_down_wrapper.children[3];
  const [ups, downs] = Utils.computeVoteCounts(post);
  if (!App.Vars.votes[post.id]) {
    return;
  }
  if (App.Vars.votes[post.id] === App.Constants.Votes.up) {
    upvote_button.className = "feed-posts-post-upvote feed-posts-post-voted";
    upvote_count.innerHTML = `${ups + 1}`;
    downvote_button.className = "feed-posts-post-downvote";
    downvote_count.innerHTML = `${downs}`;
  } else if (App.Vars.votes[post.id] === App.Constants.Votes.down) {
    upvote_button.className = "feed-posts-post-upvote";
    upvote_count.innerHTML = `${ups}`;
    downvote_button.className = "feed-posts-post-downvote feed-posts-post-voted";
    downvote_count.innerHTML = `${downs + 1}`;
  } else {
    upvote_button.className = "feed-posts-post-upvote";
    upvote_count.innerHTML = `${ups}`;
    downvote_button.className = "feed-posts-post-downvote";
    downvote_count.innerHTML = `${downs}`;
  }
};

/**
 * based on whether the user has changed, we update
 * the app. */
App.updateView = function updateView() {
  const navbar_username_elm = document.querySelector("#navbar-username");
  const feed_new_post_elm = document.querySelector("#feed-new-post");
  Utils.removeAllChildren(navbar_username_elm);
  Utils.removeAllChildren(feed_new_post_elm);
  if (App.Vars.username) {
    // set the username on the navigation and add the new
    // post element so that user is able to make new posts
    const username_object = Builder.elementWithIdAndClass(
      "navbar-username-label",
      "navbar-item",
      `Hey ${App.Vars.username}!`
    );
    navbar_username_elm.appendChild(username_object);
    feed_new_post_elm.appendChild(App.createNewPostElement());
  } else {
    // set the navbar button to prompt username input new
    // post element already removed just in case
    const username_input = Builder.input(
      "button",
      "navbar-username-input",
      App.promptUsernameInput
    );
    username_input.value = "Pick a username!";
    username_input.className = "navbar-item";
    navbar_username_elm.appendChild(username_input);
  }
  // highlight the sorting method
  const feed_style_spans = document.querySelectorAll(".feed-style-option");
  for (let i = 0; i < feed_style_spans.length; i += 1) {
    feed_style_spans[i].className = "feed-style-option";
    const feed_style = feed_style_spans[i].innerHTML.toLowerCase();
    if (feed_style === App.Vars.active_feed_style) {
      feed_style_spans[i].className = "feed-style-option feed-style-option-active";
    }
  }
  // update all posts after the action is taken
  App.loadFeed();
};

/** send the current vote that we have to firebase */
App.sendAppVotesToFirebase = function sendAppVotesToFirebase() {
  // todo - to be completed later
};

/*******************************
 * stuffs related to the modal *
 *******************************/

App.activateModalFunctions = function activateModalFunctions() {
  window.addEventListener("resize", App.setModalToFitWindow);
  App.setModalToFitWindow();
  const modal = document.querySelector("#modal");

  // e.target tells us what element we clicked on, so we
  // hide the modal only if we clicked on the actual modal
  // and not on one of it child element (e.g. modal-init).
  // "e" here stands for "event" (i.e. the click event)
  modal.onclick = (e) => {
    if (e.target === modal) {
      App.hideModal();
    }
  };
};

App.setModalToFitWindow = function setModalToFitWindow() {
  const modal = document.querySelector("#modal");
  modal.style.height = window.innerHeight + "px";
};

App.displayModal = function displayModal(html_element) {
  const modal_init = document.querySelector("#modal-init");
  Utils.removeAllChildren(modal_init);
  modal_init.appendChild(html_element);
  const modal = document.querySelector("#modal");
  modal.style.display = "block";
  modal.style.opacity = "1";
};

App.hideModal = function displayModal() {
  const modal = document.querySelector("#modal");
  modal.style.opacity = "0";
  setTimeout(() => modal.style.display = "none", App.Constants.animation_transition_time);
};

/*******************
 * Builder methods *
 *******************/

/** builds a span object with an optional text inside it */
Builder.span = function (optionalInnerText) {
  if (!optionalInnerText) {
    return document.createElement("span");
  }
  const span = document.createElement("span");
  span.appendChild(document.createTextNode(optionalInnerText));
  return span;
};

/**
 * builds a span object with the given className and an
 * optional text inside it */
Builder.elementWithClass = function (className, optionalInnerText) {
  const span = Builder.span(optionalInnerText);
  span.className = className;
  return span;
};

/**
 * builds a span object with the given idName and an
 * optional text inside it */
Builder.elementWithId = function (idName, optionalInnerText) {
  const span = Builder.span(optionalInnerText);
  span.id = idName;
  return span;
};

/**
 * builds a span object with the given idName and the
 * given className and an optional text inside it */
Builder.elementWithIdAndClass = function (idName, className, optionalInnerText) {
  const span = Builder.span(optionalInnerText);
  span.id = idName;
  span.className = className;
  return span;
};

/**
 * builds an input object with the given type, id, and
 * onclick function */
Builder.input = function (type, idName, onClickFunc) {
  const input = document.createElement("input");
  input.type = type;
  input.id = idName;
  input.onclick = onClickFunc;
  return input;
};

Builder.textarea = function (idName) {
  const textarea = document.createElement("textarea");
  textarea.id = idName;
  return textarea;
};

/*********************
 * Utility Functions *
 *********************/

const Utils = {
  /**
   * using regular expressions to extract the month and year
   * and day so that we can reformat the date more nicely since
   * it's given to us in terms of milliseconds. the resources
   * guide has a link on regular expressions if interested
   * */
  convertToDate(milliseconds) {
    const date_all = new Date(milliseconds).toString();
    const time = date_all.match(/\d\d:\d\d:\d\d\sGMT(-\d+\s)/g)[0];
    const date = date_all.match(/\w{2,3}\s\w{3,4}\s\d{1,2}\s\d{4}/g)[0];
    const [_weekday, month, day, year] = date.match(/\w{2,4}/g);
    return `${month} ${day}, ${year} at ${time}`;
  },
  removeAllChildren(element) {
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  },
  getPostListFromPostObject(posts) {
    return Object.keys(posts).map((key_id) => {
      const post = posts[key_id];
      post.id = key_id;
      return post;
    });
  },
  computeVoteCounts (post, remove_app_vote=true) {
    let ups = 0;
    let downs = 0;
    Object.keys(post.votes || {}).forEach(key => {
      if (key === App.Vars.username && remove_app_vote) {
        return;
      }
      const v = post.votes[key];
      ups += v === App.Constants.Votes.up ? 1 : 0;
      downs += v === App.Constants.Votes.down ? 1 : 0;
    });
    return [ups, downs];
  },
  /**
   * algorithm found on Stack Overflow, modified variable names:
   * https://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array
   * */
  getRandomArray(array) {
    for (let i = array.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },
  getRankedPosts(posts) {
    const posts_to_sort = posts.map(p => p);
    posts_to_sort.sort((a, b) => {
      const [a_ups, a_downs] = Utils.computeVoteCounts(a, false);
      const [b_ups, b_downs] = Utils.computeVoteCounts(b, false);
      return (b_ups - b_downs) - (a_ups - a_downs);
    });
    return posts_to_sort;
  },
  getChronologicalPosts(posts) {
    const posts_to_sort = posts.map(p => p);
    posts_to_sort.sort((a, b) => b.posted_on - a.posted_on);
    return posts_to_sort;
  },
};

/**
 * Some fruits for thoughts:
 * -------------------------
 * this application does something else that is interesting and
 * recommended. it's called Model-View-Controller (MVC). The MVC
 * concept relies on having 3 components:
 * - a model which represents the state of our data. this model
 *   may change through the controller.
 * - a controller which allows us to modify the model by
 *   interacting with it. the controller internally modifies the
 *   model, which in turns triggers a change in the view.
 * - the view is a visual representation of the model. it always
 *   reflects the model. the view has no knowledge of the
 *   controller.
 *
 * this application uses the MVC concept minimally by displaying
 * the web app based on the content of App.Vars (our model in our
 * case). When interacting with the model, something changes in
 * the model, and then we call one of the methods:
 * - App.updatePostOnView
 * - App.updateView
 * See those two methods for more details.
 *
 * =============================================================================
 *
 * potential additions to this application:
 * ----------------------------------------
 * - add a logout button
 * - make it more mobile friendly
 * - inverse sorting (on each sorting method), how can you do this?
 * - make the footer a sticky footer (see resources)
 * - add comments
 * - display the number of active users
 * - show who upvoted and downvoted
 * */