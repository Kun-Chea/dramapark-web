import { useRequest } from 'ahooks';
import { exportAppUser, listAppUser } from '@/services/short-drama-user/appuser';
import { getLanguageList } from '@/services/config/index';
import { useEffect, useState } from 'react';
import CardContainer from '@/components/CardContainer';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import ActionModal from './components/ActionModal';
import { getPageList as getAppPageList } from '@/services/app';

const AppUser = () => {
  const [searchAppUserParams, setSearchAppUserParams] = useState<Record<string, any>>({
    pageNum: 1,
    pageSize: 10,
    phoneNumber: undefined,
    nickname: undefined,
    status: undefined,
    feildChange: false,
  });

  const [open, setOpen] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<any>(undefined);
  const [languageList, setLanguageList] = useState([]);
  const [appList, setAppList] = useState([]);

  const { data, loading, run } = useRequest(() => listAppUser(searchAppUserParams));

  useEffect(() => {
    getLanguageList({}).then((res) => {
      setLanguageList(res.rows);
    });
    getAppPageList({}).then((res) => {
      const appOptions = res.rows.map((item: any) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
      setAppList(appOptions);
    });
    if (searchAppUserParams.feildChange) {
      run();
    }
    // eslint-disable-next-line
  }, [searchAppUserParams]);

  /**
   * 导出数据
   *
   */
  /**
   * 导出数据
   *
   */
  const handleExport = async () => {
    const hide = message.loading('正在导出');
    try {
      await exportAppUser(searchAppUserParams);
      hide();
      message.success('导出成功');
      return true;
    } catch (error) {
      hide();
      message.error('导出失败，请重试');
      return false;
    }
  };

  const columns: ProColumns<any>[] = [
    {
      title: '用户ID',
      dataIndex: 'userId',
      width: 100,
      hideInSearch: false,
      render: (_, record) => {
        return (
          <Button
            type="link"
            onClick={() => {
              (setOpen(true), setCurrentUserId(record.userId));
            }}
          >
            {record.userId}
          </Button>
        );
      },
    },
    {
      title: '用户昵称',
      dataIndex: 'nickname',
      width: 120,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '所属app',
      dataIndex: 'appName',
      width: 180,
      hideInSearch: true,
      align: 'center',
    },
    {
      title: '所属app',
      dataIndex: 'appId',
      width: 180,
      hideInTable: true,
      valueType: 'select',
      valueEnum: appList.reduce((acc: Record<string, { text: string }>, curr: any) => {
        acc[curr.value] = { text: curr.label };
        return acc;
      }, {}),
      align: 'center',
      search: {
        transform: (value: string | number) => {
          return { appId: value };
        },
      },
    },
    {
      title: '语言',
      dataIndex: 'language',
      width: 150,
      align: 'center',
      hideInSearch: true,
      render: (_, record) => {
        const language: any = languageList.find((item: any) => item.code == record.language);
        return language?.zhName || '-';
      },
    },
    {
      title: '国家',
      dataIndex: 'country',
      width: 150,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '手机型号',
      dataIndex: 'deviceManufacturer',
      width: 150,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '系统版本',
      dataIndex: 'devicePlatformType',
      width: 150,
      align: 'center',
      hideInSearch: true,
    },
    {
      title: '广告信息',
      dataIndex: 'language',
      width: 150,
      align: 'center',
      hideInSearch: true,
      render: (_, record) => {
        return JSON.parse(record.other)?.adName || '-';
      },
    },
    {
      title: '推广链接名称',
      dataIndex: 'linkName',
      width: 150,
      align: 'center',
      hideInSearch: true,
    },
    // {
    //   title: '来源',
    //   dataIndex: 'language',
    //   width: 150,
    //   align: 'center',
    //   hideInSearch: true,
    // },
    {
      title: '注册时间',
      dataIndex: 'createTime',
      valueType: 'dateRange',
      width: 180,
      align: 'center',
      hideInSearch: false,
      search: {
        transform: (value?: [string, string]) => {
          if (!value || value.length < 2) return {};
          return {
            regBeginTime: `${value[0]} 00:00:00`,
            regEndTime: `${value[1]} 23:59:59`,
          };
        },
      },
      render: (_, record) => {
        return record.createTime;
      },
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 180,
      align: 'center',
    },
  ];

  return (
    <CardContainer title="App用户管理">
      <ProTable<any>
        scroll={{ x: 'max-content' }}
        loading={loading}
        columns={columns}
        dataSource={data?.rows}
        rowKey="userId"
        onSubmit={async (params) => {
          setSearchAppUserParams((prev) => ({
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
          setSearchAppUserParams({
            pageNum: 1,
            pageSize: 10,
            orderByColumn: 'userId',
            isAsc: 'desc',
            feildChange: true,
          });
        }}
        pagination={{
          pageSize: searchAppUserParams.pageSize,
          total: data?.total,
          current: searchAppUserParams.pageNum,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) => {
            setSearchAppUserParams((prev) => ({
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
          <Button key="export" onClick={handleExport} type="default">
            导出
          </Button>,
        ]}
      />
      <ActionModal
        open={open}
        onCancel={() => setOpen(false)}
        currentUserId={currentUserId}
        languageList={languageList}
        appList={appList}
      />
    </CardContainer>
  );
};

export default AppUser;
