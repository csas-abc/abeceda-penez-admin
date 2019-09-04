import React, { useState } from 'react';
import MUIDataTable from 'mui-datatables';
import moment from 'moment';
import defaultTo from 'ramda/src/defaultTo';
import map from 'ramda/src/map';
import path from 'ramda/src/path';
import sort from 'ramda/src/sort';
import find from 'ramda/src/find';
import reverse from 'ramda/src/reverse';
import type from 'ramda/src/type';
import includes from 'ramda/src/includes';
import indexOf from 'ramda/src/indexOf';
import compose from 'ramda/src/compose';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import ProjectModal from './ProjectModal';
import TeamModal from './TeamModal';
import ToolboxModal from './ToolboxModal';

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
    const [projectDetail, setProjectDetail] = useState(null);
    const [teamDetail, setTeamDetail] = useState(null);
    const [toolboxDetail, setToolboxDetail] = useState(null);
    if (classroomsQuery.loading) return <CircularProgress />;
    if (classroomsQuery.error) return (
        <SnackbarContent
            className={classes.errorMessage}
            message="Načtení se nezdařilo"
        />
    );

    const options = {
        filterType: 'multiselect',
        selectableRows: 'none',
        fixedHeader: true,
        // search: false,
        download: false,
        print: false,
        filter: false,
        responsive: 'scroll',
        rowsPerPage: 1000,
        rowsPerPageOptions: [10, 50, 100, 200, 500, 1000],
        onColumnSortChange: (...args) => {
            // console.log('Sort change', args);
        },
        onTableChange: (...args) => {
            // console.log('Table change', args);
        },
        customSearch: (searchQuery, row, columns) => {
            const found = !!find((column) => {
                const columnIndex = indexOf(column)(row);
                if (columns[columnIndex].search) {
                    return columns[columnIndex].search(searchQuery, column);
                }
                if (type(column) === 'String') {
                    return !!includes(searchQuery)(column);
                }
                if (type(column) === 'Array') {
                    return !!find(includes(searchQuery))(column);
                }
                return false;
            })(row);
            return !!found;
        },
        onCellClick: (colData, colMetadata) => {
            const classroom = classroomsQuery.classrooms[colMetadata.dataIndex];
            setProjectDetail(classroom);
        },
        customSort: (data, colIndex, order) => {
            // console.log('Sort');
            switch(colIndex) {
                case 0:
                case 2:
                case 4:
                case 5:
                case 6:
                case 7:
                case 8:
                case 9:
                case 10:
                    const sorted = sort((a, b) => a.data[colIndex].localeCompare(b.data[colIndex]), data);
                    if (order === 'asc') return sorted;
                    return reverse(sorted);
            }
            const sorted = sort((a, b) => {
                let intA = 0;
                let intB = 0;
                try {
                    intA = parseInt(a.data[colIndex], 10);
                    intA = isNaN(intA) ? 0 : intA;
                } catch (e) {
                    // nothing..
                }
                try {
                    intB = parseInt(b.data[colIndex], 10);
                    intB = isNaN(intB) ? 0 : intB;
                } catch (e) {
                    // nothing..
                }
                return intA - intB;
            }, data);
            if (order === 'asc') return sorted;
            return reverse(sorted);
        }
    };

    return (
        <React.Fragment>
            {projectDetail ? (
                <ProjectModal classroom={projectDetail} onClose={() => setProjectDetail(null)} />
            ) : null}
            {teamDetail ? (
                <TeamModal team={teamDetail} onClose={() => setTeamDetail(null)} />
            ) : null}
            {toolboxDetail ? (
                <ToolboxModal toolbox={toolboxDetail} onClose={() => setToolboxDetail(null)} />
            ) : null}
            <div style={{ width: '100%', height: '100%' }}>
                <MUIDataTable
                    columns={[
                        'Projekt',
                        {
                            name: 'Tým',
                            options: {
                                sort: false,
                                customBodyRender: (value) => (
                                    <div>
                                        {map((user) => (
                                        <React.Fragment key={user.id}>
                                            {user.activated ? `${user.firstname} ${user.lastname}` : user.email}<br />
                                        </React.Fragment>
                                    ))(value)}
                                    </div>
                                ),
                                search: (query, values) => {
                                    return !!find((user) => {
                                        const valueString =  user.activated ? `${user.firstname} ${user.lastname}` : user.email;
                                        return includes(query)(valueString);
                                    })(values)
                                },
                            },

                        },
                        'Stav projektu',
                        {
                            name: 'Region',
                            options: {
                                sort: false,
                                customBodyRender: (value) => (
                                    <div>
                                        {map((region) => (
                                            <React.Fragment>
                                                {region}<br />
                                            </React.Fragment>
                                        ))(value)}
                                    </div>
                                ),
                            }
                        },
                        'Pobočka',
                        'Škola',
                        'Termín návštěvy školy',
                        'Pololetí',
                        'Toolbox',
                        'Termín exkurze ',
                        'Název firmy',
                        'V čem děti podnikají',
                        'Termín jarmarku',
                        'Výdělek použití',
                        'Výdělek (Kč)',
                    ]}
                    options={options}
                    data={map((classroom) => {
                        return [
                            path(['classroomName'])(classroom) || '-',
                            compose(
                                defaultTo([]),
                                path(['team', 'users']),
                            )(classroom),
                            getActivePhase(classroom) ? (
                                `${getActivePhase(classroom) ? getActivePhase(classroom).number : 1}/${classroom.phases.length}: ${getActivePhase(classroom) ? getActivePhase(classroom).name : '-'}`
                            ) : 'Dokončeno',
                            classroom.team.users.map((user) => user.region),
                            path(['branchAddress'])(classroom) || '-',
                            path(['schoolAddress'])(classroom) || '-',
                            path(['schoolMeeting'])(classroom) ? moment(path(['schoolMeeting'])(classroom)).format('L') : '-',
                            path(['semester'])(classroom) ? `${path(['semester'])(classroom)}` : '-',
                            path(['toolboxOrder', 'state'])(classroom) || '-',
                            path(['excursionDate'])(classroom) ? moment(path(['excursionDate'])(classroom)).format('L') : '-',
                            path(['companyName'])(classroom) || '-',
                            path(['businessDescription'])(classroom) || '-',
                            path(['fairDate'])(classroom) ? moment(path(['fairDate'])(classroom)).format('L') : '-',
                            path(['businessPurpose'])(classroom) || '-',
                            path(['moneyGoalAmount'])(classroom) || '-',
                        ]
                    })(classroomsQuery.classrooms || [])}
                />
            </div>
            {/*
                <TableRow
                    key={classroom.id}
                    className={validateProject(classroom) ? classes.errorProjectRow : null}
                >
                </TableRow>>
            */}
        </React.Fragment>
    );
};

const classroomsQuery = graphql(gql`
    {
        classrooms {
            id
            excursionDate
            classroomName
            schoolAddress
            directorName
            directorEmail
            directorPhone
            teacherName
            teacherPhone
            teacherEmail
            schoolMeeting
            semester
            branchAddress
            branchRepresentativeEmail
            branchRepresentativePhone
            branchRepresentativeName
            fairDate
            toolboxOrder {
                id
                state
                recipient
                address
                childrenCount
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
                    region
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
