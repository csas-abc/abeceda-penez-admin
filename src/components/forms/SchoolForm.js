import React, { useState } from 'react';
import compose from 'ramda/src/compose';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import updateClassroomMutation from '../../utils/updateClassroomMutation';
import { graphql } from 'react-apollo';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const BranchModal = ({
    classes,
    updateClassroomMutation,
    classroom,
    editDisabled,
}) => {
    const [schoolAddress, setSchoolAddress] = useState(classroom.schoolAddress || '');
    const [directorName, setDirectorName] = useState(classroom.directorName || '');
    const [directorPhone, setDirectorPhone] = useState(classroom.directorPhone || '');
    const [directorEmail, setDirectorEmail] = useState(classroom.directorEmail || '');
    const [teacherName, setTeacherName] = useState(classroom.teacherName || '');
    const [teacherPhone, setTeacherPhone] = useState(classroom.teacherPhone || '');
    const [teacherEmail, setTeacherEmail] = useState(classroom.teacherEmail || '');

    return (
        <form
            className={classes.form}
            onSubmit={(e) => {
                e.preventDefault();
                updateClassroomMutation({
                    variables: {
                        id: classroom.id,
                        schoolAddress,
                        directorName,
                        directorPhone,
                        directorEmail,
                        teacherName,
                        teacherEmail,
                        teacherPhone
                    }
                }).catch((e) => {
                    console.error('ERROR', e);
                })
            }}
        >
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="directorName">Jméno zástupce</InputLabel>
                <Input
                    id="directorName"
                    name="directorName"
                    autoFocus
                    value={directorName}
                    onChange={(e) => setDirectorName(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="directorEmail">E-mail zástupce</InputLabel>
                <Input
                    id="directorEmail"
                    name="directorEmail"
                    value={directorEmail}
                    onChange={(e) => setDirectorEmail(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="directorPhone">Telefon zástupce</InputLabel>
                <Input
                    id="directorPhone"
                    name="directorPhone"
                    value={directorPhone}
                    onChange={(e) => setDirectorPhone(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="teacherName">Jméno učitele</InputLabel>
                <Input
                    id="teacherName"
                    name="teacherName"
                    value={teacherName}
                    onChange={(e) => setTeacherName(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="teacherEmail">E-mail učitele</InputLabel>
                <Input
                    id="teacherEmail"
                    name="teacherEmail"
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="teacherPhone">Telefon učitele</InputLabel>
                <Input
                    id="teacherPhone"
                    name="teacherPhone"
                    value={teacherPhone}
                    onChange={(e) => setTeacherPhone(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="schoolAddress">Adresa školy</InputLabel>
                <Input
                    id="schoolAddress"
                    name="schoolAddress"
                    value={schoolAddress}
                    onChange={(e) => setSchoolAddress(e.target.value)}
                />
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
    withStyles(styles)
)(BranchModal);
