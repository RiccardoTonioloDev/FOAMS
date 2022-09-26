import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Header from './components/header/header';
import IsLoggedIn from './components/utility/isLoggedIn';
import './index.css';
import store from './store/index';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <IsLoggedIn>
                <BrowserRouter>
                    <Header>
                        <App />
                    </Header>
                </BrowserRouter>
            </IsLoggedIn>
        </Provider>
    </React.StrictMode>
);
