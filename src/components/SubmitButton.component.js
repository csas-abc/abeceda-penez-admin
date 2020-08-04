import React from "react";
import Button from "@material-ui/core/Button";
import PropTypes from "prop-types";


const SubmitButton =  ({ value, classes, editDisabled, actionHandler, color }) => (
    <Button
        style={{
            margin: 5
        }}
        fullWidth
        variant="contained"
        color={color}
        className={classes ? classes.submit : null}
        onClick={actionHandler}
        disabled={editDisabled}
    >
        {value}
    </Button>
);

SubmitButton.propTypes = {
    value: PropTypes.string,
    classes: PropTypes.object,
    editDisabled: PropTypes.bool,
    actionHandler: PropTypes.func,
    color: PropTypes.string
}

export default SubmitButton;