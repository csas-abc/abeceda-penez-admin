import React, { useState } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Typography from '@material-ui/core/Typography';
import Popover from '@material-ui/core/Popover';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = (theme) => ({
    table: {
        minWidth: 1800,
    },
    popover: {
        margin: theme.spacing.unit * 2,
    },
});

const OverviewTable = ({ classes }) => {
    const [popoverEl, setPopoverEl] = useState(null);
    return (
        <React.Fragment>
            <Popover
                id="simple-popper"
                open={!!popoverEl}
                anchorEl={popoverEl}
                onClose={() => setPopoverEl(null)}
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
            >
                <Typography className={classes.popover}>Toto vidim velky <span style={{ fontWeight: 'bold', color: 'red' }}>spatny</span></Typography>
            </Popover>
            <Table className={classes.table}>
                <TableHead>
                    <TableRow>
                        <TableCell>Tym</TableCell>
                        <TableCell>Projekt</TableCell>
                        <TableCell>Faze 1</TableCell>
                        <TableCell>Faze 2</TableCell>
                        <TableCell>Faze 3</TableCell>
                        <TableCell>Faze 4</TableCell>
                        <TableCell>Faze 5</TableCell>
                        <TableCell>Faze 6</TableCell>
                        <TableCell>Faze 7</TableCell>
                        <TableCell>Faze 8</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <TableCell rowSpan={3}>
                            Adam R <br />
                            Jarda Z
                        </TableCell>
                        <TableCell>
                            Skola 1
                        </TableCell>
                        <TableCell
                            style={{
                                backgroundColor: 'red',
                                color: 'white'
                            }}
                            onClick={(e) => {
                                setPopoverEl(e.currentTarget);
                            }}
                        >
                            1.1. - 25.1. 2019 - PROBLEM, KLIKNI
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Skola 2
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                    </TableRow>
                    <TableRow>
                        <TableCell>
                            Skola 3
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                        <TableCell>
                            1.1. - 25.1. 2019
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </React.Fragment>
    );
};

export default withStyles(styles)(OverviewTable);
