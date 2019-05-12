import { ApolloLink, split } from 'apollo-link';
import { InMemoryCache, ApolloClient } from 'apollo-client-preset';
import { createUploadLink } from 'apollo-upload-client';
import { WebSocketLink } from 'apollo-link-ws';
import { getMainDefinition } from 'apollo-utilities';
import { persistCache } from 'apollo-cache-persist';

const ENDPOINT = 'abeceda.adane.cz';

export default async() => {
    const token = await localStorage.getItem('token');
    /** INIT HTTPS & WS CONNECTION TO GRAPH-QL SERVER **/

    // inject auth header to HTPP request
    const middlewareLink = new ApolloLink((operation, forward) => {
            operation.setContext({
                headers: {
                    Authorization: token,
                },
            });
            return forward(operation);
        });

    // init HTTP connection
    // const httpLink = new HttpLink({ uri: `https://${ENDPOINT}` });
    const httpLink = createUploadLink({ uri: `https://${ENDPOINT}` });
    const httpLinkAuth = middlewareLink.concat(httpLink);

    // init WebSocket connection
    const wsLink = new WebSocketLink({
        uri: `ws://${ENDPOINT}`,
        options: {
            reconnect: true,
            connectionParams: {
                Authorization: token,
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

    // connect apollo cache to localStorage (or recover cache from AsyncStorage)
    await persistCache({
        cache,
        storage: localStorage,
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
