import React, { useState } from 'react';
import compose from 'ramda/src/compose';
import propOr from 'ramda/src/propOr';
import pathOr from 'ramda/src/pathOr';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import { graphql } from 'react-apollo';
import { useSnackbar } from 'notistack';
import Typography from '@material-ui/core/Typography';
import gql from 'graphql-tag';
import schoolAttributes from '../../constants/schoolAttributes';
import map from 'ramda/src/map';
import includes from 'ramda/src/includes';
import filter from 'ramda/src/filter';
import DialogContent from '@material-ui/core/DialogContent';
import join from 'ramda/src/join';
import path from 'ramda/src/path';

const styles =  {
    paper: {
        alignSelf: 'flex-start',
    },
};

const BranchModal = ({
    classes,
    changeClassroomSchool,
    schoolsQuery,
    classroom,
    editDisabled,
}) => {
    const { enqueueSnackbar } = useSnackbar();
    const [school, setSchool] = useState(propOr({}, 'school')(classroom));
    const [schoolSearchDialog, setSchoolSearchDialog] = useState(false);
    const [search, setSearch] = useState(false);

    return (
        <form
            className={classes.form}
            onSubmit={(e) => {
                e.preventDefault();
                changeClassroomSchool({
                    variables: {
                        id: classroom.id,
                        schoolId: school.id,
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
                })
            }}
        >

            {schoolSearchDialog ? (
                <Dialog
                    onClose={() => setSchoolSearchDialog(false)}
                    open={schoolSearchDialog}
                >
                    <DialogContent style={{ minWidth: '500px', minHeight: '500px' }}>
                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="search">Hledat (alespoň 3 znaky)</InputLabel>
                            <Input
                                id="search"
                                name="search"
                                value={school.search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </FormControl>
                        {search && search.length >= 3 ? (
                            compose(
                                map((schoolRec) => (
                                    <Button
                                        fullWidth
                                        key={schoolRec.id}
                                        onClick={() => {
                                            setSchool(schoolRec);
                                            setSearch('');
                                            setSchoolSearchDialog(false);
                                        }}
                                    >
                                        {schoolRec.name}
                                    </Button>
                                )),
                                filter((schoolRec) => (
                                    includes(search.toLowerCase())((schoolRec.street || '').toLowerCase()) ||
                                    includes(search.toLowerCase())((schoolRec.city || '').toLowerCase()) ||
                                    includes(search.toLowerCase())((schoolRec.name || '').toLowerCase()) ||
                                    includes(search.toLowerCase())((schoolRec.region || '').toLowerCase())
                                )),
                                propOr([], 'schools'),
                            )(schoolsQuery)
                        ) : null}
                    </DialogContent>
                </Dialog>
            ) : null}
            <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="school">Název</InputLabel>
                <Input
                    id="school"
                    name="school"
                    value={school.name}
                    onChange={() => {}}
                    onClick={() => {
                        setSchoolSearchDialog(true);
                    }}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="address">Adresa</InputLabel>
                <Input
                    id="address"
                    name="address"
                    value={join(', ')([
                        propOr('-', 'street')(school),
                        propOr('-', 'city')(school),
                    ])}
                    onChange={() => {}}
                    onClick={() => {
                        setSchoolSearchDialog(true);
                    }}
                />
            </FormControl>
            <Typography variant="headline" style={{ marginTop: '24px', marginBottom: 0 }}>
                Ředitel
            </Typography>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="directorName">Jméno</InputLabel>
                <Input
                    id="directorName"
                    name="directorName"
                    value={pathOr('', ['director', 'name'])(school)}
                    onChange={() => {}}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="directorEmail">E-mail</InputLabel>
                <Input
                    id="directorEmail"
                    name="directorEmail"
                    value={pathOr('', ['director', 'email'])(school)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="directorPhone">Telefon</InputLabel>
                <Input
                    id="directorPhone"
                    name="directorPhone"
                    value={pathOr('', ['director', 'phone'])(school)}
                />
            </FormControl>

            <Typography variant="headline" style={{ marginTop: '24px', marginBottom: 0 }}>
                Zástupce
            </Typography>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="alternateName">Jméno</InputLabel>
                <Input
                    id="alternateName"
                    name="alternateName"
                    value={pathOr('', ['alternate', 'name'])(school)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="alternateEmail">E-mail</InputLabel>
                <Input
                    id="alternateEmail"
                    name="alternateEmail"
                    value={pathOr('', ['alternate', 'email'])(school)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="alternatePhone">Telefon</InputLabel>
                <Input
                    id="alternatePhone"
                    name="alternatePhone"
                    value={pathOr('', ['alternate', 'phone'])(school)}
                />
            </FormControl>

            <Typography variant="headline" style={{ marginTop: '24px', marginBottom: 0 }}>
                Učitel
            </Typography>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="teacherName">Jméno</InputLabel>
                <Input
                    id="teacherName"
                    name="teacherName"
                    value={pathOr('', ['teachers', 0, 'name'])(school)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="teacherEmail">E-mail</InputLabel>
                <Input
                    id="teacherEmail"
                    name="teacherEmail"
                    value={pathOr('', ['teachers', 0, 'email'])(school)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="teacherPhone">Telefon</InputLabel>
                <Input
                    id="teacherPhone"
                    name="teacherPhone"
                    value={pathOr('', ['teachers', 0, 'phone'])(school)}
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

const changeClassroomSchool = gql`
    mutation ChangeClassroomSchool($id: ID!, $schoolId: ID!) {
        changeClassroomSchool(
            id: $id,
            schoolId: $schoolId,
        ) {
            id
            school {
                ${schoolAttributes}
            }
        }
    }
`;

const schoolsQuery = graphql(gql`
    {
        schools {
            ${schoolAttributes}
        }
    }
`, {
    name: 'schoolsQuery',
    options: {
        fetchPolicy: 'cache-and-network',
    }
});

export default compose(
    graphql(
        changeClassroomSchool,
        {
            name: 'changeClassroomSchool',
        },
    ),
    schoolsQuery,
    withStyles(styles)
)(BranchModal);
