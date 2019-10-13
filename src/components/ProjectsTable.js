import React, { useState } from 'react';
import MUIDataTable from 'mui-datatables';
import moment from 'moment';
import defaultTo from 'ramda/src/defaultTo';
import map from 'ramda/src/map';
import toLower from 'ramda/src/toLower';
import path from 'ramda/src/path';
import prop from 'ramda/src/prop';
import sort from 'ramda/src/sort';
import find from 'ramda/src/find';
import reverse from 'ramda/src/reverse';
import type from 'ramda/src/type';
import includes from 'ramda/src/includes';
import indexOf from 'ramda/src/indexOf';
import reject from 'ramda/src/reject';
import isNil from 'ramda/src/isNil';
import addIndex from 'ramda/src/addIndex';
import propOr from 'ramda/src/propOr';
import compose from 'ramda/src/compose';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Button from '@material-ui/core/Button';
import Edit from '@material-ui/icons/Edit';
import ProjectModal from './ProjectModal';
import TeamModal from './TeamModal';
import ToolboxModal from './forms/ToolboxForm';

const mapIndexed = addIndex(map);

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

const ProjectsTable = ({ classes, query, dataSelector }) => {
    const [defaultTab, setDefaultTab] = useState(0);
    const [projectDetail, setProjectDetail] = useState(null);
    const [teamDetail, setTeamDetail] = useState(null);
    const [columns, setColumns] = useState([
        {
            name: 'Projekt',
            options: {
                filter: false,
            }
        },
        {
            name: '',
            options: {
                filter: false,
                sort: false,
            },
        },
        {
            name: 'Tým',
            options: {
                sort: false,
                filter: false,
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
                        return includes(query.toLowerCase())(valueString ? valueString.toLowerCase() : '');
                    })(values)
                },
            },

        },
        {
            name: 'Stav projektu',
            options: {
                filter: false,
                customBodyRender: (phase) => {
                    const cellString = phase ? `${phase.number}/8: ${phase.name}` : 'Dokončeno';
                    return (
                        <div>
                            {cellString}
                            <div>
                                {map((task) => (
                                    <span key={task.id} style={{ color: task.checked ? 'green' : 'red', fontSize: '22px' }}>•</span>
                                ))(propOr([], 'checklist')(phase))}
                            </div>
                        </div>
                    );
                },
                search: (query, phase) => {
                    const cellString = phase ? `${phase.number}/8: ${phase.name}` : 'Dokončeno';
                    return includes(query ? query.toLowerCase() : '')(cellString ? cellString.toLowerCase() : '');
                },
            },
        },
        {
            name: 'Region',
            options: {
                filter: true,
                sort: false,
                customBodyRender: (value) => (
                    <div>
                        {(value || []).map((region, index) => (
                            <React.Fragment key={index}>
                                {region}<br />
                            </React.Fragment>
                        ))}
                    </div>
                ),
            }
        },
        {
            name: 'Pobočka',
            options: {
                filter: false,
            },
        },
        {
            name: 'Škola',
            options: {
                filter: false,
            },
        },
        {
            name: 'Termín návštěvy školy',
            options: {
                filter: false,
                customBodyRender: (value) => (
                    <div
                        style={{
                            padding: '24px',
                            backgroundColor: (!value || value !== '-') ? 'lightgreen' : 'transparent',
                        }}
                    >
                        {value}
                    </div>
                ),
            },
        },
        {
            name: 'Pololetí',
            options: {
                filter: false,
            },
        },
        {
            name: 'Toolbox',
            options: {
                filter: false,
            },
        },
        {
            name: 'Termín exkurze',
            options: {
                filter: false,
                customBodyRender: (value) => (
                    <div
                        style={{
                            padding: '24px',
                            backgroundColor: (!value || value !== '-') ? 'lightgreen' : 'transparent',
                        }}
                    >
                        {value}
                    </div>
                ),
            },
        },
        {
            name: 'Název firmy',
            options: {
                filter: false,
            },
        },
        {
            name: 'V čem děti podnikají',
            options: {
                filter: false,
            },
        },
        {
            name: 'Termín jarmarku',
            options: {
                filter: false,
                customBodyRender: (value) => (
                    <div
                        style={{
                            padding: '24px',
                            backgroundColor: (!value || value !== '-') ? 'lightgreen' : 'transparent',
                        }}
                    >
                        {value}
                    </div>
                ),
            },
        },
        {
            name: 'Výdělek použití',
            options: {
                filter: false,
            },
        },
        {
            name: 'Výdělek (Kč)',
            options: {
                filter: false,
            },
        },
    ]);
    const [toolboxDetail, setToolboxDetail] = useState(null);
    if (query.error) return (
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
        // filter: false,
        responsive: 'scroll',
        rowsPerPage: 1000,
        rowsPerPageOptions: [10, 50, 100, 200, 500, 1000],
        onFilterChange: (column, filterLists) => {
            setColumns(mapIndexed((column, index) => ({
                ...column,
                options: {
                    ...column.options,
                    filterList: filterLists[index],
                }
            }))(columns));
        },
        onTableChange: (actionName, tableData) => {
            const newCols = mapIndexed((column, index) => ({
                name: column.name,
                options: {
                    ...reject(isNil)(column),
                    filteredList: columns[index].filteredList,
                }
            }))(tableData.columns);
            const sortColumn = find((col) => !!path(['options', 'sortDirection'])(col))(newCols);
            const oldSortColumn = find((col) => !!path(['options', 'sortDirection'])(col))(columns);

            if (prop('name')(oldSortColumn) !== prop('name')(sortColumn) || path(['options', 'sortDirection'])(oldSortColumn) !== path(['options', 'sortDirection'])(sortColumn)) {
                setColumns(newCols);
            }
        },
        customSearch: (searchQuery, row, columns) => {
            const found = !!find((column) => {
                const columnIndex = indexOf(column)(row);
                if (columns[columnIndex].search) {
                    return columns[columnIndex].search(searchQuery, column);
                }
                if (type(column) === 'String') {
                    return !!includes(searchQuery.toLowerCase())(column.toLowerCase());
                }
                if (type(column) === 'Array') {
                    return !!find(includes(searchQuery.toLowerCase()))(map(toLower)(column));
                }
                return false;
            })(row);
            return !!found;
        },
        onCellClick: (colData, colMetadata) => {
            setDefaultTab(colMetadata.colIndex === 1 ? 8 : 0);
            const classroom = dataSelector(query)[colMetadata.dataIndex];
            setProjectDetail(classroom);
        },
        customSort: (data, colIndex, order) => {
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
                <ProjectModal
                    classroom={projectDetail}
                    defaultTab={defaultTab}
                    onClose={(refetch = false) => {
                        if (refetch) {
                            query.refetch();
                        }
                        setProjectDetail(null);
                    }}
                />
            ) : null}
            {teamDetail ? (
                <TeamModal team={teamDetail} onClose={() => setTeamDetail(null)} />
            ) : null}
            {toolboxDetail ? (
                <ToolboxModal toolbox={toolboxDetail} onClose={() => setToolboxDetail(null)} />
            ) : null}
            <div style={{ width: '100%', height: '100%' }}>
                {query.loading ? <CircularProgress /> : null}
                <MUIDataTable
                    columns={columns}
                    options={options}
                    data={map((classroom) => {
                        return [
                            path(['classroomName'])(classroom) || '-',
                            <Button>
                                <Edit />
                            </Button>,
                            compose(
                                defaultTo([]),
                                path(['team', 'users']),
                            )(classroom),
                            getActivePhase(classroom),
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
                    })(dataSelector(query) || [])}
                />
            </div>
        </React.Fragment>
    );
};

export default compose(
    withStyles(styles),
)(ProjectsTable);
