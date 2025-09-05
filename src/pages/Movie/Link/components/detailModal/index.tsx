import { Modal, Form, Input, Select, Row, Col, message } from 'antd';
import { getRuleList, getMovieByAppList } from '@/services/movie/details';
import { getPageList } from '@/services/app';
import { detailForm } from '@/services/movie/link';
import { useEffect, useState } from 'react';

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

  const [languageList, setLanguageList] = useState([]);
  const [ruleList, setRuleList] = useState([]);
  const [appList, setAppList] = useState([]);

  useEffect(() => {
    getPageList({}).then((res) => {
      const appOptions = res.rows.map((item: any) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      setAppList(appOptions);
    });
    if (open && currentRow) {
      detailForm(currentRow.id).then((res: any) => {
        form.setFieldsValue({
          ...res.data,
          title: currentRow.adTemplateName,
        });
        getMovieByAppList({ appId: res.data.appId }).then((pre) => {
          setMovieList(pre.data);
          const arr = pre.data.filter((item: any) => item.id == res.data.movieId);
          setLanguageList(arr[0]?.languageConfigList || []);
          getRuleList({ movieId: res.data.movieId }).then((res) => {
            setRuleList(res.rows);
          });
        });
      });
    } else {
      form.resetFields();
    }
  }, [currentRow, open]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [movieList, setMovieList] = useState<any>([]);

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
  // 选择app查询其下的所有短剧
  const handleAppChange = (val: any) => {
    if (val) {
      getMovieByAppList({ appId: val }).then((res) => {
        setMovieList(res.data);
      });
    } else {
      form.setFieldsValue({ movieId: '', language: '', adTemplateId: '' });
      setMovieList([]);
    }
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
          app: 'app',
        }}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="平台"
              name="platform"
              rules={[{ required: true, message: '请选择平台' }]}
            >
              <Select placeholder="请选择平台">
                <Option value="Facebook">facebook</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item label="APP" name="appId" rules={[{ required: true, message: '请选择APP' }]}>
              <Select allowClear placeholder="请选择APP" onChange={handleAppChange}>
                {appList.map((item: any) => (
                  <Option key={item.value} value={item.value}>
                    {item.label}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="投放系统"
              name="system"
              rules={[{ required: true, message: '请选择投放系统' }]}
            >
              <Select placeholder="请选择投放系统">
                <Option value="通用">通用</Option>
                <Option value="安卓">安卓</Option>
                <Option value="iOS">iOS</Option>
                <Option value="H5">H5</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="名称"
              name="title"
              rules={[{ required: true, message: '请输入名称' }]}
            >
              <Input placeholder="请输入名称" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          {/* <Col span={12}>
            <Form.Item
              label="facebookPixel"
              name="pixelId"
              // rules={[{ required: true, message: '请选择facebookPixel' }]}
            >
              <Select placeholder="请选择facebookPixel">
                <Option value="1">facebook</Option>
              </Select>
            </Form.Item>
          </Col> */}
          <Col span={12}>
            <Form.Item
              label="短剧"
              name="movieId"
              rules={[{ required: true, message: '请选择短剧' }]}
            >
              <Select
                allowClear
                placeholder="请选择影片"
                onChange={(e: any) => {
                  const arr = movieList.filter((item: any) => item.id == e);
                  setLanguageList(arr[0]?.languageConfigList || []);
                  getRuleList({ movieId: e }).then((res) => {
                    setRuleList(res.rows);
                  });
                }}
              >
                {movieList.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="语言"
              name="language"
              rules={[{ required: true, message: '请选择语言' }]}
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
        </Row>
        {/* <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="语言"
              name="language"
              rules={[{ required: true, message: '请选择语言' }]}
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
              label="投放目标"
              name="target"
              // rules={[{ required: true, message: '请选择投放目标' }]}
            >
              <Select placeholder="请选择投放目标">
                <Option value="1">facebook</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row> */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="视频渠道看广告配置"
              name="adTemplateId"
              rules={[{ required: true, message: '请选择视频渠道看广告配置' }]}
            >
              <Select placeholder="请选择视频渠道看广告配置">
                {ruleList.map((item: any) => (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="深链类型"
              name="linkType"
              rules={[{ required: true, message: '请选择深链类型' }]}
            >
              <Select allowClear placeholder="请选择影片">
                <Option value={1}>web To app</Option>
                <Option value={2}>app To app</Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default DetailModal;
