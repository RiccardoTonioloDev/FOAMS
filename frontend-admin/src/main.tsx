import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import Header from './components/header/header';
import './index.css';
import store from './store/index';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <Provider store={store}>
            <BrowserRouter>
                <Header>
                    <App />
                </Header>
            </BrowserRouter>
        </Provider>
    </React.StrictMode>
);
