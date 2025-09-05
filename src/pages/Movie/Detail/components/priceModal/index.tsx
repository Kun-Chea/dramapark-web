import { Modal, Form, Input, Button, InputNumber, Row, Col, message } from 'antd';
import { useEffect, useState } from 'react';

interface PriceConfigItem {
  startNum: number | undefined;
  endNum: number | undefined;
  coin: number | undefined;
}

interface PriceModalProps {
  visible: boolean;
  onCancel: () => void;
  onOk: (values: { name: string; videoChannelCoinList: PriceConfigItem[], movieId: string }) => void;
  currentRow: any;
}

const PriceModal: React.FC<PriceModalProps> = ({ visible, onCancel, onOk, currentRow }) => {
  const [form] = Form.useForm();
  const [configs, setConfigs] = useState<PriceConfigItem[]>([
    { startNum: undefined, endNum: undefined, coin: undefined },
  ]);

  useEffect(() => {
    if (visible) {
      console.log('currentRow======>>>', currentRow);
      form.resetFields();
      setConfigs([{ startNum: undefined, endNum: undefined, coin: undefined }]);
    }
  }, [visible]);

  const handleAddConfig = () => {
    setConfigs([...configs, { startNum: undefined, endNum: undefined, coin: undefined }]);
  };

  const handleRemoveConfig = (index: number) => {
    if (configs.length === 1) {
      message.warning('至少保留一项价格配置');
      return;
    }
    const newConfigs = configs.filter((_, i) => i !== index);
    setConfigs(newConfigs);
  };

  const handleConfigChange = (index: number, key: keyof PriceConfigItem, value: any) => {
    const newConfigs = configs.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    setConfigs(newConfigs);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // 校验每一项价格配置
      for (let i = 0; i < configs.length; i++) {
        const item = configs[i];
        if (item.startNum === undefined || item.endNum === undefined || item.coin === undefined) {
          message.error(`请完善第${i + 1}项的起始集、结束集和金币`);
          return;
        }
        if (item.startNum > item.endNum) {
          message.error(`第${i + 1}项的起始集不能大于结束集`);
          return;
        }
      }

      onOk({
        name: values.name,
        videoChannelCoinList: configs,
        movieId: currentRow.id,
      })
      form.resetFields();
      setConfigs([{ startNum: undefined, endNum: undefined, coin: undefined }]);
    } catch (e) {
      // 校验失败
    }
  };

  return (
    <Modal
      title="设置自定义价格"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="价格配置名称"
          name="name"
          rules={[{ required: true, message: '请输入价格配置名称' }]}
        >
          <Input placeholder="请输入价格配置名称" />
        </Form.Item>
        <div style={{ marginBottom: 8, fontWeight: 500 }}>价格区间配置</div>
        {configs.map((item, idx) => (
          <Row gutter={8} key={idx} style={{ marginBottom: 8 }}>
            <Col span={6}>
              <InputNumber
                min={1}
                placeholder="起始集"
                style={{ width: '100%' }}
                value={item.startNum}
                onChange={(val) => handleConfigChange(idx, 'startNum', val)}
              />
            </Col>
            <Col span={1} style={{ textAlign: 'center', lineHeight: '32px' }}>
              -
            </Col>
            <Col span={6}>
              <InputNumber
                min={1}
                placeholder="结束集"
                style={{ width: '100%' }}
                value={item.endNum}
                onChange={(val) => handleConfigChange(idx, 'endNum', val)}
              />
            </Col>
            <Col span={1} style={{ textAlign: 'center', lineHeight: '32px' }}>
              集
            </Col>
            <Col span={6}>
              <InputNumber
                min={0}
                placeholder="金币"
                style={{ width: '100%' }}
                value={item.coin}
                onChange={(val) => handleConfigChange(idx, 'coin', val)}
              />
            </Col>
            <Col span={2}>
              <Button
                danger
                type="link"
                onClick={() => handleRemoveConfig(idx)}
                style={{ padding: 0 }}
              >
                删除
              </Button>
            </Col>
          </Row>
        ))}
        <Button type="dashed" block onClick={handleAddConfig}>
          添加价格区间
        </Button>
      </Form>
    </Modal>
  );
};

export default PriceModal;
