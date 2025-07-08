# Real-Time Collaborative To-Do Board
 
A full-stack MERN application that replicates a Trello-like experience with real-time collaboration, smart assignment, and conflict detection.
 
---
 
# Live Demo 
 
* Frontend: https://real-time-collaborative-to-do-board-weld.vercel.app/register
* Backend: https://dashboard.render.com/web/srv-d1m0pler433s73eb7kk0/deploys/dep-d1ml0podl3ps73dlupd0?r=2025-07-08%4017%3A06%3A52%7E2025-07-08%4017%3A09%3A34
* Demo Video: https://drive.google.com/file/d/1iKG0TbAl78sPUWY-T6k24-t_9n6F0Jyd/view?usp=sharing
 
---
 
# Tech Stack
 
* **Frontend**: React, Socket.IO Client, Custom CSS
* **Backend**: Node.js, Express.js, MongoDB, Socket.IO
* **Authentication**: JWT, bcryptjs
* **Deployment**: Vercel (Frontend), Render (Backend)
 
---
 
# Features
 
* JWT-based User Registration/Login
* Create, Edit, Delete, Move Tasks with Real-Time Sync
* Assign/Unassign Tasks
* Smart Assign: Assigns task to user with fewest active tasks
* Conflict Handling: Detects concurrent edits and prompts user
* Live Activity Log (Last 20 actions)
* Smooth Drag & Drop with Custom Animation
* Responsive UI with custom styles (no Bootstrap)
 
---
 
# Project Structure
 
```
TO-DO-board/
├── server/
│   ├── client/            # React Frontend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── socket.js
│   ├── server.js
│   └── .env
```
 
---
 
## Installation & Setup
 
1. **Clone the repository**
 
```bash
git clone https://github.com/yourusername/TO-DO-board.git
cd TO-DO-board
```
 
2. **Install backend dependencies**
 
```bash
cd server
npm install
```
 
3. **Create a `.env` file inside `/server`**
 
```env
PORT=5000
JWT_SECRET=your_jwt_secret
MONGO_URI=your_mongo_connection
```
 
4. **Run backend**
 
```bash
npm start
```
 
5. **Install frontend dependencies**
 
```bash
cd client
npm install
```
 
6. **Run frontend**
 
```bash
npm start
```
 
---
 
# Smart Assign Logic
 
* Counts all active tasks ("Todo" and "In Progress") for all users
* Assigns the task to the user with the least active tasks
 
---
 
# Conflict Handling Logic
 
* When two users edit the same task at the same time:
 
  * System checks timestamp
  * Shows both versions
  * User can choose to Merge or Overwrite
 
---
 
# Demo Video
 https://drive.google.com/file/d/1iKG0TbAl78sPUWY-T6k24-t_9n6F0Jyd/view?usp=sharing
> 
 
---
 
## Logic Document
 
https://drive.google.com/file/d/1U1AR2JHhl5FAAvtWY8QlFXpUF8Nowbhf/view?usp=sharing
(This contains the Logic for Smart Assign, Conflict Handling and Resolution)
 

