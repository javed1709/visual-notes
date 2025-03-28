import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FileText, Share2, Clock, Plus, ChevronRight, Loader, AlertCircle } from 'lucide-react';
import ShareModal from '../components/ShareModal';

function Dashboard() {
  const navigate = useNavigate();
  const [userNotes, setUserNotes] = useState([]);
  const [sharedNotes, setSharedNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    totalNotes: 0,
    sharedNotes: 0,
    recentActivity: 0
  });

  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);


  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch user's notes
      const response = await fetch('http://localhost:5000/api/notes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to load notes');
      }

      const allNotes = await response.json();
      
      // Filter for user's own notes and shared notes
      const ownNotes = allNotes;
      
      // Calculate statistics
      const totalCount = ownNotes.length;
      const sharedCount = ownNotes.filter(note => note.isPublic).length;
      
      // Calculate recent activity (notes created or updated in the last 24 hours)
      const oneDayAgo = new Date();
      oneDayAgo.setDate(oneDayAgo.getDate() - 1);
      const recentCount = ownNotes.filter(note => {
        const noteDate = new Date(note.updatedAt || note.createdAt);
        return noteDate >= oneDayAgo;
      }).length;

      setUserNotes(ownNotes);
      setStats({
        totalNotes: totalCount,
        sharedNotes: sharedCount,
        recentActivity: recentCount
      });
      
      // You'll need to implement this endpoint in your API
      // For now, we'll just set an empty array
      setSharedNotes([]);
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
      setIsLoading(false);
    }
  };

  // Format date relative to now (e.g., "2 days ago")
  const formatRelativeDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const handleShareNote = async (note) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/notes/${note._id}/share`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update note to be public and show share modal
        const updatedNote = {...note, isPublic: true};
        setSelectedNote(updatedNote);
        setShareModalOpen(true);
        
        // Refresh the notes list
        fetchUserData();
      } else {
        throw new Error(data.message || 'Failed to share note');
      }
    } catch (error) {
      console.error('Error sharing note:', error);
      setError(error.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader size={40} className="animate-spin text-primary-coral dark:text-primary-purple" />
          <p className="text-theme2-dark dark:text-theme2-light font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-bg">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-theme2-dark dark:text-theme2-light">
            Welcome back!
          </h1>
          <Link 
            to="/editor" 
            className="btn-primary flex items-center gap-2"
          >
            <Plus size={20} />
            New Note
          </Link>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-accent-coral-100 dark:bg-accent-purple-700/50 border border-primary-coral dark:border-primary-purple rounded-lg flex items-center gap-2 text-primary-coral dark:text-primary-purple">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <FileText className="text-theme4-dark dark:text-theme4-light" size={24} />
              <h3 className="text-xl font-semibold text-theme2-dark dark:text-theme2-light">Total Notes</h3>
            </div>
            <p className="text-3xl font-bold text-theme2-dark dark:text-theme2-light">{stats.totalNotes}</p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Share2 className="text-theme4-dark dark:text-theme4-light" size={24} />
              <h3 className="text-xl font-semibold text-theme2-dark dark:text-theme2-light">Shared Notes</h3>
            </div>
            <p className="text-3xl font-bold text-theme2-dark dark:text-theme2-light">{stats.sharedNotes}</p>
          </div>

          <div className="card">
            <div className="flex items-center gap-3 mb-2">
              <Clock className="text-theme4-dark dark:text-theme4-light" size={24} />
              <h3 className="text-xl font-semibold text-theme2-dark dark:text-theme2-light">Recent Activity</h3>
            </div>
            <p className="text-3xl font-bold text-theme2-dark dark:text-theme2-light">{stats.recentActivity}</p>
            <p className="text-sm text-theme2-dark/70 dark:text-theme2-light/70 mt-1">Updates today</p>
          </div>
        </div>

        {/* Recent Notes */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-theme2-dark dark:text-theme2-light">Recent Notes</h2>
              <Link to="/notes" className="text-theme4-dark dark:text-theme4-light hover:text-theme5-dark dark:hover:text-theme5-light flex items-center gap-1">
                View All <ChevronRight size={16} />
              </Link>
            </div>

            {userNotes.length === 0 ? (
              <div className="card p-8 text-center">
                <p className="text-theme2-dark/70 dark:text-theme2-light/70">You haven't created any notes yet.</p>
                <Link to="/editor" className="btn-primary mt-4 inline-block">Create your first note</Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userNotes.slice(0, 4).map((note) => (
                  <div key={note._id} className="card">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-theme2-dark dark:text-theme2-light">
                        Note {note._id.substring(0, 8)}
                      </h3>
                      {note.isPublic && (
                        <div className="px-2 py-1 bg-accent-coral-100 dark:bg-accent-purple-700/50 text-xs rounded-full text-primary-coral dark:text-primary-purple">
                          Public
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-theme2-dark/70 dark:text-theme2-light/70 mb-4">
                      Last edited: {formatRelativeDate(note.updatedAt || note.createdAt)}
                    </p>
                    <div className="flex gap-3">
                      <Link 
                        to={`/editor/${note._id}`} 
                        className="text-theme4-dark dark:text-theme4-light hover:text-theme5-dark dark:hover:text-theme5-light text-sm"
                      >
                        Edit
                      </Link>
                      {!note.isPublic && (
                        <button 
                          onClick={() => navigate(`/notes?share=${note._id}`)} 
                          className="text-theme4-dark dark:text-theme4-light hover:text-theme5-dark dark:hover:text-theme5-light text-sm"
                        >
                          Share
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Shared with Me */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-theme2-dark dark:text-theme2-light">Shared with Me</h2>
            </div>

            <div className="card p-8 text-center">
              <p className="text-theme2-dark/70 dark:text-theme2-light/70">
                This feature is coming soon!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;