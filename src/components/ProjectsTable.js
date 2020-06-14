import React, { useState, useEffect } from 'react';
import MUIDataTable from 'mui-datatables';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
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
import join from 'ramda/src/join';
import compose from 'ramda/src/compose';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Button from '@material-ui/core/Button';
import Edit from '@material-ui/icons/Edit';
import ProjectModal from './ProjectModal';
import ProjectModalTabs from '../constants/ProjectModalTabs';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { all } from '../utils/permissions';

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

const ProjectsTable = ({ classes, query, dataSelector, defaultDetail, meQuery }) => {

   const getMuiTheme = () => createMuiTheme({
        overrides: {
          MUIDataTableToolbar: {
            root: {
              zIndex: 1000,
              position: "fixed",
              top: "90px",
              float: "right",
              right: "10px",
            }
          },
          MUIDataTableHeadCell: {
              fixedHeaderCommon: {
                  paddingTop: "60px" 
              }
          }
        }
      });

    const isCoreUser = all(['CORE'])(meQuery);
    const [defaultTab, setDefaultTab] = useState(ProjectModalTabs.PROJECT_DETAIL);
    const [projectDetail, setProjectDetail] = useState(null);
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
        ...isCoreUser ? [] : [
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
        ],
        {
            name: 'Oblast',
            options: {
                filter: false,
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
        ...isCoreUser ? [
            {
                name: 'Datum návštěvy při výrobě',
                options: {
                    filter: false,
                }
            },
            {
                name: 'Datum kávy s učitelem',
                options: {
                    filter: false,
                }
            },
        ] : [],
        {
            name: 'Pololetí',
            options: {
                filter: true,
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
        {
            name: 'Typ',
            options: {
                filter: true,
                sort: false,
            }
        }
    ]);
    useEffect(() => {
        setProjectDetail(defaultDetail);
    }, [defaultDetail]);
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
            setDefaultTab(colMetadata.colIndex === 1 ? ProjectModalTabs.NOTE : ProjectModalTabs.PROJECT_DETAIL);
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
                case 11:
                case 12:
                case 13:
                case 14:
                case 15:
                case 16:
                    const sorted = sort((a, b) => a.data[colIndex].localeCompare(b.data[colIndex]), data);
                    if (order === 'asc') return sorted;
                    return reverse(sorted);
                default:
                    break;
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
            <div>
            <div style={{ width: '100%', height: '100%' }}>
                {query.loading ? <CircularProgress /> : null}
                <MuiThemeProvider theme={() => getMuiTheme()}>
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
                            ...isCoreUser ? [] : [
                                classroom.team.users.map((user) => user.region),
                                getActivePhase(classroom),
                            ],
                            prop('area')(classroom) || '-',
                            path(['branchAddress'])(classroom) || '-',
                            join(', ')([
                                path(['school', 'street'])(classroom) || '-',
                                path(['school', 'city'])(classroom) || '-'
                            ]),
                            path(['schoolMeeting'])(classroom) ? moment(path(['schoolMeeting'])(classroom)).format('L') : '-',
                            ...isCoreUser ? [
                                path(['visitInProduction'])(classroom) ? moment(path(['visitInProduction'])(classroom)).format('L') : '-',
                                path(['coffeeWithTeacher'])(classroom) ? moment(path(['coffeeWithTeacher'])(classroom)).format('L') : '-',
                            ] : [],
                            path(['semester'])(classroom) ? `${path(['semester'])(classroom)}. pololetí ${path(['year'])(classroom)}/${path(['year'])(classroom) + 1}` : '-',
                            path(['toolboxOrder', 'state'])(classroom) || '-',
                            path(['excursionDate'])(classroom) ? moment(path(['excursionDate'])(classroom)).format('L') : '-',
                            path(['companyName'])(classroom) || '-',
                            path(['businessDescription'])(classroom) || '-',
                            path(['fairDate'])(classroom) ? moment(path(['fairDate'])(classroom)).format('L') : '-',
                            path(['businessPurpose'])(classroom) || '-',
                            path(['moneyGoalAmount'])(classroom) || '-',
                            classroom.type ? (classroom.type === 'CORE' ? 'RMKT' : 'Dobrovolník') : '-',
                        ]
                    })(dataSelector(query) || [])}
                />
                </MuiThemeProvider>
            </div>
       </div>
        </React.Fragment>
    );
};

const meQuery = graphql(gql`
    {
        me {
            id
            email
            roles {
                name
            }
        }
    }
`, {
    name: 'meQuery'
});

export default compose(
    meQuery,
    withStyles(styles),
)(ProjectsTable);
