import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleRefresh = () => {
    window.location.reload()
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-container futuristic-card">
            <div className="error-icon">
              <AlertTriangle size={48} color="#ef4444" />
            </div>
            
            <h2 className="error-title">Oops! Something went wrong</h2>
            
            <p className="error-message">
              The PDF Merger encountered an unexpected error. This might be due to:
            </p>
            
            <ul className="error-causes">
              <li>Browser compatibility issues</li>
              <li>Corrupted PDF files</li>
              <li>Large file sizes</li>
              <li>Network connectivity problems</li>
            </ul>
            
            <div className="error-actions">
              <button 
                className="error-btn primary futuristic-btn"
                onClick={this.handleRefresh}
              >
                <RefreshCw size={16} />
                Refresh Page
              </button>
              
              <button 
                className="error-btn futuristic-btn"
                onClick={this.handleReset}
              >
                <Home size={16} />
                Try Again
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="error-details">
                <summary>Technical Details (Development)</summary>
                <pre className="error-stack">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
          
          <style jsx>{`
            .error-boundary {
              min-height: 100vh;
              display: flex;
              align-items: center;
              justify-content: center;
              padding: 2rem;
              background: var(--background-primary);
            }
            
            .error-container {
              max-width: 600px;
              padding: 3rem;
              text-align: center;
            }
            
            .error-icon {
              margin-bottom: 1.5rem;
            }
            
            .error-title {
              font-size: 2rem;
              font-weight: 700;
              margin-bottom: 1rem;
              color: var(--text-primary);
            }
            
            .error-message {
              font-size: 1.1rem;
              color: var(--text-secondary);
              margin-bottom: 1.5rem;
            }
            
            .error-causes {
              text-align: left;
              max-width: 400px;
              margin: 0 auto 2rem;
              color: var(--text-secondary);
            }
            
            .error-causes li {
              margin-bottom: 0.5rem;
            }
            
            .error-actions {
              display: flex;
              gap: 1rem;
              justify-content: center;
              flex-wrap: wrap;
              margin-bottom: 2rem;
            }
            
            .error-btn {
              padding: 0.875rem 1.5rem;
              gap: 0.5rem;
            }
            
            .error-details {
              text-align: left;
              margin-top: 2rem;
              padding: 1rem;
              background: var(--background-secondary);
              border-radius: var(--border-radius-md);
            }
            
            .error-details summary {
              cursor: pointer;
              font-weight: 600;
              margin-bottom: 1rem;
            }
            
            .error-stack {
              font-size: 0.875rem;
              color: var(--text-secondary);
              overflow-x: auto;
              white-space: pre-wrap;
            }
            
            @media (max-width: 768px) {
              .error-container {
                padding: 2rem 1.5rem;
              }
              
              .error-title {
                font-size: 1.5rem;
              }
              
              .error-actions {
                flex-direction: column;
                align-items: center;
              }
              
              .error-btn {
                width: 100%;
                max-width: 200px;
              }
            }
          `}</style>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
