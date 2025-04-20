import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import mermaid from 'mermaid';
import MarkdownRenderer from '../components/MarkdownRenderer';

function NoteEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [noteTitle, setNoteTitle] = useState('');
  const [noteContent, setNoteContent] = useState('');
  const [viewMode, setViewMode] = useState('preview');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Initialize Mermaid.js
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
  }, []);

  // Re-render Mermaid diagrams when noteContent changes
  useEffect(() => {
    const mermaidElements = document.querySelectorAll('.mermaid');
    mermaidElements.forEach((el) => {
      try {
        mermaid.contentLoaded();
      } catch (err) {
        console.error('Mermaid rendering error:', err);
      }
    });
  }, [noteContent]);

  // Load note if ID is provided (for editing)
  useEffect(() => {
    if (id) {
      fetchNote(id);
    }
  }, [id]);

  // Fetch note data if editing an existing note
  const fetchNote = async (noteId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://visual-notes.up.railway.app/api/notes/${noteId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch note');
      }
      
      const data = await response.json();
      
      // Content is now stored directly in the note object
      setNoteContent(data.content || '');
      setNoteTitle(data.title || 'Untitled Note');
    } catch (error) {
      console.error('Error fetching note:', error);
      setError('Failed to load note');
    }
  };

  // Toggle between preview and markdown code view
  const toggleViewMode = () => {
    setViewMode(prev => (prev === 'preview' ? 'code' : 'preview'));
  };

  // Save and update note
  const saveNote = async () => {
    if (!noteContent.trim()) {
      setError("Cannot save empty note");
      return;
    }
    
    setIsSaving(true);
    setError('');
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login');
        return;
      }
  
      let response;
      
      // If id exists, update the existing note
      if (id) {
        response = await fetch(`https://visual-notes.up.railway.app/api/notes/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            title: noteTitle || 'Untitled Note',
            content: noteContent
          }),
        });
      } else {
        // Create a new note
        response = await fetch('https://visual-notes.up.railway.app/api/notes/manual-save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            title: noteTitle || 'Untitled Note',
            content: noteContent
          }),
        });
      }
  
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to save note');
      }
  
      const actionText = id ? "updated" : "saved";
      alert(`Note ${actionText} successfully!`);
      navigate('/notes'); // Redirect to notes collection
    } catch (error) {
      console.error('Error saving note:', error);
      setError(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen gradient-bg flex flex-col">
      {/* Header */}
      <div className="bg-white dark:bg-surface-dark shadow-md px-6 py-4 flex items-center justify-between">
        <Link to="/notes" className="text-theme4-dark dark:text-theme4-light hover:text-theme5-dark dark:hover:text-theme5-light text-lg">
          ← Back to Notes
        </Link>
        <div className="flex gap-4">
          <button onClick={saveNote} className="btn-primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Note'}
          </button>
          <button onClick={toggleViewMode} className="btn-secondary">
            {viewMode === 'preview' ? 'Edit Code' : 'View Preview'}
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-accent-coral-100 dark:bg-accent-purple-700/50 border border-primary-coral dark:border-primary-purple rounded-lg flex items-center gap-2 text-primary-coral dark:text-primary-purple">
          <span>{error}</span>
        </div>
      )}

      {/* Main content */}
      <div className="px-6 py-4 flex-grow">
        <input
          type="text"
          value={noteTitle}
          onChange={(e) => setNoteTitle(e.target.value)}
          placeholder="Note Title"
          className="input w-full mb-4 text-2xl font-bold border-none focus:ring-2 focus:ring-primary-coral dark:focus:ring-primary-purple"
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-220px)]">
          {viewMode === 'preview' ? (
            <div className="col-span-2 card p-6 shadow-lg overflow-auto">
              <MarkdownRenderer content={noteContent} />
            </div>
          ) : (
            <>
              <div className="card h-full">
                <textarea
                  value={noteContent}
                  onChange={(e) => setNoteContent(e.target.value)}
                  className="w-full h-full resize-none text-md border-none focus:ring-0 font-mono"
                  placeholder="Write your markdown here..."
                ></textarea>
              </div>
              <div className="card p-6 shadow-lg overflow-auto">
                <MarkdownRenderer content={noteContent} />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NoteEditor;