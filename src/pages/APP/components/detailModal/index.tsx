import { UploadOutlined } from '@ant-design/icons';
import {
  Modal,
  Form,
  Input,
  Select,
  Image,
  Row,
  Col,
  message,
  Upload,
  Button,
  Radio,
} from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { uploadFile } from '@/services/common/commont';

const { Option } = Select;

interface DetailModalProps {
  title: string;
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => Promise<void>;
  currentRow: any;
}

const DetailModal: React.FC<DetailModalProps> = ({ title, open, onCancel, onOk, currentRow }) => {
  const [form] = Form.useForm();
  const [coverImageUrl, setCoverImageUrl] = useState<any>(undefined);
  const [uploadLoading, setUploadLoading] = useState(false);
  useEffect(() => {
    if (currentRow) {
      form.setFieldsValue({
        ...currentRow,
        releaseDate: currentRow.releaseDate ? dayjs(currentRow.releaseDate) : undefined,
      });
      setCoverImageUrl(currentRow.icon);
    } else {
      form.resetFields();
    }
  }, [currentRow]);
  const coverImageValue = Form.useWatch('icon', form);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // 新增/编辑提交
  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();
      await onOk(values);
      message.success('操作成功');
    } catch (e) {
      console.log(e);
    } finally {
      setConfirmLoading(false);
    }
  };
  const beforeUpload = async (file: any) => {
    setUploadLoading(true);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      const formData = new FormData();
      formData.append('file', file);
      try {
        const res = await uploadFile(formData);
        if (res.code === 200) {
          form.setFieldsValue({ icon: res.url });
          setCoverImageUrl(res.url);
        } else {
          message.error(res.msg);
        }
      } catch (error) {
        message.error('上传失败');
      } finally {
        setUploadLoading(false);
      }
    };
  };
  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      destroyOnClose
      width={700}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={{
          type: '0',
          identifier: '0'
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="类型" name="type" rules={[{ required: true, message: '请选择类型' }]}>
              <Radio.Group>
                <Radio value="0"> APP </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="状态"
              name="status"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择状态">
                <Option value="0">正常</Option>
                <Option value="1">停用</Option>
                <Option value="2">待上线</Option>
                <Option value="3">准备就绪</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="应用名称" name="name">
              <Input placeholder="请输入应用名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="公司名称" name="company">
              <Input placeholder="请输入公司名称" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          {/* <Col span={12}>
            <Form.Item label="有效用户集数" name="releaseDate">
              <Input placeholder="请输入有效用户集数" />
            </Form.Item>
          </Col> */}
          <Col span={12}>
            <Form.Item label="app版本号" name="appVersion">
              <Input placeholder="请输入app版本号" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              hidden={true}
              label="应用图标"
              name="icon"
              rules={[{ required: true, message: '请上传应用图标' }]}
            >
              <Input placeholder="请上传应用图标" />
            </Form.Item>
            {/* 应用图标 */}
            <Form.Item label="应用图标" shouldUpdate>
              {() =>
                coverImageValue ? (
                  <Image
                    src={coverImageUrl}
                    alt="cover"
                    width={120}
                    height={120}
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                    preview={!!coverImageUrl}
                  />
                ) : (
                  <div
                    style={{
                      width: 120,
                      height: 120,
                      background: '#f0f0f0',
                      borderRadius: 8,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#aaa',
                    }}
                  >
                    暂无图标
                  </div>
                )
              }
            </Form.Item>
            <Upload beforeUpload={beforeUpload} maxCount={1} showUploadList={false}>
              <Button icon={<UploadOutlined />} loading={uploadLoading}>
                上传图标
              </Button>
            </Upload>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="深度链接" name="deepLink">
              <Input placeholder="请输入深度链接" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="深度追踪Token" name="adjustFacebookToken">
              <Input placeholder="请输入深度追踪Token" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="af深链链接" name="afLinkUrl">
              <Input placeholder="请输入af深链链接" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="是否开启多语言"
              name="identifier"
              rules={[{ required: true, message: '请选择是否开启多语言' }]}
            >
              <Radio.Group>
                <Radio value="0"> 已开启 </Radio>
                <Radio value="1"> 未开启 </Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="备注" name="remark">
          <Input.TextArea rows={2} placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DetailModal;
