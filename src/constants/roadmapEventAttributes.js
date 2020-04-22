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
    budget
    evaluation
    internalClient
    finMaterial
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
