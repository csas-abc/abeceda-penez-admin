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

const CreateUser = ({ onClose, classes, teamId, createUserMutation }) => {
    const [email, setEmail] = useState('');
    return (
        <Dialog
            open
            onClose={onClose}
            fullWidth
            maxWidth="md"
            classes={{
                paperWidthMd: classes.paper,
            }}
        >
            <DialogTitle>Vytvořit uživatele v týmu</DialogTitle>
            <DialogContent>
                <form
                    className={classes.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        createUserMutation({
                            variables: {
                                email,
                                securityCode: '123',
                                teamId,
                                role: 'VOLUNTEER',
                            }
                        }).then((res) => {
                            onClose();
                        }).catch((e) => {
                            console.error('ERROR', e);
                        })
                    }}
                >
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="email">E-mail</InputLabel>
                        <Input
                            id="email"
                            name="email"
                            autoComplete="email"
                            autoFocus
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </FormControl>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        type="submit"
                    >
                        Vytvorit
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const createUserMutation = graphql(gql`
    mutation CreateUserMutation($email: String!, $securityCode: String!, $teamId: ID!, $role: String!) {
        createUser(data: { email: $email, securityCode: $securityCode, teamId: $teamId, role: $role })
    }
`, {
    name: 'createUserMutation',
});

export default createUserMutation(withStyles(styles)(CreateUser));
