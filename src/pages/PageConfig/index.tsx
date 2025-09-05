import { useRequest } from 'ahooks';
import { getPageConfig, addPageConfig, updatePageConfig, deletePageConfig } from '@/services/page-config/config';
import { useEffect, useState } from 'react';
import CardContainer from '@/components/CardContainer';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message, Form, Input, Switch } from 'antd';

const PageConfig = () => {
  const [searchParams, setSearchParams] = useState<Record<string, any>>({
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
  const { data, loading, run } = useRequest(() => getPageConfig(searchParams));

  useEffect(() => {
    if (searchParams.feildChange) {
      run();
    }
  }, [searchParams]);

  // 打开新增/编辑弹窗
  const openModal = (type: 'add' | 'edit', record?: any) => {
    setModalType(type);
    setModalVisible(true);
    setCurrentRow(record);
    if (type === 'edit' && record) {
      form.setFieldsValue({
        pageKey: record.pageKey,
        pageCname: record.pageCname,
        pageEname: record.pageEname,
        pageLinkUrl: record.pageLinkUrl,
        isActive: record.isActive === 1,
      });
    } else {
      form.resetFields();
    }
  };

  // 删除页面配置
  const handleDelete = async (record: any) => {
    Modal.confirm({
      title: '删除页面配置',
      content: `确定要删除页面配置「${record.pageCname}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deletePageConfig([record.id]);
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
  const handleBatchDelete = async (ids: React.Key[]) => {
    Modal.confirm({
      title: '批量删除页面配置',
      content: '确定要批量删除选中的页面配置吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deletePageConfig(ids.map(String));
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
        await addPageConfig({
          pageKey: values.pageKey,
          pageCname: values.pageCname,
          pageEname: values.pageEname,
          pageLinkUrl: values.pageLinkUrl,
          isActive: values.isActive ? 1 : 0,
        });
        message.success('新增成功');
      } else if (modalType === 'edit') {
        await updatePageConfig({
          ...currentRow,
          pageKey: values.pageKey,
          pageCname: values.pageCname,
          pageEname: values.pageEname,
          pageLinkUrl: values.pageLinkUrl,
          isActive: values.isActive ? 1 : 0,
        });
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

  // 新增：切换激活状态
  const handleSwitchActive = async (checked: boolean, record: any) => {
    try {
      await updatePageConfig({
        ...record,
        isActive: checked ? 1 : 0,
      });
      message.success('激活状态已更新');
      run();
    } catch (e) {
      message.error('激活状态更新失败');
    }
  };

  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      hideInSearch: true,
    },
    {
      title: '页面标识键',
      dataIndex: 'pageKey',
      width: 200,
    },
    {
      title: '页面中文名称',
      dataIndex: 'pageCname',
      width: 200,
    },
    {
      title: '页面英文名称',
      dataIndex: 'pageEname',
      width: 200,
    },
    {
      title: '页面链接',
      dataIndex: 'pageLinkUrl',
      width: 250,
      render: (_, record) => {
        if (typeof record.pageLinkUrl === 'string' && record.pageLinkUrl.length > 40) {
          return (
            <span title={record.pageLinkUrl}>
              {record.pageLinkUrl.slice(0, 40)}...
            </span>
          );
        }
        return record.pageLinkUrl;
      },
    },
    {
      title: '是否激活',
      dataIndex: 'isActive',
      width: 100,
      render: (_, record) => (
        <Switch
          checked={record.isActive === 1}
          checkedChildren="是"
          unCheckedChildren="否"
          onChange={(checked) => handleSwitchActive(checked, record)}
        />
      ),
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
    <CardContainer title="页面配置管理">
      <ProTable
        columns={columns}
        dataSource={data?.rows || []}
        loading={loading}
        rowKey="id"
        options={{
          reload: false,
        }}
        onSubmit={async (params) => {
          setSearchParams((prev) => ({
            ...prev,
            ...params,
            feildChange: true,
          }));
        }}
        onReset={() => {
          setSearchParams({
            pageNum: 1,
            pageSize: 10,
            orderByColumn: 'id',
            isAsc: 'desc',
            feildChange: true,
          });
        }}
        pagination={{
          pageSize: searchParams.pageSize,
          total: data?.total,
          current: searchParams.pageNum,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) => {
            setSearchParams((prev) => ({
              ...prev,
              pageNum: page,
              pageSize: pageSize,
              feildChange: true,
            }));
          },
        }}
        toolBarRender={() => [
          <Button type="primary" key="add" onClick={() => openModal('add')}>
            新增页面配置
          </Button>,
          selectedRowKeys.length > 0 && (
            <Button
              key="batchDelete"
              danger
              onClick={() => handleBatchDelete(selectedRowKeys)}
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
        title={modalType === 'add' ? '新增页面配置' : '编辑页面配置'}
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
            label="页面标识键"
            name="pageKey"
            rules={[{ required: true, message: '请输入页面标识键' }]}
          >
            <Input placeholder="请输入页面标识键(如:contact_us,terms_of_service,privacy_policy,dmca)" />
          </Form.Item>
          <Form.Item
            label="页面中文名称"
            name="pageCname"
            rules={[{ required: true, message: '请输入页面中文名称' }]}
          >
            <Input placeholder="请输入页面中文名称" />
          </Form.Item>
          <Form.Item
            label="页面英文名称"
            name="pageEname"
            rules={[{ required: true, message: '请输入页面英文名称' }]}
          >
            <Input placeholder="请输入页面英文名称" />
          </Form.Item>
          <Form.Item
            label="页面链接"
            name="pageLinkUrl"
            rules={[{ required: true, message: '请输入页面链接' }]}
          >
            <Input placeholder="请输入页面链接" />
          </Form.Item>
          <Form.Item
            label="是否激活"
            name="isActive"
            valuePropName="checked"
          >
            <Switch checkedChildren="是" unCheckedChildren="否" />
          </Form.Item>
          <Form.Item
            label="备注"
            name="remark"
            rules={[{ required: false }]}
          >
            <Input.TextArea placeholder="请输入备注" rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </CardContainer>
  );
};

export default PageConfig;
