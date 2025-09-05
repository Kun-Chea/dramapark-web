import { Modal, Image, Checkbox, Spin, Empty, List } from 'antd';
import { useAsyncEffect } from 'ahooks';
import { useState } from 'react';
import { listTagMovies } from '@/services/movie/tag';
import VirtualList from 'rc-virtual-list';

interface BindModalProps {
  open: boolean;
  onClose: () => void;
  onOk: (selectedMovieIds: number[]) => void;
  tagId: number;
}

const ITEM_HEIGHT = 80;

const BindModal: React.FC<BindModalProps> = ({ open, onClose, onOk, tagId }) => {
  // 电影数据
  const [data, setData] = useState<any[]>([]);
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 选中的电影ID
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 弹窗打开时拉取数据并重置选中
  useAsyncEffect(async () => {
    if (open) {
      // 默认勾选已绑定的电影
      setLoading(true);
      try {
        const res = await listTagMovies(tagId);
        const list = res?.data || [];
        setData(list);
        // 选中所有isBind为true的电影
        setSelectedRowKeys(list.filter((item: any) => item.isBind).map((item: any) => item.id));
      } finally {
        setLoading(false);
      }
    }
  }, [open, tagId]);

  // 选中/取消选中
  const handleCheck = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedRowKeys((prev) => [...prev, id]);
    } else {
      setSelectedRowKeys((prev) => prev.filter((item) => item !== id));
    }
  };

  // 全选/全不选
  const handleCheckAll = (checked: boolean) => {
    if (checked) {
      setSelectedRowKeys(data.map((item) => item.id));
    } else {
      setSelectedRowKeys([]);
    }
  };

  // 全选框状态
  const allIds = data.map((item) => item.id);
  const checkedCount = selectedRowKeys.length;
  const isAllChecked = allIds.length > 0 && checkedCount === allIds.length;
  const isIndeterminate = checkedCount > 0 && checkedCount < allIds.length;

  return (
    <Modal
      title="绑定电影"
      open={open}
      onCancel={onClose}
      onOk={() => onOk(selectedRowKeys as number[])}
      width={700}
      destroyOnClose
      okText="确定"
      cancelText="取消"
    >
      <div
        style={{
          marginBottom: 16,
          padding: '8px 0',
          borderBottom: '1px solid #f0f0f0',
          background: '#fafafa',
          borderRadius: 4,
        }}
      >
        <Checkbox
          indeterminate={isIndeterminate}
          checked={isAllChecked}
          onChange={(e) => handleCheckAll(e.target.checked)}
          disabled={allIds.length === 0}
          style={{ fontWeight: 500, fontSize: 15, marginLeft: 8 }}
        >
          全选（共{allIds.length}部，已选{checkedCount}部）
        </Checkbox>
      </div>
      <div
        style={{
          border: '1px solid #f0f0f0',
          borderRadius: 6,
          height: 500,
          overflow: 'hidden',
          background: '#fff',
        }}
      >
        {loading ? (
          <div style={{ textAlign: 'center', paddingTop: 100 }}>
            <Spin />
          </div>
        ) : data.length === 0 ? (
          <Empty description="暂无可绑定电影" style={{ marginTop: 100 }} />
        ) : (
          <VirtualList
            virtual
            data={data}
            height={500}
            itemHeight={ITEM_HEIGHT}
            itemKey="id"
          >
            {(item: any) => (
              <List.Item
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  minHeight: ITEM_HEIGHT,
                  borderBottom: '1px solid #f0f0f0',
                  padding: '0 24px',
                  background: item.isBind ? '#f6ffed' : undefined,
                  transition: 'background 0.2s',
                }}
              >
                <Checkbox
                  checked={selectedRowKeys.includes(item.id)}
                  onChange={(e) => handleCheck(item.id, e.target.checked)}
                  style={{ marginRight: 20, marginLeft: 4 }}
                />
                <Image
                  src={item.coverImage}
                  width={60}
                  height={60}
                  style={{
                    objectFit: 'cover',
                    marginRight: 20,
                    borderRadius: 4,
                    boxShadow: '0 2px 8px #f0f1f2',
                  }}
                  preview={false}
                />
                <div style={{ flex: 1, minWidth: 0, marginLeft: 10 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: 17,
                      color: '#222',
                      marginBottom: 4,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    <span
                      style={{
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: 350,
                      }}
                    >
                      {item.title}
                    </span>
                    {item.isBind && (
                      <span
                        style={{ color: '#52c41a', fontSize: 13, marginLeft: 10, fontWeight: 400 }}
                      >
                        (已绑定)
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: '#888', marginBottom: 2 }}>
                    <span style={{ marginRight: 16 }}>导演：{item.director || '-'}</span>
                    <span>主演：{item.actors || '-'}</span>
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: '#888',
                      marginBottom: 2,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: 700,
                    }}
                  >
                    简介：{item.description || '-'}
                  </div>
                  <div style={{ fontSize: 13, color: '#888' }}>
                    <span style={{ marginRight: 16 }}>上映日期：{item.releaseDate || '-'}</span>
                    <span>总集数：{item.totalVideos || '-'}</span>
                  </div>
                </div>
              </List.Item>
            )}
          </VirtualList>
        )}
      </div>
    </Modal>
  );
};

export default BindModal;
