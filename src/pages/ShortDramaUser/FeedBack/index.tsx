import { useRequest } from 'ahooks';
import { listFeedback, deleteFeedback } from '@/services/short-drama-user/feedback';
import { useEffect, useState } from 'react';
import CardContainer from '@/components/CardContainer';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Modal, message, Button } from 'antd';

const FeedBack = () => {
  const [searchFeedbackParams, setSearchFeedbackParams] = useState<Record<string, any>>({
    pageNum: 1,
    pageSize: 10,
    orderByColumn: 'id',
    isAsc: 'desc',
    /** 反馈内容 */
    content: undefined,
    /** 用户ID */
    userId: undefined,
    /** 是否触发请求 */
    feildChange: false,
    /** 处理状态 */
    status: undefined,
  });

  // 新增：用于存储选中的行
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  const { data, loading, run } = useRequest(() => listFeedback(searchFeedbackParams));

  useEffect(() => {
    if (searchFeedbackParams.feildChange) {
      run();
    }
  }, [searchFeedbackParams]);

  // 删除单条反馈
  const handleDelete = async (record: any) => {
    Modal.confirm({
      title: '删除反馈',
      content: `确定要删除该条反馈吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteFeedback([record.id]);
          message.success('删除成功');
          run();
        } catch (e) {
          message.error('删除失败');
        }
      },
    });
  };

  // 批量删除
  const handleBatchDelete = async () => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择要删除的反馈');
      return;
    }
    Modal.confirm({
      title: '批量删除反馈',
      content: `确定要删除选中的${selectedRowKeys.length}条反馈吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteFeedback(selectedRowKeys as number[]);
          message.success('批量删除成功');
          setSelectedRowKeys([]);
          run();
        } catch (e) {
          message.error('批量删除失败');
        }
      },
    });
  };

  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      hideInSearch: true,
      width: 80,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      width: 120,
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      width: 150,
      copyable: true,
      align: 'center',
    },
    {
      title: '反馈内容',
      dataIndex: 'content',
      align: 'center',
    },
    {
      title: '处理状态',
      dataIndex: 'status',
      width: 100,
      valueType: 'select',
      valueEnum: {
        0: { text: '未处理', status: 'Error' },
        1: { text: '已处理', status: 'Success' },
      },
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
      width: 100,
      render: (_, record) => [
        <a key="delete" onClick={() => handleDelete(record)} style={{ color: '#f5222d' }}>
          删除
        </a>,
      ],
    },
  ];

  return (
    <CardContainer title="用户反馈管理">
      <ProTable<any>
        loading={loading}
        columns={columns}
        dataSource={data?.rows}
        rowKey="id"
        rowSelection={{
          selectedRowKeys,
          onChange: (keys) => setSelectedRowKeys(keys),
        }}
        onSubmit={async (params) => {
          setSearchFeedbackParams((prev) => ({
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
          setSelectedRowKeys([]);
          setSearchFeedbackParams({
            pageNum: 1,
            pageSize: 10,
            orderByColumn: 'id',
            isAsc: 'desc',
            feildChange: true,
          });
        }}
        pagination={{
          pageSize: searchFeedbackParams.pageSize,
          total: data?.total,
          current: searchFeedbackParams.pageNum,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) => {
            setSearchFeedbackParams((prev) => ({
              ...prev,
              pageNum: page,
              pageSize: pageSize,
              feildChange: true,
            }));
          },
        }}
        toolBarRender={() => [
          <Button
            key="batchDelete"
            danger
            disabled={selectedRowKeys.length === 0}
            onClick={handleBatchDelete}
          >
            批量删除
          </Button>,
        ]}
      />
    </CardContainer>
  );
};

export default FeedBack;
