import React, { useEffect, useState } from 'react';
import UrlInputList from './UrlInputList';
import { Space, Button, Flex, Slider } from 'antd';
import { PoweroffOutlined, LeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';

export const Collection = () => {
    const minForce = 20;
    const maxForce = 1000;
    const marks = { [minForce]: 'Very Stiff', [maxForce]: 'Very Loose' };
    const formatter = (value) => `${Math.round(((value - minForce) / (maxForce - minForce)) * 100)}%`

    const [isEnabled, setIsEnabled] = useState(null);
    const [force, setForce] = useState(null);

    useEffect(() => {
        chrome.storage.local.get('isEnabled', data => {
            setIsEnabled(data.isEnabled ?? true);
        });
        chrome.storage.local.get('force', data => {
            console.log('force', data.force)
            setForce(data.force ?? 200);
        });
    }, []);

    useEffect(() => {
        chrome.storage.local.set({ isEnabled: isEnabled });
    }, [isEnabled]);

    useEffect(() => {
        chrome.storage.local.set({ force: force });
    }, [force]);

    return (
        <Space direction="vertical" style={{ padding: '12px 24px', width: '300px' }}>
            <Flex justify='space-between' align='center' dir='column' style={{ width: '100%' }} >
                <Flex dir='row'>
                    <Link to='/'>
                        <LeftOutlined />
                    </Link>
                    <h2>Detail</h2>
                </Flex>
                {isEnabled !== null &&
                    <Button
                        icon={<PoweroffOutlined />}
                        onClick={() => setIsEnabled(!isEnabled)}
                        shape='circle' type='primary'
                        style={{ backgroundColor: isEnabled ? null : 'gray' }}
                    />
                }
            </Flex>

            {force !== null &&
                <Flex justify='center'>
                    <Slider
                        className='custom-slider'
                        min={minForce}
                        max={maxForce}
                        marks={marks}
                        tooltip={{ formatter }}
                        defaultValue={force}
                        onChange={value => setForce(value)}
                        disabled={!isEnabled}
                    />
                </Flex>
            }

            <UrlInputList disabled={!isEnabled} />
        </Space>
    );
}

export default Collection;