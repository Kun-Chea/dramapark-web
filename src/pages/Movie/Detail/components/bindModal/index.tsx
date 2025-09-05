import { Modal, Tag, Button, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { CloseOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';

interface BindModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (selectedTags: number[]) => void;
  onRemove: (tagId: number, tagName: string) => Promise<any>;
  tagList: any[];
  hasTagList: any[];
}

const MAX_VISIBLE_TAGS = 8;

const BindModal: React.FC<BindModalProps> = ({
  open,
  onCancel,
  onOk,
  onRemove,
  tagList,
  hasTagList,
}) => {
  // 选中的可选标签
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);
  // 展开全部可选标签
  const [showAllTags, setShowAllTags] = useState(false);
  // 当前已绑定标签
  const [currentHasTagList, setCurrentHasTagList] = useState<any[]>([]);

  // 弹窗打开时，重置选中和已绑定标签
  useEffect(() => {
    if (open) {
      setSelectedTagIds([]);
      setShowAllTags(false);
      setCurrentHasTagList(hasTagList || []);
    }
  }, [open, hasTagList]);

  // 可选标签（排除已绑定标签）
  const availableTags = tagList
    ? tagList.filter((tag) => !currentHasTagList.some((hasTag) => hasTag.tagId === tag.tagId))
    : [];

  // 处理可选标签点击
  const handleTagClick = (tagId: number) => {
    setSelectedTagIds((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    );
  };

  // 处理已绑定标签的移除
  const handleRemoveHasTag = (tagId: number) => {
    setCurrentHasTagList((prev) => prev.filter((tag) => tag.tagId !== tagId));
  };

  // 确认绑定
  const handleOk = () => {
    // 返回：新选中的标签 + 剩余已绑定标签的tagId
    const allTagIds = [...selectedTagIds, ...currentHasTagList.map((tag) => tag.tagId)];
    onOk(allTagIds);
  };

  return (
    <Modal open={open} onCancel={onCancel} onOk={handleOk} title="绑定标签" destroyOnClose>
      {/* 可选标签 */}
      <div style={{ marginBottom: 8, fontWeight: 500 }}>可选标签（点击选择）：</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        {availableTags && availableTags.length > 0 ? (
          (showAllTags ? availableTags : availableTags.slice(0, MAX_VISIBLE_TAGS)).map((tag) => {
            const selected = selectedTagIds.includes(tag.tagId);
            return (
              <Tag
                key={tag.tagId}
                color={selected ? 'gold' : 'default'}
                style={{
                  cursor: 'pointer',
                  fontWeight: selected ? 'bold' : 'normal',
                  fontSize: 16,
                  padding: '6px 16px',
                  borderRadius: 6,
                  userSelect: 'none',
                  background: selected ? '#ffe58f' : '#f5f5f5',
                  color: selected ? '#ad6800' : '#333',
                  border: selected ? '2px solid #faad14' : '1px solid #d9d9d9',
                  boxShadow: selected ? '0 0 4px #ffe58f' : undefined,
                  transition: 'all 0.2s',
                }}
                onClick={() => handleTagClick(tag.tagId)}
              >
                {tag.tagName}
              </Tag>
            );
          })
        ) : (
          <div>暂无可选标签</div>
        )}
        {availableTags.length > MAX_VISIBLE_TAGS && (
          <Button
            type="link"
            size="small"
            style={{ alignSelf: 'center', padding: 0, fontSize: 14 }}
            onClick={() => setShowAllTags((prev) => !prev)}
          >
            {showAllTags ? (
              <>
                收起 <UpOutlined />
              </>
            ) : (
              <>
                展开全部标签 <DownOutlined />
              </>
            )}
          </Button>
        )}
      </div>

      {/* 已绑定标签 */}
      <div style={{ margin: '16px 0 8px 0', fontWeight: 500 }}>已绑定标签（可移除）：</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {currentHasTagList && currentHasTagList.length > 0 ? (
          currentHasTagList.map((tag) => (
            <Tag
              key={tag.tagId}
              color="blue"
              closable
              closeIcon={<CloseOutlined />}
              onClose={async (e) => {
                e.preventDefault();
                try {
                  const res = await onRemove(tag.tagId, tag.tagName);
                  if (res === 0) return;
                  console.log('res======<<<', res);
                  if (res.code === 200) {
                    handleRemoveHasTag(tag.tagId);
                    message.success('移除标签成功');
                  } else {
                    message.error(res.msg);
                  }
                } catch (e) {
                  console.log('error', e);
                }
              }}
              style={{
                fontSize: 16,
                padding: '6px 16px',
                borderRadius: 6,
                userSelect: 'none',
                background: '#e6f7ff',
                color: '#0050b3',
                border: '1px solid #91d5ff',
                fontWeight: 'bold',
                boxShadow: '0 0 4px #bae7ff',
                transition: 'all 0.2s',
                cursor: 'pointer',
              }}
            >
              {tag.tagName}
            </Tag>
          ))
        ) : (
          <div>暂无已绑定标签</div>
        )}
      </div>
    </Modal>
  );
};

export default BindModal;
