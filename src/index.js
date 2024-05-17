import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import UrlInputList from './UrlInputList';
import { Typography, Switch } from 'antd';

const App = () => {
    const [isEnabled, setIsEnabled] = useState(null);

    useEffect(() => {
        chrome.storage.local.get('isEnabled', data => {
            setIsEnabled(data.isEnabled ?? true);
        });
    }, []);

    useEffect(() => {
        chrome.storage.local.set({ isEnabled: isEnabled});
    }, [isEnabled]);

    return (
        <>
            <Typography.Title level={2}>URL Input List</Typography.Title>
            {isEnabled !== null && <Switch checked={isEnabled} onChange={setIsEnabled} />}
            <UrlInputList />
        </>
    );
};

ReactDOM.render(<App />, document.getElementById('root'));
