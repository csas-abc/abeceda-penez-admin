import { ApolloLink, split } from 'apollo-link';
import { InMemoryCache, ApolloClient } from 'apollo-client-preset';
import { createUploadLink } from 'apollo-upload-client';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { persistCache } from 'apollo-cache-persist';

// const ENDPOINT = 'abeceda.adane.cz';
const ENDPOINT = 'localhost:4000';

export default async() => {
    /** INIT HTTPS & WS CONNECTION TO GRAPH-QL SERVER **/

    // inject auth header to HTPP request
    const middlewareLink = new ApolloLink((operation, forward) => {
        const token = localStorage.getItem('token');
        operation.setContext({
            headers: {
                Authorization: token,
            },
        });
        return forward(operation);
    });

    // init HTTP connection
    // const httpLink = createUploadLink({ uri: `https://${ENDPOINT}` });
    const httpLink = createUploadLink({ uri: `http://${ENDPOINT}` });
    const httpLinkAuth = middlewareLink.concat(httpLink);

    // init WebSocket connection
    const wsLink = new WebSocketLink({
        uri: `ws://${ENDPOINT}`,
        options: {
            reconnect: true,
            connectionParams: {
                Authorization: localStorage.getItem('token'),
            },
        },
    });

    // split requests between HTTP and WS --> depends on operation, subscriptions over WS, rest over HTTP
    const link = split(
        ({ query }) => {
            const { kind, operation } = getMainDefinition(query);
            return kind === 'OperationDefinition' && operation === 'subscription';
        },
        wsLink,
        httpLinkAuth,
    );

    /** INIT GRAPH-QL CACHE **/
    // sync in-memory cache with localStorage and recover after every reload
    const cache = new InMemoryCache();

    // connect apollo cache to localStorage (or recover cache from localStorage)
    await persistCache({
        cache,
        storage: localStorage,
        debug: true,
        maxSize: false,
    });

    // apollo client setup
    return new ApolloClient({
        link: ApolloLink.from([
            link,
        ]),
        cache,
        connectToDevTools: true,
        defaultHttpLink: false,
    });
};
