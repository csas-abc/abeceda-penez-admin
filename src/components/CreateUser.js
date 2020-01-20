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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Regions from '../constants/Regions';
import map from 'ramda/src/map';
import compose from 'ramda/src/compose';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const CreateUser = ({ onClose, classes, teamId, createUserMutation }) => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [region, setRegion] = useState('');
    const [role, setRole] = useState('VOLUNTEER');
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
            <DialogTitle>Vytvořit uživatele v týmu</DialogTitle>
            <DialogContent>
                <form
                    className={classes.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        createUserMutation({
                            variables: {
                                email,
                                firstname,
                                lastname,
                                region,
                                phone,
                                securityCode: `${Math.floor((Math.random() * 999999) + 100000)}`,
                                teamId,
                                role,
                            }
                        }).then(() => {
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
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="fistname">Jméno</InputLabel>
                        <Input
                            id="firstname"
                            name="firstname"
                            value={firstname}
                            onChange={(e) => setFirstname(e.target.value)}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="lastname">Příjmení</InputLabel>
                        <Input
                            id="lastname"
                            name="lastname"
                            value={lastname}
                            onChange={(e) => setLastname(e.target.value)}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="phone">Telefon</InputLabel>
                        <Input
                            id="phone"
                            name="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="region">Region</InputLabel>
                        <Select
                            inputProps={{
                                id: 'region',
                                name: 'region'
                            }}
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                        >
                            {map((region) => (
                                <MenuItem value={region}>{region}</MenuItem>
                            ))(Regions)}
                        </Select>
                    </FormControl>
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="role">Role</InputLabel>
                        <Select
                            inputProps={{
                                id: 'role',
                                name: 'role'
                            }}
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="VOLUNTEER">Dobrovolník</MenuItem>
                            <MenuItem value="CORE">RMKT</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        type="submit"
                    >
                        Vytvořit
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const createUserMutation = graphql(gql`
    mutation CreateUserMutation($email: String!, $firstname: String!, $lastname: String!, $region: String!, $phone: String!, $securityCode: String!, $teamId: ID!, $role: String!) {
        createUser(data: { email: $email, firstname: $firstname, lastname: $lastname, region: $region, phone: $phone, securityCode: $securityCode, teamId: $teamId, role: $role })
    }
`, {
    name: 'createUserMutation',
});

export default compose(
    createUserMutation,
    withStyles(styles),
)(CreateUser);
