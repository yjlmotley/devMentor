import React, { useEffect, useContext } from "react";
import { Context } from "./store/appContext";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/Home";
import injectContext from "./store/appContext";

import { MentorSignup } from "./pages/MentorSignup";
import { MentorLogin } from "./component/MentorLogin";
import { MentorDashboard } from "./pages/MentorDashboard";
import { MentorProfile } from "./pages/MentorProfile";
import { MentorSessionBoard } from "./pages/MentorSessionBoard";

import { ForgotPassword } from "./pages/ForgotPassword.js";
import { ResetPassword } from "./pages/ResetPassword.js";
// import ResetPasswordModal from './component/ResetPasswordModal.js';


import { CustomerSignup } from "./pages/CustomerSignup.js";
import { CustomerLogin } from "./component/CustomerLogin";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { MentorList } from "./pages/MentorList.js";

import { CreateSession } from "./pages/CreateSession";
import { EditSession } from "./pages/EditSession";

import PaymentsPayouts from "./pages/PaymentsPayouts.js";

import { Navbar } from "./component/Navbar.js";
import { CreateInstantSession } from "./pages/CreateInstantSession.js";
// import { Footer } from "./component/footer";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    const { actions } = useContext(Context);
    
    useEffect(() => {
        setInterval(() => {
            actions.getCurrentUser()
        }, 60000)
    }, []);

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />

                        <Route element={<MentorSignup />} path="/mentor-signup" />
                        <Route element={<MentorLogin />} path="/mentor-login" />
                        <Route element={<MentorProfile />} path="/mentor-profile" />
                        <Route element={<MentorDashboard />} path="/mentor-dashboard" />
                        <Route element={<MentorSessionBoard />} path="/mentor-session-board" />
                        
                        <Route element={<ForgotPassword />} path="/forgot-password" />
                        {/* <Route element={<ForgotPassword />} path="/mentor-login/forgot-password" /> */}
                        {/* <Route element={<ForgotPassword />} path="/mentor-login/forgot-password/:userType" /> */}
                        <Route element={<ResetPassword />} path="/reset-password"/>

                        <Route element={<CustomerSignup />} path="/customer-signup" />
                        <Route element={<CustomerLogin />} path="/customer-login" />
                        <Route element={<CustomerDashboard />} path="/customer-dashboard" />
                        <Route element={<MentorList />} path="/mentor-list" />
                        
                        <Route element={<CreateSession />} path="/create-session" />
                        <Route  element={<CreateInstantSession />} path="/create-instant-session/:mentorId" />
                        <Route element={<EditSession />} path="edit-session/:sessionId" />

                        <Route element={<PaymentsPayouts />} path="payments-and-payouts" />

                        <Route 
                            path="*"
                            element={
                                <React.Fragment>
                                    <div className="notFoundDiv" style={{ textAlign: 'center' }}>
                                        <h1 className="mt-5">404 Not Found</h1>
                                        <Link to="/">
                                            <button className="btn btn-secondary my-4">Back home</button>
                                        </Link>
                                    </div>
                                </React.Fragment>
                            }
                        />
                    </Routes>
                    {/* <Footer /> */}
                    {/* <ResetPasswordModal /> */}
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
