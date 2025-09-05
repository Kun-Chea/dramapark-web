import { getPageList, addForm, editForm, deleteForm } from '@/services/app';
import CardContainer from '@/components/CardContainer';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button, Image, Modal, message, Tag } from 'antd';
import DetailModal from './components/detailModal';
import { useEffect, useState } from 'react';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';

const MovieBanner = () => {
  const [searchMovieParams, setSearchMovieParams] = useState<Record<string, any>>({
    pageNum: 1,
    pageSize: 10,
    /** 是否触发请求 */
    feildChange: false,
  });

  /** 新增/编辑弹窗 */
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  /** 新增/编辑弹窗类型 */
  const [detailModalType, setDetailModalType] = useState<'add' | 'edit'>('add');
  /** 新增/编辑弹窗当前行 */
  const [detailModalCurrentRow, setDetailModalCurrentRow] = useState<any>(null);
  /** 新增/编辑弹窗标题 */
  const [detailModalTitle, setDetailModalTitle] = useState<string>('');

  const { data, loading, run } = useRequest(() => getPageList(searchMovieParams));

  // 打开新增/编辑弹窗
  const openModal = (type: 'add' | 'edit', record?: any) => {
    setDetailModalType(type);
    setDetailModalVisible(true);
    setDetailModalTitle(type === 'add' ? '新增APP' : '编辑APP');
    setDetailModalCurrentRow(record);
  };

  // 新增/编辑提交
  const handleOk = async (values: any) => {
    if (detailModalType === 'add') {
      await addForm(values);
    } else {
      await editForm({
        ...detailModalCurrentRow,
        ...values,
      });
    }
    setDetailModalVisible(false);
    run();
  };

  // 删除应用名称
  const handleDelete = async (record: any) => {
    Modal.confirm({
      title: '删除应用',
      content: `确定要删除应用名称「${record.name}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteForm(record.id);
          message.success('删除成功');
          run();
        } catch (e) {
          message.error('删除失败');
        }
      },
    });
  };

  useEffect(() => {
    if (searchMovieParams.feildChange) {
      run();
    }
  }, [searchMovieParams]);

  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      hideInSearch: true,
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '应用名称',
      dataIndex: 'name',
      hideInSearch: false,
      width: 120,
    },
    {
      title: '状态',
      dataIndex: 'status',
      hideInSearch: true,
      width: 120,
      render: (_, record) => {
        return (
          <>
            {record.status == '0' && <Tag color="green">正常</Tag>}
            {record.status == '1' && <Tag color="#f50">停用</Tag>}
            {record.status == '2' && <Tag color="gold">待上线</Tag>}
            {record.status == '3' && <Tag color="blue">准备就绪</Tag>}
          </>
        );
      },
    },
    {
      title: '应用图标',
      dataIndex: 'icon',
      valueType: 'image',
      hideInSearch: true,
      width: 130,
      render: (_, record) => (
        <Image
          src={record.icon}
          alt="cover"
          width={40}
          height={40}
          style={{ objectFit: 'cover', borderRadius: 8 }}
          preview={!!record.icon}
        />
      ),
    },
    {
      title: '是否开启多语言',
      dataIndex: 'identifier',
      hideInSearch: true,
      width: 120,
      render: (_, record) => {
        return (
          <>
            {record.identifier == '0' && <Tag color="green">开启</Tag>}
            {record.identifier == '1' && <Tag color="#f50">未开启</Tag>}
          </>
        );
      },
    },
    {
      title: '公司名称',
      dataIndex: 'company',
      hideInSearch: false,
      width: 120,
    },
    {
      title: '深度链接',
      dataIndex: 'deepLink',
      hideInSearch: true,
      width: 120,
    },
    {
      title: 'af深链链接',
      dataIndex: 'afLinkUrl',
      hideInSearch: true,
      width: 120,
    },
    {
      title: 'app版本号',
      dataIndex: 'appVersion',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Button.Group style={{ width: 230, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button
            key="edit"
            type="link"
            icon={<FormOutlined />}
            style={{ color: '#1890ff', padding: 0, textAlign: 'left', flex: 1 }}
            onClick={() => openModal('edit', record)}
          >
            编辑
          </Button>
          <Button
            key="delete"
            type="link"
            icon={<DeleteOutlined />}
            style={{ color: '#f5222d', padding: 0, textAlign: 'left', flex: 1 }}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Button.Group>
      ),
    },
  ];
  return (
    <CardContainer title="APP管理">
      <ProTable<any>
        scroll={{ x: 'max-content' }}
        loading={loading}
        columns={columns}
        dataSource={data?.rows}
        rowKey="id"
        onSubmit={async (params) => {
          setSearchMovieParams((prev) => ({
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
          setSearchMovieParams({
            pageNum: 1,
            pageSize: 10,
            feildChange: true,
          });
        }}
        pagination={{
          pageSize: searchMovieParams.pageSize,
          total: data?.total,
          current: searchMovieParams.pageNum,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) => {
            setSearchMovieParams((prev) => ({
              ...prev,
              pageNum: page,
              pageSize: pageSize,
              feildChange: true,
            }));
          },
        }}
        toolBarRender={() => [
          <Button type="primary" key="add" onClick={() => openModal('add')}>
            新增APP
          </Button>,
        ]}
      />
      <DetailModal
        title={detailModalTitle}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        onOk={async (values) => {
          await handleOk(values);
        }}
        currentRow={detailModalCurrentRow}
      />
    </CardContainer>
  );
};

export default MovieBanner;
