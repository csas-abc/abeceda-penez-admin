import React, { useState } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { useSnackbar } from 'notistack';
import CircularProgress from '@material-ui/core/CircularProgress';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import roadmapEventAttributes from '../../constants/roadmapEventAttributes';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import map from 'ramda/src/map';
import compose from 'ramda/src/compose';
import pathEq from 'ramda/src/pathEq';
import propOr from 'ramda/src/propOr';
import MenuItem from '@material-ui/core/MenuItem';
import Regions from '../../constants/Regions';
import DatePicker from 'material-ui-pickers/DateTimePicker';
import { all } from '../../utils/permissions';
import RoadmapEventPhotos from '../RoamapEventPhotos';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const EditRoadmapEventModal = ({
    onClose,
    classes,
    updateRoadmapEventMutation,
    meQuery,
    roadmapEvent,
    setDeleteItem
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const isCoreUser = all(['CORE'])(meQuery);
    const isAdmin = all(['ADMIN'])(meQuery);
    const isEditable = isAdmin || (pathEq(['me', 'region'], propOr('', 'region')(roadmapEvent))(meQuery));
    const [name, setName] = useState(propOr('', 'name')(roadmapEvent));
    const [region, setRegion] = useState(propOr('', 'region')(roadmapEvent));
    const [segment, setSegment] = useState(propOr('', 'segment')(roadmapEvent));
    const [from, setFrom] = useState(new Date(propOr(null, 'from')(roadmapEvent)));
    const [to, setTo] = useState(new Date(propOr(null, 'to')(roadmapEvent)));
    const [description, setDescription] = useState(propOr('', 'description')(roadmapEvent));
    const [address, setAddress] = useState(propOr('', 'address')(roadmapEvent));
    const [budgetMMA, setBudgetMMA] = useState(propOr('', 'budgetMMA')(roadmapEvent));
    const [budgetMSE, setBudgetMSE] = useState(propOr('', 'budgetMSE')(roadmapEvent));
    const [budgetEXHYP, setBudgetEXHYP] = useState(propOr('', 'overBudget')(roadmapEvent));
    const [overBudget, setOverBudget] = useState(propOr('', 'overBudget')(roadmapEvent));
    const [nps, setNps] = useState(propOr('', 'nps')(roadmapEvent));
    const [note, setNote] = useState(propOr('', 'note')(roadmapEvent));
    const [evaluation, setEvaluation] = useState(propOr('', 'evaluation')(roadmapEvent));
    const [internalClient, setInternalClient] = useState(propOr('', 'internalClient')(roadmapEvent));
    const [finMaterial, setFinMaterial] = useState(propOr('', 'finMaterial')(roadmapEvent));
    // const [photoLink, setPhotoLink] = useState(propOr('', 'photoLink')(roadmapEvent));
    // TBD in next commit - steven

    const [loading, setLoading] = useState(false);
    return (
        <form
            className={classes.form}
            onSubmit={(e) => {
                setLoading(true);
                e.preventDefault();
                updateRoadmapEventMutation({
                    variables: {
                        id: roadmapEvent.id,
                        name,
                        region,
                        segment,
                        from,
                        to,
                        description,
                        address,
                        budgetMMA: parseInt(budgetMMA, 10),
                        budgetMSE: parseInt(budgetMSE, 10),
                        budgetEXHYP: parseInt(budgetEXHYP, 10),
                        overBudget: parseInt(overBudget, 10),
                        nps,
                        note,
                        evaluation,
                        internalClient,
                        finMaterial,
                    }
                }).then((res) => {
                    setLoading(false);
                    onClose(true);
                }).catch((e) => {
                    setLoading(false);
                    console.error('ERROR', e);
                })
            }}
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
                    disabled={isCoreUser}
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
            <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="segment">Segment</InputLabel>
                <Select
                    inputProps={{
                        id: 'segment',
                        name: 'segment'
                    }}
                    value={segment}
                    onChange={(e) => setSegment(e.target.value)}
                >
                    <MenuItem key="MMA" value="MMA">MMA</MenuItem>
                    <MenuItem key="MSE" value="MSE">MSE</MenuItem>
                    <MenuItem key="EPAK" value="EPAK">EPAK</MenuItem>
                    <MenuItem key="EXHYP" value="EXHYP">EXHYP</MenuItem>
                    <MenuItem key="více segmentové" value="více segmentové">více segmentové</MenuItem>
                </Select>
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <DatePicker
                    id="from"
                    name="from"
                    value={from}
                    onChange={setFrom}
                    label="Od"
                    format="DD.MM.YYYY HH:mm"
                    ampm={false}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <DatePicker
                    id="to"
                    name="to"
                    value={to}
                    onChange={setTo}
                    label="Do"
                    format="DD.MM.YYYY HH:mm"
                    ampm={false}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="description">Popis</InputLabel>
                <Input
                    id="description"
                    name="description"
                    multiline
                    rows={3}
                    rowsMax={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="description">Adresa</InputLabel>
                <Input
                    id="address"
                    name="address"
                    multiline
                    rows={3}
                    rowsMax={5}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="budgetMMA">Budget MMA</InputLabel>
                <Input
                    id="budgetMMA"
                    name="budgetMMA"
                    value={budgetMMA}
                    type="number"
                    onChange={(e) => setBudgetMMA(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="budgetMSE">Budget MSE</InputLabel>
                <Input
                    id="budgetMSE"
                    name="budgetMSE"
                    value={budgetMSE}
                    type="number"
                    onChange={(e) => setBudgetMSE(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="budgetEXHYP">Budget EXHYP</InputLabel>
                <Input
                    id="budgetEXHYP"
                    name="budgetEXHYP"
                    value={budgetEXHYP}
                    type="number"
                    onChange={(e) => setBudgetEXHYP(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="overBudget">Nad rámec budgetu</InputLabel>
                <Input
                    id="overBudget"
                    name="overBudget"
                    value={overBudget}
                    type="number"
                    onChange={(e) => setOverBudget(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="nps">NPS</InputLabel>
                <Input
                    id="nps"
                    name="nps"
                    value={nps}
                    onChange={(e) => setNps(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="evaluation">Hodnocení</InputLabel>
                <Input
                    id="evaluation"
                    name="evaluation"
                    multiline
                    rows={3}
                    rowsMax={5}
                    value={evaluation}
                    onChange={(e) => setEvaluation(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="internalClient">Interní klient</InputLabel>
                <Input
                    id="internalClient"
                    name="internalClient"
                    multiline
                    rows={3}
                    rowsMax={5}
                    value={internalClient}
                    onChange={(e) => setInternalClient(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="finMaterial">Finanční podklady</InputLabel>
                <Input
                    id="finMaterial"
                    name="finMaterial"
                    multiline
                    rows={3}
                    rowsMax={5}
                    value={finMaterial}
                    onChange={(e) => setFinMaterial(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="finMaterial">Odkaz na fotku</InputLabel>
                <Input
                    id="finMaterial"
                    name="finMaterial"
                    multiline
                    rows={3}
                    rowsMax={5}
                    value={finMaterial}
                    onChange={(e) => setFinMaterial(e.target.value)}
                />
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
            <RoadmapEventPhotos event={roadmapEvent} />
            {isEditable ? (
                <div style={{ display: 'flex' }}>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={loading}
                        onClick={() => {
                            enqueueSnackbar(
                                'Akce byla uložena',
                                {
                                    variant: 'success',
                                    autoHideDuration: 4000,
                                    anchorOrigin: {
                                        horizontal: 'center',
                                        vertical: 'top',
                                    },
                                },
                            );
                        }}
                    >
                        {loading ? <CircularProgress /> : 'Uložit'}
                    </Button>
                    <Button
                        fullWidth
                        variant="contained"
                        color="secondary"
                        onClick={() => setDeleteItem(roadmapEvent.id)}
                        disabled={loading}
                    >

                        Smazat
                    </Button>
                </div>
            ) : null}
        </form>
    );
};

const updateRoadmapEventMutation = graphql(gql`
    mutation UpdateRoadmapEvent(
        $id: ID!
        $segment: String
        $name: String
        $from: DateTime
        $to: DateTime
        $description: String
        $address: String
        $budgetMMA: Int
        $budgetMSE: Int
        $budgetEXHYP: Int
        $overBudget: Int
        $nps: String
        $note: String
        $evaluation: String
        $internalClient: String
        $finMaterial: String
        $region: String
    ) {
        updateEvent(data: {
            id: $id
            segment: $segment
            name: $name
            from: $from
            to: $to
            description: $description
            address: $address
            budgetMMA: $budgetMMA
            budgetMSE: $budgetMSE
            budgetEXHYP: $budgetEXHYP
            overBudget: $overBudget
            nps: $nps
            note: $note
            evaluation: $evaluation
            internalClient: $internalClient
            finMaterial: $finMaterial
            region: $region
        }) {
            ${roadmapEventAttributes}
        }
    }
`, {
    name: 'updateRoadmapEventMutation',
});

const meQuery = graphql(gql`
    {
        me {
            id
            email
            region
            roles {
                name
            }
        }
    }
`, {
    name: 'meQuery',
    options: {
        fetchPolicy: 'cache-only',
    },
});

export default compose(
    meQuery,
    updateRoadmapEventMutation,
    withStyles(styles),
)(EditRoadmapEventModal);
