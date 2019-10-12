import React from 'react';
import Layout from '../components/Layout';
import ProjectsTable from '../components/ProjectsTable';

const Projects = ({ archive }) => (
    <Layout title={archive ? "Archiv" : "Přehled"}>
        <ProjectsTable archive={archive} />
    </Layout>
);

export default Projects;
