import {
  Modal,
  Form,
  Input,
  Button,
  InputNumber,
  Row,
  Col,
  message,
  Radio,
  Descriptions,
} from 'antd';
import { useEffect, useState } from 'react';
import { detailMovieAdRule } from '@/services/movie/details';

interface AdConfigItem {
  adType: string | undefined;
  startVideoNum: number | undefined;
  endVideoNum: number | undefined;
  intervalAdCount: number | undefined;
  intervalCount: number | undefined;
}

interface AdModalProps {
  visible: boolean;
  operationType: string;
  onCancel: () => void;
  onOk: (values: {
    id: string | number;
    name: string;
    appOpenStatus: string;
    backAdType: string;
    settingType: string;
    backAdCount: number;
    intervalAdCount: number;
    intervalCount: number;
    intervalAdType: string;
    settingJsonList: AdConfigItem[];
    movieId: string;
  }) => void;
  currentRow: any;
  rowId: any;
}

const AdModal: React.FC<AdModalProps> = ({
  visible,
  operationType,
  onCancel,
  onOk,
  currentRow,
  rowId,
}) => {
  const [form] = Form.useForm();
  const settingType = Form.useWatch('settingType', form);
  const [configs, setConfigs] = useState<AdConfigItem[]>([
    {
      adType: '1',
      startVideoNum: undefined,
      endVideoNum: undefined,
      intervalAdCount: undefined,
      intervalCount: undefined,
    },
  ]);

  useEffect(() => {
    if (visible) {
      console.log('currentRow======>>>', currentRow);
      form.resetFields();
      if (operationType == 'edit') {
        detailMovieAdRule(rowId).then((res) => {
          form.setFieldsValue({
            ...res.data,
          });
          setConfigs(res.data.settingJsonList);
        });
      } else {
        setConfigs([
          {
            adType: '1',
            startVideoNum: undefined,
            endVideoNum: undefined,
            intervalAdCount: undefined,
            intervalCount: undefined,
          },
        ]);
      }
    }
  }, [visible]);

  const handleAddConfig = () => {
    setConfigs([
      ...configs,
      {
        adType: '1',
        startVideoNum: undefined,
        endVideoNum: undefined,
        intervalAdCount: undefined,
        intervalCount: undefined,
      },
    ]);
  };

  const handleRemoveConfig = (index: number) => {
    if (configs.length === 1) {
      message.warning('至少保留一项价格配置');
      return;
    }
    const newConfigs = configs.filter((_, i) => i !== index);
    setConfigs(newConfigs);
  };

  const handleConfigChange = (index: number, key: keyof AdConfigItem, value: any) => {
    const newConfigs = configs.map((item, i) => (i === index ? { ...item, [key]: value } : item));
    setConfigs(newConfigs);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (values.settingType == '2') {
        // 校验每一项价格配置
        for (let i = 0; i < configs.length; i++) {
          const item = configs[i];
          if (Object.values(item).some((val) => val === null || val === undefined || val === '')) {
            message.error(`请填写完整价格区间配置`);
            return;
          }

          if (
            item.startVideoNum === undefined ||
            item.endVideoNum === undefined ||
            item.intervalAdCount === undefined ||
            item.intervalCount === undefined
          ) {
            message.error(`请完善第${i + 1}项的起始集、结束集、展示广告次数和间隔次数`);
            return;
          }
          if (item.startVideoNum > item.endVideoNum) {
            message.error(`第${i + 1}项的起始集不能大于结束集`);
            return;
          }
          if (item.endVideoNum > Number(currentRow.totalVideos)) {
            message.error(`结束集不能大于总集数`);
            return;
          }
        }
      }

      onOk({
        id: rowId,
        name: values.name,
        appOpenStatus: values.appOpenStatus,
        settingType: values.settingType,
        backAdType: values.backAdType,
        backAdCount: values.backAdCount,
        intervalAdType: values.settingType == '1' ? values.intervalAdType : undefined,
        intervalAdCount: values.settingType == '1' ? values.intervalAdCount : undefined,
        intervalCount: values.settingType == '1' ? values.intervalCount : undefined,
        settingJsonList: values.settingType == '1' ? [] : configs,
        movieId: currentRow.id,
      });
      form.resetFields();
      setConfigs([
        {
          adType: '1',
          startVideoNum: undefined,
          endVideoNum: undefined,
          intervalAdCount: undefined,
          intervalCount: undefined,
        },
      ]);
    } catch (e) {
      // 校验失败
    }
  };

  return (
    <Modal
      title="新增广告规则"
      open={visible}
      onCancel={onCancel}
      onOk={handleOk}
      destroyOnClose
      width={900}
    >
      <Descriptions bordered>
        <Descriptions.Item label="短剧名称">{currentRow?.name}</Descriptions.Item>
        <Descriptions.Item label="总集数">{currentRow?.totalVideos}</Descriptions.Item>
      </Descriptions>
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          appOpenStatus: '1',
          backAdType: '1',
          settingType: '1',
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="名称" name="name" rules={[{ required: true, message: '请输入名称' }]}>
              <Input placeholder="请输入名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="是否开屏"
              name="appOpenStatus"
              rules={[{ required: true, message: '请选择是否开屏' }]}
            >
              <Radio.Group>
                <Radio value="1"> 开 </Radio>
                <Radio value="0"> 关 </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="返回展示广告类型"
              name="backAdType"
              rules={[{ required: true, message: '请选择返回展示广告类型' }]}
            >
              <Radio.Group>
                <Radio value="1"> 激励 </Radio>
                <Radio value="2"> 插屏 </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="返回第几次展示广告"
              name="backAdCount"
              rules={[{ required: true, message: '请输入返回第几次展示广告' }]}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="广告展现方式"
              name="settingType"
              rules={[{ required: true, message: '请选择广告展现方式' }]}
            >
              <Radio.Group>
                <Radio value="1"> 间隔 </Radio>
                <Radio value="2"> 区间 </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        {settingType == '1' && (
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                label="展示几个广告"
                name="intervalAdCount"
                rules={[{ required: true, message: '请输入展示几个广告' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="间隔"
                name="intervalCount"
                rules={[{ required: true, message: '请输入间隔' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                label="间隔展示广告"
                name="intervalAdType"
                rules={[{ required: true, message: '请选择间隔展示广告' }]}
              >
                <Radio.Group>
                  <Radio value="1"> 激励 </Radio>
                  <Radio value="2"> 插屏 </Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        )}

        {settingType == '2' && (
          <>
            <div style={{ marginBottom: 8, fontWeight: 500 }}>价格区间配置</div>
            {configs.map((item, idx) => (
              <Row gutter={20} key={idx} style={{ marginBottom: 8 }}>
                <Col span={5}>
                  <Radio.Group
                    onChange={(val) => handleConfigChange(idx, 'adType', val.target.value)}
                    value={item.adType}
                  >
                    <Radio value="1"> 激励 </Radio>
                    <Radio value="2"> 插屏 </Radio>
                  </Radio.Group>
                </Col>
                <Col span={4}>
                  <InputNumber
                    min={1}
                    placeholder="起始集"
                    style={{ width: '100%' }}
                    value={item.startVideoNum}
                    onChange={(val) => handleConfigChange(idx, 'startVideoNum', val)}
                  />
                </Col>
                <Col span={1} style={{ textAlign: 'center', lineHeight: '32px' }}>
                  -
                </Col>
                <Col span={4}>
                  <InputNumber
                    min={1}
                    placeholder="结束集"
                    style={{ width: '100%' }}
                    value={item.endVideoNum}
                    onChange={(val) => handleConfigChange(idx, 'endVideoNum', val)}
                  />
                </Col>
                <Col span={4}>
                  <InputNumber
                    min={0}
                    placeholder="展示广告"
                    style={{ width: '100%' }}
                    value={item.intervalAdCount}
                    onChange={(val) => handleConfigChange(idx, 'intervalAdCount', val)}
                  />
                </Col>
                <Col span={4}>
                  <InputNumber
                    min={0}
                    placeholder="间隔次数"
                    style={{ width: '100%' }}
                    value={item.intervalCount}
                    onChange={(val) => handleConfigChange(idx, 'intervalCount', val)}
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
              添加区间
            </Button>
          </>
        )}
      </Form>
    </Modal>
  );
};

export default AdModal;
