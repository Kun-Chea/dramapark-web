import { useRequest } from 'ahooks';
import {
  listCategory,
  addCategory,
  updateCategory,
  delCategory,
  bindMovie,
} from '@/services/movie/category';
import { useEffect, useState } from 'react';
import CardContainer from '@/components/CardContainer';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message, Form, Input, Select, Tag } from 'antd';
import BindModal from './components/bindModal';

const { Option } = Select;

const Category = () => {
  const [searchCategoryParams, setSearchCategoryParams] = useState<Record<string, any>>({
    pageNum: 1,
    pageSize: 10,
    orderByColumn: 'id',
    isAsc: 'desc',
    /** 分类名称 */
    categoryName: undefined,
    /** 排序 */
    sort: undefined,
    /** 0: 正常 1: 禁用 */
    status: undefined,
    /** 搜索值 */
    searchValue: undefined,
    /** 是否触发请求 */
    feildChange: false,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<'add' | 'edit'>('add');
  const [currentRow, setCurrentRow] = useState<any>(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [bindModalVisible, setBindModalVisible] = useState(false);
  const [bindModalCategoryId, setBindModalCategoryId] = useState<any>(undefined);

  const [form] = Form.useForm();

  const { data, loading, run } = useRequest(() => listCategory(searchCategoryParams));

  useEffect(() => {
    if (searchCategoryParams.feildChange) {
      run();
    }
  }, [searchCategoryParams]);

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

  // 删除分类
  const handleDelete = async (record: any) => {
    Modal.confirm({
      title: '删除分类',
      content: `确定要删除分类「${record.categoryName}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await delCategory(record.id);
          message.success('删除成功');
          setSearchCategoryParams((prev) => ({
            ...prev,
            feildChange: true,
          }));
        } catch (e) {
          message.error('删除失败');
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
        await addCategory(values);
        message.success('新增成功');
      } else if (modalType === 'edit') {
        await updateCategory({ ...currentRow, ...values });
        message.success('编辑成功');
      }
      setModalVisible(false);
      setSearchCategoryParams((prev) => ({
        ...prev,
        feildChange: true,
      }));
    } catch (e) {
      // 校验失败
    } finally {
      setConfirmLoading(false);
    }
  };

  const bindModal = (record: any) => {
    setBindModalCategoryId(record.id);
    setBindModalVisible(true);
  };

  const handleBindOk = async (selectedMovieIds: number[]) => {
    try {
      const res = await bindMovie(bindModalCategoryId, selectedMovieIds);
      if (res.code === 200) {
        run();
        message.success('绑定成功');
        setBindModalVisible(false);
        setBindModalCategoryId(undefined);
      } else {
        message.error('绑定失败');
      }
    } catch (e) {
      console.log('e======<<<', e);
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
      title: '多语言分类名称',
      dataIndex: 'categoryName',
      key: 'categoryName',
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
      title: '排序',
      dataIndex: 'sort',
      hideInSearch: true,
      valueType: 'indexBorder',
      width: 80,
    },
    {
      title: '分类名称',
      dataIndex: 'categoryName',
      width: 200,
      render: (_, record) => <Tag color="blue">{record.categoryName}</Tag>,
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
          setSearchCategoryParams((prev) => ({
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
      ellipsis: true,
      copyable: true,
    },
    {
      title: '创建人',
      dataIndex: 'createBy',
      hideInSearch: true,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      hideInSearch: true,
      width: 200,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      width: 130,
      render: (_, record) => [
        <a key="bind" onClick={() => bindModal(record)} style={{ color: '#1890ff' }}>
          绑定
        </a>,
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
    <CardContainer title="分类管理">
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
          setSearchCategoryParams((prev) => ({
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
          setSearchCategoryParams({
            pageNum: 1,
            pageSize: 10,
            orderByColumn: 'id',
            isAsc: 'desc',
            feildChange: true,
          });
        }}
        pagination={{
          pageSize: searchCategoryParams.pageSize,
          total: data?.total,
          current: searchCategoryParams.pageNum,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) => {
            setSearchCategoryParams((prev) => ({
              ...prev,
              pageNum: page,
              pageSize: pageSize,
              feildChange: true,
            }));
          },
        }}
        toolBarRender={() => [
          <Button type="primary" key="add" onClick={() => openModal('add')}>
            新增分类
          </Button>,
        ]}
      />

      <Modal
        title={modalType === 'add' ? '新增分类' : '编辑分类'}
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
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            status: '1',
          }}
        >
          <Form.Item
            label="分类名称"
            name="categoryName"
            rules={[{ required: true, message: '请输入分类名称' }]}
          >
            <Input placeholder="请输入分类名称" />
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
        categoryId={bindModalCategoryId}
        // movieId={currentRow?.id}
      />
    </CardContainer>
  );
};

export default Category;
