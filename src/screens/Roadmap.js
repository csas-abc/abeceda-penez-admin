import React from 'react';
import Layout from '../components/Layout';
import RoadmapEventsTable from '../components/RoadmapEventsTable';
import roadmapEventAttributes from "../constants/roadmapEventAttributes";
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';

const Roadmap = ({ roadmapQuery }) => (
    <Layout title="Akce RMKT">
        <RoadmapEventsTable roadmapQuery={roadmapQuery}/>
    </Layout>
);

const roadmapQuery = graphql(gql`
query RoadmapEvents($year: Int){
    roadmapEvents(year: $year) {
        ${roadmapEventAttributes}
    }
}
`, {
    name: 'roadmapQuery',
    options: {
         variables: {
            year: Number(moment().year().toString()),
        },
        fetchPolicy: 'cache-and-network'
    }
});

export default roadmapQuery(Roadmap);
