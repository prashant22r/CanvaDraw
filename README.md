# 🖌️ Canvas Whiteboard

A simple, browser-based whiteboard application where users can **draw**, **erase**, and **take notes visually**.  
Each user can **sign up, log in, and automatically save** their work locally — no backend or cloud storage required!

---

## 🚀 Features

✅ **User Authentication (Local Storage)**  
- Sign up and log in using the browser’s `localStorage`.  
- Each user’s work is stored separately — no database required.

✅ **Drawing & Erasing Tools**  
- Draw freehand with adjustable **brush size** and **color**.  
- Switch to **eraser mode** instantly via icon buttons.

✅ **Auto-Save**  
- Your canvas automatically saves every few seconds and after each stroke.  
- Reloading or logging back in restores your last saved work automatically.

✅ **File Operations**  
- **Download** your drawing as a JSON file.  
- **Upload** a previously saved file to restore it.  
- **Load** your saved session or **clear** the canvas anytime.

✅ **Responsive Canvas**  
- The canvas automatically fits your screen.  
- Works smoothly across zoom levels and high-DPI (Retina) displays.

✅ **Local Only**  
- All data (users + drawings) are stored in your browser’s localStorage.  
- No server, no database — everything runs offline.

---

## 🛠️ Tech Stack

- **HTML5 Canvas API** — for drawing and rendering  
- **CSS3 / Flexbox** — for layout and styling  
- **Vanilla JavaScript (ES6)** — for all logic  
- **Local Storage API** — for user and drawing persistence

---

## 🧠 How It Works

1. User signs up or logs in → stored in `localStorage["users"]`.  
2. App identifies the logged-in user via `localStorage["currentUser"]`.  
3. Drawing data is saved as a Base64 image in the user object:
   ```json
   {
     "username": "john_doe",
     "drawing": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgA..."
   }
4. On reload, `loadFromCurrentUser()` fetches and redraws the image.  
5. Auto-save keeps work up-to-date even without manual saving.

---

## ⚙️ Running the App Locally

1. Clone or download this repository.  
2. Open the folder in **VS Code** or your preferred editor.  
3. Right-click on **index.html** → “Open with Live Server” *(or open directly in a browser)*.  
4. Create a new account, log in, and start drawing!

---

## 🧹 Future Improvements

- Add text annotations directly on canvas.  
- Multi-user sync with cloud storage or Firebase.  
- Add shape tools (rectangles, circles, arrows).  
- Export as PNG/JPEG image.  
- Collaborative real-time whiteboard.
