import React, { useState } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import find from 'ramda/src/find';
import pathOr from 'ramda/src/pathOr';
import map from 'ramda/src/map';
import includes from 'ramda/src/includes';
import last from 'ramda/src/last';
import compose from 'ramda/src/compose';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Checkbox from '@material-ui/core/Checkbox';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import { CircularProgress, withStyles } from '@material-ui/core';
import validatePhase from '../utils/validatePhase';
import isNilOrEmpty from '../utils/isNilOrEmpty';

const PhaseTooltip = withStyles(theme => ({
    tooltip: {
        backgroundColor: 'rgba(221, 221, 221, 1)',
        opacity: 1,
        color: '#000',
        minWidth: 500,
        fontSize: theme.typography.pxToRem(12),
        border: '1px solid #dadde9',
    },
}))(Tooltip);

const styles = (theme) => {
    return {
        taskCheckItem: {
            cursor: 'pointer',
            '&:hover': {
                backgroundColor: theme.palette.action.hover,
            }
        }
    };
};

const ProjectState = ({
    classroom,
    userRoles,
    classes,
    switchCheckItemMutation,
    finishPhaseMutation,
}) => {
    const [loadingTaskCheck, setLoadingTaskCheck] = useState(null);
    const [finishPhaseLoading, setFinishPhaseLoading] = useState(false);
    const activePhase = classroom ? (find((phase) => !phase.finished)(classroom.phases || []) || last(classroom.phases || [])) : {};
    const allChecked = !find((task) => !task.checked)(pathOr([], ['checklist'])(activePhase || {}));
    const editable = includes('CORE')(userRoles) && !activePhase.finished;
    return (
        <div style={{ padding: '16px' }}>
            <Typography variant="headline">
                Krok: {`${activePhase.number} - ${activePhase.name}`}
            </Typography>
            <List>
                {compose(
                    map((task) => (
                        <ListItem
                            key={task.id}
                            onClick={() => {
                                if (!task.checked && !loadingTaskCheck) {
                                    setLoadingTaskCheck(task.id);
                                    switchCheckItemMutation({
                                        variables: {
                                            id: task.id,
                                        }
                                    }).then(() => {
                                        setLoadingTaskCheck(null);
                                    })
                                }
                            }}
                            className={classes.taskCheckItem}
                        >
                            {editable ? (
                                <React.Fragment>
                                    <ListItemIcon>
                                        {loadingTaskCheck === task.id ? <CircularProgress /> : <Checkbox checked={task.checked} color="primary" />}
                                    </ListItemIcon>
                                    <ListItemText primary={task.name} />
                                </React.Fragment>
                            ) : (
                                <React.Fragment>
                                    <ListItemIcon>
                                        {task.checked ? <Check color="primary" /> : <Close color="error" />}
                                    </ListItemIcon>
                                    <ListItemText primary={task.name} />
                                </React.Fragment>
                            )}
                        </ListItem>
                    )),
                    pathOr([], ['checklist']),
                )(activePhase)}
            </List>
            {editable ? (
                allChecked && isNilOrEmpty(validatePhase(activePhase, classroom)) ? (
                        <Button
                            color="primary"
                            variant="contained"
                            disabled={finishPhaseLoading}
                            onClick={() => {
                                setFinishPhaseLoading(true);
                                finishPhaseMutation({
                                    variables: {
                                        id: activePhase.id,
                                    },
                                }).then(() => {
                                    setFinishPhaseLoading(false);
                                })
                            }}
                        >
                            {finishPhaseLoading ? <CircularProgress /> : null} Dokončit
                        </Button>
                    ) : (
                        <PhaseTooltip
                            placement="top-start"
                            title={
                                <React.Fragment>
                                    {!allChecked ? (
                                        <Typography style={{ marginBottom: '4px', fontSize: '16px', fontWeight: 700 }}>
                                            Zaškrtněte všechny úkoly
                                        </Typography>
                                    ): null}
                                    {!isNilOrEmpty(validatePhase(activePhase, classroom)) ? (
                                        <React.Fragment>
                                            <Typography style={{ marginBottom: '4px', fontSize: '16px', fontWeight: 700 }}>
                                                Ještě musíte doplnit:
                                            </Typography>
                                            <ul>
                                                {map((error) => (
                                                    <li key={error} style={{ marginBottom: '4px', fontSize: '16px' }}>
                                                        {error}
                                                    </li>
                                                ))(validatePhase(activePhase, classroom))}
                                            </ul>
                                        </React.Fragment>
                                    ) : null}
                                </React.Fragment>
                            }
                        >
                            <span>
                                <Button
                                    color="primary"
                                    variant="contained"
                                    disabled
                                    onClick={() => {}}
                                >
                                    Dokončit
                                </Button>
                            </span>
                        </PhaseTooltip>
                )
            ) : null}
        </div>
    );
};

const SwitchCheckItemMutation = graphql(
    gql`
        mutation SwitchChecklistItem($id: ID!) {
            swithChecklistItem(id: $id) {
                id
                name
                checked
            }
        }
    `,
    {
        name: 'switchCheckItemMutation',
    }
);

export default compose(
    withStyles(styles),
    SwitchCheckItemMutation,
    graphql(gql`
        mutation FinishPhase($id: ID!) {
            finishPhase(id: $id) {
                id
                finished
            }
        }
    `, {
        name: 'finishPhaseMutation'
    }),
)(ProjectState);
