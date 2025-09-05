import { useRequest } from 'ahooks';
import { listTag, addTag, updateTag, delTag, bindMovies } from '@/services/movie/tag';
import { useEffect, useState } from 'react';
import CardContainer from '@/components/CardContainer';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message, Form, Input, Select, Popconfirm, Tag } from 'antd';
import BindModal from './components/bindModal';

const { Option } = Select;

const TagPage = () => {
  const [searchTagParams, setSearchTagParams] = useState<Record<string, any>>({
    pageNum: 1,
    pageSize: 10,
    tagName: undefined,
    orderNum: undefined,
    status: undefined,
    /** 是否触发请求 */
    feildChange: false,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [bindModalVisible, setBindModalVisible] = useState(false);
  const [bindModalTagId, setBindModalTagId] = useState<any>(null);

  const [form] = Form.useForm();

  const { data, loading, run } = useRequest(() => listTag(searchTagParams));

  useEffect(() => {
    if (searchTagParams.feildChange) {
      run();
    }
  }, [searchTagParams]);

  // 多语言子表格列
  const i18nColumns = [
    {
      title: '语言代码',
      dataIndex: 'languageCode',
      key: 'languageCode',
      width: 120,
      render: (text: any) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: '多语言标签名称',
      dataIndex: 'tagName',
      key: 'tagName',
      copyable: true,
      width: 200,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 180,
      render: (text: any) => text || '-',
    },
  ];

  // 打开新增/编辑弹窗
  const openModal = (type: 'add' | 'edit', record?: any) => {
    setModalType(type);
    setModalVisible(true);
    if (type === 'edit' && record) {
      setCurrentRow(record);
      form.setFieldsValue(record);
    } else {
      setCurrentRow(null);
      form.resetFields();
    }
  };

  // 提交表单
  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      setConfirmLoading(true);
      if (modalType === 'add') {
        await addTag(values);
        message.success('新增标签成功');
      } else if (modalType === 'edit') {
        await updateTag({ ...currentRow, ...values });
        message.success('编辑标签成功');
      }
      setModalVisible(false);
      setSearchTagParams((prev) => ({
        ...prev,
        feildChange: true,
      }));
    } catch (error) {
      // 校验失败
    } finally {
      setConfirmLoading(false);
    }
  };

  // 删除标签
  const handleDelete = async (record: any) => {
    try {
      await delTag(record.tagId);
      message.success('删除标签成功');
      setSearchTagParams((prev) => ({
        ...prev,
        feildChange: true,
      }));
    } catch (error) {
      message.error('删除标签失败');
    }
  };

  const openBindModal = (record: any) => {
    setBindModalVisible(true);
    setBindModalTagId(record.tagId);
  };

  const handleBindOk = async (selectedMovieIds: number[]) => {
    try {
      const res = await bindMovies(bindModalTagId, selectedMovieIds);
      if (res.code === 200) {
        message.success('绑定电影成功');
        setBindModalVisible(false);
        setBindModalTagId(undefined);
        run();
      } else {
        message.error('绑定电影失败');
      }
    } catch (error) {
      console.log('error======<<<', error);
    }
  };

  const columns: ProColumns<any>[] = [
    {
      title: '排序',
      dataIndex: 'orderNum',
      hideInSearch: true,
      width: 80,
      valueType: 'indexBorder',
    },
    {
      title: '标签名称',
      dataIndex: 'tagName',
      width: 200,
      render: (_, record) => <Tag color="blue">{record.tagName}</Tag>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        '1': { text: '正常', status: 'Success' },
        '0': { text: '禁用', status: 'Error' },
      },
      fieldProps: {
        onChange: (value: string) => {
          setSearchTagParams((prev) => ({
            ...prev,
            status: value,
            feildChange: true,
          }));
        },
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      hideInSearch: true,
      width: 200,
      ellipsis: true,
      copyable: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 160,
      render: (_, record) => [
        <a key="bind" onClick={() => openBindModal(record)} style={{ color: '#1890ff' }}>
          绑定
        </a>,
        <a key="edit" onClick={() => openModal('edit', record)} style={{ color: '#1890ff' }}>
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确定要删除该标签吗？"
          onConfirm={() => handleDelete(record)}
        >
          <a key="delete" onClick={() => handleDelete(record)} style={{ color: '#ff4d4f' }}>
            删除
          </a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <CardContainer title="标签管理">
      <ProTable
        columns={columns}
        dataSource={data?.rows || []}
        loading={loading}
        rowKey="tagId"
        search={{
          labelWidth: 80,
          defaultCollapsed: false,
        }}
        options={false}
        pagination={{
          pageSize: searchTagParams.pageSize,
          total: data?.total,
          current: searchTagParams.pageNum,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) => {
            setSearchTagParams((prev) => ({
              ...prev,
              pageNum: page,
              pageSize: pageSize,
              feildChange: true,
            }));
          },
        }}
        onSubmit={(params) => {
          setSearchTagParams({
            ...searchTagParams,
            ...params,
            pageNum: 1,
            feildChange: true,
          });
        }}
        onReset={() => {
          setSearchTagParams({
            pageNum: 1,
            pageSize: 10,
            feildChange: true,
          });
        }}
        toolBarRender={() => [
          <Button type="primary" key="add" onClick={() => openModal('add')}>
            新增标签
          </Button>,
        ]}
        expandable={{
          expandedRowRender: (record) => (
            <ProTable
              columns={i18nColumns}
              dataSource={record.i18nList || []}
              rowKey="id"
              pagination={false}
              size="small"
              bordered
              options={false}
              search={false}
              style={{ margin: 0 }}
              locale={{ emptyText: '暂无多语言数据' }}
            />
          ),
          rowExpandable: (record) => Array.isArray(record.i18nList) && record.i18nList.length > 0,
        }}
      />

      <Modal
        title={modalType === 'add' ? '新增标签' : '编辑标签'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => setModalVisible(false)}
        confirmLoading={confirmLoading}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: '1',
            orderNum: 0,
          }}
        >
          <Form.Item
            label="标签名称"
            name="tagName"
            rules={[{ required: true, message: '请输入标签名称' }]}
          >
            <Input placeholder="请输入标签名称" />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
            <Select>
              <Option value="1">正常</Option>
              <Option value="0">禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="请输入备注" />
          </Form.Item>
        </Form>
      </Modal>
      <BindModal
        open={bindModalVisible}
        onClose={() => setBindModalVisible(false)}
        onOk={handleBindOk}
        tagId={bindModalTagId}
      />
    </CardContainer>
  );
};

export default TagPage;
