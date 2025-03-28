import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage"; // Replace separate Login and Register with AuthPage
import Dashboard from "./pages/Dashboard";
import NotesCollection from "./pages/NotesCollection";
import NoteEditor from "./pages/NoteEditor";
import ViewNote from "./pages/ViewNote";
import Settings from "./pages/Settings";
import SharedNote from "./pages/SharedNote";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#1D1616]">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notes"
            element={
              <ProtectedRoute>
                <NotesCollection />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/view/:id" 
            element={
              <ProtectedRoute>
                <ViewNote />
              </ProtectedRoute>
            }
          />
          <Route path="/editor" element={
            <ProtectedRoute>
              <NoteEditor />
            </ProtectedRoute>
          } />
          <Route path="/editor/:id" element={
            <ProtectedRoute>
              <NoteEditor />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/shared/:id" element={<SharedNote />} />
          <Route path="/note/:id" element={<SharedNote />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;