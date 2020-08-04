import React, { useState } from 'react';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import gql from 'graphql-tag';
import compose from 'ramda/src/compose';
import schoolAttributes from '../../constants/schoolAttributes';
import { graphql } from 'react-apollo';
import { useSnackbar } from 'notistack';
import Select from '@material-ui/core/Select';
import map from 'ramda/src/map';
import MenuItem from '@material-ui/core/MenuItem';
import Regions from '../../constants/Regions';
import SchoolStatuses from '../../constants/SchoolStatuses';
import SchoolStatusesHints from '../../constants/SchoolStatusesHints';
import styled from "styled-components";
import SubmitButton from "../SubmitButton.component";

const Buttons = styled.div`
position: absolute;
bottom: 0;
left: 0;
right: 0;
background-color: white;
display: flex;
padding: 10px 20px;
border-radius: 4px;
`

const EditSchoolForm = ({ onClose, school, updateSchoolMutation, deleteSchool }) => {

    const { enqueueSnackbar } = useSnackbar();

    const [name, setName] = useState(school.name || '');
    const [region, setRegion] = useState(school.region || '');
    const [note, setNote] = useState(school.note || '');
    const [street, setStreet] = useState(school.street || '');
    const [city, setCity] = useState(school.city || '');
    const [status, setStatus] = useState(school.status || '');

    return (
        <form
        >
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="name">Název</InputLabel>
                <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
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
                        <MenuItem key={region} value={region}>{region}</MenuItem>
                    ))(Regions)}
                </Select>
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="note">Poznámka</InputLabel>
                <Input
                    id="note"
                    name="note"
                    multiline
                    rows={3}
                    rowsMax={5}
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="street">Ulice a č.p.</InputLabel>
                <Input
                    id="street"
                    name="street"
                    multiline
                    rows={3}
                    rowsMax={5}
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="city">PSČ a město</InputLabel>
                <Input
                    id="city"
                    name="city"
                    multiline
                    rows={3}
                    rowsMax={5}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" required fullWidth style={{ marginBottom: 50 }}>
                <InputLabel htmlFor="status">Status</InputLabel>
                <Select
                    inputProps={{
                        id: 'schoolStatus',
                        name: 'schoolStatus'
                    }}
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    {map((schoolStatus) => (
                        <MenuItem key={schoolStatus} value={schoolStatus}><b>{schoolStatus}</b>&nbsp;(<i>{SchoolStatusesHints[schoolStatus]}</i>)</MenuItem>
                    ))(SchoolStatuses)}
                </Select>
            </FormControl>
             <Buttons>
                <SubmitButton
                        color="primary" value="Uložit" actionHandler={e => {
                            e.preventDefault();
                            updateSchoolMutation({
                                variables: {
                                    id: school.id,
                                    name,
                                    region,
                                    note,
                                    street,
                                    city,
                                    status,
                                }
                            }).then(() => {
                                onClose(true);
                                enqueueSnackbar(
                                    'Škola byla úspěšně uložena',
                                    {
                                        variant: 'success',
                                        autoHideDuration: 4000,
                                        anchorOrigin: {
                                            horizontal: 'center',
                                            vertical: 'top',
                                        },
                                    }
                                )
                            }).catch((e) => {
                                console.error('ERROR', e);
                            })
                        }}
                        style={{
                            marginTop: "10px"
                        }}

                        />
                <SubmitButton color="secondary" value="Smazat" actionHandler={e => {
                            e.preventDefault();
                            deleteSchool({
                                variables: {
                                    id: school.id
                                }
                            }).then(() => {
                                onClose(true);
                                enqueueSnackbar(
                                    'Škola byla úspěšně smazána',
                                    {
                                        variant: 'success',
                                        autoHideDuration: 4000,
                                        anchorOrigin: {
                                            horizontal: 'center',
                                            vertical: 'top',
                                        },
                                    }
                                )
                            }).catch((e) => {
                                console.error('ERROR', e);
                            })
                        }}
                        style={{
                            marginTop: "10px"
                        }}
                        />
             </Buttons>
        </form>
    );
};

const updateSchoolMutation = graphql(gql`
mutation UpdateSchool(
    $id: ID!
    $name: String
    $region: String
    $note: String
    $street: String
    $city: String
    $status: String
) {
    updateSchool(
        data: {
            id: $id
            name: $name
            region: $region
            note: $note
            street: $street
            city: $city
            status: $status
        }
    ) {
        ${schoolAttributes}
    }
}
`,
    {
        name: 'updateSchoolMutation',
    },
)
const deleteSchool = graphql(gql`
mutation DeleteSchool($id: ID!) {
    deleteSchool(id: $id)
}
`,
    {
        name: 'deleteSchool',
    },
)

export default compose(
    updateSchoolMutation,
    deleteSchool
)(EditSchoolForm);
