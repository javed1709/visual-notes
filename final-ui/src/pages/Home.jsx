import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Book, FileText, Share2, Zap, ArrowRight,NotepadText } from 'lucide-react';

function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Listen for auth changes
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate('/dashboard');
    } else {
      navigate('/auth');
    }
  };

  return (
    <div className="min-h-screen gradient-bg">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold text-text-primary dark:text-text-light mb-6">
              Transform Your Ideas Into Visual Stories
            </h1>
            <p className="text-xl text-text-secondary dark:text-text-light/80 mb-8">
              Create beautiful visual notes, diagrams, and mind maps with the power of AI. 
              Perfect for students, professionals, and creative thinkers.
            </p>
            <div className="flex gap-4">
              <button onClick={handleGetStarted} className="btn-primary text-lg">
                {isLoggedIn ? 'Go to Dashboard' : 'Get Started'}
              </button>
              {!isLoggedIn && (
                <Link to="/auth" className="btn-secondary text-lg">
                  Learn More
                </Link>
              )}
              {isLoggedIn && (
                <Link to="/editor" className="btn-secondary text-lg">
                  Create New Note
                </Link>
              )}
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary-coral to-primary-purple rounded-lg blur-xl opacity-20"></div>
            <div className="relative bg-white dark:bg-surface-dark rounded-lg p-8 border border-accent-coral-200 
                          dark:border-accent-purple-300 shadow-medium">
              <div className="h-64 flex items-center justify-center animate-float">
  <NotepadText size={128} className="text-primary-coral dark:text-primary-purple" />
</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 bg-white dark:bg-surface-dark">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-text-primary dark:text-text-light mb-12">
            Powerful Features for Your Ideas
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card">
              <Zap size={48} className="text-primary-coral dark:text-primary-purple mb-4" />
              <h3 className="text-xl font-bold mb-2 text-text-primary dark:text-text-light">AI-Powered Insights</h3>
              <p className="text-text-secondary dark:text-text-light/80">
                Let AI help you organize and visualize your thoughts with smart suggestions and automatic layouts.
              </p>
            </div>
            <div className="card">
              <FileText size={48} className="text-primary-coral dark:text-primary-purple mb-4" />
              <h3 className="text-xl font-bold mb-2 text-text-primary dark:text-text-light">Smart Diagrams</h3>
              <p className="text-text-secondary dark:text-text-light/80">
                Create professional diagrams from simple text descriptions using our intelligent diagram generator.
              </p>
            </div>
            <div className="card">
              <Share2 size={48} className="text-primary-coral dark:text-primary-purple mb-4" />
              <h3 className="text-xl font-bold mb-2 text-text-primary dark:text-text-light">Seamless Sharing</h3>
              <p className="text-text-secondary dark:text-text-light/80">
                Share your visual notes instantly with anyone, anywhere. Perfect for team collaboration.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="py-20 bg-accent-coral-50 dark:bg-accent-purple-700/20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-text-primary dark:text-text-light mb-12">
            What Our Users Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Sarah Johnson",
                role: "Product Manager",
                text: "Visual Notes has transformed how I organize my product roadmaps. The AI suggestions are incredibly helpful!"
              },
              {
                name: "David Chen",
                role: "Software Engineer",
                text: "The diagram generation feature is a game-changer. I can create system architecture diagrams in minutes."
              },
              {
                name: "Emily Brown",
                role: "UX Designer",
                text: "Perfect for brainstorming and organizing design ideas. The collaboration features are seamless."
              }
            ].map((testimonial, index) => (
              <div key={index} className="card">
                <p className="text-text-secondary dark:text-text-light/80 mb-4">"{testimonial.text}"</p>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary-coral dark:bg-primary-purple flex items-center justify-center">
                    <span className="text-white font-bold">{testimonial.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-text-primary dark:text-text-light">{testimonial.name}</p>
                    <p className="text-sm text-text-secondary dark:text-text-light/70">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20 gradient-bg">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-text-primary dark:text-text-light mb-6">
            {isLoggedIn ? 'Ready To Create Amazing Notes?' : 'Ready to Transform Your Ideas?'}
          </h2>
          <p className="text-xl text-text-secondary dark:text-text-light/80 mb-8">
            {isLoggedIn 
              ? 'Your creative journey starts with just a click.' 
              : 'Join thousands of users who are already creating beautiful visual notes.'}
          </p>
          {isLoggedIn ? (
            <Link to="/editor" className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2">
              Create New Note <ArrowRight size={20} />
            </Link>
          ) : (
            <Link to="/auth" className="btn-primary text-lg px-8 py-3 inline-flex items-center gap-2">
              Get Started Free <ArrowRight size={20} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;