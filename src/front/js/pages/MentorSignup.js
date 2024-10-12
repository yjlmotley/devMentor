import React, { useContext, useState, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate, Link } from "react-router-dom";
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { ValidateEmail, ValidateFirstName, ValidateLastName, ValidatePassword, ValidateCity, ValidatePhone, ValidateWhatState, ValidateCountry } from "../component/Validators";
import Select from 'react-select';
import CreatableSelect from "react-select/creatable";
import { stateOptions, countryOptions } from "../store/data";


export const MentorSignup = () => {
    const navigate = useNavigate();
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

    const handleSignup = async () => {
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
            const success = await actions.signUpMentor({
                email: email,
                password: password,
                first_name: first_name,
                last_name: last_name,
                phone: phone,
                city: city,
                what_state: what_state,
                country: country
            });
            if (success) {
                navigate("/mentor-login");
            } else {
                alert("something went wrong");
            }
        } else {
            console.log("Invalid inputs:", invalidItems);

        }
    }

    const handleCountryChange = (selectedOption) => {
        setCountry(selectedOption ? selectedOption.label : '');
    };

    const handleStateChange = (selectedOption) => {
        setWhat_state(selectedOption ? selectedOption.value : '');
    };

    const handlePhoneChange = (value, countryData) => {
        const countryCode = countryData?.countryCode || "us";
        setCountryCode(countryData?.countryCode || "us");

        setPhone(value);

        // comment out the bottom 4 lines if you do not want to see the phone error before form submission
        const isPhoneValid = ValidatePhone(value, countryCode, setInvalidItems);
        if (isPhoneValid) {
            setInvalidItems(prevInvalidItems => prevInvalidItems.filter(item => item !== "phone"));
        }
    };


    return (

        <form onSubmit={(event) => {
            event.preventDefault();
            handleSignup();
        }}>
            <div style={{ width: '100%', maxWidth: '1000px', margin: '30px auto', padding: '30px', backgroundColor: '#2b2a2a', borderRadius: '10px', boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)', textAlign: 'center' }}>
                <div className="row justify-content-center">
                    <div className="col-md-6 pb-5 text-light authDiv" >
                        <div style={{ padding: '20px', borderRadius: '10px', boxShadow: '0px 0px 50px rgba(255, 255, 255, 0.2)', border: '1px solid white' }}>
                            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Welcome Mentors!</h2>
                            <div style={{ marginBottom: '20px' }}>
                                <input
                                    type="email"
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }}
                                    placeholder="Email"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                />
                                {invalidItems.includes("email") && <label className="error-label">Invalid email format (must be similar to this example: example@domain.com)</label>}
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
                                {invalidItems.includes("password") && <label className="error-label">Invalid Password format. Must be between 5 and 20 characters.</label>}
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <input
                                    type="password"
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }}
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(event) => setConfirmPassword(event.target.value)}
                                    required
                                />
                                {invalidItems.includes("password") && <label className="error-label">Invalid Password format. Must be between 5 and 20 characters.</label>}
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <input
                                    type="first_name"
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }}
                                    placeholder="First Name"
                                    value={first_name}
                                    onChange={(event) => setFirst_name(event.target.value)}
                                    required
                                />
                                {invalidItems.includes("first_name") && <label className="error-label">First Name is required. Must be between 2 - 25 characters.</label>}
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <input
                                    type="last_name"
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }}
                                    placeholder="Last Name"
                                    value={last_name}
                                    onChange={(event) => setLast_name(event.target.value)}
                                    required
                                />
                                {invalidItems.includes("last_name") && <label className="error-label">Last Name is required. Must be between 2 - 25 characters.</label>}
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <PhoneInput
                                    country={'us'}
                                    value={phone}
                                    onChange={handlePhoneChange}
                                    inputClass="form-control"
                                    inputStyle={{
                                        width: '100%'
                                    }}
                                    inputProps={{
                                        name: 'phone',
                                        required: true,
                                        autoFocus: true
                                    }}
                                    required
                                />
                                {invalidItems.includes("phone") && <label className="error-label">Invalid phone format. Please put in a valid phone number.</label>}
                            </div>
                            <div style={{ marginBottom: '20px', textAlign: 'center' }}>
                                <Select
                                    isClearable
                                    name="country"
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }}
                                    styles={{
                                        menu: (baseStyles, state) => ({
                                            ...baseStyles,
                                            color: 'black',
                                        }),
                                    }}
                                    options={countryOptions}
                                    className="basic-single-select"
                                    classNamePrefix="select"
                                    onChange={handleCountryChange}
                                    defaultValue={countryOptions[195]}
                                    value={
                                        country
                                            ? { label: country, value: country }
                                            : ''
                                    }
                                    placeholder="Select a Country..."
                                    required
                                />
                                {invalidItems.includes("country") && <label className="error-label">Country is required</label>}
                            </div>
                            <div style={{ marginBottom: '20px' }}>
                                <CreatableSelect
                                    isClearable
                                    name="what_state"
                                    styles={{
                                        menu: (baseStyles, state) => ({
                                            ...baseStyles,
                                            color: 'black',
                                        }),
                                    }}
                                    options={country === "United States of America (USA)" ? stateOptions : []}
                                    className="basic-single-select"
                                    classNamePrefix="select"
                                    onChange={handleStateChange}
                                    value={
                                        what_state
                                            ? { value: what_state, label: what_state }
                                            : ''
                                    }
                                    placeholder="Select or Type a State/ Providence..."
                                />
                                {invalidItems.includes("what_state") && <label className="error-label">State/Providence is required. Must be between 2-80 characters.</label>}
                            </div>



                            <div style={{ marginBottom: '20px' }}>
                                <input
                                    type="city"
                                    style={{ width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ced4da' }}
                                    placeholder="City"
                                    value={city}
                                    onChange={(event) => setCity(event.target.value)}
                                    required
                                />
                                {invalidItems.includes("city") && <label className="error-label">City is required. Must be between 2 - 80 characters.</label>}
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
                </div>
            </div>
        </form>
    );
}

// TODO: When first going to the page, the user is taken straight to the phone number. Please fix this bug so that the user is taken to the top of the page on window.onload