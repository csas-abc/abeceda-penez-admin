export default `
    id
    name
    region
    note
    status
    street
    city
    director {
        id
        name
        email
        phone
    }
    alternate {
        id
        name
        email
        phone
    }
    teachers {
        id
        name
        email
        phone
    }
`;
