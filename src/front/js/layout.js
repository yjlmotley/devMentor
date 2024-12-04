import React, { useEffect, useContext } from "react";
import { Context } from "./store/appContext";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/Home";
import injectContext from "./store/appContext";

// import ResetPsModal from './auth/ResetPsModal.js';
import { Navbar } from "./component/Navbar.js";
import { MentorDashboard } from "./pages/MentorDashboard";
import { MentorProfile } from "./pages/MentorProfile";
import { MentorSessionBoard } from "./pages/MentorSessionBoard";
import { MentorList } from "./pages/MentorList.js";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { CreateSession } from "./pages/CreateSession";
import { CreateInstantSession } from "./pages/CreateInstantSession.js";
import { EditSession } from "./pages/EditSession";

import PaymentsPayouts from "./pages/PaymentsPayouts.js";

// import { Footer } from "./component/footer";


//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if (!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL />;

    const { store, actions } = useContext(Context);

    //useEffect to handle token exp. instances
    useEffect(() => {
        if (store.token) {
            actions.getCurrentUser();
        }

        const interval = setInterval(() => {
            if (store.token) {
                actions.getCurrentUser();
            } else {
                // Handle no token case
                console.log('User not authenticated');
            }
            // actions.getCurrentUser()
        }, 60000);

        // Cleanup function
        return () => clearInterval(interval);
    }, [store.token]);

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<MentorProfile />} path="/mentor-profile" />
                        <Route element={<MentorDashboard />} path="/mentor-dashboard" />
                        <Route element={<MentorSessionBoard />} path="/mentor-session-board" />
                        <Route element={<MentorList />} path="/mentor-list" />
                        <Route element={<CustomerDashboard />} path="/customer-dashboard" />
                        <Route element={<CreateSession />} path="/create-session" />
                        <Route element={<CreateInstantSession />} path="/create-instant-session/:mentorId" />
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
                    {/* <ResetPsModal /> */}
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
