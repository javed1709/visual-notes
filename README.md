# Visual Notes Maker

An AI-driven interactive note-taking platform that leverages Google GenAI for intelligent content generation and file parsing for enhanced note-taking.

---

## 🚀 Live : [https://visual-notes-maker.vercel.app/](https://visual-notes-maker.vercel.app/)

---

## ✨ Features

1. **AI-Powered Note Generation**: Generate notes using Google GenAI.
2. **File Parsing**: Upload files (PDF, Word, images, or text) and extract content.
3. **Markdown Editor**: Create and edit notes with a rich markdown editor.
4. **Note Sharing**: Share notes publicly with a unique link.
5. **Dashboard**: View statistics like total notes, shared notes, and recent activity.

---


## 🛠️ How to Run the Project Locally

### ✅ Step 1: Setup the Backend

1. **Install Dependencies**:
   ```bash
   cd backend
   npm install
   ```

2. **Set Up Environment Variables**:
   Create a `.env` file inside the `backend` directory:
   ```env
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>
   JWT_SECRET=your_jwt_secret
   GOOGLE_GENAI_API_KEY=your_google_genai_api_key
   PORT=5000
   ```

   Replace `<username>`, `<password>`, `<dbname>`, and `your_google_genai_api_key` with your actual credentials.

3. **Start the Backend Server**:
   ```bash
   npm start
   ```
   - Backend runs on `http://localhost:5000`.

---

### ✅ Step 2: Setup the Frontend

1. **Install Dependencies**:
   ```bash
   cd ../final-ui
   npm install
   ```

2. **Start the Frontend Development Server**:
   ```bash
   npm run dev
   ```
   - Frontend runs on `http://localhost:3000`.

---

