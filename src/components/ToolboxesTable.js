import React from 'react';
import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import path from 'ramda/src/path';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import SnackbarContent from '@material-ui/core/SnackbarContent';

const styles = theme => ({
    table: {
        minWidth: 500,
    },
    errorMessage: {
        backgroundColor: theme.palette.error.dark,
        margin: theme.spacing.unit,
    }
});

const ToolboxesTable = ({ classes, toolboxOrdersQuery }) => {
    if (toolboxOrdersQuery.loading) return <CircularProgress />;
    if (toolboxOrdersQuery.error) return (
        <SnackbarContent
            className={classes.errorMessage}
            message="Načtení se nezdařilo"
        />
    );
    return (
        <Table className={classes.table}>
            <TableHead>
                <TableRow>
                    <TableCell />
                    <TableCell>Projekt</TableCell>
                    <TableCell>Adresát</TableCell>
                    <TableCell>Adresa</TableCell>
                    <TableCell>Datum Jarmarku</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {map((toolbox) => (
                    <TableRow key={toolbox.id}>
                        <TableCell>
                            <ShoppingCart />
                        </TableCell>
                        <TableCell>
                            {path(['classroom', 'classroomName'])(toolbox)}
                        </TableCell>
                        <TableCell>
                            {path(['recipient'])(toolbox)}
                        </TableCell>
                        <TableCell>
                            {path(['address'])(toolbox)}
                        </TableCell>
                        <TableCell>
                            {path(['classroom', 'fairDate'])(toolbox)}
                        </TableCell>
                    </TableRow>
                ))(toolboxOrdersQuery.toolboxOrders)}
            </TableBody>
        </Table>
    );
};

const toolboxOrdersQuery = graphql(gql`
    {
        toolboxOrders {
            id
            createdAt
            state
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
            }
            recipient
            address
        }
    }
`, {
    name: 'toolboxOrdersQuery',
    options: {
        fetchPolicy: 'network-only',
    }
});

export default compose(
    withStyles(styles),
    toolboxOrdersQuery,
)(ToolboxesTable);
