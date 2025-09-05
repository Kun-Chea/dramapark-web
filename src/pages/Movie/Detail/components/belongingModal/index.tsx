import { Modal, message, Table, Avatar, Button } from 'antd';
import { useEffect, useState } from 'react';
import { getPageList } from '@/services/app';
import { listMovieApp, addMovieApps, delMovieApp } from '@/services/movie/details';

interface BelongingModalProps {
  title: string;
  open: boolean;
  onCancel: () => void;
  onOk: (values: any) => Promise<void>;
  currentRow: any;
}

const BelongingModal: React.FC<BelongingModalProps> = ({
  title,
  open,
  onCancel,
  onOk,
  currentRow,
}) => {
  const [tableData, setTableData] = useState([]);
  const [correlation, setCorrelation] = useState([]);
  useEffect(() => {
    if (open && currentRow) {
      listMovieApp({ movieId: currentRow.id }).then((res) => {
        setCorrelation(res.rows);
      });
      getPageList({}).then((res) => {
        setTableData(res.rows);
      });
    }
  }, [open, currentRow]);

  const [confirmLoading, setConfirmLoading] = useState(false);

  // 新增/编辑提交
  const handleOk = async () => {
    try {
      setConfirmLoading(true);
      await onOk('values');
      message.success('操作成功');
    } catch (e) {
      console.log(e);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handelCorrelation = (val: any, type: string) => {
    if (type == 'add') {
      addMovieApps({ movieId: currentRow.id, appId: val.id }).then(() => {
        listMovieApp({ movieId: currentRow.id }).then((res) => {
          setCorrelation(res.rows);
        });
      });
    } else {
      delMovieApp(val[0].id).then(() => {
        listMovieApp({ movieId: currentRow.id }).then((res) => {
          setCorrelation(res.rows);
        });
      });
    }
  };

  const columns: any = [
    {
      title: 'ID',
      dataIndex: 'id',
    },
    {
      title: '应用名称',
      dataIndex: 'name',
    },
    {
      title: '应用图标',
      dataIndex: 'icon',
      render: (record: any) => <Avatar size={40} src={record} />,
    },
    {
      title: '公司名称',
      dataIndex: 'company',
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (_: any, record: any) => {
        return correlation.some((item: any) => item.appId == record.id) ? '已关联' : '未关联';
      },
    },
    {
      title: '操作',
      dataIndex: 'operation',
      render: (_: any, record: any) => {
        return correlation.some((item: any) => item?.appId == record.id) ? (
          <Button
            type="link"
            danger
            onClick={() =>
              handelCorrelation(
                correlation.filter((item: any) => item?.appId == record.id),
                'remove',
              )
            }
          >
            取消
          </Button>
        ) : (
          <Button type="link" onClick={() => handelCorrelation(record, 'add')}>
            关联
          </Button>
        );
      },
    },
  ];

  return (
    <Modal
      title={title}
      open={open}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      destroyOnClose
      width={700}
    >
      <Table columns={columns} dataSource={tableData} pagination={false} />
    </Modal>
  );
};

export default BelongingModal;
