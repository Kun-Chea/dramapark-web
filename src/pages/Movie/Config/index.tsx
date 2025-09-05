import { useRequest } from 'ahooks';
import {
  listMovieConfig,
  addMovieConfig,
  updateMovieConfig,
  delMovieConfig,
} from '@/services/movie/movieconfig';
import { listMovie } from '@/services/movie/details';
import { useEffect, useState } from 'react';
import CardContainer from '@/components/CardContainer';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message, Form, Input, Tag, Select } from 'antd';
import { listAllCategory } from '@/services/movie/category';
import { getPageList } from '@/services/app';

const Config = () => {
  const [searchConfigParams, setSearchConfigParams] = useState<Record<string, any>>({
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
  const [appList, setAppList] = useState([]);
  const [selectApp, setSelectApp] = useState([]);

  const [form] = Form.useForm();

  // 查询数据
  const { data, loading, run } = useRequest(() => listMovieConfig(searchConfigParams));

  const { data: categoryData } = useRequest(() => listAllCategory());

  const [categoryOptions, setCategoryOptions] = useState([]);
  // 选中的分类（用于Select的受控值）
  const [selectCategory, setSelectCategory] = useState<any[]>([]);

  // 弹窗打开时设置selectCategory用于回显，简化逻辑
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
    listMovie({ pageNum: 1, pageSize: 10 }).then((res) => {
      const optionsList = res.rows.map((item: any) => {
        return {
          label: item.description,
          value: Number(item.id),
        };
      });
      setCategoryOptions(optionsList);
    });
    if (modalVisible) {
      if (modalType === 'edit' && currentRow) {
        if (['app_home_movie_config', 'app_recommend_movie_config'].includes(currentRow.paramKey)) {
        } else {
          setCategoryOptions([]);
        }
        let value = currentRow.paramValue;
        // 转换成数组并转为number类型
        let arr = JSON.parse(value);

        setSelectCategory(arr);
        form.setFieldsValue({ paramValue: arr });
      } else {
        setCategoryOptions([]);
        setSelectCategory([]);
        form.setFieldsValue({ paramValue: [] });
      }
    }
  }, [modalVisible, modalType, currentRow]);

  // 打开新增/编辑弹窗
  const openModal = (type: 'add' | 'edit', record?: any) => {
    setModalType(type);
    setModalVisible(true);
    setCurrentRow(record);
    if (type === 'edit' && record) {
      // 兼容字段
      form.setFieldsValue({
        paramKey: record.paramKey,
        remark: record.remark,
        appId: record.appId,
      });
      // paramValue的回显交给useEffect处理
    } else {
      setSelectCategory([]);
      form.resetFields();
    }
  };

  // 删除配置
  const handleDelete = async (record: any) => {
    Modal.confirm({
      title: '删除配置',
      content: `确定要删除配置「${record.paramKey}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await delMovieConfig([record.id]);
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
      title: '批量删除配置',
      content: '确定要批量删除选中的配置吗？',
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await delMovieConfig(ids);
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
        await addMovieConfig({
          paramKey: values.paramKey,
          paramValue: '[' + values.paramValue.toString() + ']',
        });
        message.success('新增成功');
      } else if (modalType === 'edit') {
        await updateMovieConfig({
          ...currentRow,
          paramKey: values.paramKey,
          paramValue: '[' + values.paramValue.toString() + ']',
        });
        message.success('编辑成功');
      }
      setModalVisible(false);
      setConfirmLoading(false);
      setCurrentRow(null);
      form.resetFields();
      setSelectCategory([]);
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
      title: '配置App',
      dataIndex: 'appId',
      width: 200,
      render: (_, record) => {
        return appList.filter((item: any) => item.value == record.appId)[0]?.label;
      },
    },
    {
      title: '配置键',
      dataIndex: 'paramKey',
      width: 200,
    },
    {
      title: '配置值',
      dataIndex: 'paramValue',
      width: 300,
      render: (_, record) => {
        if (!record.paramValue) return '-';
        const ids = JSON.parse(record.paramValue);
        const labels = categoryOptions.filter((item: any) => ids.includes(Number(item.value)));

        return labels.map((item: any, i: any) => (
          <Tag key={i} color="blue">
            {item.label as string}
          </Tag>
        ));
      },
    },
    {
      title: '备注',
      dataIndex: 'remark',
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
          style={{ color: 'red', marginLeft: 8 }}
        >
          删除
        </a>,
      ],
    },
  ];

  return (
    <CardContainer title="短剧配置管理">
      <ProTable
        columns={columns}
        dataSource={data?.rows || []}
        loading={loading}
        rowKey="id"
        options={{
          reload: false,
        }}
        onSubmit={async (params) => {
          setSearchConfigParams((prev) => ({
            ...prev,
            ...params,
            feildChange: true,
          }));
        }}
        onReset={() => {
          setSearchConfigParams({
            pageNum: 1,
            pageSize: 10,
            orderByColumn: 'id',
            isAsc: 'desc',
            feildChange: true,
          });
        }}
        pagination={{
          pageSize: searchConfigParams.pageSize,
          total: data?.total,
          current: searchConfigParams.pageNum,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) => {
            setSearchConfigParams((prev) => ({
              ...prev,
              pageNum: page,
              pageSize: pageSize,
              feildChange: true,
            }));
          },
        }}
        toolBarRender={() => [
          // <Button type="primary" key="add" onClick={() => openModal('add')}>
          //   新增配置
          // </Button>,
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
        title={modalType === 'add' ? '新增配置' : '编辑配置'}
        open={modalVisible}
        onOk={handleOk}
        onCancel={() => {
          setModalVisible(false);
          setCurrentRow(null);
          form.resetFields();
          setSelectCategory([]);
        }}
        confirmLoading={confirmLoading}
        destroyOnClose
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="配置键"
            name="paramKey"
            rules={[{ required: true, message: '请输入配置键' }]}
          >
            <Input placeholder="请输入配置键" disabled />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea
              placeholder="请输入备注"
              autoSize={{ minRows: 2, maxRows: 6 }}
              disabled
            />
          </Form.Item>
          <Form.Item label="APP" name="appId" rules={[{ required: true, message: '请选择APP' }]}>
            <Select
              allowClear
              placeholder="请选择app"
              style={{ width: '100%' }}
              options={appList}
              value={selectApp}
              onChange={(value) => {
                setSelectApp(value);
                form.setFieldsValue({ appId: value });
              }}
            />
          </Form.Item>
          <Form.Item
            label="配置值"
            name="paramValue"
            rules={[{ required: true, message: '请选择配置值' }]}
          >
            <Select
              mode="multiple"
              allowClear
              placeholder="请选择配置值"
              style={{ width: '100%' }}
              options={categoryOptions}
              value={selectCategory}
              onChange={(value) => {
                setSelectCategory(value);
                form.setFieldsValue({ value });
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </CardContainer>
  );
};

export default Config;
