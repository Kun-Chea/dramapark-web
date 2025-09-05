import React, { useState } from 'react';
import { Modal, Tag, Button, Spin, Row } from 'antd';

interface LanguageModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (selectedLanguage: any) => void;
  appLanguageData: any[];
  languageLoading?: boolean;
  distributeButLoading?: boolean;
}

const LanguageModal: React.FC<LanguageModalProps> = ({
  visible,
  onClose,
  onSubmit,
  appLanguageData = [],
  languageLoading = false,
  distributeButLoading = false,
}) => {
  const [activeAppLanguageData, setActiveAppLanguageData] = useState<any>(null);

  const handleOk = () => {
    if (activeAppLanguageData) {
      onSubmit(activeAppLanguageData);
    }
  };

  return (
    <Modal
      title="分发影片"
      open={visible}
      onCancel={onClose}
      width="35%"
      footer={[
        <Button
          key="submit"
          type="primary"
          onClick={handleOk}
          loading={distributeButLoading}
          disabled={!activeAppLanguageData}
        >
          {distributeButLoading ? '翻译中...' : '确 定'}
        </Button>,
        <Button key="back" onClick={onClose}>
          取 消
        </Button>,
      ]}
      destroyOnClose
      centered
      maskClosable={false}
    >
      <div className="language-tags-container" style={{ minHeight: 60 }}>
        <Spin spinning={languageLoading}>
          {appLanguageData && appLanguageData.length > 0 ? (
            appLanguageData.map((item: any) => (
              <Tag
                key={item.id}
                style={{
                  marginRight: 10,
                  marginBottom: 10,
                  cursor: 'pointer',
                  border:
                    activeAppLanguageData && activeAppLanguageData.id === item.id
                      ? '1px solid #1890ff'
                      : undefined,
                  background:
                    activeAppLanguageData && activeAppLanguageData.id === item.id
                      ? '#e6f7ff'
                      : undefined,
                }}
                color={
                  activeAppLanguageData && activeAppLanguageData.id === item.id ? 'blue' : 'default'
                }
                onClick={() => setActiveAppLanguageData(item)}
              >
                <Row align="middle" style={{ padding: 5 }}>
                  <img
                    src={item.icon}
                    alt={item.name}
                    style={{
                      width: 16,
                      height: 16,
                      verticalAlign: 'middle',
                      marginRight: 5,
                    }}
                  />
                  <div>{item.name}</div>
                  <div style={{ color: '#999' }}>({item.zhName})</div>
                </Row>
              </Tag>
            ))
          ) : (
            <span style={{ color: '#999' }}>暂无可用语言</span>
          )}
        </Spin>
      </div>
    </Modal>
  );
};

export default LanguageModal;
