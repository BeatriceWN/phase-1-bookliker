# 📚 BookLiker

BookLiker is a fun and simple single-page web app that allows users to browse through a list of books, view book details, and like/unlike them. The app uses a mock REST API provided by `json-server` to simulate persistent backend behavior.

---

## ✨ Brief Description

At a high level, **BookLiker**:
- Fetches and displays a list of books from a local JSON database.
- Lets users view detailed information about each book.
- Allows a predefined user to like or unlike a book.
- Updates the backend (`db.json`) using `PATCH` requests.

---

## 🚀 Core Features

- 📖 Display Book List
- 🔍 Show Book Details (thumbnail, description, liked users)
- 👍 Like a Book
- 👎 Un-Like a Book (Bonus)
- 💾 Persist Likes to the database

---

## 🛠 Technologies Used

- **HTML**
- **CSS**
- **JavaScript (Vanilla)**
- **JSON Server**
- **VS Code Live Server**
- **Git & GitHub**

---

## ⚙️ Installation / Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/)
- Code editor (e.g., [VS Code](https://code.visualstudio.com/))

### Steps

1. **Clone the Repository**  
   ```bash
   git clone https://github.com/your-username/bookliker-app.git
   cd bookliker-app
Install JSON Server

bash
Copy
Edit
npm install -g json-server
Start the Server

bash
Copy
Edit
json-server --watch db.json
Your API will be available at: http://localhost:3000

Open the App
Use Live Server in VS Code or open index.html manually in your browser.

💡 Usage Instructions
A list of book titles appears on the left when the page loads.

Click a title to view:

Cover image (thumbnail)

Book description

List of users who liked the book

Click the LIKE button to like the book.

Click the LIKE button again to un-like the book (bonus feature).

All changes are persisted using PATCH requests to the mock API.

👥 Project Team
This project was built by a team of 5 members as part of a collaborative assignment:

Member 1 – Project Manager & GitHub Lead

Member 2 – Backend & Data Engineer

Member 3 – UI/UX Developer

Member 4 – Book List & Event Handling

Member 5 – Book Details & Like Logic

We worked together using GitHub, shared task boards, and real-time collaboration to deliver this app within 2 days.
