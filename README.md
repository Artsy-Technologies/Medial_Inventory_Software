📦 ARTSY Inventory Management System
This is a full-stack Inventory Management System built for pharmaceutical stores. It helps automate stock monitoring, reorder management, and purchase order (PO) generation. This system is built using:

🔧 Backend: Node.js + Express + MySQL

💻 Frontend: React (Vite) + TypeScript 

🗂 Database: MySQL (shared company server)

🛠️ Project Structure
ARTSY_INVENTORY_MGMT/
├── backend/         # Node.js + Express API (stock rule, auth, etc.)
├── frontend/        # React + TypeScript (Vite project)
├── text-docs/       # Sample data (PDFs, mockups, etc.)
└── images/          # Reference images or assets

🛠 Local Setup (For Developers)
📌 Prerequisites
Node.js (v18+ recommended)
MySQL (for testing, though you'll use the shared company DB)

Clone the Repo
git clone https://github.com/Artsy-Technologies/Medial_Inventory_Software.git
cd Medial_Inventory_Software

Setup Backend
cd backend
npm install

Create .env file in /backend
DB_HOST=your-db-host.com
DB_USER=your-db-username
DB_PASSWORD=your-db-password
DB_NAME=inventory_db
SESSION_SECRET=your-secret-key
PORT=5000

Start the server 
devlopment - npm run dev
production - npm start

Setup Frontend
cd ../frontend
npm install
npm run dev


