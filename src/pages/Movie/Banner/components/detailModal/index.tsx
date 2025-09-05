import { detailForm } from '@/services/movie/banner';
import { getLanguageList } from '@/services/config/index';
import { listMovie } from '@/services/movie/details';
import { UploadOutlined } from '@ant-design/icons';
import { Modal, Form, Input, Image, Row, Col, message, Upload, Button, Select, Spin } from 'antd';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { uploadFile } from '@/services/common/commont';
import { getPageList } from '@/services/app';
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
  const [languageList, setLanguageList] = useState([]);
  const [movieList, setMovieList] = useState<any>([]);
  const [appList, setAppList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  useEffect(() => {
    getLanguageList({}).then((res) => {
      setLanguageList(res.rows);
    });
    getPageList({}).then((res) => {
      const appOptions = res.rows.map((item: any) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      setAppList(appOptions);
    });
    loadMoreData();
    if (currentRow) {
      detailForm(currentRow.id).then((res) => {
        form.setFieldsValue(res.data);
        setCoverImageUrl(res.data.imageUrl);
      });
    } else {
      setCoverImageUrl('');
      form.resetFields();
    }
  }, [currentRow, open]);

  const [confirmLoading, setConfirmLoading] = useState(false);

  // 选择影片事件
  const handleMovieChange = (val: any) => {
    const query: any = movieList.filter((item: any) => item.id == val);
    form.setFieldsValue({
      remark: JSON.stringify({ movieId: query[0].id, num: query[0].totalVideos }),
    });
  };

  // 下拉加载更多影片
  const loadMoreData = () => {
    if (loading) return;
    setLoading(true);
    const nextPage = page + 1;
    listMovie({ pageNum: nextPage, pageSize: 10 }).then((res: any) => {
      if (movieList.length >= Number(res.total)) {
        setLoading(false);
        return;
      }
      setMovieList([...movieList, ...res.rows]);
      setPage(nextPage);
      setLoading(false);
    });
  };
  // 新增/编辑提交
  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();
      await onOk({ ...values, imageUrl: coverImageUrl });
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
          form.setFieldsValue({ imageUrl: res.url });
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
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            {/* 封面预览 */}
            <Form.Item label="封面预览" shouldUpdate>
              {() =>
                coverImageUrl ? (
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
        <Col span={12}>
          <Form.Item
            label="多语言code"
            name="languageCode"
            rules={[{ required: true, message: '请选择多语言code' }]}
          >
            <Select allowClear placeholder="请选择多语言Code">
              {languageList.map((item: any) => (
                <Option key={item.id} value={item.code}>
                  {item.zhName}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="影片"
            name="movieId"
            rules={[{ required: true, message: '请选择影片' }]}
          >
            <Select
              allowClear
              placeholder="请选择影片"
              onChange={handleMovieChange}
              onPopupScroll={(e: any) => {
                const target = e.target;
                if (target.scrollTop + target.offsetHeight >= target.scrollHeight - 10) {
                  loadMoreData();
                }
              }}
              dropdownRender={(menu) => (
                <>
                  {menu}
                  {loading && (
                    <div style={{ textAlign: 'center', padding: 8 }}>
                      <Spin size="small" />
                    </div>
                  )}
                </>
              )}
            >
              {movieList.map((item: any) => (
                <Option key={item.id} value={item.id}>
                  {item.id} - {item.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item label="APP" name="appId" rules={[{ required: true, message: '请选择APP' }]}>
            <Select allowClear placeholder="请选择APP">
              {appList.map((item: any) => (
                <Option key={item.value} value={item.value}>
                  {item.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Form.Item label="备注" name="remark" hidden>
          <Input.TextArea rows={2} placeholder="请输入备注" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DetailModal;
