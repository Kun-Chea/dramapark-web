import { useRequest } from 'ahooks';
import { listArea, addArea, updateArea, delAreaBatch } from '@/services/movie/area';
import { useEffect, useState } from 'react';
import CardContainer from '@/components/CardContainer';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message, Form, Input, Table, Tag } from 'antd';

const Area = () => {
  const [searchAreaParams, setSearchAreaParams] = useState<Record<string, any>>({
    pageNum: 1,
    pageSize: 10,
    orderByColumn: 'id',
    isAsc: 'desc',
    /** 地区名称 */
    area: undefined,
    /** 搜索值 */
    searchValue: undefined,
    /** 是否触发请求 */
    feildChange: false,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [form] = Form.useForm();

  // 查询数据
  const { data, loading, run } = useRequest(() => listArea(searchAreaParams));

  useEffect(() => {
    if (searchAreaParams.feildChange) {
      run();
    }
  }, [searchAreaParams]);

  // 打开新增/编辑弹窗
  const openModal = async (type: 'add' | 'edit', record?: any) => {
    setModalType(type);
    setModalVisible(true);
    setCurrentRow(record);
    form.setFieldsValue(record);
  };

  // 删除地区
  const handleDelete = async (record: any) => {
    Modal.confirm({
      title: '删除地区',
      content: `确定要删除地区「${record.area}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await delAreaBatch([record.id]);
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
      title: '批量删除地区',
      content: '确定要批量删除选中的地区吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await delAreaBatch(ids);
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
        await addArea(values);
        message.success('新增成功');
      } else if (modalType === 'edit') {
        await updateArea({ ...currentRow, ...values });
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
      title: '多语言名称',
      dataIndex: 'area',
      key: 'area',
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

  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      hideInSearch: true,
      valueType: 'indexBorder',
    },
    {
      title: '地区名称',
      dataIndex: 'area',
      width: 200,
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
          style={{ color: '#f5222d', marginLeft: 8 }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <CardContainer title="地区管理">
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
          setSearchAreaParams((prev) => ({
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
          setSearchAreaParams({
            pageNum: 1,
            pageSize: 10,
            orderByColumn: 'id',
            isAsc: 'desc',
            feildChange: true,
          });
        }}
        pagination={{
          pageSize: searchAreaParams.pageSize,
          total: data?.total,
          current: searchAreaParams.pageNum,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) => {
            setSearchAreaParams((prev) => ({
              ...prev,
              pageNum: page,
              pageSize: pageSize,
              feildChange: true,
            }));
          },
        }}
        toolBarRender={() => [
          <Button type="primary" key="add" onClick={() => openModal('add')}>
            新增地区
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
        title={modalType === 'add' ? '新增地区' : '编辑地区'}
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
            label="地区名称"
            name="area"
            rules={[{ required: true, message: '请输入地区名称' }]}
          >
            <Input placeholder="请输入地区名称" />
          </Form.Item>
        </Form>
      </Modal>
    </CardContainer>
  );
};

export default Area;
