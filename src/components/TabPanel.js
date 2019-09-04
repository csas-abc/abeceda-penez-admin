import Typography from '@material-ui/core/Typography';
import React from 'react';

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            style={{ display: index !== value ? 'none' : null }}
            {...other}
        >
            {children}
        </Typography>
    );
};

export default TabPanel;
