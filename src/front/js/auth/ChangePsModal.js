import React, { useState, useEffect } from "react";
import "../../styles/auth.css";


export const ChangePsModal = ({ onHide }) => {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        // Initialize the Bootstrap modal
        const modalElement = document.getElementById('changePsModal');
        const bsModal = new bootstrap.Modal(modalElement, {
            keyboard: true,
            backdrop: true
        });

        bsModal.show();

        // Add event listener for hidden.bs.modal
        modalElement.addEventListener('hidden.bs.modal', onHide);

        return () => {
            bsModal.hide();
            modalElement.removeEventListener('hidden.bs.modal', onHide);
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match. Please try again.");
            return;
        }

        try {
            const resp = await fetch(`${process.env.BACKEND_URL}/api/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("token")
                },
                body: JSON.stringify({ password })
            });
            if (resp.ok) {
                alert("Password successfully changed.");
                onHide();
            } else {
                const data = await resp.json();
                setError("data.message" || "Something went wrong");
            }
        } catch (error) {
            setError(error.message);
        }
    }

    return (
        <div
            id="changePsModal"
            className="modal show fade d-block auth authDiv"
            tabIndex="-1"
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content bg-dark" style={{ boxShadow: '0 0 30px rgba(0, 0, 0, 0.7)' }}>
                    <div className="modal-header border-0 p-0">
                        <button
                            type="button"
                            className="btn-close btn-close-white position-absolute top-0 end-0 m-1"
                            onClick={onHide}
                            aria-label="Close"
                        />
                    </div>

                    <div className="modal-body pt-0 p-4">
                        <h2 className="modal-title text-light text-center mt-5 mb-4">Change Password</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <input
                                    type="password"
                                    className={`form-control bg-dark text-light ${error ? "is-invalid" : ""}`}
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
                                    className={`form-control bg-dark text-light ${error ? "is-invalid" : ""}`}
                                    style={{
                                        border: '1px solid #414549',
                                        padding: '12px'
                                    }}
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="text-center mt-5 mb-3">
                                <button type="submit" className="btn btn-secondary w-100 py-2">
                                    Change Password
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}