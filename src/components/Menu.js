import React from 'react';
import compose from 'ramda/src/compose';
import map from 'ramda/src/map';
import Divider from '@material-ui/core/Divider';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Collapse from '@material-ui/core/Collapse';
import Person from '@material-ui/icons/Person';
import People from '@material-ui/icons/People';
import Mood from '@material-ui/icons/Mood';
import Archive from '@material-ui/icons/Archive';
import Delete from '@material-ui/icons/Delete';
import ListItemText from '@material-ui/core/ListItemText';
import Subject from '@material-ui/icons/Subject';
import Assessment from '@material-ui/icons/Assessment';
import Work from '@material-ui/icons/Work';
import Message from '@material-ui/icons/Message';
import Money from '@material-ui/icons/Money';
import Today from '@material-ui/icons/Today';
import Domain from '@material-ui/icons/Domain';
import { withStyles } from '@material-ui/core';
import logo from '../assets/cs-logo.svg';
import { NavLink } from 'react-router-dom';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { all, any, none } from '../utils/permissions';
import Regions from '../constants/Regions';

const styles = theme => ({
    toolbar: {
        ...theme.mixins.toolbar,
        padding: '15px',
    },
    logo: {
        width: '100%',
    },
    nested: {
        paddingLeft: '73px',
    },
    active: {
        backgroundColor: 'rgb(235, 235, 235)',
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
                {all(['ADMIN'])(meQuery) ? (
                    <React.Fragment>
                        <ListItem button component={NavLink} to="/" exact activeClassName={classes.active}>
                            <ListItemIcon><Subject /></ListItemIcon>
                            <ListItemText primary="AP 4.třídy" />
                        </ListItem>
                        <ListItem button component={NavLink} to="/core-projects" exact activeClassName={classes.active}>
                            <ListItemIcon><Subject /></ListItemIcon>
                            <ListItemText primary="Přehled RMKT" />
                        </ListItem>
                    </React.Fragment>
                ) : null}
                {any(['ADMIN', 'CORE'])(meQuery) ? (
                    <ListItem button component={NavLink} to="/vap-projects" exact activeClassName={classes.active}>
                        <ListItemIcon><Subject /></ListItemIcon>
                        <ListItemText primary="VAP" />
                    </ListItem>
                ) : null}
                {all(['ADMIN'])(meQuery) ? (
                    <ListItem button component={NavLink} to="/teams" exact activeClassName={classes.active}>
                        <ListItemIcon><People /></ListItemIcon>
                        <ListItemText primary="Správa týmů" />
                    </ListItem>
                ) : null}
                {any(['ADMIN', 'AGENCY'])(meQuery) ? (
                    <ListItem button component={NavLink} to="/toolboxes" exact activeClassName={classes.active}>
                        <ListItemIcon><Work /></ListItemIcon>
                        <ListItemText primary="Toolboxy" />
                    </ListItem>
                ) : null}
                {any(['ADMIN', 'AGENCY', 'CORE_AGENCY'])(meQuery) ? (
                    <ListItem button component={NavLink} to="/fairs" exact activeClassName={classes.active}>
                        <ListItemIcon><Mood /></ListItemIcon>
                        <ListItemText primary="Jarmarky" />
                    </ListItem>
                ) : null}
                {all(['ADMIN'])(meQuery) ? (
                    <React.Fragment>
                        <ListItem button component={NavLink} to="/users" exact activeClassName={classes.active}>
                            <ListItemIcon><Person /></ListItemIcon>
                            <ListItemText primary="Uživatelé" />
                        </ListItem>
                        <ListItem button component={NavLink} to="/statistics" exact activeClassName={classes.active}>
                            <ListItemIcon><Assessment /></ListItemIcon>
                            <ListItemText primary="Reporty" />
                        </ListItem>
                        <ListItem button component={NavLink} to="/budgets" exact activeClassName={classes.active}>
                            <ListItemIcon><Money /></ListItemIcon>
                            <ListItemText primary="Budgety" />
                        </ListItem>
                        <ListItem button component={NavLink} to="/schools" exact activeClassName={classes.active}>
                            <ListItemIcon><Domain /></ListItemIcon>
                            <ListItemText primary="Školy" />
                        </ListItem>
                    </React.Fragment>
                ) : null}
                {all(['CORE'])(meQuery) ? (
                    <React.Fragment>
                        <ListItem button component={NavLink} to="/classrooms-management" exact activeClassName={classes.active}>
                            <ListItemIcon><Subject /></ListItemIcon>
                            <ListItemText primary="AP 4.třídy" />
                        </ListItem>
                        <ListItem component="span">
                            <ListItemIcon><People /></ListItemIcon>
                            <ListItemText primary="AP regiony" />
                        </ListItem>
                        <Collapse in timeout="auto" unmountOnExit>
                            <List component="div" disablePadding>
                                {map((region) => (
                                    <ListItem
                                        key={region}
                                        button
                                        component={NavLink}
                                        to={`/core-region/${region}`}
                                        className={classes.nested}
                                        exact
                                        activeClassName={classes.active}
                                    >
                                        <ListItemText primary={region} />
                                    </ListItem>
                                ))(Regions)}
                            </List>
                        </Collapse>
                    </React.Fragment>
                ) : null}
                {none(['AGENCY', 'CORE_AGENCY', 'CORE'])(meQuery) ? (
                    <ListItem button component={NavLink} to="/forum" exact activeClassName={classes.active}>
                        <ListItemIcon><Message /></ListItemIcon>
                        <ListItemText primary="Forum" />
                    </ListItem>
                ) : null}
                {any(['ADMIN', 'CORE']) ? (
                    <ListItem button component={NavLink} to="/roadmap" exact activeClassName={classes.active}>
                        <ListItemIcon><Today /></ListItemIcon>
                        <ListItemText primary="Akce RMKT" />
                    </ListItem>
                ) : null}
                {any(['CORE'])(meQuery) ? (
                    <React.Fragment>
                        <ListItem button component={NavLink} to="/budgets" exact activeClassName={classes.active}>
                            <ListItemIcon><Money /></ListItemIcon>
                            <ListItemText primary="Budgety" />
                        </ListItem>
                        <ListItem button component={NavLink} to="/schools" exact activeClassName={classes.active}>
                            <ListItemIcon><Domain /></ListItemIcon>
                            <ListItemText primary="Školy" />
                        </ListItem>
                        <ListItem button component={NavLink} to="/statistics" exact activeClassName={classes.active}>
                            <ListItemIcon><Assessment /></ListItemIcon>
                            <ListItemText primary="Reporty" />
                        </ListItem>
                        <ListItem button component={NavLink} to="/core-toolboxes" exact activeClassName={classes.active}>
                            <ListItemIcon><Work /></ListItemIcon>
                            <ListItemText primary="Toolboxy" />
                        </ListItem>
                        <ListItem button component={NavLink} to="/core-fairs" exact activeClassName={classes.active}>
                            <ListItemIcon><Mood /></ListItemIcon>
                            <ListItemText primary="Jarmarky" />
                        </ListItem>
                    </React.Fragment>

                ) : null}
                {any(['ADMIN', 'SUPER_ADMIN', 'CORE'])(meQuery) ? (
                    <ListItem button component={NavLink} to="/archive" exact activeClassName={classes.active}>
                        <ListItemIcon><Archive /></ListItemIcon>
                        <ListItemText primary="Archiv" />
                    </ListItem>
                ) : null}
                {any(['ADMIN'])(meQuery) ? (
                    <ListItem button component={NavLink} to="/deleted" exact activeClassName={classes.active}>
                        <ListItemIcon><Delete /></ListItemIcon>
                        <ListItemText primary="Koš" />
                    </ListItem>
                ) : null}
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
