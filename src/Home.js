import React, { useEffect, useState } from "react";
import UrlInputList from "./UrlInputList";
import { Space, Button, Flex, Slider, Segmented } from "antd";
import { PoweroffOutlined } from "@ant-design/icons";

export const MIN_FORCE = 5;
export const MAX_FORCE = 4000;

const Home = () => {
  const [isEnabled, setIsEnabled] = useState(null);
  const [force, setForce] = useState(null);
  const [action, setAction] = useState(null);

  useEffect(() => {
    chrome.storage.local.get("isEnabled", (data) => {
      setIsEnabled(data.isEnabled ?? true);
    });
    chrome.storage.local.get("force", (data) => {
      setForce(data.force ?? (MAX_FORCE + MIN_FORCE) / 2);
    });
    chrome.storage.local.get("action", (data) => {
      setAction(data.action ?? "spring");
    });
  }, []);

  useEffect(() => {
    chrome.storage.local.set({ isEnabled });
  }, [isEnabled]);

  useEffect(() => {
    chrome.storage.local.set({ force });
  }, [force]);

  useEffect(() => {
    chrome.storage.local.set({ action });
  }, [action]);

  const marks = { [MIN_FORCE]: "Very Stiff", [MAX_FORCE]: "Very Loose" };
  const formatter = (value) =>
    `${Math.round(((value - MIN_FORCE) / (MAX_FORCE - MIN_FORCE)) * 100)}%`;

  return (
    <Space
      direction="vertical"
      style={{ padding: "12px 24px", width: "340px" }}
    >
      <Flex
        justify="space-between"
        align="center"
        dir="column"
        style={{ width: "100%" }}
      >
        <h2>Spring Settings</h2>
        {isEnabled !== null && (
          <Button
            icon={<PoweroffOutlined />}
            onClick={() => setIsEnabled(!isEnabled)}
            shape="circle"
            type="primary"
            style={{ backgroundColor: isEnabled ? null : "gray" }}
          />
        )}
      </Flex>
      {action !== null && (
        <Segmented
          options={[
            { label: "Spring", value: "spring" },
            { label: "Fade", value: "fade" },
          ]}
          value={action}
          onChange={setAction}
          disabled={!isEnabled}
        />
      )}
      {force !== null && (
        <Flex justify="center">
          <Slider
            className="custom-slider"
            min={MIN_FORCE}
            max={MAX_FORCE}
            marks={marks}
            tooltip={{ formatter }}
            defaultValue={force}
            onChange={setForce}
            disabled={!isEnabled}
          />
        </Flex>
      )}
      <UrlInputList disabled={!isEnabled} />
    </Space>
  );
};

export default Home;
