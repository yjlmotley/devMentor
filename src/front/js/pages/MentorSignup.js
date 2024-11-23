import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import { Link } from "react-router-dom";
import PhoneInput from 'react-phone-input-2'
import { ValidateEmail, ValidateFirstName, ValidateLastName, ValidatePassword, ValidateCity, ValidatePhone, ValidateWhatState, ValidateCountry } from "../component/Validators";
import Select from 'react-select';
import CreatableSelect from "react-select/creatable";
import { stateOptions, countryOptions } from "../store/data";


export const MentorSignup = ({ onSuccess, switchToLogin }) => {
    const { actions } = useContext(Context);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [first_name, setFirst_name] = useState("");
    const [last_name, setLast_name] = useState("");
    const [phone, setPhone] = useState("");
    const [city, setCity] = useState("");
    const [what_state, setWhat_state] = useState("");
    const [country, setCountry] = useState("");
    const [countryCode, setCountryCode] = useState("us");
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
        let isCityValid = ValidateCity(city, setInvalidItems);
        let isWhatStateValid = ValidateWhatState(what_state, setInvalidItems);
        let isCountryValid = ValidateCountry(country, setInvalidItems);
        let isPhoneValid = ValidatePhone(phone, countryCode, setInvalidItems);

        if (isEmailValid && isFirstNameValid && isLastNameValid && isPasswordValid && isCityValid && isWhatStateValid && isCountryValid && isPhoneValid) {

            const result = await actions.signUpMentor({
                email, password, first_name, last_name, phone, city, what_state, country
            });

            if (result.success) {
                setEmail("");
                setPassword("");
                setConfirmPassword();
                setFirst_name("");
                setLast_name("");
                setPhone("");
                setCountry("");
                setWhat_state("");
                setCity("");

                if (typeof onSuccess === 'function') {
                    // console.log("Calling onSucess from MentorSignUp");
                    onSuccess();
                }

                setTimeout(() => {
                    alert(result.message || "Account successfully created! Please log in.");
                }, 100)
            } else {
                alert(result.message || "An error occurred during signup");
            }
        }
    }

    const handleCountryChange = (selectedOption) => {
        setCountry(selectedOption ? selectedOption.label : '');
    };

    const handleStateChange = (selectedOption) => {
        setWhat_state(selectedOption ? selectedOption.value : '');
    };

    const handlePhoneChange = (value, countryData) => {
        setPhone(value);
        setCountryCode(countryData?.countryCode || "us");

        // comment out the bottom 4 lines if you do not want to see the phone error before form submission
        // const isPhoneValid = ValidatePhone(value, countryCode, setInvalidItems);
        // if (isPhoneValid) {
        //     setInvalidItems(prevInvalidItems => prevInvalidItems.filter(item => item !== "phone"));
        // }
    };


    return (

        <form onSubmit={handleSignup}>
            <div className="row justify-content-center authDiv">
                <div className="col-12 text-light" >
                    <h2 className="text-center mt-2 mb-4">Welcome Mentors!</h2>

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
                        {invalidItems.includes("email") &&
                            <div className="invalid-feedback">Invalid email format (e.g.: example@domain.com)</div>
                        }
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
                        {invalidItems.includes("password") &&
                            <div className="invalid-feedback">Password must be 5-20 characters.</div>
                        }
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
                        {invalidItems.includes("password") &&
                            <div className="invalid-feedback">Password must be 5-20 characters.</div>
                        }
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

                    <div className="mb-3">
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

                    <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                        <Select
                            isClearable
                            name="country"
                            options={countryOptions}
                            className={`basic-single-select ${invalidItems.includes("country") ? "is-invalid" : ""}`}
                            classNamePrefix="select"
                            onChange={handleCountryChange}
                            defaultValue={countryOptions[195]}
                            value={country ? { label: country, value: country } : ''}
                            placeholder="Select a Country..."
                            required
                        />
                        {invalidItems.includes("country") && (
                            <div className="invalid-feedback">Country is required. Must be between 2 - 80 characters.</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <CreatableSelect
                            isClearable
                            name="what_state"
                            options={country === "United States of America (USA)" ? stateOptions : []}
                            className="basic-single-select"
                            classNamePrefix="select"
                            onChange={handleStateChange}
                            value={what_state ? { value: what_state, label: what_state } : ''}
                            placeholder="Select or Type a State/ Providence..."
                        />
                        {invalidItems.includes("what_state") && (
                            <div className="invalid-feedback">State/Providence is required. Must be between 2-80 characters.</div>
                        )}
                    </div>

                    <div className="mb-3">
                        <input
                            type="city"
                            className={`form-control bg-dark text-light ${invalidItems.includes("city") ? "is-invalid" : ""}`}
                            style={{
                                border: invalidItems.includes("city") ? '1px solid red' : '1px solid #414549',
                                padding: '12px'
                            }}
                            placeholder="City"
                            value={city}
                            onChange={(event) => setCity(event.target.value)}
                            required
                        />
                        {invalidItems.includes("city") && (
                            <div className="invalid-feedback">City is required. Must be between 2 - 80 characters..</div>
                        )}
                    </div>

                    {/* TODO: The button's active/focused styling needs to be addressed (also check MentorLogin, CustomerSignup, CustomerLogin, Forgot/Reset/Change Password pages) */}
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
                            onClick={handleSignup}

                        >
                            Submit
                        </button>
                    </div>
                    <div>
                        <Link to='/mentor-login' className="mentor-login-link">Already have an account?</Link>
                    </div>
                </div>
            </div>
        </form>
    );
}

// TODO: When first going to the page, the user is taken straight to the phone number. Please fix this bug so that the user is taken to the top of the page on window.onload