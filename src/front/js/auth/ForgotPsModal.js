import React, { useState } from "react";


export const ForgotPsModal = ({ onClose, switchToLogin }) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(process.env.BACKEND_URL + "/api/forgot-password", {
                method: "POST",
                headers: { 'Content-Type': "application/json" },
                body: JSON.stringify({ email: email.toLowerCase() })
            });

            if (response.ok) {
                alert("An email has been sent to reset your password. If you do not see the email from devMentor in your inbox, please check your spam/junk folder.");
                // onSuccess(); // This will close the forgot password modal and show the login modal
                switchToLogin();
            } else {
                const data = await response.json();
                setError(data.message || "Something went wrong.");
            }
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <>
            <div className="modal-header border-0 p-0">
                <button
                    type="button"
                    className="btn-close btn-close-white position-absolute top-0 end-0 m-1"
                    onClick={onClose}
                />
            </div>
            <div className="authDiv modal-body p-4">
                <h2 className="text-light text-center mt-2 mb-4">Forgot Password</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <input
                            type="email"
                            className="form-control bg-dark text-light"
                            style={{
                                border: '1px solid #414549',
                                padding: '12px'
                            }}
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    {error && (
                        <div className="text-danger mb-3">{error}</div>
                    )}
                    <div className="text-center mt-3 mb-4">
                        <button
                            type="submit"
                            className="btn btn-secondary w-100 py-2"
                            style={{
                                backgroundColor: '#6c757d',
                                border: 'none',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                                transition: 'box-shadow 0.3s ease',
                            }}
                        >
                            Submit
                        </button>
                    </div>
                    <div className="text-center text-secondary small-font">
                        <span
                            onClick={switchToLogin}
                            className="ms-1 text-secondary auth-link"
                        >
                            Back to Login
                        </span>
                    </div>
                </form>
            </div>
        </>
    );
};