import React, { useEffect, useState } from 'react';
import UrlInputList from './UrlInputList';
import { Space, Button, Flex, Slider } from 'antd';
import { PoweroffOutlined, LeftOutlined } from '@ant-design/icons';
import { Link, useParams } from 'react-router-dom';

export const Collection = () => {
    const minForce = 20;
    const maxForce = 1000;
    const marks = { [minForce]: 'Very Stiff', [maxForce]: 'Very Loose' };
    const formatter = (value) => `${Math.round(((value - minForce) / (maxForce - minForce)) * 100)}%`

    const { key } = useParams();
    
    const [collections, setCollections] = useState([]);
    const [collection, setCollection] = useState({});

    const updateCollections = (collection) => {
        const newCollections = collections.map(c => {
            console.log(c);
            if (c.key == collection.key) {
                console.log(collection);
                return collection;
            }
            return c;
        });

        console.log(collections);
        console.log(newCollections);
        setCollections(newCollections);
        chrome.storage.local.set({ collections: newCollections });
    }

    useEffect(() => {
        chrome.storage.local.get('collections', data => {
            const collections = data.collections ?? [];
            setCollections(collections);
            const collection = collections.find(collection => collection.key == key);
            setCollection(collection);
        });
    }, []);

    return (
        <Space direction="vertical" style={{ padding: '12px 24px', width: '300px' }}>
            <Flex justify='space-between' align='center' dir='column' style={{ width: '100%' }} >
                <Flex dir='row'>
                    <Link to='/'>
                        <LeftOutlined />
                    </Link>
                    <h2>Detail</h2>
                </Flex>
                {collection && collection.isEnabled !== null &&
                    <Button
                        icon={<PoweroffOutlined />}
                        onClick={() => {
                            const newCollection = { ...collection, isEnabled: !collection.isEnabled };
                            updateCollections(newCollection);
                            setCollection(newCollection);
                        }}
                        shape='circle' type='primary'
                        style={{ backgroundColor: collection.isEnabled ? null : 'gray' }}
                    />
                }
            </Flex>

            {collection && collection.force !== null &&
                <Flex justify='center'>
                    <Slider
                        className='custom-slider'
                        min={minForce}
                        max={maxForce}
                        marks={marks}
                        tooltip={{ formatter }}
                        value={collection.force}
                        onChange={value => setCollection({ ...collection, force: value })}
                        onBlur={() => updateCollections(collection)}
                        disabled={!collection.isEnabled}
                    />
                </Flex>
            }

            {/* <UrlInputList disabled={!collection.isEnabled} urls={collection.urls} /> */}
        </Space>
    );
}

export default Collection;