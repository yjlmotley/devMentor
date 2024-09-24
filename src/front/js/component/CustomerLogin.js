import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";

export const CustomerLogin = () => {
    const navigate = useNavigate();
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async () => {
        const success = await actions.logInCustomer({ email, password });
        if (success) {
            navigate("/customer-dashboard");
        } else {
            alert("Something went wrong, please try again");
        }
    };

    return (
        <form onSubmit={(event) => {
            event.preventDefault();
            handleLogin();
        }}>
            <div style={{ width: '100%', maxWidth: '1000px', margin: '30px auto', padding: '30px', backgroundColor: '#2b2a2a', borderRadius: '10px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)', textAlign: 'center' }}>
                <div className="row justify-content-center">
                    <div className="col-md-6 pb-5 text-light authDiv" >
                        <div style={{ padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 50px rgba(255, 255, 255, 0.2)', border: '1px solid white' }}>
                            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Welcome Back!</h2>
                            <div style={{ marginBottom: '20px' }}>
                                <input
                                    type="email"
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }}
                                    placeholder="Email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <input
                                    type="password"
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                            </div>
                            <div style={{ textAlign: 'center' }}>
                                <button
                                    type="button"
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
                                    onClick={handleLogin}
                                >
                                    Login
                                </button>
                            </div>
                            <div>
                                <Link to='/forgot-password' className="forgot-password-link">Forgot Password?</Link>
                            </div>
                            <div>
                                <Link to='/customer-signup' className="customer-signup-link">Don't have an account?</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};