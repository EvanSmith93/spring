import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import Collection from './Collection';
import { Card, Space, Flex, Button, Modal } from 'antd';
import { PoweroffOutlined, RightOutlined, PlusOutlined } from '@ant-design/icons';
import Meta from 'antd/es/card/Meta';
import { BrowserRouter, Link } from 'react-router-dom';

export const Home = () => {
    const emptyCollection = { key: 0, name: '', isEnabled: true, force: 50, urls: [] };
    const [collections, setCollections] = useState([structuredClone(emptyCollection)]);

    const handleAdd = () => {
        const newKey = collections.length ? collections[collections.length - 1].key + 1 : 0;
        const newCollection = structuredClone(emptyCollection);
        newCollection.key = newKey;
        setCollections([...collections, newCollection]);
    };

    // const handleRemove = () => {
    //     setCollections(collections.filter(collection => collection.key !== key));
    // };

    useEffect(() => {
        chrome.storage.local.get('collections', data => {
            const collections = data.collections;
            if (collections) setCollections(collections);
        });
    }, []);

    useEffect(() => {
        chrome.storage.local.set({ collections });
    }, [collections]);

    return (
        <Space direction="vertical" style={{ padding: '12px 24px', width: '340px' }}>
            <Flex justify='space-between' align='center' dir='column' style={{ width: '100%' }} >
                <h2>Glue Settings</h2>
                {"isEnabled" !== null &&
                    <Button
                        icon={<PoweroffOutlined />}
                        // onClick={() => setIsEnabled(!isEnabled)}
                        shape='circle' type='primary'
                        style={{ backgroundColor: "isEnabled" ? null : 'gray' }}
                    />
                }
            </Flex>
            {/* navigates to collection when clicked */}
            {collections.map(collection => (
                <Link to={`/collection/${collection.key}`} key={collection.key}>
                    <Card hoverable>
                        <Flex justify='space-between' align='center'>
                            <Meta title="Collection A" description={`Glue | ${collection.urls.length} URL${collection.urls.length === 1 ? '' : 's'}`} />
                            <RightOutlined />
                        </Flex>
                    </Card>
                </Link>
            ))}
            <Button type="dashed" onClick={handleAdd} icon={<PlusOutlined />}>
                Add Collection
            </Button>
            {/* {showModal &&
                <Modal
                    open={showModal}
                    onCancel={() => setShowModal(false)}
                    // styles={{ body: { overflowY: 'auto', maxHeight: 'calc(100vh - 200px)' } }}
                    bodyStyle={{ overflowY: 'scroll', overflowX: 'scroll', maxHeight: 'calc(100vh - 200px)' }}
                >
                    <Collection></Collection>
                </Modal>
            } */}
        </Space>
    );
};

export default Home;