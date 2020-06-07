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
import includes from 'ramda/src/includes';
import find from 'ramda/src/find';
import prop from 'ramda/src/prop';
import propEq from 'ramda/src/propEq';
import ArchiveConfirmationModal from '../ArchiveConfirmationModal';
import FinishConfirmationModal from '../FinishConfirmationModal';
import DeleteConfirmationModal from '../DeleteConfirmationModal';

const styles = {
    paper: {
        alignSelf: 'flex-start',
    },
};

const getActivePhase = (classroom) => find((phase) => !phase.finished)(classroom.phases || []);

const ProjectForm = ({
    onClose,
    classes,
    updateClassroomMutation,
    classroom,
    exportMutation,
    userRoles = [],
    editDisabled,
}) => {
    const isAdmin = includes('SUPER_ADMIN')(userRoles) || includes('ADMIN')(userRoles);
    const isCore = includes('CORE')(userRoles);
    const isCoreClassroom = propEq('type', 'CORE')(classroom);
    const { enqueueSnackbar } = useSnackbar();
    const [archiveConfirmModal, setArchiveConfirmModal] = useState(false);
    const [deleteConfirmModal, setDeleteConfirmModal] = useState(false);
    const [finishConfirmModal, setFinishConfirmModal] = useState(false);
    const [classroomName, setClassroomName] = useState(classroom.classroomName || '');
    const [schoolMeeting, setSchoolMeeting] = useState(classroom.schoolMeeting);
    const [semester, setSemester] = useState(classroom.semester);
    const [moneyGoalAmount, setMoneyGoalAmount] = useState(classroom.moneyGoalAmount || '');
    const [companyName, setCompanyName] = useState(classroom.companyName || '');
    const [businessPurpose, setBusinessPurpose] = useState(classroom.businessPurpose || '');
    const [businessDescription, setBusinessDescription] = useState(classroom.businessDescription || '');
    const [excursionDate, setExcursionDate] = useState(classroom.excursionDate);
    const [visitInProduction, setVisitInProduction] = useState(classroom.visitInProduction);
    const [coffeeWithTeacher, setCoffeeWithTeacher] = useState(classroom.coffeeWithTeacher);
    const [forgiveLoan, setForgiveLoan] = useState(classroom.forgiveLoan || '');
    const [forgiveLoanCause, setForgiveLoanCause] = useState(classroom.forgiveLoanCause || '');
    const [nps, setNps] = useState(classroom.nps || '');
    const [area, setArea] = useState(classroom.area || '');

    const isFinished = !getActivePhase(classroom);

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
                        semester: semester % 2 === 1 ? 1 : 2,
                        year: semester > 2 ? classroom.year + 1 : classroom.year,
                        moneyGoalAmount,
                        companyName,
                        businessPurpose,
                        businessDescription,
                        excursionDate,
                        visitInProduction,
                        coffeeWithTeacher,
                        forgiveLoan,
                        forgiveLoanCause,
                        nps,
                        area,
                    }
                }).then(() => {
                    enqueueSnackbar(
                        'Projekt byl úspěšně uložen',
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
                });
            }}
        >
            {archiveConfirmModal ? (
                <ArchiveConfirmationModal
                    onClose={(refetch) => {
                        onClose(refetch);
                        setArchiveConfirmModal(false);
                    }}
                    classroom={classroom}
                />
            ) : null}
            {deleteConfirmModal ? (
                <DeleteConfirmationModal
                    onClose={(refetch) => {
                        onClose(refetch);
                        setDeleteConfirmModal(false);
                    }}
                    classroom={classroom}
                />
            ) : null}
            {finishConfirmModal ? (
                <FinishConfirmationModal
                    onClose={(success = false) => {
                        setFinishConfirmModal(false);
                        if (!success) return;
                        onClose(false);
                        enqueueSnackbar(
                            'Projekt byl úspěšně ukončen',
                            {
                                variant: 'success',
                                autoHideDuration: 4000,
                                anchorOrigin: {
                                    horizontal: 'center',
                                    vertical: 'top',
                                },
                            }
                        )
                    }}
                    classroom={classroom}
                />
            ) : null}
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
            {classroom.type === 'CORE' ? [
                <FormControl margin="normal" fullWidth key="visitInProduction">
                    <DatePicker
                        id="visitInProduction"
                        name="visitInProduction"
                        value={visitInProduction}
                        onChange={setVisitInProduction}
                        label="Návštěva při výrobě"
                        format="DD.MM.YYYY"
                    />
                </FormControl>,
                <FormControl margin="normal" fullWidth key="coffeeWithTeacher">
                    <DatePicker
                        id="coffeeWithTeacher"
                        name="coffeeWithTeacher"
                        value={coffeeWithTeacher}
                        onChange={setCoffeeWithTeacher}
                        label="Káva s učitelem"
                        format="DD.MM.YYYY"
                    />
                </FormControl>,
            ] : null}
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
                    <MenuItem value={1}>1. pololetí {prop('year')(classroom)}/{prop('year')(classroom) + 1}</MenuItem>
                    <MenuItem value={2}>2. pololetí {prop('year')(classroom)}/{prop('year')(classroom) + 1}</MenuItem>
                    <MenuItem value={3}>1. pololetí {prop('year')(classroom) + 1}/{prop('year')(classroom) + 2}</MenuItem>
                    <MenuItem value={4}>2. pololetí {prop('year')(classroom) + 1}/{prop('year')(classroom) + 2}</MenuItem>
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
            {isCore || isAdmin ? (
                <React.Fragment>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="semester">Odpuštění půjčky</InputLabel>
                        <Select
                            inputProps={{
                                id: 'forgiveLoan',
                                name: 'forgiveLoan'
                            }}
                            value={forgiveLoan}
                            onChange={(e) => setForgiveLoan(e.target.value)}
                        >
                            <MenuItem value="ANO">ANO</MenuItem>
                            <MenuItem value="NE">NE</MenuItem>
                        </Select>
                    </FormControl>
                    {forgiveLoan === 'ANO' ? (
                        <FormControl margin="normal" fullWidth>
                            <InputLabel htmlFor="forgiveLoanCause">Důvod</InputLabel>
                            <Input
                                id="forgiveLoanCause"
                                name="forgiveLoanCause"
                                multiline
                                rows={3}
                                rowsMax={5}
                                value={forgiveLoanCause}
                                onChange={(e) => setForgiveLoanCause(e.target.value)}
                            />
                        </FormControl>
                    ) : null}
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="nps">NPS</InputLabel>
                        <Input
                            id="nps"
                            name="nps"
                            multiline
                            rows={3}
                            rowsMax={5}
                            value={nps}
                            onChange={(e) => setNps(e.target.value)}
                        />
                    </FormControl>
                    <FormControl margin="normal" fullWidth>
                        <InputLabel htmlFor="area">Oblast</InputLabel>
                        <Input
                            id="area"
                            name="area"
                            value={area}
                            onChange={(e) => setArea(e.target.value)}
                        />
                    </FormControl>
                </React.Fragment>
            ) : null}
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
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
                        disabled={editDisabled}
                    >
                        Export
                    </Button>
                    {isAdmin ? ([
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            style={{ marginLeft: '16px' }}
                            onClick={() => setArchiveConfirmModal(true)}
                            key="archive"
                        >
                            {classroom.archived ? 'Obnovit' : 'Přesunout do Archivu'}
                        </Button>,
                        <Button
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            style={{ marginLeft: '16px' }}
                            onClick={() => setDeleteConfirmModal(true)}
                            key="trash"
                        >
                            {classroom.deleted ? 'Obnovit' : 'Přesunout do koše'}
                        </Button>
                    ]) : null}
                    {isCore && !isFinished && isCoreClassroom ? (
                        <Button
                            variant="contained"
                            color="secondary"
                            className={classes.submit}
                            style={{ marginLeft: '16px' }}
                            onClick={() => setFinishConfirmModal(true)}
                        >
                            Ukončit projekt
                        </Button>
                    ) : null}
                </div>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    type="submit"
                    disabled={editDisabled}
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
