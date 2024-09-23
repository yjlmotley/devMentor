import React, { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export const ResetPassword = () => {
    const [error, setErrMsg] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [searchParams] = useSearchParams();
    let token = searchParams.get("token");
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();

        if (password === confirmPassword) {
            try {
                const response = await fetch(`${process.env.BACKEND_URL}/api/reset-password/${token}`, {
                    method: "PUT",
                    headers: { 'Content-Type': "application/json" },
                    body: JSON.stringify({ password })
                });
                const data = await response.json();

                if (response.status === 200) {
                    alert("You have successfully reset your password. Please log in.");
                    if (data.role == "mentor") {
                        navigate('/mentor-login')
                    } else {
                        navigate('/customer-login')
                    }
                } else if (response.status === 400) {
                    throw new Error(data.message || "Password is not provided");
                } else {
                    throw new Error("Something went wrong with the server.");
                }
            } catch (error) {
                setErrMsg(error.message);
            }
        } else {
            setErrMsg("Passwords do not match");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div style={{ width: '100%', maxWidth: '1000px', margin: '30px auto', padding: '30px', backgroundColor: '#2b2a2a', borderRadius: '10px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)', textAlign: 'center' }}>
                <div className="row justify-content-center">
                    <div className="col-md-6 pb-5 text-light authDiv" >
                        <div style={{ padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 50px rgba(255, 255, 255, 0.2)', border: '1px solid white' }}>
                            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Reset Password</h2>
                            <div style={{ marginBottom: '20px' }}>
                                <input
                                    type="password"
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }}
                                    placeholder="New Password"
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <input
                                    type="password"
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }}
                                    placeholder="Confirm New Password"
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <div style={{ color: 'red', marginBottom: '20px' }}>{error}</div>}
                            <div style={{ textAlign: 'center' }}>
                                <button
                                    type="submit"
                                    style={{
                                        backgroundColor: '#6c757d',
                                        marginBottom: '10px',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: '5px',
                                        padding: '10px 20px',
                                        cursor: 'pointer',
                                        boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.2)',
                                        transition: 'box-shadow 0.3s ease',
                                        outline: 'none',
                                    }}
                                >
                                    Submit
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};


// If extra time: Instead of navigating to home after resetting the ps, link them to mentor-login or customer-login depending on who is resetting the email (feel free to add in their email up above for confirmation if possible)
