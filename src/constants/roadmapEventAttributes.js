export default `
    id
    createdAt
    updatedAt
    author {
        id
        firstname
        lastname
        email
        region
    }
    segment
    name
    from
    to
    description
    address
    budgetMMA
    budgetMSE
    budgetEXHYP
    overBudget
    nps
    note
    evaluation
    internalClient
    finMaterial
    photoLink
    region
    photos {
        id
        name
        path
        fileType
        author {
            id
            firstname
            lastname
            email
        }
    }
`;
