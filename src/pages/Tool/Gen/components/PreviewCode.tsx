import React, { useEffect, useState } from 'react';
import { useIntl } from '@umijs/max';
import { Modal, Tabs, Button, message } from 'antd';
import type { TabsProps } from 'antd';
// @ts-ignore
import Highlight from 'react-highlight';
import 'highlight.js/styles/base16/material.css';
import copy from "copy-to-clipboard";

interface PreviewTableProps {
  open: boolean;
  data?: any;
  onHide: () => void;
}

const PreviewTableCode: React.FC<PreviewTableProps> = (props) => {
  const intl = useIntl();
  const [activeKey, setActiveKey] = useState<string>('1');
  const keys = Object.keys(props.data || {});
  const panes: any = [];
  

  // 复制代码到剪贴板
  const handleCopy = async () => {
    if (!props.data) return;
    const key = keys[Number(activeKey) - 1];
    if (!key) return;
    try {
      copy(props.data[key] as string);
      message.success('代码已复制到剪贴板');
    } catch (e) {
      console.log('e======<<<', e);
      message.error('复制失败，请手动复制');
    }
  };

  keys.forEach((key, idx) => {
    panes.push({
      key: (idx + 1).toString(),
      label: key.substring(key.lastIndexOf('/') + 1, key.indexOf('.vm')),
      children: (
        <div style={{ position: 'relative' }}>
          <Button
            style={{ position: 'absolute', right: 0, top: 0, zIndex: 2, margin: 10 }}
            size="small"
            type="primary"
            onClick={handleCopy}
          >
            复制
          </Button>
          <Highlight className="java" style={{ marginTop: 32 }}>
            {props.data[key]}
          </Highlight>
        </div>
      ),
    } as TabsProps);
  });

  useEffect(() => {
    setActiveKey('1');
  }, [props.open]);

  return (
    <Modal
      width={900}
      title={intl.formatMessage({
        id: 'gen.preview',
        defaultMessage: '预览',
      })}
      open={props.open}
      destroyOnClose
      footer={false}
      onOk={() => {
        props.onHide();
      }}
      onCancel={() => {
        props.onHide();
      }}
    >
      <Tabs defaultActiveKey="1" activeKey={activeKey} onChange={setActiveKey} items={panes} />
    </Modal>
  );
};

export default PreviewTableCode;
