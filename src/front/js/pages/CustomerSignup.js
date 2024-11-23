import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { ValidateEmail, ValidateFirstName, ValidateLastName, ValidatePassword, ValidatePhone, } from "../component/Validators";


export const CustomerSignup = ({ onSuccess, switchToLogin }) => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [countryCode, setCountryCode] = useState("us");
    const [phone, setPhone] = useState("");
    const [invalidItems, setInvalidItems] = useState([]);

    const handleSignup = async (e) => {
        if (e) e.preventDefault();

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        setInvalidItems([]);
        let isEmailValid = ValidateEmail(email, setInvalidItems);
        let isFirstNameValid = ValidateFirstName(first_name, setInvalidItems);
        let isLastNameValid = ValidateLastName(last_name, setInvalidItems);
        let isPasswordValid = ValidatePassword(password, setInvalidItems);
        let isPhoneValid = ValidatePhone(phone, countryCode, setInvalidItems);

        if (isEmailValid && isFirstNameValid && isLastNameValid && isPasswordValid && isPhoneValid) {
            try {
                const result = await actions.signUpCustomer({
                    email, password, first_name, last_name, phone,
                });

                if (result.success) {
                    setEmail("");
                    setPassword("");
                    setConfirmPassword("");
                    setFirst_name("");
                    setLast_name("");
                    setPhone("");

                    if (typeof onSuccess === 'function') {
                        // console.log("Calling onSuccess from CustomerSignUp");
                        onSuccess();
                    }

                    setTimeout(() => {
                        alert(result.message || "Account successfully created! Please log in.");
                    }, 100)

                } else {
                    alert(result.message || "An error occurred during signup");
                }
            } catch (error) {
                console.error("Signup error:", error);
                alert("An unexpected error occurred. Please try again.");
            }
        }
    }

    const handlePhoneChange = (value, countryData) => {
        setPhone(value);
        setCountryCode(countryData?.countryCode || "us");

        // uncomment the next 4 lines if you want to see the validation as the user is typing
        //     const isPhoneValid = ValidatePhone(value, countryCode, setInvalidItems);
        //     if (isPhoneValid) {
        //         setInvalidItems(prevInvalidItems => prevInvalidItems.filter(item => item !== "phone"));
        //     }
    };


    return (

        <form onSubmit={handleSignup}>
            <div className="row justify-content-center authDiv">
                <div className="col-12 text-light">
                    <h2 className="text-center mt-2 mb-4">Welcome!</h2>

                    <div className="mb-3">
                        <input
                            type="email"
                            className={`form-control bg-dark text-light ${invalidItems.includes("email") ? "is-invalid" : ""}`}
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
                            <div className="invalid-feedback">Invalid email format (e.g.: example@domain.com)</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <input
                            type="password"
                            className={`form-control bg-dark text-light ${invalidItems.includes("password") ? "is-invalid" : ""}`}
                            style={{
                                border: invalidItems.includes("password") ? '1px solid red' : '1px solid #414549',
                                padding: '12px'
                            }}
                            placeholder="Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
                            required
                        />
                        {invalidItems.includes("password") && (
                            <div className="invalid-feedback">Password must be 5-20 characters</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <input
                            type="password"
                            className={`form-control bg-dark text-light ${invalidItems.includes("password") ? "is-invalid" : ""}`}
                            style={{
                                border: invalidItems.includes("password") ? '1px solid red' : '1px solid #414549',
                                padding: '12px'
                            }}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)}
                            required
                        />
                        {invalidItems.includes("password") && (
                            <div className="invalid-feedback">Password must be 5-20 characters</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <input
                            type="first_name"
                            className={`form-control bg-dark text-light ${invalidItems.includes("first_name") ? "is-invalid" : ""}`}
                            style={{
                                border: invalidItems.includes("first_name") ? '1px solid red' : '1px solid #414549',
                                padding: '12px'
                            }}
                            placeholder="First Name"
                            value={first_name}
                            onChange={(event) => setFirst_name(event.target.value)}
                            required
                        />
                        {invalidItems.includes("first_name") && (
                            <div className="invalid-feedback">First Name is required. Must be between 2 - 25 characters.</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <input
                            type="last_name"
                            className={`form-control bg-dark text-light ${invalidItems.includes("last_name") ? "is-invalid" : ""}`}
                            style={{
                                border: invalidItems.includes("last_name") ? '1px solid red' : '1px solid #414549',
                                padding: '12px'
                            }}
                            placeholder="Last Name"
                            value={last_name}
                            onChange={(event) => setLast_name(event.target.value)}
                            required
                        />
                        {invalidItems.includes("last_name") && (
                            <div className="invalid-feedback">Last Name is required. Must be between 2 - 25 characters.</div>
                        )}
                    </div>

                    <div className="mb-3 position-relative">
                        <PhoneInput
                            country={'us'}
                            value={phone}
                            onChange={handlePhoneChange}
                            inputClass={`form-control ${invalidItems.includes("phone") ? "is-invalid" : ""}`}
                            inputStyle={{
                                width: '100%',
                                backgroundColor: "#212529",
                                color: 'white',
                                border: invalidItems.includes("phone") ? '1px solid red' : '1px solid #414549',
                                height: '50px',
                            }}
                            containerStyle={{
                                width: '100%',
                                marginBottom: invalidItems.includes("phone") ? '24px' : '0'
                            }}
                            buttonStyle={{
                                backgroundColor: "#212529",
                                border: invalidItems.includes("phone") ? '1px solid red' : '1px solid #414549'
                            }}
                            dropdownStyle={{
                                backgroundColor: "#212529",
                                color: 'white'
                            }}
                            required
                        />
                        {invalidItems.includes("phone") && (
                            <div
                                className="invalid-feedback d-block"
                                style={{
                                    position: 'absolute',
                                    bottom: '-25px',
                                    left: '0'
                                }}
                            >
                                Invalid phone number
                            </div>
                        )}
                    </div>

                    <div className={`text-center mb-4 ${invalidItems.includes("phone") ? "mt-5" : "mt-4"}`}>
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
                            Sign Up
                        </button>
                    </div>

                    <div className="text-center text-secondary small-font">
                        Already have an account?
                        <span
                            onClick={() => {
                                switchToLogin();
                            }}
                            className="ms-1 text-secondary auth-link"
                        >
                            Login
                        </span>
                    </div>
                </div>
            </div>
        </form>
    );
}