import React, { useState, useEffect, useRef } from 'react';
import { CustomerLogin } from './CustomerLogin.js';
import { CustomerSignup } from '../pages/CustomerSignup.js';
import { ForgotPsModal } from './ForgotPsModal.js';
import "../../styles/auth.css";


// export const CustomerAuthModal = ({ initialTab = 'login', show, onHide }) => {
export const CustomerAuthModal = ({ initialTab, show, onHide }) => {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showForgotPs, setShowForgotPs] = useState(false);
  const modalRef = useRef(null);
  const bsModalRef = useRef(null);

  // useEffect(() => {
  //   // Initialize modal when component mounts
  //   if (modalRef.current && !bsModalRef.current && window.bootstrap) {
  //     bsModalRef.current = new window.bootstrap.Modal(modalRef.current, {
  //       keyboard: false,
  //     });

  //     // Add event listener for when modal is hidden
  //     modalRef.current.addEventListener('hidden.bs.modal', () => {
  //       if (onHide) onHide();
  //     });
  //   }

  //   // Cleanup on unmount
  //   return () => {
  //     if (bsModalRef.current) {
  //       bsModalRef.current.dispose();
  //     }
  //   };
  // }, []);

  useEffect(() => {
    if (modalRef.current && window.bootstrap) {
      bsModalRef.current = new window.bootstrap.Modal(modalRef.current, {
        keyboard: !showForgotPs,
        backdrop: showForgotPs ? 'static' : true,
      });

      modalRef.current.addEventListener('hidden.bs.modal', () => {
        if (onHide) onHide();
      });

      // Show modal if needed
      if (show) {
        setActiveTab(initialTab);
        bsModalRef.current.show();
      }
    }

    return () => {
      try {
        if (bsModalRef.current?.dispose) {
          bsModalRef.current.dispose();
        }
      } catch (error) {
        console.error('Error disposing modal:', error);
      }
      bsModalRef.current = null;
    };
  }, [showForgotPs]);

  useEffect(() => {
    if (bsModalRef.current) {
      if (show) {
        setActiveTab(initialTab);
        bsModalRef.current.show();
      } else {
        bsModalRef.current.hide();
      }
    }
  }, [show, initialTab]);


  const handleSignupSuccess = () => {
    console.log('Signup success handler called');
    setActiveTab('login');
  };

  const handleClose = () => {
    setShowForgotPs(false);
    // if (bsModalRef.current) {
    //   bsModalRef.current.hide();
    // }
    // if (onHide) onHide();
    // onHide();
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
          {!showForgotPs ? (
            <>
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
                    onForgotPs={() => setShowForgotPs(true)}
                  />
                ) : (
                  <CustomerSignup onSuccess={handleSignupSuccess} switchToLogin={handleSwitchLogin} />
                )}
              </div>
            </>
          ) : (
            <ForgotPsModal
              // onClose={() => {
              //   setShowForgotPs(false);
              //   if (bsModalRef.current) {
              //     bsModalRef.current.hide();
              //   }
              // }}
              onClose={handleClose}
              onSuccess={() => {
                setShowForgotPs(false);
                setActiveTab('login');
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
};

