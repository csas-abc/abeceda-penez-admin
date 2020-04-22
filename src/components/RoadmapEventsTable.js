import React, { useState, useEffect } from 'react';
import moment from 'moment';
import defaultTo from 'ramda/src/defaultTo';
import map from 'ramda/src/map';
import path from 'ramda/src/path';
import contains from 'ramda/src/contains';
import propEq from 'ramda/src/propEq';
import prop from 'ramda/src/prop';
import pathOr from 'ramda/src/pathOr';
import compose from 'ramda/src/compose';
import sort from 'ramda/src/sort';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import pluck from 'ramda/src/pluck';
import FairModal from './FairModal';
import roadmapEventAttributes from '../constants/roadmapEventAttributes';
import Button from '@material-ui/core/Button';
import Layout from './Layout';
import CreateRoadmapEventModal from './CreateRoadmapEventModal';

const styles = theme => ({
    table: {
        minWidth: 500,
    },
    errorMessage: {
        backgroundColor: theme.palette.error.dark,
        margin: theme.spacing.unit,
    }
});

const RoadmapEventsTable = ({
    classes,
    roadmapEventsQuery,
}) => {
    const [createEventModal, setCreateEventModal] = useState(false);
    if (roadmapEventsQuery.loading) return <CircularProgress />;
    if (roadmapEventsQuery.error) return (
        <SnackbarContent
            className={classes.errorMessage}
            message="Načtení se nezdařilo"
        />
    );
    return (
        <React.Fragment>
            {createEventModal ? (
                <CreateRoadmapEventModal onClose={() => setCreateEventModal(false)} />
            ) : null}
            <Button
                variant="contained"
                color="primary"
                onClick={() => setCreateEventModal(true)}
            >
                Vytvořit akci
            </Button>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Region</TableCell>
                        <TableCell>Segment</TableCell>
                        <TableCell>Název akce</TableCell>
                        <TableCell>Datum od-do</TableCell>
                        <TableCell>Foto</TableCell>
                        <TableCell>budget MMA</TableCell>
                        <TableCell>budget MSE</TableCell>
                        <TableCell>budget EXHYP</TableCell>
                        <TableCell>nad rámec budgetu</TableCell>
                        <TableCell>NPS</TableCell>
                        <TableCell>hodnocení</TableCell>
                        <TableCell>interní klient</TableCell>
                        <TableCell>adresa</TableCell>
                        <TableCell>finanční podklady</TableCell>
                        <TableCell>poznámka</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {compose(
                        map((event) => (
                            <TableRow key={event.id}>
                                <TableCell>
                                    {pathOr('-', ['region'])(event)}
                                </TableCell>
                                <TableCell>
                                    {pathOr('-', ['segment'])(event)}
                                </TableCell>
                                <TableCell>
                                    {pathOr('-', ['name'])(event)}
                                </TableCell>
                                <TableCell>
                                    {`${moment(event.from).format('L LT')} - ${moment(event.to).format('L LT') }`}
                                </TableCell>
                                <TableCell>
                                    TBD
                                </TableCell>
                                <TableCell>
                                    {pathOr('-', ['budget'])(event)}
                                </TableCell>
                                <TableCell>
                                    TBD
                                </TableCell>
                                <TableCell>
                                    TBD
                                </TableCell>
                                <TableCell>
                                    TBD
                                </TableCell>
                                <TableCell>
                                    TBD
                                </TableCell>
                                <TableCell>
                                    {pathOr('-', ['evaluation'])(event)}
                                </TableCell>
                                <TableCell>
                                    {pathOr('-', ['internalClient'])(event)}
                                </TableCell>
                                <TableCell>
                                    <a target="_blank" href={`https://maps.google.com/?q=${prop('address')(event)}`}>
                                        {pathOr('-', ['address'])(event)}
                                    </a>
                                </TableCell>
                                <TableCell>
                                    {pathOr('-', ['finMaterial'])(event)}
                                </TableCell>
                                <TableCell>
                                    TBD
                                </TableCell>
                            </TableRow>
                        )),
                    )(roadmapEventsQuery.roadmapEvents || [])}
                </TableBody>
            </Table>
        </React.Fragment>
    );
};

const roadmapEventsQuery = graphql(gql`
    {
        roadmapEvents {
            ${roadmapEventAttributes}
        }
    }
`, {
    name: 'roadmapEventsQuery',
    options: {
        fetchPolicy: 'cache-and-network',
    }
});



export default compose(
    withStyles(styles),
    roadmapEventsQuery,
)(RoadmapEventsTable);
