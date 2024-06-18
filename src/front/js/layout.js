import React from "react";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import ScrollToTop from "./component/scrollToTop";
import { BackendURL } from "./component/backendURL";

import { Home } from "./pages/Home";
import { MentorDashboard } from "./pages/MentorDashboard";
import { CustomerDashboard } from "./pages/CustomerDashboard";
import { MentorProfile } from "./pages/MentorProfile";
import { MentorSessionBoard } from "./pages/MentorSessionBoard";
import { CreateSession } from "./pages/CreateSession";
import { Demo } from "./pages/demo";
import { Single } from "./pages/single";
import injectContext from "./store/appContext";

import { Navbar } from "./component/navbar";
import { Footer } from "./component/footer";

//create your first component
const Layout = () => {
    //the basename is used when your project is published in a subdirectory and not in the root of the domain
    // you can set the basename on the .env file located at the root of this project, E.g: BASENAME=/react-hello-webapp/
    const basename = process.env.BASENAME || "";

    if(!process.env.BACKEND_URL || process.env.BACKEND_URL == "") return <BackendURL/ >;

    return (
        <div>
            <BrowserRouter basename={basename}>
                <ScrollToTop>
                    <Navbar />
                    <Routes>
                        <Route element={<Home />} path="/" />
                        <Route element={<MentorDashboard />} path="/mentor-dashboard" />
                        <Route element={<CustomerDashboard />} path="/customer-dashboard" />
                        <Route element={<MentorProfile />} path="/mentor-profile" />
                        <Route element={<MentorSessionBoard />} path="/mentor-session-board" />
                        <Route element={<CreateSession />} path="/create-session" />
                        <Route element={<Demo />} path="/demo" />
                        <Route element={<Single />} path="/single/:theid" />
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
                    <Footer />
                </ScrollToTop>
            </BrowserRouter>
        </div>
    );
};

export default injectContext(Layout);
