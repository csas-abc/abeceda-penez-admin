import React from 'react';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import styled from "styled-components";

const NoRecord = styled.div`
text-align: center;
color: red;
margin-top: 30px;
`

const Table = styled.table`
font-family: arial, sans-serif;
border-collapse: collapse;
width: 100%;
margin-top: 30px;
`

const Th = styled.th`
border-bottom: 1px solid #dddddd;
text-align: left;
padding: 8px;
`

const Tr = styled.tr`
&:nth-child(even) {
  background-color: #dddddd;
}
`

const Td = styled.td`
border-bottom: 1px solid #dddddd;
text-align: left;
padding: 8px;
`

const ClassroomsTable = ({ classes, data }) => {

    if (data.error) return (
        <SnackbarContent
            className={classes.errorMessage}
            message="Načtení se nezdařilo"
        />
    );
    
    const table = (
                 <Table>
                     <thead>
                       <Tr>
                         <Th>Třída</Th>
                         <Th>Typ</Th>
                         <Th>Semestr/rok</Th>
                         <Th>Učitel</Th>
                         <Th>Email učitele</Th>
                       </Tr>
                     </thead>
                     <tbody>
                         {data.map(classroom => {
                            return (
                                <Tr key={classroom.id}>
                                    <Td>{classroom.classroomName ? classroom.classroomName : '-'}</Td>
                                    <Td>{classroom.type ? (classroom.type === 'CORE' ? 'RMKT' : 'Dobrovolník') : '-'}</Td>
                                    <Td>{classroom.semester + ". pololetí/" + classroom.year}</Td>
                                    <Td>{classroom.teacherName ? classroom.teacherName : '-'}</Td>
                                    <Td>{classroom.teacherEmail ? classroom.teacherEmail : '-'}</Td>
                                </Tr>
                            );
                         })
                        } 
                     </tbody>   
                 </Table>
    );
    
    return (
        <>
                {data.length > 0 ? table : <NoRecord>Nejsou vedeny žádné aktivní třídy k této škole</NoRecord>}
    
        </>
    );
};



export default ClassroomsTable;
