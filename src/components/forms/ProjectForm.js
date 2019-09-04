import React, { useState } from 'react';
import { useSnackbar } from 'notistack';
import gql from 'graphql-tag';
import compose from 'ramda/src/compose';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import updateClassroomMutation from '../../utils/updateClassroomMutation';
import { graphql } from 'react-apollo';
import DatePicker from 'material-ui-pickers/DatePicker/DatePickerModal';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const ProjectForm = ({
    onClose,
    classes,
    updateClassroomMutation,
    classroom,
    exportMutation,
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [classroomName, setClassroomName] = useState(classroom.classroomName);
    const [schoolMeeting, setSchoolMeeting] = useState(classroom.schoolMeeting);
    const [semester, setSemester] = useState(classroom.semester);
    const [moneyGoalAmount, setMoneyGoalAmount] = useState(classroom.moneyGoalAmount);
    const [companyName, setCompanyName] = useState(classroom.companyName);
    const [businessPurpose, setBusinessPurpose] = useState(classroom.businessPurpose);
    const [businessDescription, setBusinessDescription] = useState(classroom.businessDescription);
    const [excursionDate, setExcursionDate] = useState(classroom.excursionDate);

    return (
        <form
            className={classes.form}
            onSubmit={(e) => {
                e.preventDefault();
                updateClassroomMutation({
                    variables: {
                        id: classroom.id,
                        classroomName,
                        schoolMeeting,
                        semester,
                        moneyGoalAmount,
                        companyName,
                        businessPurpose,
                        businessDescription,
                        excursionDate,
                    }
                }).then(() => {
                    onClose();
                }).catch((e) => {
                    console.error('ERROR', e);
                })
            }}
        >
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="classroomName">Jméno třídy</InputLabel>
                <Input
                    id="classroomName"
                    name="classroomName"
                    autoFocus
                    value={classroomName}
                    onChange={(e) => setClassroomName(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <DatePicker
                    id="schoolMeeting"
                    name="schoolMeeting"
                    value={schoolMeeting}
                    onChange={setSchoolMeeting}
                    label="Schůzka ve škole"
                    format="DD.MM.YYYY"
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <DatePicker
                    id="excursionDate"
                    name="excursionDate"
                    value={excursionDate}
                    onChange={setExcursionDate}
                    label="Termín exkurze"
                    format="DD.MM.YYYY"
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="semester">Pololetí</InputLabel>
                <Select
                    inputProps={{
                        id: 'semester',
                        name: 'semester'
                    }}
                    value={semester}
                    onChange={(e) => setSemester(e.target.value)}
                >
                    <MenuItem value={1}>1. pololetí</MenuItem>
                    <MenuItem value={2}>2. pololetí</MenuItem>
                </Select>
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="moneyGoalAmount">Výdělek</InputLabel>
                <Input
                    id="moneyGoalAmount"
                    name="moneyGoalAmount"
                    value={moneyGoalAmount}
                    onChange={(e) => setMoneyGoalAmount(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="companyName">Název firmy</InputLabel>
                <Input
                    id="companyName"
                    name="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="businessDescription">V čem děti podnikají</InputLabel>
                <Input
                    id="businessDescription"
                    name="businessDescription"
                    value={businessDescription}
                    onChange={(e) => setBusinessDescription(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="businessPurpose">Výdělek - použití</InputLabel>
                <Input
                    id="businessPurpose"
                    name="businessPurpose"
                    value={businessPurpose}
                    onChange={(e) => setBusinessPurpose(e.target.value)}
                />
            </FormControl>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={() => {
                        exportMutation({
                            variables: {
                                id: classroom.id,
                            }
                        });
                        enqueueSnackbar('Projekt byl odeslaný na e-mail');
                    }}
                >
                    Export
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    type="submit"
                >
                    Uložit
                </Button>
            </div>
        </form>
    );
};

const exportMutation = graphql(gql`
    mutation Export($id: ID!) {
        export(id: $id)
    }
`, {
    name: 'exportMutation'
});

export default compose(
    graphql(
        updateClassroomMutation,
        {
            name: 'updateClassroomMutation',
        },
    ),
    exportMutation,
    withStyles(styles)
)(ProjectForm);
