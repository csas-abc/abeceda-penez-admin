import React, { useState } from 'react';
import moment from 'moment';
import map from 'ramda/src/map';
import prop from 'ramda/src/prop';
import pathOr from 'ramda/src/pathOr';
import compose from 'ramda/src/compose';
import Edit from '@material-ui/icons/Edit';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import roadmapEventAttributes from '../constants/roadmapEventAttributes';
import Button from '@material-ui/core/Button';
import CreateRoadmapEventModal from './CreateRoadmapEventModal';
import EditRoadmapEventModal from './EditRoadmapEventModal';
import reject from 'ramda/src/reject';
import isNil from 'ramda/src/isNil';
import find from 'ramda/src/find';
import path from 'ramda/src/path';
import indexOf from 'ramda/src/indexOf';
import type from 'ramda/src/type';
import includes from 'ramda/src/includes';
import toLower from 'ramda/src/toLower';
import sort from 'ramda/src/sort';
import reverse from 'ramda/src/reverse';
import addIndex from 'ramda/src/addIndex';
import MUIDataTable from 'mui-datatables';

const styles = theme => ({
    table: {
        minWidth: 500,
    },
    errorMessage: {
        backgroundColor: theme.palette.error.dark,
        margin: theme.spacing.unit,
    }
});

const mapIndexed = addIndex(map);

const RoadmapEventsTable = ({
    classes,
    roadmapEventsQuery,
}) => {
    const [createEventModal, setCreateEventModal] = useState(false);
    const [editEventModal, setEditEventModal] = useState(false);

    const [columns, setColumns] = useState([
        {
            options: {
                filter: false,
                sort: false,
            }
        },
        {
            name: 'Region',
            options: {
                filter: true,
            }
        },
        {
            name: 'Segment',
            options: {
                filter: true,
            }
        },
        {
            name: 'Název akce',
            options: {
                filter: false,
            }
        },
        {
            name: 'Datum od-do',
            options: {
                filter: true,
                customBodyRender: ([from, to]) => (
                    `${moment(from).format('L LT')} - ${moment(to).format('L LT') }`
                ),
            }
        },
        {
            name: 'budget MMA',
            options: {
                filter: false,
            }
        },
        {
            name: 'budget MSE',
            options: {
                filter: false,
            }
        },
        {
            name: 'budget EXHYP',
            options: {
                filter: false,
            }
        },
        {
            name: 'nad rámec budgetu',
            options: {
                filter: false,
            }
        },
        {
            name: 'NPS',
            options: {
                filter: false,
            }
        },
        {
            name: 'hodnocení',
            options: {
                filter: false,
            }
        },
        {
            name: 'interní klient',
            options: {
                filter: false,
            }
        },
        {
            name: 'adresa',
            options: {
                filter: false,
                customBodyRender: (address) => (
                    <a target="_blank" href={`https://maps.google.com/?q=${address}`}>
                        {address}
                    </a>
                ),
            }
        },
        {
            name: 'finanční podklady',
            options: {
                filter: false,
                customBodyRender: (link) => (
                    <a target="_blank" href={link}>
                        {link.length > 30 ? `${link.substr(0, 30)}...` : link}
                    </a>
                ),
            }
        },
        {
            name: 'poznámka',
            options: {
                filter: false,
            }
        },
    ]);

    const options = {
        filterType: 'multiselect',
        selectableRows: 'none',
        fixedHeader: true,
        download: false,
        print: false,
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
        customSort: (data, colIndex, order) => {
            switch(colIndex) {
                case 1:
                case 2:
                case 3:
                // case 5:
                // case 6:
                // case 7:
                // case 8:
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
                case 4:
                    const sortedData = sort((a, b) => {
                        moment(a.data[colIndex][0]).isBefore(b.data[colIndex][0])
                    }, data);
                    if (order === 'asc') return sortedData;
                    return reverse(sortedData);
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
        },
        onCellClick: (colData, { colIndex, dataIndex }) => {
            if (colIndex === 12) return;
            setEditEventModal(roadmapEventsQuery.roadmapEvents[dataIndex].id)
        }
    };



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
                <CreateRoadmapEventModal
                    onClose={(refetch) => {
                        if (refetch) {
                            roadmapEventsQuery.refetch();
                        }
                        setCreateEventModal(false)
                    }}
                />
            ) : null}
            {editEventModal ? (
                <EditRoadmapEventModal
                    onClose={(refetch) => {
                        if (refetch) {
                            roadmapEventsQuery.refetch();
                        }
                        setEditEventModal(false)
                    }}
                    eventId={editEventModal}
                />
            ) : null}
            <Button
                variant="contained"
                color="primary"
                onClick={() => setCreateEventModal(true)}
            >
                Vytvořit akci
            </Button>
            <MUIDataTable
                columns={columns}
                options={options}
                data={map((event) => {
                    return [
                        <Edit onClick={() => setEditEventModal(event.id)} />,
                        pathOr('-', ['region'])(event),
                        pathOr('-', ['segment'])(event),
                        pathOr('-', ['name'])(event),
                        [
                            moment(event.from),
                            moment(event.to)
                        ],
                        pathOr('-', ['budgetMMA'])(event),
                        pathOr('-', ['budgetMSE'])(event),
                        pathOr('-', ['budgetEXHYP'])(event),
                        pathOr('-', ['overBudget'])(event),
                        pathOr('-', ['nps'])(event),
                        pathOr('-', ['evaluation'])(event),
                        pathOr('-', ['internalClient'])(event),
                        pathOr('-', ['address'])(event),
                        pathOr('-', ['finMaterial'])(event),
                        pathOr('-', ['note'])(event),
                    ]
                })(roadmapEventsQuery.roadmapEvents || [])}
            />
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
