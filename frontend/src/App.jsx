import { useState } from "react";
import Chat from "./Chat";
import { uploadFile } from "./api";
import { Upload, FileText, MessageSquare, Sparkles, Check } from "lucide-react";
import "./App.css";

function App() {
  const [uploaded, setUploaded] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      await uploadFile(file);
      setUploaded(true);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFileUpload(file);
    }
  };

  const handleFileUpload = async (file) => {
    setUploading(true);
    try {
      await uploadFile(file);
      setUploaded(true);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="app">
      <div className="app-background"></div>
      
      <div className="app-container">
        {/* Header */}
        <div className="header">
          <div className="header-badge">
            <Sparkles className="header-badge-icon" />
            <span>AI-Powered Policy Assistant</span>
          </div>
          <h1 className="header-title">
            Policy Q&A Bot
          </h1>
          <p className="header-subtitle">
            Upload your policy documents and get instant, intelligent answers to your questions
          </p>
        </div>

        {/* Main Content */}
        <div className="main-card">
          {!uploaded ? (
            <div className="upload-section">
              <div className="upload-header">
                <FileText className="upload-icon" />
                <h2 className="upload-title">
                  Upload Your Policy Document
                </h2>
                <p className="upload-subtitle">
                  Support for PDF and TXT files up to 10MB
                </p>
              </div>

              {/* Drag & Drop Area */}
              <div
                className={`drop-zone ${dragActive ? 'drop-zone-active' : ''} ${uploading ? 'drop-zone-disabled' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  onChange={handleUpload}
                  accept=".pdf,.txt"
                  className="file-input"
                  disabled={uploading}
                />
                
                <div className="drop-zone-content">
                  {uploading ? (
                    <div className="upload-loading">
                      <div className="spinner"></div>
                      <p className="upload-loading-text">Processing your document...</p>
                    </div>
                  ) : (
                    <div className="drop-zone-idle">
                      <Upload className="drop-zone-icon" />
                      <div className="drop-zone-text">
                        <p className="drop-zone-main-text">
                          Drop your file here or click to browse
                        </p>
                        <p className="drop-zone-sub-text">
                          PDF, TXT files only
                        </p>
                      </div>
                      <button className="upload-button">
                        <Upload className="upload-button-icon" />
                        Choose File
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Features */}
              <div className="features-grid">
                <div className="feature-card feature-card-blue">
                  <div className="feature-icon feature-icon-blue">
                    <FileText />
                  </div>
                  <h3 className="feature-title">Smart Analysis</h3>
                  <p className="feature-description">AI-powered document understanding and context awareness</p>
                </div>
                
                <div className="feature-card feature-card-green">
                  <div className="feature-icon feature-icon-green">
                    <MessageSquare />
                  </div>
                  <h3 className="feature-title">Instant Answers</h3>
                  <p className="feature-description">Get immediate responses to your policy questions</p>
                </div>
                
                <div className="feature-card feature-card-purple">
                  <div className="feature-icon feature-icon-purple">
                    <Sparkles />
                  </div>
                  <h3 className="feature-title">Accurate Results</h3>
                  <p className="feature-description">Precise information extraction with source references</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="chat-section">
              {/* Success Header */}
              <div className="success-header">
                <div className="success-badge">
                  <Check />
                  <span>Document Successfully Uploaded</span>
                </div>
                <h2 className="success-title">
                  Ready to Answer Your Questions
                </h2>
              </div>

              {/* Chat Interface */}
              <Chat />

              {/* Reset Option */}
              <div className="reset-section">
                <button
                  onClick={() => setUploaded(false)}
                  className="reset-button"
                >
                  Upload a different document
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="footer">
          <p>
            Powered by advanced AI • Secure document processing • Privacy protected
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;