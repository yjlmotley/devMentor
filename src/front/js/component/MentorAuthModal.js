import React, { useState, useEffect, useRef } from 'react';
import { MentorLogin } from "./MentorLogin.js";
import { MentorSignup } from "../pages/MentorSignup.js";
import { ForgotPsModal } from './ForgotPsModal.js';
import "../../styles/auth.css";


export const MentorAuthModal = ({ initialTab = 'login', show, onHide }) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const [showForgotPs, setShowForgotPs] = useState(false);
    const modalRef = useRef(null);
    const bsModalRef = useRef(null);

    useEffect(() => {
        if (modalRef.current && !bsModalRef.current && window.bootstrap) {
            bsModalRef.current = new window.bootstrap.Modal(modalRef.current, {
                keyboard: false,
            });

            modalRef.current.addEventListener('hidden.bs.modal', () => {
                if (onHide) onHide();
            });
        }

        return () => {
            if (bsModalRef.current) {
                bsModalRef.current.dispose();
            }
        };
    }, []);

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
        setActiveTab('login');
    }

    const handleSwitchLogin = () => {
        setActiveTab('login');
    }

    const handleSwitchSignUp = () => {
        setActiveTab('signup');
    }

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div
            className="modal fade auth"
            id="mentorAuthModal"
            tabIndex="-1"
            aria-hidden="true"
            ref={modalRef}
        >
            <div className="modal-dialog modal-dialog-centered">
                {/* <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable"> */}
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
                            </div>
                            <div className="modal-body p-4">
                                {activeTab === 'login' ? (
                                    <MentorLogin
                                        onSuccess={() => {
                                            if (bsModalRef.current) {
                                                bsModalRef.current.hide();
                                            }
                                        }}
                                        switchToSignUp={handleSwitchSignUp}
                                        onForgotPs={() => setShowForgotPs(true)}
                                    />
                                ) : (
                                    <MentorSignup onSuccess={handleSignupSuccess} switchToLogin={handleSwitchLogin} />
                                )}
                            </div>
                        </>
                    ) : (
                        <ForgotPsModal
                            onClose={() => setShowForgotPs(false)}
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