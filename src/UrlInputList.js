/*global chrome*/
import React, { useState, useEffect } from 'react';
import { Input, Button, Form, Space } from 'antd';
import { DeleteTwoTone, PlusOutlined } from '@ant-design/icons';

export const UrlInputList = () => {
  const [urls, setUrls] = useState([{ key: 0, value: '' }]);

  const handleChange = (key, event) => {
    const newUrls = urls.map(url => {
      if (url.key === key) {
        return { ...url, value: event.target.value };
      }
      return url;
    });
    setUrls(newUrls);
  };

  const handleAdd = () => {
    const newKey = urls.length ? urls[urls.length - 1].key + 1 : 0;
    setUrls([...urls, { key: newKey, value: '' }]);
  };

  const handleRemove = key => {
    setUrls(urls.filter(url => url.key !== key));
  };

  useEffect(() => {
    // get the urls from local storage
    chrome.storage.local.get('urls', data => {
      if (data.urls) {
        setUrls(data.urls.map((url, index) => ({ key: index, value: url })));
      }
    });
  }, []);

  useEffect(() => {
    // store the urls in local storage
    console.log('storing urls', urls)
    chrome.storage.local.set({ urls: urls.map(url => url.value) });
  }, [urls]);

  return (
    <Form>
      <Space direction="vertical">
        {urls.map(url => (
          <Space key={url.key}>
            <Input
              placeholder="Enter URL"
              addonBefore="https://"
              value={url.value}
              onChange={e => handleChange(url.key, e)}
            />
            <DeleteTwoTone onClick={() => handleRemove(url.key)} style={{ verticalAlign: 'middle' }} twoToneColor={'red'} />
          </Space>
        ))}
        
        <Form.Item>
          <Button type="dashed" onClick={handleAdd} icon={<PlusOutlined />}>
            Add URL
          </Button>
        </Form.Item>
      </Space>
    </Form>
  );
};

export default UrlInputList;
