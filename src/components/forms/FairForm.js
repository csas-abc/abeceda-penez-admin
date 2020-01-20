import React, { useState } from 'react';
import gql from 'graphql-tag';
import compose from 'ramda/src/compose';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import CircularProgress from '@material-ui/core/CircularProgress';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import DatePicker from 'material-ui-pickers/DatePicker';
import TimePicker from 'material-ui-pickers/TimePicker';
import updateClassroomMutation from '../../utils/updateClassroomMutation';
import { graphql } from 'react-apollo';
import Select from '@material-ui/core/Select';
import replace from 'ramda/src/replace';
import pathOr from 'ramda/src/pathOr';
import map from 'ramda/src/map';
import filter from 'ramda/src/filter';
import includes from 'ramda/src/includes';
import path from 'ramda/src/path';
import MenuItem from '@material-ui/core/MenuItem';
import { useSnackbar } from 'notistack';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const FairModal = ({
    classes,
    updateClassroomMutation,
    classroom,
    fairAgenciesQuery,
    editDisabled,
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [fairDate, setFairDate] = useState(classroom.fairDate);
    const [childrenCount, setChildrenCount] = useState(classroom.childrenCount || '');
    const [kioskReadyTime, setKioskReadyTime] = useState(classroom.kioskReadyTime);
    const [fairTime, setFairTime] = useState(classroom.fairTime);
    const [fairEnd, setFairEnd] = useState(classroom.fairEnd);
    const [fairNote, setFairNote] = useState(classroom.fairNote || '');
    const [fairElectricity, setFairElectricity] = useState(classroom.fairElectricity || '');
    const [fairAnnexationState, setFairAnnexationState] = useState(classroom.fairAnnexationState || '');
    const [fairAnnexationNote, setFairAnnexationNote] = useState(classroom.fairAnnexationNote || '');
    const [kioskPlace, setKioskPlace] = useState(classroom.kioskPlace || '');
    const [fairAgency, setFairAgency] = useState(pathOr('', ['fairAgency', 'id'])(classroom));
    return (
        <form
            className={classes.form}
            onSubmit={(e) => {
                e.preventDefault();
                updateClassroomMutation({
                    variables: {
                        id: classroom.id,
                        fairDate,
                        childrenCount,
                        kioskReadyTime,
                        fairTime,
                        fairEnd,
                        fairNote,
                        fairElectricity,
                        fairAnnexationState,
                        fairAnnexationNote,
                        kioskPlace,
                        ...fairAgency ? {
                            fairAgency: {
                                connect: {
                                    id: fairAgency,
                                }
                            }
                        } : {}
                    }
                }).catch((e) => {
                    enqueueSnackbar(replace('GraphQL error: ', '')(e.message), { variant: 'error' });
                    console.error('ERROR', e);
                })
            }}
        >
            {classroom.type === 'CORE' ? (
                fairAgenciesQuery.loading ? <CircularProgress /> : (
                <FormControl margin="normal" fullWidth>
                    <InputLabel htmlFor="fairAgency">Regionální agentura</InputLabel>
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
                                <MenuItem key={fairAgency.id} value={fairAgency.id}>{fairAgency.name}</MenuItem>
                            )),
                            filter((agency) => includes(path(['team', 'users', 0, 'region'])(classroom))(agency.regions))
                        )(fairAgenciesQuery.fairAgencies || [])}
                    </Select>
                </FormControl>)
            ) : null}
            <FormControl margin="normal" fullWidth>
                <DatePicker
                    id="fairDate"
                    name="fairDate"
                    value={fairDate}
                    onChange={setFairDate}
                    label="Datum jarmarku"
                    format="DD.MM.YYYY"
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="childrenCount">Počet dětí</InputLabel>
                <Input
                    id="childrenCount"
                    name="childrenCount"
                    value={childrenCount}
                    onChange={(e) => setChildrenCount(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <TimePicker
                    id="kioskReadyTime"
                    name="kioskReadyTime"
                    value={kioskReadyTime}
                    onChange={setKioskReadyTime}
                    label="Postavení stánků"
                    ampm={false}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <TimePicker
                    id="fairTime"
                    name="fairTime"
                    value={fairTime}
                    onChange={setFairTime}
                    label="Začátek jarmarku"
                    ampm={false}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <TimePicker
                    id="fairEnd"
                    name="fairEnd"
                    value={fairEnd}
                    onChange={setFairEnd}
                    label="Konec jarmarku"
                    ampm={false}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="fairNote">Poznámka</InputLabel>
                <Input
                    id="fairNote"
                    name="fairNote"
                    multiline
                    rows={3}
                    rowsMax={5}
                    value={fairNote}
                    onChange={(e) => setFairNote(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="fairNote">Elektřina</InputLabel>
                <Input
                    id="fairElectricity"
                    name="fairElectricity"
                    multiline
                    rows={3}
                    rowsMax={5}
                    value={fairElectricity}
                    onChange={(e) => setFairElectricity(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="fairAnnexationState">Stav záboru</InputLabel>
                <Select
                    inputProps={{
                        id: 'fairAnnexationState',
                        name: 'fairAnnexationState'
                    }}
                    value={fairAnnexationState}
                    onChange={(e) => setFairAnnexationState(e.target.value)}
                >
                    <MenuItem value="Začal">Začal</MenuItem>
                    <MenuItem value="Nezačal">Nezačal</MenuItem>
                </Select>
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="fairNote">Poznámka k záboru</InputLabel>
                <Input
                    id="fairAnnexationNote"
                    name="fairAnnexationNote"
                    multiline
                    rows={3}
                    rowsMax={5}
                    value={fairAnnexationNote}
                    onChange={(e) => setFairAnnexationNote(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="kioskPlace">Prostor ČS?</InputLabel>
                <Select
                    inputProps={{
                        id: 'kioskPlace',
                        name: 'kioskPlace'
                    }}
                    value={kioskPlace}
                    onChange={(e) => setKioskPlace(e.target.value)}
                >
                    <MenuItem value="ANO">ANO</MenuItem>
                    <MenuItem value="NE">NE</MenuItem>
                    <MenuItem value="Pobočka je v OC">Pobočka je v OC</MenuItem>
                </Select>
            </FormControl>
            <Button
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                type="submit"
                disabled={editDisabled}
            >
                Uložit
            </Button>
        </form>
    );
};

export default compose(
    graphql(
        updateClassroomMutation,
        {
            name: 'updateClassroomMutation',
        },
    ),
    graphql(gql`
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
    }),
    withStyles(styles)
)(FairModal);
