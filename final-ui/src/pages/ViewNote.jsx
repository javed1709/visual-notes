import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Loader, AlertCircle, Share2, Edit } from 'lucide-react';
import MarkdownRenderer from '../components/MarkdownRenderer';
import ShareModal from '../components/ShareModal';

function ViewNote() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    fetchNote();
  }, [id]);

  const fetchNote = async () => {
    try {
      const token = localStorage.getItem('token');
      // Fetch the note data including content
      const response = await fetch(`http://localhost:5000/api/notes/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch note');
      }
      
      const noteData = await response.json();
      setNote(noteData);
      setIsLoading(false);
      
    } catch (error) {
      console.error('Error fetching note:', error);
      setError(error.message || 'Failed to load note');
      setIsLoading(false);
    }
  };

  const handleShare = async () => {
    if (!note || note.isPublic) {
      setShareModalOpen(true);
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/notes/${id}/share`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        setNote({...note, isPublic: true});
        setShareModalOpen(true);
      } else {
        throw new Error(data.message || 'Failed to share note');
      }
    } catch (error) {
      console.error('Error sharing note:', error);
      setError(error.message);
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
          <p className="text-theme2-dark dark:text-theme2-light font-medium">Loading note...</p>
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
            <Link to="/notes" className="btn-primary">Back to Notes</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white dark:bg-surface-dark shadow-md px-6 py-4 flex items-center justify-between rounded-t-lg border border-accent-coral-200 dark:border-accent-purple-300">
          <Link to="/notes" className="text-theme4-dark dark:text-theme4-light hover:text-theme5-dark dark:hover:text-theme5-light text-lg">
            ← Back to Notes
          </Link>
          <div className="flex gap-4">
            <Link to={`/editor/${id}`} className="btn-secondary flex items-center gap-2">
              <Edit size={18} />
              Edit
            </Link>
            <button onClick={handleShare} className="btn-primary flex items-center gap-2">
              <Share2 size={18} />
              Share
            </button>
          </div>
        </div>
        
        <div className="card rounded-t-none">
          <div className="mb-6 border-b border-accent-coral-200 dark:border-accent-purple-300 pb-4">
            <h1 className="text-2xl md:text-3xl font-bold text-text-primary dark:text-text-light mb-2">
              {note?.title || 'Untitled Note'}
            </h1>
            <p className="text-text-secondary dark:text-text-light/70 text-sm">
              {note && `Last updated: ${formatDate(note.updatedAt || note.createdAt)}`}
              {note?.isPublic && (
                <span className="ml-2 px-2 py-1 bg-accent-coral-100 dark:bg-accent-purple-700 text-xs rounded-full text-primary-coral dark:text-primary-purple">
                  Public
                </span>
              )}
            </p>
          </div>
          
          {/* Use the MarkdownRenderer component for content rendering */}
          <MarkdownRenderer content={note?.content || ''} />
        </div>
      </div>
      
      {note && (
        <ShareModal
          isOpen={shareModalOpen}
          onClose={() => setShareModalOpen(false)}
          noteId={note._id}
          noteTitle={note.title}
        />
      )}
    </div>
  );
}

export default ViewNote;