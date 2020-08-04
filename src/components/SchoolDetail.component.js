import React, {useState} from "react";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import propOr from "ramda/src/propOr";
import join from "ramda/src/join";
import Typography from "@material-ui/core/Typography";
import pathOr from "ramda/src/pathOr";
import SchoolDialog from "./SchoolDialog.component";

const SchoolDetail = ({ school, setSchool, name, email, phone, setName, setEmail, setPhone }) => {

    const [schoolSearchDialog, setSchoolSearchDialog] = useState(false);

    return (
        <>
            {schoolSearchDialog ? <SchoolDialog
                                          school={school}
                                          setSchool={setSchool}
                                          schoolSearchDialog={schoolSearchDialog}
                                          setSchoolSearchDialog={setSchoolSearchDialog}
            /> : null}
            <FormControl margin="normal" required fullWidth>
                <InputLabel style={{position: "relative", top: "-10px"}} htmlFor="school">Název</InputLabel>
                <Input
                    id="school"
                    name="school"
                    value={school.name}
                    // onChange={() => {}}
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
            <Typography variant="h5" style={{ marginTop: '24px', marginBottom: 0 }}>
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

            <Typography variant="h5" style={{ marginTop: '24px', marginBottom: 0 }}>
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
            <Typography variant="h5" style={{ marginTop: '24px', marginBottom: 0 }}>
                Učitel
            </Typography>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="name">Jméno a příjmení</InputLabel>
                <Input
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth>
                <InputLabel htmlFor="phone">Telefon</InputLabel>
                <Input
                    id="phone"
                    name="phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
            </FormControl>
            <FormControl margin="normal" fullWidth style={{ marginBottom: 60 }}>
                <InputLabel htmlFor="email">E-mail</InputLabel>
                <Input
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </FormControl>
    </>
    );
}

export default SchoolDetail;