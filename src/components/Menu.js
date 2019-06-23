import React from 'react';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Person from '@material-ui/icons/Person';
import People from '@material-ui/icons/People';
import Mood from '@material-ui/icons/Mood';
import Attachment from '@material-ui/icons/Attachment';
import ListItemText from '@material-ui/core/ListItemText';
import Subject from '@material-ui/icons/Subject';
import Work from '@material-ui/icons/Work';
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
                <ListItemIcon><Subject /></ListItemIcon>
                <ListItemText primary="Přehled" />
            </ListItem>
            <ListItem button component={Link} to="/teams">
                <ListItemIcon><People /></ListItemIcon>
                <ListItemText primary="Týmy" />
            </ListItem>
            <ListItem button component={Link} to="/toolboxes">
                <ListItemIcon><Work /></ListItemIcon>
                <ListItemText primary="Toolboxy" />
            </ListItem>
            <ListItem button component={Link} to="/fairs">
                <ListItemIcon><Mood /></ListItemIcon>
                <ListItemText primary="Jarmarky" />
            </ListItem>
            <ListItem button component={Link} to="/users">
                <ListItemIcon><Person /></ListItemIcon>
                <ListItemText primary="Uživatelé" />
            </ListItem>
            <ListItem button component={Link} to="/files">
                <ListItemIcon><Attachment /></ListItemIcon>
                <ListItemText primary="Dokumenty" />
            </ListItem>
        </List>
    </div>
);

export default withStyles(styles, { withTheme: true })(Menu);
