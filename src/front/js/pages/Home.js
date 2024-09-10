
import React, { useContext } from "react";
import { Context } from "../store/appContext";
import rigoImageUrl from "../../img/rigo-baby.jpg";
import "../../styles/home.css";


export const Home = () => {
	const { store, actions } = useContext(Context);

	return (
        <div className="homepage">
          <header className="container hero">
            <div className="container">
              <h1 className="header-background">Learn from the best. Find your mentor.</h1>
              <p className="lead header-background text-white">devMentor is the easiest way to connect with experienced developers for one-on-one mentorship. Whether you're new to coding or an experienced developer looking to level up, we'll help you find the perfect mentor.</p>
              <div className="search-container">
                <input type="text" placeholder="Search for a mentor" className="search-input" />
                <button className="search-button">Search</button>
              </div>
            </div>
          </header>
    
          <section className="why-devmentor">
            <div className="container">
              <h2>Why devMentor?</h2>
              <div className="row">
                <div className="col-md-4">
                  <div className="feature-card">
                    <img src="https://res.cloudinary.com/dufs8hbca/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1725933626/Saved/mentorSession1_gigjmn.jpg" alt="Learn by doing" className="feature-image" />
                    <h3>Learn by doing</h3>
                    <p>Work on real projects and learn by building things you care about.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="feature-card">
                    <img src="https://res.cloudinary.com/dufs8hbca/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1725933624/Saved/GroupMentorSessionElder1_ydoslt.jpg" alt="Real-world projects" className="feature-image" />
                    <h3>Real-world projects</h3>
                    <p>Get help with your personal coding projects from experienced developers.</p>
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="feature-card">
                    <img src="https://res.cloudinary.com/dufs8hbca/image/upload/w_1000,ar_16:9,c_fill,g_auto,e_sharpen/v1725935854/Saved/1on1MentorSession_vwg4jh.jpg" alt="Personalized learning" className="feature-image" />
                    <h3>Personalized learning</h3>
                    <p>Learn at your own pace with personalized guidance and feedback.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
    
          <section className="featured-mentors">
            <div className="container">
              <h2>Featured mentors</h2>
              <div className="mentor-stats">
                <div className="stat-item">
                  <h3>5,000</h3>
                  <p>Followers</p>
                </div>
                <div className="stat-item">
                  <h3>4,000</h3>
                  <p>Following</p>
                </div>
                <div className="stat-item">
                  <h3>3,000</h3>
                  <p>Posts</p>
                </div>
                <div className="stat-item">
                  <h3>2,000</h3>
                  <p>Reactions</p>
                </div>
                <div className="stat-item">
                  <h3>1,000</h3>
                  <p>Comments</p>
                </div>
              </div>
              <div className="mentor-profiles">
                <div className="mentor-profile">
                  <img src="https://res.cloudinary.com/dufs8hbca/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1725936902/Saved/JulieFace_vulxy2.jpg" alt="Jane Smith" className="mentor-image" />
                  <h3>Jane Smith</h3>
                  <p>New York, NY. Senior Frontend Developer. Passionate about education and helping others learn to code.</p>
                  <button className="follow-button">Follow</button>
                </div>
                <div className="mentor-profile">
                  <img src="https://res.cloudinary.com/dufs8hbca/image/upload/w_1000,ar_1:1,c_fill,g_auto,e_art:hokusai/v1725936923/Saved/aimepic_fudlb7.jpg" alt="John Doe" className="mentor-image" />
                  <h3>John Doe</h3>
                  <p>San Francisco, CA. Full-stack Developer. Experience mentoring junior developers and teaching coding bootcamps.</p>
                  <button className="follow-button">Follow</button>
                </div>
              </div>
            </div>
          </section>
        </div>
      );
};

