import React from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import AccountCircle from '@material-ui/icons/AccountCircle';
import ShoppingCart from '@material-ui/icons/ShoppingCart';
import People from '@material-ui/icons/People';
import ListItemText from '@material-ui/core/ListItemText';
import { withStyles } from '@material-ui/core';
import logo from '../abeceda-logo.png';
import { Link } from 'react-router-dom';

const styles = theme => ({
    toolbar: theme.mixins.toolbar,
    logo: {
        width: '100%',
    }
});

const Menu = ({ classes }) => (
    <div>
        <div className={classes.toolbar}>
            <img src={logo} alt="Abeceda penez logo" className={classes.logo} />
        </div>
        <Divider />
        <List>
            <ListItem button component={Link} to="/">
                <ListItemIcon><People /></ListItemIcon>
                <ListItemText primary="Týmy" />
            </ListItem>
            <ListItem button component={Link} to="/users">
                <ListItemIcon><AccountCircle /></ListItemIcon>
                <ListItemText primary="Uživatelé" />
            </ListItem>
            <ListItem button component={Link} to="/toolboxes">
                <ListItemIcon><ShoppingCart /></ListItemIcon>
                <ListItemText primary="Toolboxy" />
            </ListItem>
        </List>
    </div>
);

export default withStyles(styles, { withTheme: true })(Menu);
