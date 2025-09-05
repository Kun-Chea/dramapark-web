import { Modal, Table, Button, message } from 'antd';
import { useEffect, useState } from 'react';
import { getRuleList, editMovieAdRule } from '@/services/movie/details';
import AdModal from '../adModal';

interface RuleModalProps {
  title: string;
  open: boolean;
  onCancel: () => void;
  currentRow: any;
}

const DetailModal: React.FC<RuleModalProps> = ({ title, open, onCancel, currentRow }) => {
  const [data, setData] = useState([]);
  /** 设置广告规则弹窗 */
  const [customAdModalVisible, setCustomAdModalVisible] = useState(false);
  const [rowId, setRowId] = useState('');

  useEffect(() => {
    if (open) {
      getRuleList({ movieId: currentRow.id }).then((res) => {
        setData(res.rows);
      });
    }
  }, [open]);

  const columns: any = [
    {
      title: '模板名称',
      dataIndex: 'name',
    },
    {
      title: '操作',
      dataIndex: 'system',
      render: (_: any, record: any) => {
        return (
          <Button
            type="link"
            onClick={() => {
              setCustomAdModalVisible(true);
              setRowId(record.id);
            }}
          >
            编辑
          </Button>
        );
      },
    },
  ];
  return (
    <Modal title={title} open={open} onCancel={onCancel} destroyOnClose width={700}>
      <Table columns={columns} dataSource={data} />
      {/* 广告规则 */}
      <AdModal
        visible={customAdModalVisible}
        operationType="edit"
        onCancel={() => setCustomAdModalVisible(false)}
        onOk={(values) => {
          console.log('values======<<<', values);
          editMovieAdRule(values)
            .then((res) => {
              setCustomAdModalVisible(false);
            })
            .catch((err) => {
              message.error(err);
            });
        }}
        currentRow={currentRow}
        rowId={rowId}
      />
    </Modal>
  );
};

export default DetailModal;
