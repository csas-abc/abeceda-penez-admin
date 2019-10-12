import React from 'react';
import compose from 'ramda/src/compose';
import contains from 'ramda/src/contains';
import pluck from 'ramda/src/pluck';
import defaultTo from 'ramda/src/defaultTo';
import path from 'ramda/src/path';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Person from '@material-ui/icons/Person';
import People from '@material-ui/icons/People';
import Mood from '@material-ui/icons/Mood';
import Archive from '@material-ui/icons/Archive';
import ListItemText from '@material-ui/core/ListItemText';
import Subject from '@material-ui/icons/Subject';
import Work from '@material-ui/icons/Work';
import Message from '@material-ui/icons/Message';
import { withStyles } from '@material-ui/core';
import logo from '../assets/cs-logo.svg';
import { Link } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

const styles = theme => ({
    toolbar: {
        ...theme.mixins.toolbar,
        padding: '15px',
    },
    logo: {
        width: '100%',
    }
});

const Menu = ({ classes, meQuery }) => (
    <div>
        <div className={classes.toolbar}>
            <img src={logo} alt="Abeceda penez logo" className={classes.logo} />
        </div>
        <Divider />
        {meQuery.loading ? null : (
            <List>
                {compose(
                    contains('ADMIN'),
                    pluck('name'),
                    defaultTo([]),
                    path(['me', 'roles']),
                )(meQuery) ? (
                    <React.Fragment>
                        <ListItem button component={Link} to="/">
                            <ListItemIcon><Subject /></ListItemIcon>
                            <ListItemText primary="Přehled" />
                        </ListItem>
                        <ListItem button component={Link} to="/teams">
                            <ListItemIcon><People /></ListItemIcon>
                            <ListItemText primary="Správa týmů" />
                        </ListItem>
                    </React.Fragment>
                ) : null}
                <ListItem button component={Link} to="/toolboxes">
                    <ListItemIcon><Work /></ListItemIcon>
                    <ListItemText primary="Toolboxy" />
                </ListItem>
                <ListItem button component={Link} to="/fairs">
                    <ListItemIcon><Mood /></ListItemIcon>
                    <ListItemText primary="Jarmarky" />
                </ListItem>
                {compose(
                    contains('ADMIN'),
                    pluck('name'),
                    defaultTo([]),
                    path(['me', 'roles']),
                )(meQuery) ? (
                    <React.Fragment>
                        <ListItem button component={Link} to="/users">
                            <ListItemIcon><Person /></ListItemIcon>
                            <ListItemText primary="Uživatelé" />
                        </ListItem>
                        <ListItem button component={Link} to="/archive">
                            <ListItemIcon><Archive /></ListItemIcon>
                            <ListItemText primary="Archiv" />
                        </ListItem>
                    </React.Fragment>
                    ) : null}
                {compose(
                    contains('CORE'),
                    pluck('name'),
                    defaultTo([]),
                    path(['me', 'roles']),
                )(meQuery) ? (
                    <React.Fragment>
                        <ListItem button component={Link} to="/classrooms-management">
                            <ListItemIcon><Subject /></ListItemIcon>
                            <ListItemText primary="Správa tříd" />
                        </ListItem>
                    </React.Fragment>
                ) : null}
                <ListItem button component={Link} to="/forum">
                    <ListItemIcon><Message /></ListItemIcon>
                    <ListItemText primary="Forum" />
                </ListItem>
            </List>
        )}
    </div>
);

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
    withStyles(styles, { withTheme: true }),
)(Menu);
