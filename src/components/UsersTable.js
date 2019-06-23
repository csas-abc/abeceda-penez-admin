import React, { Fragment, useState } from 'react';
import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Badge from '@material-ui/core/Badge';
import AccountCircle from '@material-ui/icons/AccountCircle';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import UserDetail from './UserDetail';

const styles = theme => ({
    table: {
        minWidth: 500,
    },
    errorMessage: {
        backgroundColor: theme.palette.error.dark,
        margin: theme.spacing.unit,
    }
});

const UsersTable = ({ classes, usersQuery, banMutation, unbanMutation }) => {
    const [user, setUser] = useState(null);
    if (usersQuery.loading) return <CircularProgress />;
    if (usersQuery.error) return (
        <SnackbarContent
            className={classes.errorMessage}
            message="Načtení se nezdařilo"
        />
    );
    return (
        <Fragment>
            {user ? (
                <UserDetail user={user} onClose={() => setUser(null)} />
            ) : null}
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell />
                        <TableCell>Jméno</TableCell>
                        <TableCell>Bezpečnostní kód</TableCell>
                        <TableCell>Projekty</TableCell>
                        <TableCell>E-mail</TableCell>
                        <TableCell>Telefon</TableCell>
                        <TableCell>Role</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {map((user) => (
                        <TableRow key={user.id}>
                            <TableCell
                                onClick={() => setUser(user)}
                                style={{ cursor: 'pointer' }}
                            >
                                <Badge color={user.activated ? "primary" : "error"} variant="dot">
                                    <AccountCircle />
                                </Badge>
                            </TableCell>
                            <TableCell
                                style={{ cursor: 'pointer' }}
                                onClick={() => {
                                    if (user.banned) {
                                        unbanMutation({
                                            variables: {
                                                id: user.id,
                                            },
                                        }).then(() => {
                                            usersQuery.refetch();
                                        })
                                    } else {
                                        banMutation({
                                            variables: {
                                                id: user.id,
                                            },
                                        }).then(() => {
                                            usersQuery.refetch();
                                        })
                                    }
                                }}
                            >
                                {user.banned ?  'Aktivovat': 'Blokovat'}
                            </TableCell>
                            <TableCell>
                                {`${user.firstname || ''} ${user.lastname || ''}`}
                            </TableCell>
                            <TableCell>
                                {user.securityCode}
                            </TableCell>
                            <TableCell>
                                {user.team ? map((classroom) => (
                                    <React.Fragment key={classroom.id}>{classroom.classroomName || classroom.id} <br /></React.Fragment>
                                ))(user.team.classrooms) : null}
                            </TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.phone}</TableCell>
                            <TableCell>
                                {map((role) => (
                                    <React.Fragment key={role.name}>{role.name} <br /></React.Fragment>
                                ))(user.roles)}
                            </TableCell>
                        </TableRow>
                    ))(usersQuery.users)}
                </TableBody>
            </Table>
        </Fragment>
    );
};

const usersQuery = graphql(gql`
    {
        users {
            id
            email
            phone
            firstname
            lastname
            activated
            securityCode
            banned
            region
            roles {
                name
            }
            team {
                id
                classrooms {
                    id
                    classroomName
                }
            }
        }
    }
`, {
    name: 'usersQuery',
    options: {
        fetchPolicy: 'network-only',
    }
});

const banMutation = graphql(gql`
    mutation BanUser($id: ID!) {
        banUser(id: $id) {
            id
            banned
        }
    }
`, {
    name: 'banMutation',
});

const unbanMutation = graphql(gql`
    mutation UnbanUser($id: ID!) {
        unbanUser(id: $id) {
            id
            banned
        }
    }
`, {
    name: 'unbanMutation',
});

export default compose(
    withStyles(styles),
    usersQuery,
    banMutation,
    unbanMutation,
)(UsersTable);
