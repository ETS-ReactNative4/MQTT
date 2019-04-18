import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './pages/App';
import registerServiceWorker from './registerServiceWorker';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import { BrowserRouter } from 'react-router-dom';
import { appStore } from '../src/pages/app.store';

ReactDOM.render((
    <LocaleProvider locale={zhCN}>
        <BrowserRouter>
            <App/>
        </BrowserRouter>
    </LocaleProvider>
), document.getElementById('root'));
// registerServiceWorker();
