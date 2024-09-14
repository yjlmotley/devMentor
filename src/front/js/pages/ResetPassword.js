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

                if (response.status === 200) {
                    alert("You have successfully reset your password. Please log in.");
                    navigate('/login');
                } else if (response.status === 400) {
                    const data = await response.json();
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

// import React, { useState } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom"


// export const ResetPassword = () => {
//     const [ error, setErrMsg ] = useState('');
//     const [ password, setPassword ] = useState('');
//     const [ confirmPassword, setConfirmPassword ] = useState('');
//     const [ searchParams, setSearchParams ] = useSearchParams();
//     let token = searchParams.get("token");
//     // get user type here
//     const navigate = useNavigate();


//     async function handleSubmit(event) {
//         event.preventDefault();

//         if (password === confirmPassword) {
//             fetch(`${process.env.BACKEND_URL}/api/reset-password/${token}`, {
//                 method: "PUT",
//                 headers: { 'Content-Type': "application/json" },
//                 body: JSON.stringify({
//                     // email: email,
//                     // password: password,
//                     password
//                     // secret: token
//                 })
//             }).then(response => {
//                 if (response.status === 200) {
//                     console.log("response", response.message)
//                     alert("You have successfully reset your password. Please log in.")
//                     // use user type to determine where to navigate to
//                     navigate('/login')
//                 } else if (response.status === 400) {
//                     return response.json().then(data => {
//                         throw new Error(data.message || "Password is not provided");
//                     });
//                 } else {
//                     throw new Error("Something went wrong with the server.");
//                 }
//             }).catch(error => {
//                 setErrMsg(error.message);
//             });
//         } else {
//             setErrMsg("Passwords do not match");
//         }
//     }

//     return (
//         <div className="container">
//             <form onSubmit={handleSubmit}>
//                 <div>
//                     <h1 className="text-center mt-5">Reset Password</h1>
//                     <div className="mb-3">
//                         <label className="form-label" htmlFor="password">New Password</label>
//                         <input onChange={(e) => {
//                             setPassword(e.target.value)
//                         }} className="form-control" id="password" type="password" placeholder="new password" />
//                     </div>
//                     <div className="mb-3">
//                         <label className="form-label" htmlFor="confirm_password">Confirm New Password</label>
//                         <input onChange={(e) => {
//                             setConfirmPassword(e.target.value)
//                         }} className="form-control" id="confirm_password" type="password" placeholder="please confirm your new password" />
//                     </div>
//                 </div>
//                 <div className="col-auto">
//                     {error && error.length && <div className="alert alert-danger" role="alert">{error}</div>}
//                     <button type="submit" className="btn btn-dark my-4">Submit</button>
//                 </div>
//             </form>
//         </div>
//     );
// };