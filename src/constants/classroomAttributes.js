import schoolAttributes from './schoolAttributes';

export default `
    id
    excursionDate
    classroomName
    creator {
        id
        firstname
        lastname
    }
    schoolAddress
    directorName
    directorEmail
    directorPhone
    teacherName
    teacherPhone
    teacherEmail
    schoolMeeting
    semester
    year
    branchAddress
    branchRepresentativeEmail
    branchRepresentativePhone
    branchRepresentativeName
    fairDate
    childrenCount
    fairNote
    fairElectricity
    fairAnnexationState
    fairAnnexationNote
    fairDate
    fairTime
    fairEnd
    kioskReadyTime
    kioskPlace
    archived
    deleted
    toolboxOrder {
        id
        state
        recipient
        address
        childrenCount
        classroom {
            id
        }
    }
    phases {
        id
        name
        finished
        finishDate
        number
        checklist {
            id
            name
            checked
        }
    }
    companyName
    businessPurpose
    businessDescription
    moneyGoalAmount
    team {
        id
        users {
            id
            firstname
            lastname
            activated
            email
            region
        }
    }
    type
    visitInProduction
    coffeeWithTeacher
    fairAgency {
        id
        name
    }
    forgiveLoan
    forgiveLoanCause
    nps
    area
    school {
        ${schoolAttributes}
    }
    teacher {
          id
          name
          phone
          email
    }
`;
