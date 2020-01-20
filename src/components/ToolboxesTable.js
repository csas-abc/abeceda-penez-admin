import React, { useState } from 'react';
import moment from 'moment';
import defaultTo from 'ramda/src/defaultTo';
import map from 'ramda/src/map';
import path from 'ramda/src/path';
import contains from 'ramda/src/contains';
import compose from 'ramda/src/compose';
import without from 'ramda/src/without';
import append from 'ramda/src/append';
import propEq from 'ramda/src/propEq';
import sortBy from 'ramda/src/sortBy';
import Table from '@material-ui/core/Table';
import Checkbox from '@material-ui/core/Checkbox';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import { Button } from '@material-ui/core';
import pluck from 'ramda/src/pluck';
import ToolboxModal from './ToolboxModal';

const toolboxState = {
    'Objednaný přes aplikaci': 1,
    'Předáno do agentury': 2,
    'Agentura eviduje': 3,
    'Odesláno na pobočku': 4,
};

const styles = theme => ({
    table: {
        minWidth: 500,
    },
    errorMessage: {
        backgroundColor: theme.palette.error.dark,
        margin: theme.spacing.unit,
    }
});

const ToolboxesTable = ({
    classes,
    toolboxOrdersQuery,
    sendOrdersMutation,
    registerOrderMutation,
    finishOrderMutation,
    meQuery,
}) => {
    const [selected, setSelected] = useState([]);
    const [toolboxDetail, setToolboxDetail] = useState(null);
    const isAdmin = compose(
        contains('ADMIN'),
        pluck('name'),
        defaultTo([]),
        path(['me', 'roles']),
    )(meQuery);
    if (toolboxOrdersQuery.loading) return <CircularProgress />;
    if (toolboxOrdersQuery.error) return (
        <SnackbarContent
            className={classes.errorMessage}
            message="Načtení se nezdařilo"
        />
    );
    return (
        <React.Fragment>
            {isAdmin ? (
                <div>
                    <Button
                        variant="outlined"
                        disabled={!selected || !selected[0]}
                        onClick={() => {
                            sendOrdersMutation({
                                variables: {
                                    toolboxOrderIds: selected,
                                }
                            }).then(() => {
                                setSelected([]);
                                toolboxOrdersQuery.refetch();
                            })
                        }}
                    >
                        Odeslat vybrané
                    </Button>
                </div>
            ) : null}
            {toolboxDetail ? (
                <ToolboxModal toolbox={toolboxDetail} onClose={() => setToolboxDetail(null)} />
            ) : null}
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        {isAdmin ? <TableCell /> : null}
                        <TableCell>Stav</TableCell>
                        <TableCell>Do agentury odeslal</TableCell>
                        <TableCell>Adresát</TableCell>
                        <TableCell>Adresa</TableCell>
                        <TableCell>Tým</TableCell>
                        <TableCell>V aplikaci odeslal</TableCell>
                        <TableCell>Projekt</TableCell>
                        <TableCell>Datum Jarmarku</TableCell>
                        <TableCell>Počet dětí</TableCell>
                        <TableCell>Datum zaevidování</TableCell>
                        <TableCell>Datum odeslání</TableCell>
                        <TableCell>Datum exkurze</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {compose(
                        map((toolbox) => (
                            <TableRow key={toolbox.id}>
                                {isAdmin ? (
                                    <TableCell>
                                        <Checkbox
                                            checked={contains(toolbox.id)(selected)}
                                            onChange={() => {
                                                if (contains(toolbox.id)(selected)) {
                                                    setSelected(without([toolbox.id])(selected));
                                                } else {
                                                    setSelected(append(toolbox.id)(selected));
                                                }
                                            }}
                                            disabled={path(['state'])(toolbox) !== 'Objednaný přes aplikaci'}
                                            color="primary"
                                        />
                                    </TableCell>
                                ) : null}
                                <TableCell onClick={() => isAdmin ? setToolboxDetail(toolbox) : null}>
                                    {path(['state'])(toolbox)}
                                </TableCell>
                                <TableCell>
                                    {path(['sendAdmin', 'email'])(toolbox) ? `${path(['sendAdmin', 'firstname'])(toolbox)} ${path(['sendAdmin', 'lastname'])(toolbox)} (${path(['sendAdmin', 'email'])(toolbox)})` : '-'}
                                </TableCell>
                                <TableCell onClick={() => isAdmin ? setToolboxDetail(toolbox) : null}>
                                    {path(['recipient'])(toolbox)}
                                </TableCell>
                                <TableCell>
                                    {path(['address'])(toolbox)}
                                </TableCell>
                                <TableCell onClick={() => isAdmin ? setToolboxDetail(toolbox) : null}>
                                    {compose(
                                        map((user) => (
                                            <React.Fragment key={user.id}>
                                                {user.activated ? `${user.firstname} ${user.lastname}` : user.email}<br />
                                            </React.Fragment>
                                        )),
                                        defaultTo([]),
                                        path(['classroom', 'team', 'users']),
                                    )(toolbox)}
                                </TableCell>
                                <TableCell onClick={() => isAdmin ? setToolboxDetail(toolbox) : null}>
                                    {`${path(['author', 'firstname'])(toolbox)} ${path(['author', 'lastname'])(toolbox)}`}
                                </TableCell>
                                <TableCell onClick={() => isAdmin ? setToolboxDetail(toolbox) : null}>
                                    {path(['classroom', 'classroomName'])(toolbox)}
                                </TableCell>
                                <TableCell onClick={() => isAdmin ? setToolboxDetail(toolbox) : null}>
                                    {path(['classroom', 'fairDate'])(toolbox) ? moment(path(['classroom', 'fairDate'])(toolbox)).format('L') : '-'}
                                </TableCell>
                                <TableCell onClick={() => isAdmin ? setToolboxDetail(toolbox) : null}>
                                    {path(['childrenCount'])(toolbox) || '-'}
                                </TableCell>
                                <TableCell>
                                    {!isAdmin && propEq('state', 'Předáno do agentury')(toolbox) ? (
                                        <Button
                                            variant="outlined"
                                            onClick={() => registerOrderMutation({
                                                variables: {
                                                    id: toolbox.id
                                                }
                                            })}
                                        >
                                            Evidováno
                                        </Button>
                                    ) : (path(['registrationDate'])(toolbox) ? moment(path(['registrationDate'])(toolbox)).format('L') : '-')}
                                </TableCell>
                                <TableCell>
                                    {!isAdmin && propEq('state', 'Agentura eviduje')(toolbox) ? (
                                        <Button
                                            variant="outlined"
                                            onClick={() => {
                                                finishOrderMutation({
                                                    variables: {
                                                        id: toolbox.id,
                                                    }
                                                })
                                            }}
                                        >
                                            Posláno
                                        </Button>
                                    ) : (path(['sendDate'])(toolbox) ? moment(path(['sendDate'])(toolbox)).format('L') : '-')}
                                </TableCell>
                                <TableCell>{(path(['classroom', 'excursionDate'])(toolbox) ? moment(path(['classroom', 'excursionDate'])(toolbox)).format('L') : '-')}</TableCell>
                            </TableRow>
                        )),
                        sortBy((x) => toolboxState[x.state]),
                    )(toolboxOrdersQuery.toolboxOrders || [])}
                </TableBody>
            </Table>
        </React.Fragment>
    );
};

const toolboxOrdersQuery = graphql(gql`
    {
        toolboxOrders {
            id
            createdAt
            state
            registrationDate
            sendDate
            author {
                id
                email
                firstname
                lastname
            }
            classroom {
                id
                classroomName
                fairDate
                excursionDate
                team {
                    id
                    users {
                        id
                        email
                        activated
                        firstname
                        lastname
                    }
                    
                }
            }
            recipient
            address
            childrenCount
            sendAdmin {
                id
                email
                firstname
                lastname
            }
        }
    }
`, {
    name: 'toolboxOrdersQuery',
    options: {
        fetchPolicy: 'network-only',
    }
});

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

const sendOrdersMutation = graphql(gql`
    mutation SendOrders($toolboxOrderIds: [ID!]!) {
        sendOrders(toolboxOrderIds: $toolboxOrderIds)
    }
`, {
    name: 'sendOrdersMutation'
});

const registerOrderMutation = graphql(gql`
    mutation RegisterOrder($id: ID!) {
        registerOrder(id: $id) {
            id
            state
            registrationDate
        }
    }
`, {
    name: 'registerOrderMutation'
});

const finishOrderMutation = graphql(gql`
    mutation FinishOrder($id: ID!) {
        finishOrder(id: $id) {
            id
            state
            sendDate
        }
    }
`, {
    name: 'finishOrderMutation'
});

export default compose(
    withStyles(styles),
    sendOrdersMutation,
    registerOrderMutation,
    finishOrderMutation,
    toolboxOrdersQuery,
    meQuery,
)(ToolboxesTable);
