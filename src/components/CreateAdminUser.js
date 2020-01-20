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
import compose from 'ramda/src/compose';
import map from 'ramda/src/map';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const CreateAdminUser = ({ onClose, classes, createUserMutation, fairAgenciesQuery }) => {
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [role, setRole] = useState('ADMIN');
    const [fairAgency, setFairAgency] = useState('');
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
            <DialogTitle>Vytvořit uživatele administrátorské aplikace</DialogTitle>
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
                                phone,
                                securityCode: `${Math.floor((Math.random() * 999999) + 100000)}`,
                                role,
                                ...role === 'CORE_AGENCY' ? { fairAgencyId: fairAgency } : {},
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
                        <InputLabel htmlFor="role">Role</InputLabel>
                        <Select
                            inputProps={{
                                id: 'role',
                                name: 'role'
                            }}
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                        >
                            <MenuItem value="ADMIN">Administrátor</MenuItem>
                            <MenuItem value="AGENCY">Agentura</MenuItem>
                            <MenuItem value="CORE_AGENCY">Regionální agentura (RMKT)</MenuItem>
                        </Select>
                    </FormControl>
                    {role === 'CORE_AGENCY' ? (
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="fairAgency">Agentura</InputLabel>
                            <Select
                                inputProps={{
                                    id: 'fairAgency',
                                    name: 'fairAgency'
                                }}
                                value={fairAgency}
                                onChange={(e) => setFairAgency(e.target.value)}
                            >
                                {compose(
                                    map((fairAgency) => (
                                        <MenuItem key={fairAgency.id} value={fairAgency.id}>{`${fairAgency.name} (${fairAgency.regions.join(', ')})`}</MenuItem>
                                    )),
                                )(fairAgenciesQuery.fairAgencies || [])}
                            </Select>
                        </FormControl>
                    ) : null}
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
    mutation CreateUserMutation($email: String!, $firstname: String!, $lastname: String!, $phone: String!, $securityCode: String!, $role: String!, $fairAgencyId: ID) {
        createUser(data: { email: $email, firstname: $firstname, lastname: $lastname, phone: $phone, securityCode: $securityCode, role: $role, fairAgencyId: $fairAgencyId })
    }
`, {
    name: 'createUserMutation',
});

const fairAgenciesQuery = graphql(gql`
            {
                fairAgencies {
                    id
                    name
                    regions
                }
            }
    `,
    {
        name: 'fairAgenciesQuery',
        options: {
            fetchPolicy: 'cache-and-network',
        }
    });

export default compose(
    createUserMutation,
    fairAgenciesQuery,
    withStyles(styles),
)(CreateAdminUser);
