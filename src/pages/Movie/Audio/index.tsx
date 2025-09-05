import { useRequest } from 'ahooks';
import { listAudio, addAudio, updateAudio, deleteAudio } from '@/services/movie/audio';
import { useEffect, useState } from 'react';
import CardContainer from '@/components/CardContainer';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message, Form, Input, Tag } from 'antd';

const Audio = () => {
  const [searchAudioParams, setSearchAudioParams] = useState<Record<string, any>>({
    pageNum: 1,
    pageSize: 10,
    orderByColumn: 'id',
    isAsc: 'desc',
    feildChange: false,
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  // 查询数据
  const { data, loading, run } = useRequest(() => listAudio(searchAudioParams));

  useEffect(() => {
    if (searchAudioParams.feildChange) {
      run();
    }
  }, [searchAudioParams]);

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
      title: '多语言音轨类型',
      dataIndex: 'audio',
      key: 'audio',
      copyable: true,
      width: 200,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      key: 'remark',
      width: 200,
      render: (text: any) => {
        if (typeof text === 'string' && text.length > 30) {
          return (
            <span title={text}>
              {text.slice(0, 30)}...
            </span>
          );
        }
        return text;
      },
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

  // 删除音轨
  const handleDelete = async (record: any) => {
    Modal.confirm({
      title: '删除音轨',
      content: `确定要删除音轨「${record.audio}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteAudio([record.id]);
          message.success('删除成功');
          run();
          setSelectedRowKeys([]);
        } catch (e) {
          message.error('删除失败');
        }
      },
    });
  };

  // 批量删除
  const handleBatchDelete = async (ids: number[] | string[]) => {
    Modal.confirm({
      title: '批量删除音轨',
      content: '确定要批量删除选中的音轨吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteAudio(ids);
          message.success('批量删除成功');
          run();
          setSelectedRowKeys([]);
        } catch (e) {
          message.error('批量删除失败');
        }
      },
    });
  };

  // 新增/编辑提交
  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      const values = await form.validateFields();
      if (modalType === 'add') {
        await addAudio(values);
        message.success('新增成功');
      } else if (modalType === 'edit') {
        await updateAudio({ ...currentRow, ...values });
        message.success('编辑成功');
      }
      setModalVisible(false);
      setConfirmLoading(false);
      setCurrentRow(null);
      form.resetFields();
      run();
    } catch (e) {
      setConfirmLoading(false);
    }
  };

  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      hideInSearch: true,
      valueType: 'indexBorder',
    },
    {
      title: '音轨类型',
      dataIndex: 'audio',
      width: 200,
    },
    {
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      render: (text: any) => {
        if (typeof text === 'string' && text.length > 30) {
          return (
            <span title={text}>
              {text.slice(0, 30)}...
            </span>
          );
        }
        return text;
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      valueType: 'dateTime',
      width: 200,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      hideInSearch: true,
      valueType: 'dateTime',
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 130,
      render: (_, record) => [
        <a key="edit" onClick={() => openModal('edit', record)} style={{ color: '#1890ff' }}>
          编辑
        </a>,
        <a
          key="delete"
          onClick={() => handleDelete(record)}
          style={{ color: 'red', marginLeft: 8 }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <CardContainer title="音轨管理">
      <ProTable<any>
        loading={loading}
        columns={columns}
        dataSource={data?.rows}
        rowKey="id"
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
        onSubmit={async (params) => {
          setSearchAudioParams((prev) => ({
            ...prev,
            ...params,
            feildChange: true,
          }));
        }}
        options={{
          fullScreen: true,
          setting: true,
          density: true,
          reload: false,
        }}
        onReset={() => {
          setSearchAudioParams({
            pageNum: 1,
            pageSize: 10,
            orderByColumn: 'id',
            isAsc: 'desc',
            feildChange: true,
          });
        }}
        pagination={{
          pageSize: searchAudioParams.pageSize,
          total: data?.total,
          current: searchAudioParams.pageNum,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) => {
            setSearchAudioParams((prev) => ({
              ...prev,
              pageNum: page,
              pageSize: pageSize,
              feildChange: true,
            }));
          },
        }}
        toolBarRender={() => [
          <Button type="primary" key="add" onClick={() => openModal('add')}>
            新增音轨
          </Button>,
          selectedRowKeys.length > 0 && (
            <Button
              key="batchDelete"
              danger
              onClick={() => handleBatchDelete(selectedRowKeys as number[])}
            >
              批量删除
            </Button>
          ),
        ]}
        rowSelection={{
          selectedRowKeys,
          onChange: setSelectedRowKeys,
        }}
      />

      <Modal
        title={modalType === 'add' ? '新增音轨' : '编辑音轨'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => {
          setModalVisible(false);
          setCurrentRow(null);
          form.resetFields();
        }}
        confirmLoading={confirmLoading}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="音轨类型"
            name="audio"
            rules={[{ required: true, message: '请输入音轨类型' }]}
          >
            <Input placeholder="请输入音轨类型，如“原音”、“配音”、“字幕”等" />
          </Form.Item>
          <Form.Item
            label="备注"
            name="remark"
          >
            <Input.TextArea placeholder="请输入备注" autoSize={{ minRows: 2, maxRows: 6 }} />
          </Form.Item>
        </Form>
      </Modal>
    </CardContainer>
  );
};

export default Audio;