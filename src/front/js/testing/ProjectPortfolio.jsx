import React from 'react';
function ProjectPortfolio() {
    const projects = [
        { title: "Project 1", description: "Brief description of the project." },
        { title: "Project 2", description: "Brief description of the project." },
        // Add more projects here
    ];
    return (
        <div className="project-portfolio">
            {projects.map((project, index) => (
                <div key={index} className="project-card">
                    <h5>{project.title}</h5>
                    <p>{project.description}</p>
                </div>
            ))}
        </div>
    );
}
export default ProjectPortfolio;