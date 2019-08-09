import React from 'react';
import TeamsTable from './components/TeamsTable';
import Layout from './components/Layout';

const Dashboard = () => {

    return (
        <Layout title="Správa týmů">
            <TeamsTable />
        </Layout>
    );
};

export default Dashboard;
