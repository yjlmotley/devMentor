import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ResetPasswordModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get token from URL parameters
    const params = new URLSearchParams(window.location.search);
    const resetToken = params.get('token');
    
    if (resetToken) {
      setToken(resetToken);
      setIsOpen(true);
      // Remove token from URL without refreshing page
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await fetch(process.env.BACKEND_URL + `/api/reset-password/${token}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed');
      }

      setIsOpen(false);
      alert('Password successfully changed!');
      // Redirect based on user role
      if (data.roles.includes('mentor')) {
        navigate('/mentor-login');
      } else {
        navigate('/customer-login');
      }
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Reset Password</h5>
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => {
                setIsOpen(false);
                navigate('/');
              }}
              aria-label="Close"
            ></button>
          </div>
          
          <div className="modal-body">
            <p className="text-muted mb-4">Enter your new password below</p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              <div className="mb-3">
                <input
                  type="password"
                  className="form-control"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <div className="modal-footer px-0 pb-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/');
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Reset Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordModal;