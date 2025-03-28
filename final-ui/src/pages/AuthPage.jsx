import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle, Lock, Mail, User } from 'lucide-react';

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isLogin ? 'login' : 'register';
      const payload = isLogin 
        ? { email, password } 
        : { name, email, password };

      const response = await fetch(`https://visual-notes.up.railway.app/api/users/${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `${isLogin ? 'Login' : 'Registration'} failed`);
      }

      // Save the token to localStorage
      localStorage.setItem('token', data.token);
      
      // Trigger a storage event to notify other components (like Navbar)
      // This is a workaround since localStorage events don't fire in the same window
      window.dispatchEvent(new Event('storage'));

      setIsLoading(false);
      navigate('/dashboard'); // Redirect to dashboard
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 gradient-bg">
      <div className="bg-white dark:bg-surface-dark border border-accent-coral-200 dark:border-accent-purple-300 p-8 rounded-lg shadow-medium w-full max-w-md">
      <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-text-primary dark:text-text-light">
            {isLogin ? 'Login' : 'Create Account'}
          </h2>
          <div className="bg-accent-coral-100 dark:bg-accent-purple-700/50 rounded-full p-1 flex h-10">
            <button 
              onClick={() => setIsLogin(true)}
              className={`px-4 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center min-w-[80px] ${
                isLogin 
                  ? 'bg-white dark:bg-surface-dark text-text-primary dark:text-text-light shadow' 
                  : 'bg-transparent text-primary-coral dark:text-primary-purple'
              }`}
            >
              Login
            </button>
            <button 
              onClick={() => setIsLogin(false)}
              className={`px-4 rounded-full text-sm font-medium transition-all duration-200 flex items-center justify-center min-w-[80px] ${
                !isLogin 
                  ? 'bg-white dark:bg-surface-dark text-text-primary dark:text-text-light shadow' 
                  : 'bg-transparent text-primary-coral dark:text-primary-purple'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-accent-coral-100 dark:bg-accent-purple-700/50 border border-primary-coral dark:border-primary-purple rounded-lg flex items-center gap-2 text-primary-coral dark:text-primary-purple">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-text-primary dark:text-text-light mb-2 flex items-center gap-2"
              >
                <User size={18} />
                <span>Name</span>
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input"
                placeholder="Enter your name"
                required={!isLogin}
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-text-primary dark:text-text-light mb-2 flex items-center gap-2"
            >
              <Mail size={18} />
              <span>Email</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-text-primary dark:text-text-light mb-2 flex items-center gap-2"
            >
              <Lock size={18} />
              <span>Password</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input"
              placeholder="Enter your password"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`btn-primary w-full py-3 mt-2 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isLoading 
              ? isLogin ? 'Signing in...' : 'Creating account...' 
              : isLogin ? 'Sign In' : 'Create Account'}
          </button>

          <div className="text-center mt-4">
            <p className="text-text-secondary dark:text-text-light/70">
              {isLogin ? "Don't have an account?" : "Already have an account?"} 
              <button 
                type="button"
                onClick={toggleMode} 
                className="ml-2 text-primary-coral dark:text-primary-purple hover:underline font-medium"
              >
                {isLogin ? 'Register' : 'Login'}
              </button>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AuthPage;