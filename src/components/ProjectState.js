import React from 'react';
import find from 'ramda/src/find';
import pathOr from 'ramda/src/pathOr';
import map from 'ramda/src/map';
import compose from 'ramda/src/compose';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import Check from '@material-ui/icons/Check';
import Close from '@material-ui/icons/Close';
import { Typography } from '@material-ui/core';

const ProjectState = ({ classroom }) => {
    const activePhase = find((phase) => !phase.finished)(classroom.phases);
    return (
        <div style={{ padding: '16px' }}>
            <Typography variant="headline">
                Krok: {`${activePhase.number} - ${activePhase.name}`}
            </Typography>
            <List>
                {compose(
                    map((task) => (
                        <ListItem key={task.id}>
                            <ListItemIcon>
                                {task.checked ? <Check color="primary" /> : <Close color="error" />}
                            </ListItemIcon>
                            <ListItemText primary={task.name} />
                        </ListItem>
                    )),
                    pathOr([], ['checklist']),
                )(activePhase)}
            </List>
        </div>
    );
};

export default ProjectState;
