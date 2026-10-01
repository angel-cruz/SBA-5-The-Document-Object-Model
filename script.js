let posts = [];
let editingPostId = null;


// DOM elements
const form = document.getElementById("postForm");

const titleInput = document.getElementById("postTitle");
const contentInput = document.getElementById("postContent");

const titleError = document.getElementById("titleError");
const contentError = document.getElementById("contentError");

const postsContainer = document.getElementById("postsContainer");

const formHeading = document.getElementById("formHeading");
const submitButton = document.getElementById("submitButton");
const cancelButton = document.getElementById("cancelButton");

const savedPosts = localStorage.getItem("posts");

if (savedPosts) {
    posts = JSON.parse(savedPosts);
}


// Save posts
function savePosts() {
    localStorage.setItem("posts", JSON.stringify(posts));
}


function validateForm() {

    let isValid = true;

    titleError.textContent = "";
    contentError.textContent = "";


    if (titleInput.value.trim() === "") {
        titleError.textContent = "Title is required.";
        isValid = false;
    }


    if (contentInput.value.trim() === "") {
        contentError.textContent = "Content is required.";
        isValid = false;
    }


    return isValid;
}


function renderPosts() {

    postsContainer.innerHTML = "";


    if (posts.length === 0) {
        postsContainer.innerHTML = "<p>No blog posts yet.</p>";
        return;
    }


    posts.forEach(function (post) {


        const postElement = document.createElement("article");

        postElement.classList.add("post");



        const title = document.createElement("h3");

        title.textContent = post.title;


        const content = document.createElement("p");

        content.textContent = post.content;


        const timestamp = document.createElement("p");

        timestamp.textContent = post.timestamp;
        timestamp.classList.add("timestamp");


        const buttonContainer = document.createElement("div");

        buttonContainer.classList.add("post-buttons");


        const editButton = document.createElement("button");

        editButton.textContent = "Edit";

        editButton.classList.add("edit-button");

        editButton.dataset.id = post.id;


        const deleteButton = document.createElement("button");

        deleteButton.textContent = "Delete";

        deleteButton.classList.add("delete-button");

        deleteButton.dataset.id = post.id;


        buttonContainer.appendChild(editButton);
        buttonContainer.appendChild(deleteButton);


        // Add everything
        postElement.appendChild(title);
        postElement.appendChild(content);
        postElement.appendChild(timestamp);
        postElement.appendChild(buttonContainer);


        
        postsContainer.appendChild(postElement);
    });
}


// Reset
function resetForm() {

    form.reset();

    editingPostId = null;

    formHeading.textContent = "Create New Post";

    submitButton.textContent = "Add Post";

    cancelButton.style.display = "none";

    titleError.textContent = "";
    contentError.textContent = "";
}


// submit
form.addEventListener("submit", function (event) {

    event.preventDefault();


    const isValid = validateForm();


    if (!isValid) {
        return;
    }


    // EDIT EXISTING POST
    if (editingPostId !== null) {

        const post = posts.find(function (post) {
            return post.id === editingPostId;
        });


        if (post) {

            post.title = titleInput.value.trim();

            post.content = contentInput.value.trim();

            post.timestamp =
                "Updated: " + new Date().toLocaleString();
        }

    } else {

        // CREATE NEW POST

        const newPost = {

            id: Date.now(),

            title: titleInput.value.trim(),

            content: contentInput.value.trim(),

            timestamp:
                "Created: " + new Date().toLocaleString()
        };


        posts.push(newPost);
    }


    savePosts();

    renderPosts();

    resetForm();
});


// Delegation
postsContainer.addEventListener("click", function (event) {

    const postId = Number(event.target.dataset.id);


    // DELETE
    if (event.target.classList.contains("delete-button")) {

        posts = posts.filter(function (post) {

            return post.id !== postId;

        });


        savePosts();

        renderPosts();


        if (editingPostId === postId) {
            resetForm();
        }
    }


    // EDIT
    if (event.target.classList.contains("edit-button")) {

        const post = posts.find(function (post) {

            return post.id === postId;

        });


        if (post) {

            titleInput.value = post.title;

            contentInput.value = post.content;

            editingPostId = post.id;


            formHeading.textContent = "Edit Post";

            submitButton.textContent = "Update Post";

            cancelButton.style.display = "inline-block";
        }
    }
});


// Cancel
cancelButton.addEventListener("click", function () {

    resetForm();

});


// on page load
renderPosts();
