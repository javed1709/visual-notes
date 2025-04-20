import React, { useState } from 'react';
import { Upload, FileText, AlertCircle, Check, X } from 'lucide-react';

function FileUploader({ onTextExtracted }) {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
      setError('');
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setIsUploading(true);
    setError('');
    setSuccess(false);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://visual-notes.up.railway.app/api/files/parse', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error parsing file');
      }

      setSuccess(true);
      onTextExtracted(data.extractedText, file.name);
    } catch (error) {
      console.error('Error uploading file:', error);
      setError(error.message || 'Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const resetUploader = () => {
    setFile(null);
    setError('');
    setSuccess(false);
  };

  return (
    <div className="card mb-8">
      <h2 className="text-2xl font-bold text-theme2-dark dark:text-theme2-light mb-4">Parse from File</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-accent-coral-100 dark:bg-accent-purple-700/50 border border-primary-coral dark:border-primary-purple rounded-lg flex items-center gap-2 text-primary-coral dark:text-primary-purple">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-lg flex items-center gap-2 text-green-700 dark:text-green-400">
          <Check size={20} />
          <span>File parsed successfully! The extracted text is ready to use.</span>
        </div>
      )}
      
      <div className="flex flex-col md:flex-row gap-4 items-start">
        <div className="flex-grow">
          <label className="block mb-2 text-sm font-medium text-theme2-dark dark:text-theme2-light">
            Upload a file (Image, PDF, Word, or Text)
          </label>
          <div className="flex items-center">
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              accept=".pdf,.doc,.docx,.txt,image/*"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center gap-2 cursor-pointer input py-2 w-full"
            >
              <Upload size={18} />
              <span className="truncate">
                {file ? file.name : 'Choose a file...'}
              </span>
            </label>
            {file && (
              <button 
                onClick={resetUploader}
                className="ml-2 p-2 text-text-secondary hover:text-red-500"
                aria-label="Clear selection"
              >
                <X size={18} />
              </button>
            )}
          </div>
          {file && (
            <p className="mt-1 text-sm text-text-secondary dark:text-text-light/70">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          )}
        </div>
        
        <button
          onClick={handleUpload}
          disabled={!file || isUploading}
          className={`btn-primary whitespace-nowrap ${!file || isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isUploading ? 'Processing...' : 'Parse Text'}
        </button>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-text-secondary dark:text-text-light/70">
          Supported file types: Images (JPG, PNG), PDF, Word documents (DOC, DOCX), and Text files (TXT)
        </p>
      </div>
    </div>
  );
}

export default FileUploader;