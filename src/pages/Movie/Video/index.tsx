import { useRequest } from 'ahooks';
import { listVideo, addVideo, updateVideo, delVideo } from '@/services/movie/video';
import { uploadFile } from '@/services/common/commont';
import { useEffect, useState, useRef } from 'react';
import CardContainer from '@/components/CardContainer';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message, Form, Input, Upload, Select, Space, Popconfirm } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import VideoPreview from '@/components/VideoPreview';

const { Option } = Select;

const Video = () => {
  const [searchVideoParams, setSearchVideoParams] = useState<Record<string, any>>({
    pageNum: 1,
    pageSize: 10,
    orderByColumn: 'id',
    isAsc: 'desc',
    videoNum: undefined,
    status: undefined,
    movieId: undefined,
    isVip: undefined,
    feildChange: false,
  });

  const { data, loading, run } = useRequest(() => listVideo(searchVideoParams));
  const [openPreviewVideo, setOpenPreviewVideo] = useState(false);
  const [currentVideo, setCurrentVideo] = useState<any>(null);

  // 新增/编辑弹窗
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [modalLoading, setModalLoading] = useState(false);
  const [editRecord, setEditRecord] = useState<any>(null);

  // 表单
  const [form] = Form.useForm();

  useEffect(() => {
    if (searchVideoParams.feildChange) {
      run();
    }
  }, [searchVideoParams]);

  // 打开新增/编辑弹窗
  const openModal = (type: 'add' | 'edit', record?: any) => {
    setModalType(type);
    setModalVisible(true);
    setEditRecord(record || null);
    if (type === 'edit' && record) {
      form.setFieldsValue({
        ...record,
        coverImage: record.coverImage ? [{ url: record.coverImage, name: '封面', status: 'done', uid: '-1' }] : [],
        videoUrl: record.videoUrl ? [{ url: record.videoUrl, name: '视频', status: 'done', uid: '-2' }] : [],
      });
    } else {
      form.resetFields();
    }
  };

  // 删除
  const handleDelete = async (record: any) => {
    Modal.confirm({
      title: '删除剧集',
      content: `确定要删除剧集「${record.videoNum}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await delVideo(record.id);
          message.success('删除成功');
          run();
        } catch (e) {
          message.error('删除失败');
        }
      },
    });
  };

  // 上传封面
  const handleUploadCover = async (options: any) => {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await uploadFile(formData);
      if (res.code === 200) {
        onSuccess({ url: res.url });
      } else {
        message.error(res.msg || '上传失败');
        onError();
      }
    } catch (e) {
      message.error('上传失败');
      onError();
    }
  };

  // 上传视频（只允许m3u8）
  const handleUploadVideo = async (options: any) => {
    const { file, onSuccess, onError } = options;
    if (!file.name.endsWith('.m3u8')) {
      message.error('只允许上传m3u8格式的视频文件');
      onError();
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await uploadFile(formData);
      if (res.code === 200) {
        onSuccess({ url: res.url });
      } else {
        message.error(res.msg || '上传失败');
        onError();
      }
    } catch (e) {
      message.error('上传失败');
      onError();
    }
  };

  // 提交表单
  const handleModalOk = async () => {
    try {
      setModalLoading(true);
      const values = await form.validateFields();
      const coverImage = values.coverImage && values.coverImage[0]?.url
        ? values.coverImage[0].url
        : values.coverImage && values.coverImage[0]?.response?.url
        ? values.coverImage[0].response.url
        : '';
      const videoUrl = values.videoUrl && values.videoUrl[0]?.url
        ? values.videoUrl[0].url
        : values.videoUrl && values.videoUrl[0]?.response?.url
        ? values.videoUrl[0].response.url
        : '';
      const params = {
        ...values,
        coverImage,
        videoUrl,
      };
      if (modalType === 'add') {
        await addVideo(params);
        message.success('新增成功');
      } else {
        await updateVideo({ ...params, id: editRecord.id });
        message.success('修改成功');
      }
      setModalVisible(false);
      run();
    } catch (e: any) {
      if (e?.errorFields) return; // 表单校验错误
      message.error('操作失败');
    } finally {
      setModalLoading(false);
    }
  };

  const columns: ProColumns<any>[] = [
    {
      title: '电影ID',
      dataIndex: 'id',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '视频',
      dataIndex: 'coverImage',
      width: 100,
      render: (_, record) => (
        <div
          style={{ cursor: 'pointer' }}
          onClick={() => {
            setOpenPreviewVideo(true);
            setCurrentVideo(record);
          }}
        >
          <img
            alt="cover"
            width={120}
            height={120}
            style={{ objectFit: 'cover', borderRadius: 8 }}
            src={record.coverImage}
          />
        </div>
      ),
    },
    {
      title: '剧集编号',
      dataIndex: 'videoNum',
      width: 100,
      render: (text) => (
        <span
          style={{
            color: '#faad14',
            fontWeight: 'bold',
            fontSize: 18,
            background: '#fffbe6',
            borderRadius: 4,
            padding: '2px 8px',
            display: 'inline-block',
            boxShadow: '0 0 4px #ffe58f',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '时长(秒)',
      dataIndex: 'duration',
      width: 100,
      hideInSearch: true,
    },
    // {
    //   title: '播放数',
    //   dataIndex: 'playCount',
    //   width: 100,
    //   hideInSearch: true,
    // },
    // {
    //   title: '点赞数',
    //   dataIndex: 'likeCount',
    //   width: 100,
    //   hideInSearch: true,
    // },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        '0': { text: '正常', status: 'Success' },
        '1': { text: '禁用', status: 'Error' },
      },
      fieldProps: {
        onChange: (value: string) => {
          setSearchVideoParams((prev) => ({
            ...prev,
            status: value,
            feildChange: true,
          }));
        },
      },
    }, 
    {
      title: '操作',
      dataIndex: 'option',
      width: 160,
      fixed: 'right',
      valueType: 'option',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openModal('edit', record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除该剧集吗？"
            onConfirm={() => handleDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="link" icon={<DeleteOutlined />} danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <CardContainer title="剧集管理">
      <ProTable
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={data?.rows || []}
        loading={loading}
        rowKey="id"
        key="videoList"
        search={{
          labelWidth: 120,
        }}
        pagination={{
          pageSize: searchVideoParams.pageSize,
          total: data?.total,
          current: searchVideoParams.pageNum,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) => {
            setSearchVideoParams((prev) => ({
              ...prev,
              pageNum: page,
              pageSize: pageSize,
              feildChange: true,
            }));
          },
        }}
        onSubmit={(params) => {
          setSearchVideoParams({
            ...searchVideoParams,
            ...params,
            pageNum: 1,
            feildChange: true,
          });
        }}
        toolBarRender={() => [
          <Button type="primary" key="add" onClick={() => openModal('add')}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
      />
      {/* 新增/编辑弹窗 */}
      <Modal
        title={modalType === 'add' ? '新增剧集' : '编辑剧集'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        onOk={handleModalOk}
        confirmLoading={modalLoading}
        destroyOnClose
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: '0',
          }}
        >
          <Form.Item
            label="剧集编号"
            name="videoNum"
            rules={[{ required: true, message: '请输入剧集编号' }]}
          >
            <Input placeholder="请输入剧集编号" />
          </Form.Item>
          <Form.Item
            label="封面"
            name="coverImage"
            valuePropName="fileList"
            getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[{ required: true, message: '请上传封面' }]}
          >
            <Upload
              customRequest={handleUploadCover}
              listType="picture-card"
              maxCount={1}
              accept="image/*"
              showUploadList={{ showRemoveIcon: true }}
              beforeUpload={file => {
                const isImage = file.type.startsWith('image/');
                if (!isImage) {
                  message.error('只能上传图片文件');
                }
                return isImage;
              }}
              defaultFileList={[]}
            >
              <div>
                <UploadOutlined />
                <div style={{ marginTop: 8 }}>上传</div>
              </div>
            </Upload>
          </Form.Item>
          <Form.Item
            label="视频文件（仅支持m3u8）"
            name="videoUrl"
            valuePropName="fileList"
            getValueFromEvent={e => (Array.isArray(e) ? e : e && e.fileList)}
            rules={[{ required: true, message: '请上传m3u8视频文件' }]}
          >
            <Upload
              customRequest={handleUploadVideo}
              listType="text"
              maxCount={1}
              accept=".m3u8"
              showUploadList={{ showRemoveIcon: true }}
              beforeUpload={file => {
                const isM3u8 = file.name.endsWith('.m3u8');
                if (!isM3u8) {
                  message.error('只能上传m3u8格式的视频文件');
                }
                return isM3u8;
              }}
              defaultFileList={[]}
            >
              <Button icon={<UploadOutlined />}>上传m3u8</Button>
            </Upload>
          </Form.Item>
          <Form.Item
            label="时长(秒)"
            name="duration"
            rules={[{ required: true, message: '请输入时长' }]}
          >
            <Input type="number" placeholder="请输入时长（秒）" />
          </Form.Item>
          <Form.Item
            label="状态"
            name="status"
            rules={[{ required: true, message: '请选择状态' }]}
          >
            <Select>
              <Option value="0">正常</Option>
              <Option value="1">禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="备注"
            name="remark"
          >
            <Input.TextArea placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
      {/* 视频预览弹窗 */}
      <Modal
        width="50%"
        open={openPreviewVideo}
        onCancel={() => setOpenPreviewVideo(false)}
        footer={null}
        bodyStyle={{ padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
        style={{ top: 20 }}
        destroyOnClose
      >
        <VideoPreview
          pic={currentVideo?.coverImage}
          videoId={currentVideo?.id}
          src={currentVideo?.videoUrl}
        />
      </Modal>
    </CardContainer>
  );
};

export default Video;
