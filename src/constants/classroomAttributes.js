export default `
            id
            excursionDate
            classroomName
            schoolAddress
            directorName
            directorEmail
            directorPhone
            teacherName
            teacherPhone
            teacherEmail
            schoolMeeting
            semester
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
            toolboxOrder {
                id
                state
                recipient
                address
                childrenCount
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
            }`;
