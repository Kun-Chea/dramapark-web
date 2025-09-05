import { listUserBehaviorLog } from '@/services/short-drama-user/actionlog';
import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import { ProTable, ProColumns } from '@ant-design/pro-components';
import { Tag, Button } from 'antd';
import CardContainer from '@/components/CardContainer';
import { listMovie } from '@/services/movie/details';

const ActionLog = () => {
  const [searchActionLogParams, setSearchActionLogParams] = useState<Record<string, any>>({
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    feildChange: false,
  });
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [total, setTotal] = useState(0);

  const fetchMovies = async (pageNum: number, keyword?: string) => {
    const res = await listMovie({ pageNum, pageSize: 10, keyword });
    const movieData = res.rows.map((item: any) => ({
      label: item.description,
      value: item.id,
    }));

    if (pageNum == 1) {
      setOptions(movieData); // 重置
    } else {
      setOptions((prev) => [...prev, ...movieData]); // 追加
    }
    setPage(pageNum); // 记录最新页码
    setTotal(res.total); // 记住总数
  };

  const { data, loading, run } = useRequest(() => listUserBehaviorLog(searchActionLogParams));

  useEffect(() => {
    // 初始化加载第一页
    fetchMovies(1, '');
    if (searchActionLogParams.feildChange) {
      run();
    }
    // eslint-disable-next-line
  }, [searchActionLogParams]);

  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      width: 80,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '用户ID',
      dataIndex: 'userId',
      width: 120,
      align: 'center',
      ellipsis: true,
    },
    {
      title: '类型',
      dataIndex: 'behaviorType',
      width: 140,
      align: 'center',
      valueEnum: {
        USER_BROWSE_PAGE: { text: '浏览页面' },
        // 可根据后端返回类型继续补充
      },
      hideInSearch: true,
    },
    {
      title: '短剧',
      dataIndex: 'movieName',
      width: 220,
      valueType: 'select',
      align: 'center',
      search: {
        transform: (value: string | number) => {
          return { movieId: value };
        },
      },
      fieldProps: {
        showSearch: true,
        filterOption: false,
        options, // 绑定到 state
        onSearch: async (value: string) => {
          await fetchMovies(1, value); // 搜索时重新加载第一页
        },
        onPopupScroll: async (e: React.UIEvent<HTMLElement>) => {
          const target = e.target as HTMLElement;
          if (target.scrollTop + target.offsetHeight === target.scrollHeight) {
            // 已经全部加载了，不再请求
            if (page * 10 >= total) return;
            await fetchMovies(page + 1); // 滚到底加载下一页
          }
        },
      },
    },
    {
      title: '行为描述',
      dataIndex: 'behaviorDesc',
      width: 220,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '国家',
      dataIndex: 'country',
      width: 220,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: 'ip',
      dataIndex: 'ip',
      width: 220,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '设备品牌',
      dataIndex: 'deviceBrand',
      width: 120,
      align: 'center',
      hideInSearch: false,
    },
    {
      title: '设备系统',
      dataIndex: 'deviceOs',
      width: 120,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '行为时间',
      dataIndex: 'createTime',
      width: 180,
      align: 'center',
      hideInSearch: false,
      valueType: 'dateTime',
    },
  ];

  return (
    <CardContainer title="用户行为日志">
      <ProTable<any>
        scroll={{ x: 'max-content' }}
        loading={loading}
        columns={columns}
        dataSource={data?.rows || []}
        rowKey="id"
        options={{
          fullScreen: true,
          setting: true,
          density: true,
          reload: false,
        }}
        onSubmit={(params) => {
          setSearchActionLogParams((prev) => ({
            ...prev,
            ...params,
            feildChange: true,
          }));
        }}
        onReset={() => {
          setSearchActionLogParams((prev) => ({
            pageNum: 1,
            pageSize: 10,
            feildChange: true,
          }));
        }}
        pagination={{
          pageSize: searchActionLogParams.pageSize,
          total: data?.total,
          current: searchActionLogParams.pageNum,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) => {
            setSearchActionLogParams((prev) => ({
              ...prev,
              pageNum: page,
              pageSize: pageSize,
              feildChange: true,
            }));
          },
        }}
        toolBarRender={() => [
          <Button key="refresh" onClick={() => run()} type="primary">
            刷新
          </Button>,
        ]}
      />
    </CardContainer>
  );
};

export default ActionLog;
