import React, { useState } from 'react';
import compose from 'ramda/src/compose';
import { withRouter } from 'react-router-dom';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import Drawer from '@material-ui/core/Drawer';
import { withStyles } from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Menu from './Menu';

const drawerWidth = 240;

const styles = theme => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
    },
    appBar: {
        marginLeft: drawerWidth,
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
        },
    },
    menuButton: {
        marginRight: 20,
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbar: theme.mixins.toolbar,
});

const Layout = ({ children, classes, container, theme, title, history: { push } }) => {

    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className={classes.root}>
            <CssBaseline />
            <nav className={classes.drawer}>
                <Hidden smUp implementation="css">
                    <Drawer
                        container={container}
                        variant="temporary"
                        anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                        open={mobileOpen}
                        onClose={() => setMobileOpen(!mobileOpen)}
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                    >
                        <Menu />
                    </Drawer>
                </Hidden>
                <Hidden xsDown implementation="css">
                    <Drawer
                        classes={{
                            paper: classes.drawerPaper,
                        }}
                        variant="permanent"
                        open
                    >
                        <Menu />
                    </Drawer>
                </Hidden>
            </nav>
            <main className={classes.content}>
                <AppBar position="fixed" className={classes.appBar}>
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="Open drawer"
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className={classes.menuButton}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" color="inherit" noWrap style={{ flexGrow: 1 }}>
                            {title}
                        </Typography>
                        <IconButton
                            onClick={() => {
                                localStorage.removeItem('token');
                                push('/login');
                            }}
                            color="inherit"
                        >
                            <AccountCircle />
                        </IconButton>
                    </Toolbar>

                </AppBar>
                <div className={classes.toolbar} />
                {children}
            </main>
        </div>
    );
};

export default compose(
    withStyles(styles, { withTheme: true }),
    withRouter,
)(Layout);
