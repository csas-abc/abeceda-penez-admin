import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = {
    table: {
        minWidth: 500,
    },
};

const UsersTable = ({ classes }) => (
    <Table className={classes.table}>
        <TableHead>
            <TableRow>
                <TableCell>Jmeno</TableCell>
                <TableCell>Projekty</TableCell>
                <TableCell>E-mail</TableCell>
                <TableCell>Telefon</TableCell>
            </TableRow>
        </TableHead>
        <TableBody>
            <TableRow>
                <TableCell>
                    Adam R
                </TableCell>
                <TableCell>
                    Skola 1 <br />
                    Skola 2 <br />
                    Skola 3
                </TableCell>
                <TableCell>
                    adam@mail.com
                </TableCell>
                <TableCell>
                    123 456 789
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell>
                    Jarda Z
                </TableCell>
                <TableCell>
                    Skola 1 <br />
                    Skola 2 <br />
                    Skola 3
                </TableCell>
                <TableCell>
                    jarda@mail.com
                </TableCell>
                <TableCell>
                    987 654 321
                </TableCell>
            </TableRow>
        </TableBody>
    </Table>
);

export default withStyles(styles)(UsersTable);
