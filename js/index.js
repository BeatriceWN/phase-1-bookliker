document.addEventListener("DOMContentLoaded", function() {

    //grab references to the main HTML elements we will interact with
    const bookListUl = document.getElementById('list'); //the <ul> element for book titles
    const bookDetailsContentDiv = document.getElementById('book_details_content'); //the <div> for book details

    //simulates the currently logged-in user
    let currentUser = { id: 1, username: "pouros" };

    //arrays to store data fetched from the API
    let allBooks = []; //holds all book objects
    let allUsers = []; //holds all user objects

    //stores the full book object currently displayed in the details panel
    let currentSelectedBook = null;

    //helper Functions that perform specific smaller tasks

    /**
     * checks if a given user has liked a given book
     * book parameter - the book object to check
     * user parameter - the user object to check for (e.g currentUser)
     * returns a boolean - true if the user is found in the book's 'users' array and false otherwise
     */
    function hasUserLikedBook(book, user) {
        //uses .some() to check if any user in book.users has an ID matching the given user's ID
        return book.users.some(u => u.id === user.id);
    }

    /**
     * updates the DOM to display the list of users who have liked the currently selected book
     * book parameter is the book object whose liked users need to be displayed
     */
    function updateLikedUsersDisplay(book) {
        const usersLikedListUl = document.getElementById("users-liked-list");
        //exit if the 'users-liked-list' element doesn't exist (e.g details panel not rendered yet)
        if (!usersLikedListUl) return;

        usersLikedListUl.innerHTML = ''; //clear any previously displayed users

        //check if the book has an array of users who liked it
        if (book.users && book.users.length > 0) {
            //iterate over each user and create a list item for their username
            book.users.forEach(user => {
                const li = document.createElement('li');
                li.textContent = user.username;
                usersLikedListUl.appendChild(li);
            });
        } else {
            //if no one has liked the book yet, display a message
            const li = document.createElement('li');
            li.textContent = 'No Likes Yet.';
            usersLikedListUl.appendChild(li);
        }
    }

    //deliverables Implementation

    /**
     *fetches all users from the API and updates the 'currentUser' based on the fetched data
     */
    function fetchUsers() {
        fetch('http://localhost:3000/users')
            .then(function(response) { //first .then() to handle the raw HTTP response
                //check if the response was successful (HTTP status 200-299)
                if (!response.ok) {
                    //if not, throw an error to be caught by the .catch() block
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); //parse the response body as JSON
            })
            .then(function(users) { //second .then() receives the parsed JSON 'users' array
                allUsers = users; //store the fetched users globally

                //find our simulated 'currentUser' within the fetched user list
                const foundUser = allUsers.find(user => String(user.id) === String(currentUser.id));
                if (foundUser) {
                    currentUser = foundUser; //update 'currentUser' with full data from API.
                } else {
                    console.warn(`User with ID ${currentUser.id} not found in /users. Using default.`);
                }
                fetchAndDisplayBooks(); //after users are fetched, proceed to fetch and display books
            })
            .catch(function(error) { //catch any errors from the fetch or parsing process
                console.error('Failed to fetch users:', error);
            });
    }
    /**
     *fetches all books from the API and displays their titles in the list panel
     * (Deliverable: List Books)
     */
    function fetchAndDisplayBooks() {
        fetch('http://localhost:3000/books') //make the API request to the /books endpoint
            .then(function(response) {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json(); //parse the response body as JSON
            })
            .then(function(books) { //receives the parsed 'books' array
                allBooks = books; //store the fetched books globally
                bookListUl.innerHTML = ''; //clear any existing items in the book list

                //iterate over each book to create a list item for it
                books.forEach(book => {
                    const li = document.createElement('li'); //create new list item
                    li.textContent = book.title; //set its text to the book's title
                    li.dataset.bookId = book.id; //store the book's ID in a data attribute

                    //add a click event listener to each book title
                    li.addEventListener('click', function() {
                        //remove 'active' class from any currently highlighted book
                        const currentActive = document.querySelector('#list li.active');
                        if (currentActive) {
                            currentActive.classList.remove('active');
                        }
                        li.classList.add('active'); //add 'active' class to the clicked book
                        showBookDetails(book.id); //display details for this book
                    });
                    bookListUl.appendChild(li); //add the list item to the <ul>
                });
            })
            .catch(function(error) {
                console.error('Failed to fetch and display books:', error);
            });
    }
    /**
     * displays the detailed information of a specific book in the details panel
     * (Deliverable: Show Details)
     * bookId parameter - the ID of the book to display
     */
    function showBookDetails(bookId) {
        //find the book object from our 'allBooks' array
        const book = allBooks.find(b => String(b.id) === String(bookId));

        if (!book) { //if book is not found (which shouldn't happen with correct flow)
            bookDetailsContentDiv.innerHTML = '<p>Book not found.</p>';
            return;
        }

        currentSelectedBook = book; //store the currently displayed book

        //determine if the current user has liked this book for button text and styling
        const liked = hasUserLikedBook(book, currentUser);
        const likeButtonText = liked ? 'UNLIKE' : 'LIKE';
        const likeButtonClass = liked ? 'unlike' : '';

        //dynamically update the HTML content of the details panel
        bookDetailsContentDiv.innerHTML = `
            <h3>${book.title}</h3>
            ${book.subtitle ? `<p><em>${book.subtitle}</em></p>` : ''}
            <img src="${book.img_url}" alt="${book.title} cover">
            <p><strong>Author:</strong> ${book.author}</p>
            <p>${book.description}</p>
            <button id="like-button" type="button" class="${likeButtonClass}">${likeButtonText}</button>
            <div class="liked-users">
                <h4>Users who liked this book:</h4>
                <ul id="users-liked-list">
                    </ul>
            </div>
        `;

        updateLikedUsersDisplay(book); //populate the list of liked users

        //get the dynamically created like/unlike button
        const likeButton = document.getElementById('like-button');
        if (likeButton) {
            //add a click event listener to handle like/unlike actions
            likeButton.addEventListener('click', handleLikeButtonClick);
        }
    }
    /**
     * handles the click event on the LIKE/UNLIKE button
     * sends a PATCH request to the API to update the book's 'users' array
     * (Deliverable: Like a Book & Bonus: Un-Like a Book)
     */
    function handleLikeButtonClick(event) {
        event.preventDefault(); // prevent default button behavior

        if (!currentSelectedBook || !currentUser) {
            console.error('No book selected or current user not defined.');
            return;
        }

        //create a copy of the current list of users who liked the book
        let updatedUsersArray = [...currentSelectedBook.users];
        const hasLiked = hasUserLikedBook(currentSelectedBook, currentUser);

        if (hasLiked) {
            // UNLIKE action
             updatedUsersArray = updatedUsersArray.filter(user =>
                user.id !== currentUser.id
             );
        } else {
            // LIKE action
            updatedUsersArray.push(currentUser);
         }

        //send a PATCH request to the book on the server
        fetch(`http://localhost:3000/books/${currentSelectedBook.id}`, {
            method: 'PATCH', //use PATCH to update specific fields
            headers: { 'Content-Type': 'application/json' }, //specify content type as JSON
            body: JSON.stringify({ users: updatedUsersArray }), // send full user objects
        })
        .then(function(response) {
            if (!response.ok) {
                throw new Error(`HTTP error! status ${response.status}`);
            }
            return response.json(); //parse the response, which should be the updated book object
        })
        .then(function(updatedBookFromServer) { //receives the updated book from the server
            currentSelectedBook = updatedBookFromServer; //update the globally selected book.

            //find and update the book in our local 'allBooks' cache to reflect changes
            const bookIndex = allBooks.findIndex(book => book.id === updatedBookFromServer.id);
            if (bookIndex > -1) {
                allBooks[bookIndex] = updatedBookFromServer;
            }

            updateLikedUsersDisplay(currentSelectedBook); //update the displayed list of liked users

            //update the like/unlike button's text and style.
            const likeButton = document.getElementById('like-button');
            if (likeButton) {
                const newLikedStatus = hasUserLikedBook(currentSelectedBook, currentUser);
                likeButton.textContent = newLikedStatus ? 'UNLIKE' : 'LIKE';
                // classList.toggle() adds 'unlike' if newLikedStatus is true, removes it if false
                likeButton.classList.toggle('unlike', newLikedStatus);
            }
        })
        .catch(function(error) {
            console.error('Error updating book likes:', error);
        });
    }

    /**
     * initial application load flow
     * these functions are called once when the page first loads to set up the UI
     * start by fetching users. once complete, the .then() block of fetchUsers will automatically call fetchAndDisplayBooks to populate the list
     */
    fetchUsers();
});