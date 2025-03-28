import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader, AlertCircle, Plus, Eye, Share2 } from 'lucide-react';
import ShareModal from '../components/ShareModal';

function NotesCollection() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // Fetch user notes when component mounts
  useEffect(() => {
    fetchNotes();
  }, []);

  // Fetch user's notes from backend
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('https://visual-notes.up.railway.app/api/notes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to load notes');
      }
      
      const data = await response.json();
      setNotes(data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching notes:', error);
      setError('Failed to load notes');
      setIsLoading(false);
    }
  };

  // Generate notes using AI
  const handleGenerate = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }
  
    setError('');
    setIsGenerating(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
  
      const response = await fetch('https://visual-notes.up.railway.app/api/notes/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to generate notes');
      }
      
      const data = await response.json();
      
      // Add the new note to the list
      fetchNotes();
      setQuery(''); // Clear query field
      alert('Note generated successfully!');
  
    } catch (error) {
      console.error('Error generating notes:', error);
      setError(`Generation error: ${error.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Share a note (make it public)
  const shareNote = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`https://visual-notes.up.railway.app/api/notes/${id}/share`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        // Find the note that was shared
        const sharedNote = notes.find(note => note._id === id);
        if (sharedNote) {
          // Update the note to be public
          sharedNote.isPublic = true;
          // Open the share modal
          setSelectedNote(sharedNote);
          setShareModalOpen(true);
        }
        
        // Refresh notes list
        fetchNotes();
      } else {
        throw new Error(data.message || 'Failed to share note');
      }
    } catch (error) {
      console.error('Error sharing note:', error);
      alert(`Error: ${error.message}`);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <h1 className="text-3xl font-bold text-theme2-dark dark:text-theme2-light">My Notes</h1>
          <div className="flex gap-4">
            <button onClick={() => navigate('/editor')} className="btn-primary">
              <Plus size={18} className="mr-2" />
              Create Manually
            </button>
          </div>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-accent-coral-100 dark:bg-accent-purple-700/50 border border-primary-coral dark:border-primary-purple rounded-lg flex items-center gap-2 text-primary-coral dark:text-primary-purple">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}
        
        {/* Note Generation Section */}
        <div className="card mb-8">
          <h2 className="text-2xl font-bold text-theme2-dark dark:text-theme2-light mb-4">Generate with AI</h2>
          
          <textarea 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter your query for AI note generation..."
            className="input h-32 mb-4 resize-none"
          />
          
          <div className="flex justify-end">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !query.trim()}
              className={`btn-primary ${isGenerating ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isGenerating ? (
                <>
                  <Loader size={20} className="animate-spin mr-2" />
                  Generating...
                </>
              ) : 'Generate Notes'}
            </button>
          </div>
        </div>
        
        {/* My Notes List */}
        <h2 className="text-2xl font-bold text-theme2-dark dark:text-theme2-light mb-4">My Saved Notes</h2>
        
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <Loader size={40} className="animate-spin text-primary-coral dark:text-primary-purple" />
          </div>
        ) : notes.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {notes.map((note) => (
              <div key={note._id} className="card">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-theme2-dark dark:text-theme2-light truncate">
                    {note.title || `Note ${note._id.substring(0, 8)}`}
                  </h3>
                  {note.isPublic && (
                    <span className="px-2 py-1 bg-accent-coral-100 dark:bg-accent-purple-700 text-xs rounded-full text-primary-coral dark:text-primary-purple">
                      Public
                    </span>
                  )}
                </div>
                <p className="text-sm text-theme2-dark/70 dark:text-theme2-light/70 mb-4">
                  Created: {formatDate(note.createdAt)}
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => navigate(`/view/${note._id}`)}
                    className="btn-secondary btn-sm flex items-center gap-1"
                  >
                    <Eye size={16} />
                    View
                  </button>
                  {!note.isPublic && (
                    <button 
                      onClick={() => shareNote(note._id)}
                      className="btn-secondary btn-sm flex items-center gap-1"
                    >
                      <Share2 size={16} />
                      Share
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <p className="text-text-secondary dark:text-text-light/80 mb-4">No notes yet. Create one manually or generate with AI!</p>
            <div className="flex gap-4 justify-center">
              <button onClick={() => navigate('/editor')} className="btn-primary">Create Manually</button>
            </div>
          </div>
        )}
      </div>
      
      {selectedNote && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          noteId={selectedNote._id}
          noteTitle={selectedNote.title}
        />
      )}
    </div>
  );
}

export default NotesCollection;