import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader, AlertCircle, User } from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';

function SharedNote() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSharedNote();
  }, [id]);

  const fetchSharedNote = async () => {
    try {
      // Fetch shared note directly from MongoDB
      const response = await fetch(`https://visual-notes.up.railway.app/api/notes/shared/${id}`);
      
      if (!response.ok) {
        throw new Error('Note not found or not publicly shared');
      }
      
      const noteData = await response.json();
      setNote(noteData);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching note:', error);
      setError(error.message || 'Failed to load shared note');
      setIsLoading(false);
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

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader size={40} className="animate-spin text-primary-coral dark:text-primary-purple" />
          <p className="text-theme2-dark dark:text-theme2-light font-medium">Loading shared note...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen gradient-bg">
        <div className="max-w-3xl mx-auto px-6 py-20">
          <div className="card p-8 text-center">
            <AlertCircle size={40} className="mx-auto mb-4 text-primary-coral dark:text-primary-purple" />
            <h2 className="text-2xl font-bold text-text-primary dark:text-text-light mb-2">Error Loading Note</h2>
            <p className="text-text-secondary dark:text-text-light/70 mb-6">{error}</p>
            <Link to="/" className="btn-primary">Go Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="card">
          <div className="mb-6 border-b border-accent-coral-200 dark:border-accent-purple-300 pb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-text-light mb-2">
              {note?.title || 'Shared Note'}
            </h1>
            <div className="flex items-center gap-2 text-text-secondary dark:text-text-light/70 text-sm">
              <User size={14} />
              <span>By {note?.ownerName || 'Anonymous'}</span>
              <span className="mx-2">•</span>
              <span>Shared: {formatDate(note?.createdAt)}</span>
            </div>
          </div>
          
          {/* Use MarkdownRenderer instead of ReactMarkdown directly */}
          <MarkdownRenderer content={note?.content || ''} />
          
          <div className="flex gap-4 mt-8">
            <Link to="/" className="btn-secondary">Go Home</Link>
            {localStorage.getItem('token') && (
              <Link to="/notes" className="btn-primary">My Notes</Link>
            )}
          </div>
        </div>  
      </div>
    </div>
  );
}

export default SharedNote;