document.addEventListener('DOMContentLoaded', function() {
    const usernameForm = document.getElementById('username-form');
    const usernameInput = document.getElementById('username');
    const usernameSection = document.getElementById('username-section');
    const accountSettingsSection = document.getElementById('account-settings');
    const newPostSection = document.getElementById('new-post');
    const postsSection = document.getElementById('posts');
    const serversSection = document.getElementById('servers');
    const postForm = document.getElementById('post-form');
    const changeUsernameForm = document.getElementById('change-username-form');
    const newUsernameInput = document.getElementById('new-username');
    const logoutButton = document.getElementById('logout-button');
    const postsLink = document.getElementById('posts-link');
    const serversLink = document.getElementById('servers-link');

    let username = '';

    // Load posts from the server
    const loadPosts = () => {
        fetch('http://localhost:3000/posts')
            .then(response => response.json())
            .then(posts => {
                postsSection.innerHTML = '<h2>Posts</h2>'; // Clear the section
                posts.forEach(post => {
                    displayPost(post.title, post.content, post.replies);
                });
            });
    };

    // Polling to check for new posts every 5 seconds
    setInterval(loadPosts, 5000);

    // Save a new post to the server
    const savePost = (post) => {
        fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        }).then(response => response.json())
          .then(() => loadPosts()); // Reload posts after saving
    };

    // Delete a post from the server
    const deletePost = (title) => {
        fetch(`http://localhost:3000/posts/${title}`, {
            method: 'DELETE'
        }).then(() => loadPosts()); // Reload posts after deleting
    };

    // Display a single post
    const displayPost = (title, content, replies = []) => {
        const postDiv = document.createElement('div');
        postDiv.classList.add('post');

        const postHeader = document.createElement('div');
        postHeader.classList.add('post-header');
        postHeader.textContent = `Posted by ${username}: ${title}`;

        const postContentElement = document.createElement('p');
        postContentElement.textContent = content;

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Post';
        deleteButton.addEventListener('click', function() {
            deletePost(title);
        });

        const replyForm = document.createElement('form');
        replyForm.classList.add('reply-form');
        replyForm.innerHTML = `
            <h4>Reply to this post:</h4>
            <textarea name="reply-content" required></textarea>
            <button type="submit">Reply</button>
        `;

        replyForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const replyContent = replyForm.querySelector('textarea').value;

            const replyDiv = document.createElement('div');
            replyDiv.classList.add('reply');

            const replyHeader = document.createElement('div');
            replyHeader.classList.add('reply-header');
            replyHeader.textContent = `Reply from ${username}:`;

            const replyContentElement = document.createElement('p');
            replyContentElement.textContent = replyContent;

            replyDiv.appendChild(replyHeader);
            replyDiv.appendChild(replyContentElement);

            postDiv.appendChild(replyDiv);
            replyForm.reset();

            // Save posts after adding a new reply
        });

        postDiv.appendChild(postHeader);
        postDiv.appendChild(postContentElement);
        postDiv.appendChild(deleteButton);
        postDiv.appendChild(replyForm);

        replies.forEach(reply => {
            const replyDiv = document.createElement('div');
            replyDiv.classList.add('reply');

            const replyHeader = document.createElement('div');
            replyHeader.classList.add('reply-header');
            replyHeader.textContent = `Reply from ${username}:`;

            const replyContentElement = document.createElement('p');
            replyContentElement.textContent = reply;

            replyDiv.appendChild(replyHeader);
            replyDiv.appendChild(replyContentElement);

            postDiv.appendChild(replyDiv);
        });

        postsSection.appendChild(postDiv);
    };

    // Check if username is already saved in localStorage
    if (localStorage.getItem('username')) {
        username = localStorage.getItem('username');
        usernameSection.style.display = 'none';
        newPostSection.style.display = 'block';
        postsSection.style.display = 'block';
        accountSettingsSection.style.display = 'block';
        loadPosts();
    }

    usernameForm.addEventListener('submit', function(event) {
        event.preventDefault();
        username = usernameInput.value.trim();

        if (username) {
            localStorage.setItem('username', username);
            usernameSection.style.display = 'none';
            newPostSection.style.display = 'block';
            postsSection.style.display = 'block';
            accountSettingsSection.style.display = 'block';

            // Load existing posts when username is set
            loadPosts();
        }
    });

    postForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const postTitle = document.getElementById('post-title').value;
        const postContent = document.getElementById('post-content').value;

        // Save posts after adding a new post
        savePost({ title: postTitle, content: postContent, replies: [] });

        postForm.reset();
    });

    changeUsernameForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const newUsername = newUsernameInput.value.trim();

        if (newUsername) {
            username = newUsername;
            localStorage.setItem('username', username);
            alert('Username changed successfully!');
            newUsernameInput.value = '';
            // Update posts with new username
            const postHeaders = document.querySelectorAll('.post-header');
            postHeaders.forEach(header => {
                header.textContent = header.textContent.replace(/Posted by .*: /, `Posted by ${username}: `);
            });
            const replyHeaders = document.querySelectorAll('.reply-header');
            replyHeaders.forEach(header => {
                header.textContent = header.textContent.replace(/Reply from .*: /, `Reply from ${username}: `);
            });
            // Save posts
        }
    });

    logoutButton.addEventListener('click', function() {
        username = '';
        localStorage.removeItem('username');
        usernameSection.style.display = 'block';
        newPostSection.style.display = 'none';
        postsSection.style.display = 'none';
        accountSettingsSection.style.display = 'none';
        postsSection.innerHTML = '<h2>Posts</h2>';
    });

    postsLink.addEventListener('click', function(event) {
        event.preventDefault();
        newPostSection.style.display = 'block';
        postsSection.style.display = 'block';
        serversSection.style.display = 'none';
    });

    serversLink.addEventListener('click', function(event) {
        event.preventDefault();
        newPostSection.style.display = 'none';
        postsSection.style.display = 'none';
        serversSection.style.display = 'block';
    });
});
