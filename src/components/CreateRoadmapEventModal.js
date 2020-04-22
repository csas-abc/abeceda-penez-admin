import React, { useState } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import CircularProgress from '@material-ui/core/CircularProgress';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import roadmapEventAttributes from '../constants/roadmapEventAttributes';
import Input from '@material-ui/core/Input';
import Select from '@material-ui/core/Select';
import map from 'ramda/src/map';
import compose from 'ramda/src/compose';
import MenuItem from '@material-ui/core/MenuItem';
import Regions from '../constants/Regions';
import DatePicker from 'material-ui-pickers/DateTimePicker';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const CreateRoadmapEventModal = ({ onClose, classes, createRoadmapEventMutation }) => {
    const [name, setName] = useState('');
    const [region, setRegion] = useState('');
    const [segment, setSegment] = useState('');
    const [from, setFrom] = useState(null);
    const [to, setTo] = useState(null);
    const [description, setDescription] = useState('');
    const [address, setAddress] = useState('');
    const [budget, setBudget] = useState(0);
    const [evaluation, setEvaluation] = useState('');
    const [internalClient, setInternalClient] = useState('');
    const [finMaterial, setFinMaterial] = useState('');

    const [loading, setLoading] = useState(false);
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
            <DialogTitle>Vytvořit akci</DialogTitle>
            <DialogContent>
                <form
                    className={classes.form}
                    onSubmit={(e) => {
                        setLoading(true);
                        e.preventDefault();
                        createRoadmapEventMutation({
                            variables: {
                                name,
                                region,
                                segment,
                                from,
                                to,
                                description,
                                address,
                                budget: parseInt(budget, 10),
                                evaluation,
                                internalClient,
                                finMaterial,
                            }
                        }).then((res) => {
                            setLoading(false);
                            onClose();
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
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="segment">Segment</InputLabel>
                        <Input
                            id="segment"
                            name="segment"
                            value={segment}
                            onChange={(e) => setSegment(e.target.value)}
                        />
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
                        <InputLabel htmlFor="budget">Budget</InputLabel>
                        <Input
                            id="budget"
                            name="budget"
                            value={budget}
                            type="number"
                            onChange={(e) => setBudget(e.target.value)}
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
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress /> : 'Vytvořit'}
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const createRoadmapEventMutation = graphql(gql`
    mutation CreateRoadmapEvent(
        $segment: String
        $name: String
        $from: DateTime
        $to: DateTime
        $description: String
        $address: String
        $budget: Int
        $evaluation: String
        $internalClient: String
        $finMaterial: String
        $region: String
    ) {
        createEvent(data: {
            segment: $segment
            name: $name
            from: $from
            to: $to
            description: $description
            address: $address
            budget: $budget
            evaluation: $evaluation
            internalClient: $internalClient
            finMaterial: $finMaterial
            region: $region
        }) {
            ${roadmapEventAttributes}
        }
    }
`, {
    name: 'createRoadmapEventMutation',
});

export default compose(
    createRoadmapEventMutation,
    withStyles(styles),
)(CreateRoadmapEventModal);
