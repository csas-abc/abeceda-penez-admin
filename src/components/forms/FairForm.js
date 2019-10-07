import React, { useState } from 'react';
import compose from 'ramda/src/compose';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import DatePicker from 'material-ui-pickers/DatePicker';
import TimePicker from 'material-ui-pickers/TimePicker';
import updateClassroomMutation from '../../utils/updateClassroomMutation';
import { graphql } from 'react-apollo';
import Select from '@material-ui/core/Select';
import replace from 'ramda/src/replace';
import MenuItem from '@material-ui/core/MenuItem';
import { useSnackbar } from 'notistack';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const FairModal = ({
    onClose,
    classes,
    updateClassroomMutation,
    classroom,
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
                        kioskPlace
                    }
                }).then(() => {
                    onClose();
                }).catch((e) => {
                    enqueueSnackbar(replace('GraphQL error: ', '')(e.message), { variant: 'error' });
                    console.error('ERROR', e);
                })
            }}
        >
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
    withStyles(styles)
)(FairModal);
