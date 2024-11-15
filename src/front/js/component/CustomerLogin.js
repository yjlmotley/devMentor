import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link, useNavigate } from "react-router-dom";
import { ValidateEmail, ValidatePassword } from "./Validators"; // Ensure path is correct

export const CustomerLogin = ({ onSuccess }) => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [invalidItems, setInvalidItems] = useState([]);
    const navigate = useNavigate();

    const handleLogin = async () => {
        // Reset invalid items before validation
        setInvalidItems([]);
        const isEmailValid = ValidateEmail(email, setInvalidItems);
        const isPasswordValid = ValidatePassword(password, setInvalidItems);

        // Proceed if validations pass
        if (isEmailValid && isPasswordValid) {
            const success = await actions.logInCustomer({ email, password });
            if (success) {
                if (onSuccess) onSuccess();
                navigate("/customer-dashboard");
            } else {
                alert("Email and or password incorrect");
            }
        }
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
        }}>
            <div className="row justify-content-center">
                <div className="col-12 text-light authDiv">
                    <h2 className="text-center mt-2 mb-4">Welcome Back!</h2>
                    <div className="mb-3">
                        <input
                            type="email"
                            className={`form-control bg-dark text-light ${invalidItems.includes("email") ? 'is-valid' : ''}`}
                            style={{
                                border: invalidItems.includes("email") ? '1px solid red' : '1px solid #414549',
                                padding: '12px'
                            }}
                            placeholder="Email"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                        {invalidItems.includes("email") && (
                            <p className="invalid-feedback">Invalid email format</p>
                        )}
                    </div>
                    <div>
                        <input
                            type="password"
                            className={`form-control bg-dark text-light ${invalidItems.includes("password") ? 'is-invalid' : ''}`}
                            style={{
                                border: invalidItems.includes("password") ? '1px solid red' : '1px solid #414549',
                                padding: '12px'
                            }}
                            placeholder="Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
                            required
                        />
                        {invalidItems.includes("password") && (
                            <div className="invalid-feedback">Password must be 5-20 characters</div>
                        )}
                        <Link to='/forgot-password' className="text-secondary auth-link small-font">Forgot Password?</Link>
                    </div>
                    <div className="text-center mt-3 mb-4">
                        <button
                            type="submit"
                            className="btn btn-secondary w-100 py-2"
                            style={{
                                backgroundColor: '#6c757d',
                                border: 'none',
                                boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                                transition: 'all 0.3s ease',
                            }}
                        >
                            Login
                        </button>
                    </div>
                    {/* <div>
                        <Link to='/forgot-password' className="forgot-password-link">Forgot Password?</Link>
                    </div> */}
                    <div className="text-center text-secondary small-font">
                        Need to create an account?
                        <Link to='/customer-signup' className="ms-1 text-secondary auth-link">
                            Sign up
                        </Link>
                    </div>
                </div>
            </div>
        </form>
    );
};
