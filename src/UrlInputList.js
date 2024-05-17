/*global chrome*/
import React, { useState, useEffect } from 'react';
import { Input, Button, Form, Space } from 'antd';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';

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
      {urls.map(url => (
        <div key={url.key} style={{ display: 'flex', marginBottom: 8 }}>
          <Input
            placeholder="Enter URL"
            addonBefore="https://"
            value={url.value}
            onChange={e => handleChange(url.key, e)}
            style={{ width: '80%', marginRight: 8 }}
          />
          <MinusCircleOutlined onClick={() => handleRemove(url.key)} style={{ verticalAlign: 'middle' }} size={24} />
          </div>
      ))}
      <Form.Item>
        <Button type="dashed" onClick={handleAdd} icon={<PlusOutlined />}>
          Add URL
        </Button>
      </Form.Item>
    </Form>
  );
};

export default UrlInputList;
