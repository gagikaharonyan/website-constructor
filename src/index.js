import React from 'react';
import ReactDOM from 'react-dom';
import {Provider as ProviderRedux} from 'react-redux';
import store from './store';
import {ToastProvider} from 'react-toast-notifications';
import * as serviceWorker from './serviceWorker';
import {BrowserRouter as Router} from 'react-router-dom';
import App from './App';
import './index.css';

ReactDOM.render(
    <ProviderRedux store={store}>
        <React.StrictMode>
            <Router>
                <ToastProvider>
                    <App/>
                </ToastProvider>
            </Router>
        </React.StrictMode>
    </ProviderRedux>
    ,document.getElementById('root')
);

serviceWorker.unregister();
