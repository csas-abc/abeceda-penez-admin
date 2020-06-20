import React, { useEffect, useState } from 'react';
import {
    BrowserRouter as Router,
    Route,
    Switch,
} from 'react-router-dom';
import { ApolloProvider } from 'react-apollo';
import moment from 'moment';
import { SnackbarProvider } from 'notistack';
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import MuiPickersUtilsProvider from 'material-ui-pickers/MuiPickersUtilsProvider';
import MomentUtils from '@date-io/moment';
import CircularProgress from '@material-ui/core/CircularProgress';
import Login from './screens/Login';
import Authenticated from './Authenticated';
import initApolloClient from './initApolloClient';
import ForgotPassword from './screens/ForgotPassword';
import "./styles/index.css";

import 'moment/locale/cs';

const theme = createMuiTheme({
    overrides: {
        MuiTableCell: {
            root: {
                padding: '3px 6px',
            }
        },
        MUIDataTable: {
            responsiveScroll: {
                maxHeight: '100%',
            }
        }
    },
});

const App = () => {
    const [client, setClient] = useState(null);
    useEffect(() => {
        moment.locale('cs');
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
          <MuiThemeProvider theme={theme}>
              <MuiPickersUtilsProvider utils={MomentUtils} locale="cs">
                  <SnackbarProvider maxSnack={3}>
                      <Router>
                          <Switch>
                              <Route path="/forgot-password" component={ForgotPassword} />
                              <Route path="/login" component={Login} />
                              <Route path="/" component={Authenticated} />
                          </Switch>
                      </Router>
                  </SnackbarProvider>
              </MuiPickersUtilsProvider>
          </MuiThemeProvider>
      </ApolloProvider>
    );
};

export default App;
