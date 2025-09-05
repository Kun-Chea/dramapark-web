import { listUserLog } from '@/services/short-drama-user/userlog';
import CardContainer from '@/components/CardContainer';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
const UserLog = () => {
  const [searchLogParams, setSearchLogParams] = useState<Record<string, any>>({
    pageNum: 1,
    pageSize: 10,
    /** 是否触发请求 */
    feildChange: false,
  });

  const { data, loading, run } = useRequest(() => listUserLog(searchLogParams));

  useEffect(() => {
    if (searchLogParams.feildChange) {
      run();
    }
  }, [searchLogParams]);

  const columns: ProColumns<any>[] = [
    {
      title: 'APP用户ID',
      dataIndex: 'userId',
      hideInSearch: true,
      width: 60,
    },
    {
      title: '广告标识',
      dataIndex: 'adId',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '广告平台',
      dataIndex: 'adPlatform',
      hideInSearch: false,
      width: 120,
    },
    {
      title: '广告类型',
      dataIndex: 'adType',
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
    <CardContainer title="用户广告日志">
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

export default UserLog;
