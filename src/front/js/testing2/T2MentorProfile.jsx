import React from "react";
import "./t2mentorProfile.css";
import paperPng from "./paper.png";

const T2MentorProfile = () => {

    return (
        <div className="container">
            <div className="main-div position-relative">
                <div className="position-absolute top-0 start-50 translate-middle-x mt-1" >
                    <img src="https://via.placeholder.com/350" alt="Profile" className="img-fluid rounded-circle" />
                </div>
                <div className="row">
                    {/* left side of the page begins here */}
                    <div className="col-6 left-side" style={{ paddingTop: '275px' }}>
                        <h1 className="fw-bold double-underline">Portfolio Pictures</h1>
                        <div id="paper" className="mt-5" style={{ opacity: '50%', width: '73%', height: '100%', border: '3px solid black', backgroundImage: `url(${paperPng})`, backgroundRepeat: 'repeat'}}>

                        </div>
                    </div>

                    {/* right side of the page begins here */}
                    <div className="col-6 right-side text-end" style={{ paddingTop: '275px' }}>
                        <div className="ms-auto" style={{ width: '73%'}}>
                            <h1 className="fw-bold double-underline">Yeju Lee Motley</h1>
                            <h2 className="mt-5">'NickName'</h2>
                            <h2>email@testing.com</h2>
                            <h2>(123) 456-7890</h2>
                            <h2>City, Statehere</h2>
                            <h2>Country!==USA</h2>
                            <h2> 0 years exp.</h2>
                            <h2>Mon AM & PM</h2>
                            <h2>Tues PM</h2>
                            <h2>$20/ hr</h2>
                            <h5 className="mt-5">Aboue me text is going to go here for as much as is ehre. I like to dance, and sing. I like to travel and look at all the riches ofthe world. I want to experience all the pleasure and joys of life and hopefully live on foever through memories and advances. Leave a legacy.</h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default T2MentorProfile;