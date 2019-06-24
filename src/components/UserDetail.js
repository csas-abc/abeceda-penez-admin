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

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const UserDetail = ({
    onClose,
    classes,
    updateUserMutation,
    user,
}) => {
    const [firstname, setFirstname] = useState(user.firstname);
    const [lastname, setLastname] = useState(user.lastname);
    const [phone, setPhone] = useState(user.phone);
    const [region, setRegion] = useState(user.region);

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
            <DialogTitle>Detail uživatele</DialogTitle>
            <DialogContent>
                <form
                    className={classes.form}
                    onSubmit={(e) => {
                        e.preventDefault();
                        updateUserMutation({
                            variables: {
                                id: user.id,
                                firstname,
                                lastname,
                                phone,
                                region,
                            }
                        }).then(() => {
                            onClose();
                        }).catch((e) => {
                            console.error('ERROR', e);
                        })
                    }}
                >
                    <FormControl margin="normal" required fullWidth>
                        <InputLabel htmlFor="firstname">Jméno</InputLabel>
                        <Input
                            id="firstname"
                            name="firstname"
                            autoFocus
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
                        <InputLabel htmlFor="phone">Region</InputLabel>
                        <Select
                            inputProps={{
                                id: 'region',
                                name: 'region'
                            }}
                            value={region}
                            onChange={(e) => setRegion(e.target.value)}
                        >
                            <MenuItem value="PHA">PHA</MenuItem>
                            <MenuItem value="JZČ">JZČ</MenuItem>
                            <MenuItem value="JM">JM</MenuItem>
                            <MenuItem value="SM">SM</MenuItem>
                            <MenuItem value="SZČ">SZČ</MenuItem>
                            <MenuItem value="VČ">VČ</MenuItem>
                        </Select>
                    </FormControl>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        type="submit"
                    >
                        Uložit
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const updateUserMutation = graphql(gql`
    mutation UpdateUserMutation($firstname: String, $lastname: String, $phone: String, $region: String, $id: ID!) {
        updateUser(
            data: {
                firstname: $firstname
                lastname: $lastname
                phone: $phone
                region: $region
            },
            id: $id
        ){
            id
            firstname
            lastname
            region
            phone
        }
    }
`, {
    name: 'updateUserMutation',
});

export default updateUserMutation(withStyles(styles)(UserDetail));
