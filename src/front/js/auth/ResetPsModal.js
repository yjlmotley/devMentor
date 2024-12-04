import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const ResetPsModal = () => {
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
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Password reset failed');
      }

      setIsOpen(false);
      alert('Password is successfully changed! Please log in.');
      // Redirect based on user role
      // if (data.roles.includes('mentor')) {
      //   navigate('/mentor-login');
      // } else {
      //   navigate('/customer-login');
      // }
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal show d-block auth authDiv" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark" style={{ boxShadow: '0 0 30px rgba(0, 0, 0, 0.7)' }}>
          <div className="modal-header border-0 p-0">
            <button
              type="button"
              className="btn-close btn-close-white position-absolute top-0 end-0 m-1"
              onClick={() => {
                setIsOpen(false);
                navigate('/');
              }}
              aria-label="Close"
            />
          </div>

          <div className="modal-body pt-0 p-4">
            <h2 className="modal-title text-light text-center mt-5 mb-4">Reset Password</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <input
                  type="password"
                  className={`form-control bg-dark text-light ${error ? 'is-invalid' : ''}`}
                  style={{
                    border: '1px solid #414549',
                    padding: '12px'
                  }}
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <input
                  type="password"
                  className={`form-control bg-dark text-white ${error ? 'is-invalid' : ''}`}
                  style={{
                    border: '1px solid #414549',
                    padding: '12px'
                  }}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                {error && (
                  <div className="invalid-feedback">
                    {error}
                  </div>
                )}
              </div>

              {/* <div className="d-grid gap-2"> */}
              <div className="text-center mt-5 mb-3">
                <button type="submit" className="btn btn-secondary w-100 py-2">
                  Reset Password
                </button>
                {/* <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setIsOpen(false);
                    navigate('/');
                  }}
                >
                  Cancel
                </button> */}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPsModal;

// TODO: ADD EYE (TO SEE PS: ResetPsModal, ChangePs, LogIn, Signup)