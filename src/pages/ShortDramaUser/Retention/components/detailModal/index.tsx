import { UploadOutlined } from '@ant-design/icons';
import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Image,
  Row,
  Col,
  message,
  Upload,
  Button,
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

const DetailModal: React.FC<DetailModalProps> = ({
  title,
  open,
  onCancel,
  onOk,
  currentRow,
}) => {
  const [form] = Form.useForm();
  const [coverImageUrl, setCoverImageUrl] = useState<any>(undefined);
  const [uploadLoading, setUploadLoading] = useState(false);
  useEffect(() => {
    if (currentRow) {
      form.setFieldsValue({
        ...currentRow,
        releaseDate: currentRow.releaseDate ? dayjs(currentRow.releaseDate) : undefined,
      });
      setCoverImageUrl(currentRow.coverImage);
    } else {
      form.resetFields();
    }
  }, [currentRow]);
  const coverImageValue = Form.useWatch('coverImage', form);
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
          form.setFieldsValue({ coverImage: res.url });
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
          status: '1',
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="标题"
              name="title"
              rules={[{ required: true, message: '请输入标题' }]}
            >
              <Input placeholder="请输入标题" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              hidden={true}
              label="封面链接"
              name="coverImage"
              rules={[{ required: true, message: '请输入封面图片链接' }]}
            >
              <Input placeholder="请输入封面图片链接" />
            </Form.Item>
            {/* 封面预览 */}
            <Form.Item label="封面预览" shouldUpdate>
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
                    暂无封面
                  </div>
                )
              }
            </Form.Item>
            <Upload beforeUpload={beforeUpload} maxCount={1} showUploadList={false}>
              <Button icon={<UploadOutlined />} loading={uploadLoading}>
                上传封面
              </Button>
            </Upload>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="导演" name="director">
              <Input placeholder="请输入导演" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="演员" name="actors">
              <Input placeholder="请输入演员" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item label="上映日期" name="releaseDate">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="总集数" name="totalVideos">
              <Input type="number" placeholder="请输入总集数" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="状态"
              name="status"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select>
                <Option value="1">上架</Option>
                <Option value="0">下架</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="中文名称" name="name" rules={[{ required: true, message: '请输入中文名称' }]}>
              <Input placeholder="请输入中文名称" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item label="简介" name="description">
          <Input.TextArea rows={2} placeholder="请输入简介" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DetailModal;
