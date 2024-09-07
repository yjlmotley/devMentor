//import react into the bundle
import React from "react";
import ReactDOM from "react-dom";

//include your index.scss file into the bundle
import "../styles/index.css";

//import your own components
import Layout from "./layout";

//render your react application
// ReactDOM.render(<Layout />, document.querySelector("#app"));

const render = () => {
    ReactDOM.render(<Layout />, document.querySelector("#app"));
};

// Initial render
render();

// Hot Module Replacement (HMR) setup
if (module.hot) {
    module.hot.accept('./layout', () => {
        render();
    });
}