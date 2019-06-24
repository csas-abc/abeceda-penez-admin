import React, { useState } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const ChangePassword = ({ onClose, classes, changePassword }) => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPasswordCheck, setNewPasswordCheck] = useState('');
    return (
        <Dialog
            open
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            classes={{
                paperWidthMd: classes.paper,
            }}
        >
            <DialogTitle>Změnit heslo</DialogTitle>
            <DialogContent>
                <form
                    className={classes.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        changePassword({
                            variables: {
                                oldPassword,
                                newPassword,
                            }
                        }).then(() => {
                            onClose();
                        }).catch((e) => {
                            console.error('ERROR', e);
                        })
                    }}
                >
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="oldPassword">Staré heslo</InputLabel>
                        <Input
                            id="oldPassword"
                            name="oldPassword"
                            type="password"
                            autoFocus
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="newPassword">Nové heslo</InputLabel>
                        <Input
                            id="newPassword"
                            name="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="newPasswordCheck">Nové heslo ještě jednou</InputLabel>
                        <Input
                            id="newPasswordCheck"
                            name="newPasswordCheck"
                            type="password"
                            value={newPasswordCheck}
                            onChange={(e) => setNewPasswordCheck(e.target.value)}
                        />
                    </FormControl>
                    <Button
                        fullWidth
                        disabled={!newPassword || newPassword === '' || newPassword !== newPasswordCheck}
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        type="submit"
                    >
                        Změnit
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const changePasswordMutation = graphql(gql`
    mutation ChangePasswordMutation($oldPassword: String!, $newPassword: String!) {
        changePassword(oldPassword: $oldPassword, newPassword: $newPassword)
    }
`, {
    name: 'changePassword',
});

export default changePasswordMutation(withStyles(styles)(ChangePassword));
