import { Modal, Table, Tag } from 'antd';
import { useEffect, useState } from 'react';
import { useAsyncEffect, useRequest } from 'ahooks';
import { listUserBehaviorLog } from '@/services/short-drama-user/actionlog';
import { ProTable } from '@ant-design/pro-table';

const columns = [
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
  },
  {
    title: '短剧',
    dataIndex: 'movieName',
    width: 220,
    align: 'center',
  },
  {
    title: '行为描述',
    dataIndex: 'behaviorDesc',
    width: 220,
    align: 'center',
  },
  {
    title: '国家',
    dataIndex: 'country',
    width: 220,
    align: 'center',
  },
  {
    title: 'ip',
    dataIndex: 'ip',
    width: 220,
    align: 'center',
  },
  {
    title: '设备品牌',
    dataIndex: 'deviceBrand',
    width: 120,
    align: 'center',
    hideInSearch: true,
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
    hideInSearch: true,
    render: (text: string) => (text ? text.replace('T', ' ').replace('.000+08:00', '') : '-'),
  },
];

const ActionModal: React.FC<{
  open: boolean;
  onCancel: () => void;
  currentUserId: any;
  languageList: any[];
  appList: any[];
}> = ({ open, onCancel, currentUserId, languageList, appList }) => {
  //   console.log('currentUserId===>', currentUserId);

  const [searchActionLogParams, setSearchActionLogParams] = useState<Record<string, any>>({
    pageNum: 1,
    pageSize: 10,
    // userId: currentUserId,
    feildChange: false,
  });

  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await listUserBehaviorLog(searchActionLogParams);
      setData(res.rows);
      setTotal(res.total);
    } catch (error) {
      console.log('error===>', error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    setSearchActionLogParams((prev) => ({
      ...prev,
      feildChange: true,
      userId: currentUserId,
    }));
  }, [open, currentUserId]);

  useEffect(() => {
    if (searchActionLogParams.feildChange) {
      loadData();
    }
  }, [searchActionLogParams]);

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      title="用户轨迹"
      width={900}
      footer={null}
      destroyOnClose
    >
      <ProTable<any>
        columns={columns as any}
        dataSource={data || []}
        loading={loading}
        rowKey="id"
        size="middle"
        bordered
        search={false}
        pagination={{
          current: searchActionLogParams.pageNum,
          pageSize: searchActionLogParams.pageSize,
          total,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) => {
            setSearchActionLogParams((prev) => ({
              ...prev,
              pageNum: page,
              pageSize,
              feildChange: true,
            }));
          },
        }}
        scroll={{ x: 900, y: 400 }}
        style={{ background: '#fff', borderRadius: 8 }}
      />
    </Modal>
  );
};

export default ActionModal;
