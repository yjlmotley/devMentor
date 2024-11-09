import React, { useState, useEffect, useRef } from 'react';
import { CustomerLogin } from './CustomerLogin.js';
import { CustomerSignup } from '../pages/CustomerSignup.js';

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

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div 
      className="modal fade" 
      id="customerAuthModal" 
      tabIndex="-1" 
      aria-hidden="true"
      ref={modalRef}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content bg-dark">
          <div className="modal-header border-0 p-0">
            <ul className="nav nav-tabs w-100 border-0">
              <li className="nav-item w-50">
                <button
                  className={`nav-link w-100 rounded-0 border-0 ${activeTab === 'login' ? 'active' : ''}`}
                  onClick={() => handleTabChange('login')}
                  style={{
                    borderBottom: activeTab === 'login' ? '2px solid #6c757d' : '1px solid #dee2e6',
                    backgroundColor: 'transparent',
                    color: activeTab === 'login' ? '#fff' : '#6c757d'
                  }}
                >
                  Login
                </button>
              </li>
              <li className="nav-item w-50">
                <button
                  className={`nav-link w-100 rounded-0 border-0 ${activeTab === 'signup' ? 'active' : ''}`}
                  onClick={() => handleTabChange('signup')}
                  style={{
                    borderBottom: activeTab === 'signup' ? '2px solid #6c757d' : '1px solid #dee2e6',
                    backgroundColor: 'transparent',
                    color: activeTab === 'signup' ? '#fff' : '#6c757d'
                  }}
                >
                  Sign Up
                </button>
              </li>
            </ul>
            <button 
              type="button" 
              className="btn-close btn-close-white position-absolute top-0 end-0 m-3" 
              onClick={() => {
                if (bsModalRef.current) {
                  bsModalRef.current.hide();
                }
              }}
            />
          </div>
          <div className="modal-body p-0">
            {activeTab === 'login' ? (
              <CustomerLogin onSuccess={() => {
                if (bsModalRef.current) {
                  bsModalRef.current.hide();
                }
              }} />
            ) : (
              <CustomerSignup onSuccess={() => {
                handleTabChange('login');
              }} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};