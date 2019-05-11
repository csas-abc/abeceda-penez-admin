import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import CircularProgress from '@material-ui/core/CircularProgress';
import Login from './Login';
import Authenticated from './Authenticated';
import initApolloClient from './initApolloClient';

const App = () => {
    const [client, setClient] = useState(null);
    useEffect(() => {
        initApolloClient().then((initializedClient) => {
            setClient(initializedClient);
        });
    }, []);
    if (!client) return (
        <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <CircularProgress />
        </div>
    );
    return (
      <ApolloProvider client={client}>
          <Router>
              <Authenticated />
              <Route path="/login" component={Login} />
          </Router>
      </ApolloProvider>
    );
};

export default App;
