import { listUserAdLog } from '@/services/short-drama-user/adlog';
import CardContainer from '@/components/CardContainer';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
const AdLog = () => {
  const [searchLogParams, setSearchLogParams] = useState<Record<string, any>>({
    pageNum: 1,
    pageSize: 10,
    /** 是否触发请求 */
    feildChange: false,
  });

  const { data, loading, run } = useRequest(() => listUserAdLog(searchLogParams));

  useEffect(() => {
    if (searchLogParams.feildChange) {
      run();
    }
  }, [searchLogParams]);

  const columns: ProColumns<any>[] = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      hideInSearch: true,
      width: 60,
    },
    {
      title: '广告单元名称',
      dataIndex: 'adUnitName',
      hideInSearch: false,
      width: 120,
    },
    {
      title: '估算收入',
      dataIndex: 'allRevenue',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '事件ID',
      dataIndex: 'eventId',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '深链名称',
      dataIndex: 'linkName',
      hideInSearch: false,
      width: 120,
    },
    {
      title: 'idfa',
      dataIndex: 'idfa',
      hideInSearch: false,
      width: 120,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 120,
    },
  ];
  return (
    <CardContainer title="广告回传日志">
      <ProTable<any>
        scroll={{ x: 'max-content' }}
        loading={loading}
        columns={columns}
        dataSource={data?.rows}
        rowKey="id"
        onSubmit={async (params) => {
          setSearchLogParams((prev) => ({
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
          setSearchLogParams({
            pageNum: 1,
            pageSize: 10,
            feildChange: true,
          });
        }}
        pagination={{
          pageSize: searchLogParams.pageSize,
          total: data?.total,
          current: searchLogParams.pageNum,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) => {
            setSearchLogParams((prev) => ({
              ...prev,
              pageNum: page,
              pageSize: pageSize,
              feildChange: true,
            }));
          },
        }}
      />
    </CardContainer>
  );
};

export default AdLog;
