import React from 'react';

const ProjectCard = ({ title, description, link }) => (
  <div className="project-card">
    <h3>{title}</h3>
    <p>{description}</p>
    <a href={link} target="_blank" rel="noopener noreferrer" className="btn btn-secondary">View Project</a>
  </div>
);

const Projects = () => {
  const projects = [
    { title: "Netflix Clone", description: "Description of project 1", link: "#" },
    { title: "Django Hospital Management", description: "Description of project 2", link: "#" },
    { title: "Project Hub", description: "Description of project 3", link: "#" },
  ];

  return (
    <div className="projects">
      <h2>My Projects</h2>
      <div className="project-list">
        {projects.map((project, index) => (
          <ProjectCard key={index} {...project} />
        ))}
      </div>
    </div>
  );
};

export default Projects;