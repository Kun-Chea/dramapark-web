import React, { useEffect, useState } from 'react';
import { useRequest } from 'ahooks';
import { listSysError } from '@/services/error/sys-error';
import { Card, Typography, Tag, Space, Tooltip } from 'antd';
import { BugOutlined } from '@ant-design/icons';
import ProTable, { ProColumns } from '@ant-design/pro-table';

const { Paragraph, Text } = Typography;

type SysErrorItem = {
  id: number;
  createBy?: string | null;
  createTime: string;
  updateBy?: string | null;
  updateTime?: string | null;
  remark?: string | null;
  traceId?: string | null;
  errorCode?: string;
  errorName: string;
  errorMessage: string;
  errorStack: string;
  requestUrl: string;
  requestMethod: string;
  requestParams?: string;
  ipAddress?: string;
  deviceInfo?: string;
  userAgent?: string;
  userId?: number | string;
  status?: number;
  systemType?: string;
};

const statusMap: Record<number, { text: string; color: string }> = {
  0: { text: '未处理', color: 'red' },
  1: { text: '已处理', color: 'green' },
};

const systemTypeMap: Record<string, string> = {
  IOS: 'iOS',
  ANDROID: 'Android',
  WEB: 'Web',
};

const columns: ProColumns<SysErrorItem>[] = [
  {
    title: 'ID',
    dataIndex: 'id',
    hideInSearch: true,
    width: 60,
    ellipsis: true,
    valueType: 'indexBorder',
  },
  {
    title: '错误名称',
    dataIndex: 'errorName',
    hideInSearch: true,
    width: 200,
    render: (_, record) => (
      <Tag color="red" icon={<BugOutlined />}>
        {record.errorName}
      </Tag>
    ),
  },
  {
    title: '错误信息',
    dataIndex: 'errorMessage',
    hideInSearch: true,
    width: 260,
    render: (_, record) => (
      <Tooltip title={record.errorMessage}>
        <Paragraph
          ellipsis={{ rows: 2, expandable: true, symbol: '更多' }}
          style={{ marginBottom: 0 }}
        >
          {record.errorMessage}
        </Paragraph>
      </Tooltip>
    ),
  },
  {
    title: '错误码',
    dataIndex: 'errorCode',
    hideInSearch: true,
    width: 80,
    ellipsis: true,
  },
  {
    title: '请求地址',
    dataIndex: 'requestUrl',
    hideInSearch: true,
    width: 220,
    render: (_, record) => <Text copyable>{record.requestUrl}</Text>,
  },
  {
    title: '请求方式',
    dataIndex: 'requestMethod',
    hideInSearch: true,
    width: 80,
    render: (_, record) => <Tag color="blue">{record.requestMethod}</Tag>,
  },
  {
    title: '请求参数',
    dataIndex: 'requestParams',
    hideInSearch: true,
    width: 120,
    render: (_, record) => (
      <Paragraph copyable style={{ marginBottom: 0 }}>
        {record.requestParams || '-'}
      </Paragraph>
    ),
  },
  {
    title: '用户ID',
    dataIndex: 'userId',
    hideInSearch: true,
    width: 80,
  },
  {
    title: 'IP地址',
    dataIndex: 'ipAddress',
    hideInSearch: true,
    width: 120,
    render: (_, record) => record.ipAddress || '-',
  },
  {
    title: '用户代理',
    dataIndex: 'userAgent',
    hideInSearch: true,
    width: 180,
    render: (_, record) => (
      <Paragraph copyable style={{ marginBottom: 0 }}>
        {record.userAgent || '-'}
      </Paragraph>
    ),
  },
  {
    title: '设备信息',
    dataIndex: 'deviceInfo',
    width: 140,
    render: (_, record) => record.deviceInfo || '-',
    hideInSearch: true,
  },
  {
    title: '错误类型',
    dataIndex: 'systemType',
    width: 120,
    valueType: 'select',
    valueEnum: {
      MOBILE: { text: '移动端', status: 'MOBILE' },
      DRAMA: { text: '剧集', status: 'DRAMA' },
      SEM: { text: 'SEM', status: 'SEM' },
    },
    render: (_, record) => {
      if (!record.systemType) return '-';
      switch (record.systemType) {
        case 'MOBILE':
          return '移动端';
        case 'DRAMA':
          return '剧集';
        case 'SEM':
          return 'SEM';
        default:
          return record.systemType;
      }
    },
  },
  {
    title: '状态',
    dataIndex: 'status',
    valueType: 'select',
    valueEnum: {
      '0': { text: '未处理', status: 'Error' },
      '1': { text: '已处理', status: 'Success' },
    },
    width: 90,
    render: (_, record) => {
      const status = statusMap[record.status ?? 0];
      return <Tag color={status.color}>{status.text}</Tag>;
    },
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    hideInSearch: true,
    width: 180,
  },
];

const Error: React.FC = () => {
  const [params, setParams] = useState<{
    pageNum: number;
    pageSize: number;
    systemType: string | undefined;
    status: string | undefined;
    feildChange: boolean;
  }>({
    pageNum: 1,
    pageSize: 10,
    systemType: undefined,
    status: undefined,
    /** 是否触发请求 */
    feildChange: false,
  });

  const { data, loading, run } = useRequest(
    () =>
      listSysError({
        ...params,
      }),
    {
      refreshDeps: [params.pageNum, params.pageSize],
    },
  );

  useEffect(() => {
    if (params.feildChange) {
      run();
    }
  }, [params]);

  return (
    <Card
      title={
        <span>
          <BugOutlined style={{ color: '#ff4d4f', marginRight: 8 }} />
          系统错误日志
        </span>
      }
      bordered={false}
      style={{ marginTop: 24, boxShadow: '0 2px 8px #f0f1f2' }}
      extra={
        <Text type="secondary">
          共 <Text strong>{data?.total || 0}</Text> 条
        </Text>
      }
    >
      <ProTable<SysErrorItem>
        rowKey="id"
        columns={columns}
        loading={loading}
        dataSource={data?.rows || []}
        pagination={{
          current: params.pageNum,
          pageSize: params.pageSize,
          total: data?.total || 0,
          showSizeChanger: true,
          showQuickJumper: true,
          pageSizeOptions: ['10', '20', '50', '100'],
          showTotal: (total) => `共 ${total} 条`,
          onChange: (page, pageSize) => {
            setParams({
              ...params,
              pageNum: page,
              pageSize: pageSize || 10,
              feildChange: true,
            });
          },
        }}
        scroll={{ x: 'max-content' }}
        expandable={{
          expandedRowRender: (record) => (
            <div style={{ background: '#fafafa', padding: 16 }}>
              <Space direction="vertical" size="small" style={{ width: '100%' }}>
                <div>
                  <b>错误堆栈：</b>
                  <Paragraph
                    copyable
                    style={{
                      maxHeight: 200,
                      overflow: 'auto',
                      fontSize: 12,
                      background: '#f5f5f5',
                      padding: 8,
                      borderRadius: 4,
                      marginBottom: 0,
                    }}
                  >
                    <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{record.errorStack}</pre>
                  </Paragraph>
                </div>
                <div>
                  <b>请求参数：</b>
                  <Paragraph copyable style={{ marginBottom: 0 }}>
                    {record.requestParams || '-'}
                  </Paragraph>
                </div>
                <div>
                  <b>用户代理：</b>
                  <Paragraph copyable style={{ marginBottom: 0 }}>
                    {record.userAgent || '-'}
                  </Paragraph>
                </div>
                <div>
                  <b>IP地址：</b>
                  {record.ipAddress || '-'}
                </div>
                <div>
                  <b>设备信息：</b>
                  {record.deviceInfo || '-'}
                </div>
                <div>
                  <b>TraceId：</b>
                  {record.traceId || '-'}
                </div>
                <div>
                  <b>备注：</b>
                  {record.remark || '-'}
                </div>
              </Space>
            </div>
          ),
          rowExpandable: (record) => !!record.errorStack,
        }}
        onSubmit={(params) => {
          setParams((p) => ({
            ...p,
            ...params,
            feildChange: true,
          }));
        }}
        onReset={() => {
          setParams({
            pageNum: 1,
            pageSize: 10,
            systemType: undefined,
            status: undefined,
            /** 是否触发请求 */
            feildChange: false,
          });
        }}
        options={false}
        bordered
        size="middle"
      />
    </Card>
  );
};

export default Error;
