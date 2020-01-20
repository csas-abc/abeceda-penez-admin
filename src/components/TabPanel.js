import Typography from '@material-ui/core/Typography';
import React from 'react';

const TabPanel = (props) => {
    const { children, value, id, ...other } = props;
    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== id}
            id={`simple-tabpanel-${id}`}
            aria-labelledby={`simple-tab-${id}`}
            style={{ display: id !== value ? 'none' : null }}
            {...other}
        >
            {children}
        </Typography>
    );
};

export default TabPanel;
