import React, { useState, useEffect, useRef } from 'react';
import { CustomerLogin } from './CustomerLogin.js';
import { CustomerSignup } from '../pages/CustomerSignup.js';
import "../../styles/auth.css";


export const CustomerAuthModal = ({ initialTab = 'login', show, onHide }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const modalRef = useRef(null);
  const bsModalRef = useRef(null);

  useEffect(() => {
    // Initialize modal when component mounts
    if (modalRef.current && !bsModalRef.current && window.bootstrap) {
      bsModalRef.current = new window.bootstrap.Modal(modalRef.current, {
        keyboard: false,
        backdrop: 'static'
      });

      // Add event listener for when modal is hidden
      modalRef.current.addEventListener('hidden.bs.modal', () => {
        if (onHide) onHide();
      });
    }

    // Cleanup on unmount
    return () => {
      if (bsModalRef.current) {
        bsModalRef.current.dispose();
      }
    };
  }, []);

  useEffect(() => {
    if (bsModalRef.current) {
      if (show) {
        bsModalRef.current.show();
      } else {
        bsModalRef.current.hide();
      }
    }
  }, [show]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleSignupSuccess = () => {
    console.log('Signup success handler called');
    setActiveTab('login');
  };

  const handleSwitchLogin = () => {
    setActiveTab('login');
  }

  const handleSwitchSignUp = () => {
    setActiveTab('signup');
  }

  const handleTabChange = (tab) => {
    console.log('Changing tab to:', tab);
    setActiveTab(tab);
  };

  return (
    <div
      className="modal fade auth"
      id="customerAuthModal"
      tabIndex="-1"
      aria-hidden="true"
      ref={modalRef}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div
          className="modal-content bg-dark"
          style={{
            boxShadow: '0 0 30px rgba(0, 0, 0, 0.7)',
          }}
        >
          <div className="modal-header border-0 p-0">
            <div className="d-flex w-100 position-relative">
              <button
                className={`flex-fill border-0 auth-tab login-tab ${activeTab === 'login'
                  ? 'active text-white'
                  : 'text-secondary'
                  }`}
                onClick={() => handleTabChange('login')}
              >
                Login
              </button>
              <div className="vr" style={{ backgroundColor: '#6c757d', marginTop: '15px', marginBottom: '15px' }}></div>
              <button
                className={`flex-fill border-0 auth-tab signup-tab ${activeTab === 'signup'
                  ? 'active text-white'
                  : 'text-secondary'
                  }`}
                onClick={() => handleTabChange('signup')}
              >
                Sign Up
              </button>
            </div>
            <button
              type="button"
              className="btn-close btn-close-white position-absolute top-0 end-0 m-1"
              onClick={() => {
                if (bsModalRef.current) {
                  bsModalRef.current.hide();
                }
              }}
            />
          </div>
          <div className="modal-body p-4">
            {activeTab === 'login' ? (
              <CustomerLogin
                onSuccess={() => {
                  console.log('Login successful, rerouting to the customer dashboard page');
                  if (bsModalRef.current) {
                    bsModalRef.current.hide();
                  }
                }}
                switchToSignUp={handleSwitchSignUp}
              />
            ) : (
              <CustomerSignup onSuccess={handleSignupSuccess} switchToLogin={handleSwitchLogin} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};