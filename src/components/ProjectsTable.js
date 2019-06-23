import React, { useState } from 'react';
import defaultTo from 'ramda/src/defaultTo';
import map from 'ramda/src/map';
import path from 'ramda/src/path';
import compose from 'ramda/src/compose';
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
import find from 'ramda/src/find';
import validateProject from '../utils/validateProject';
import BranchModal from './BranchModal';
import SchoolModal from './SchoolModal';

const styles = theme => ({
    table: {
        minWidth: 500,
    },
    errorMessage: {
        backgroundColor: theme.palette.error.dark,
        margin: theme.spacing.unit,
    },
    errorProjectRow: {
        backgroundColor: theme.palette.error.light,
    }
});

const getActivePhase = (classroom) => find((phase) => !phase.finished)(classroom.phases || []);

const ProjectsTable = ({ classes, classroomsQuery }) => {
    const [branchDetail, setBranchDetail] = useState(null);
    const [schoolDetail, setSchoolDetail] = useState(null);
    if (classroomsQuery.loading) return <CircularProgress />;
    if (classroomsQuery.error) return (
        <SnackbarContent
            className={classes.errorMessage}
            message="Načtení se nezdařilo"
        />
    );
    return (
        <React.Fragment>
            {branchDetail ? (
                <BranchModal classroom={branchDetail} onClose={() => setBranchDetail(null)} />
            ) : null}
            {schoolDetail ? (
                <SchoolModal classroom={schoolDetail} onClose={() => setSchoolDetail(null)} />
            ) : null}
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Projekt</TableCell>
                        <TableCell>Region</TableCell>
                        <TableCell>Tým</TableCell>
                        <TableCell>Pobočka</TableCell>
                        <TableCell>Škola</TableCell>
                        <TableCell>Toolbox</TableCell>
                        <TableCell>Stav projektu</TableCell>
                        <TableCell>Název firmy</TableCell>
                        <TableCell>V čem děti podnikají</TableCell>
                        <TableCell>Výdělek použití</TableCell>
                        <TableCell>Výdělek</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {map((classroom) => (
                        <TableRow
                            key={classroom.id}
                            className={validateProject(classroom) ? classes.errorProjectRow : null}
                        >
                            <TableCell>
                                {path(['classroomName'])(classroom)}
                            </TableCell>
                            <TableCell>
                                {path(['region'])(classroom)}
                            </TableCell>
                            <TableCell>
                                {compose(
                                    map((user) => (
                                        <React.Fragment key={user.id}>
                                            {user.activated ? `${user.firstname} ${user.lastname}` : user.email}<br />
                                        </React.Fragment>
                                    )),
                                    defaultTo([]),
                                    path(['team', 'users']),
                                )(classroom)}
                            </TableCell>
                            <TableCell style={{ cursor: 'pointer' }} onClick={() => setBranchDetail(classroom)}>
                                {path(['branchAddress'])(classroom)}
                            </TableCell>
                            <TableCell style={{ cursor: 'pointer' }} onClick={() => setSchoolDetail(classroom)}>
                                {path(['schoolAddress'])(classroom)}
                            </TableCell>
                            <TableCell>
                                {path(['toolboxOrder', 'state'])(classroom)}
                            </TableCell>
                            <TableCell>
                                {`${getActivePhase(classroom).number}/${classroom.phases.length}: ${getActivePhase(classroom).name}`}
                            </TableCell>
                            <TableCell>
                                {path(['companyName'])(classroom)}
                            </TableCell>
                            <TableCell>
                                {path(['businessPurpose'])(classroom)}
                            </TableCell>
                            <TableCell>
                                {path(['businessDescription'])(classroom)}
                            </TableCell>
                            <TableCell>
                                {path(['moneyGoalAmount'])(classroom)}
                            </TableCell>
                        </TableRow>
                    ))(classroomsQuery.classrooms)}
                </TableBody>
            </Table>
        </React.Fragment>
    );
};

const classroomsQuery = graphql(gql`
    {
        classrooms {
            id
            classroomName
            schoolAddress
            directorName
            directorEmail
            directorPhone
            schoolMeeting
            branchAddress
            branchRepresentativeEmail
            branchRepresentativePhone
            branchRepresentativeName
            toolboxOrder {
                id
                state
            }
            phases {
                id
                name
                finished
                finishDate
                number
            }
            companyName
            businessPurpose
            businessDescription
            moneyGoalAmount
            team {
                id
                users {
                    id
                    firstname
                    lastname
                    activated
                    email
                }
            }
        }
    }
`, {
    name: 'classroomsQuery',
    options: {
        fetchPolicy: 'network-only',
    }
});

export default compose(
    withStyles(styles),
    classroomsQuery,
)(ProjectsTable);
