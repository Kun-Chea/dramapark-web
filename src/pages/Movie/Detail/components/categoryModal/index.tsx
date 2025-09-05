import { Modal, Tag, Button, message } from 'antd';
import React, { useState, useEffect } from 'react';
import { CloseOutlined, DownOutlined, UpOutlined } from '@ant-design/icons';

interface CategoryModalProps {
  open: boolean;
  onCancel: () => void;
  onOk: (selectedCategoryIds: number[]) => void;
  onRemove: (categoryId: number, categoryName: string) => Promise<any>;
  categoryList: any[];
  hasCategoryList: any[];
}

const MAX_VISIBLE_CATEGORIES = 8;

const CategoryModal: React.FC<CategoryModalProps> = ({
  open,
  onCancel,
  onOk,
  onRemove,
  categoryList,
  hasCategoryList,
}) => {
  // 选中的可选分类
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
  // 展开全部可选分类
  const [showAllCategories, setShowAllCategories] = useState(false);
  // 当前已绑定分类
  const [currentHasCategoryList, setCurrentHasCategoryList] = useState<any[]>([]);

  // 弹窗打开时，重置选中和已绑定分类
  useEffect(() => {
    if (open) {
      setSelectedCategoryIds([]);
      setShowAllCategories(false);
      setCurrentHasCategoryList(hasCategoryList || []);
    }
  }, [open, hasCategoryList]);

  // 可选分类（排除已绑定分类）
  const availableCategories = categoryList
    ? categoryList.filter(
        (cat) => !currentHasCategoryList.some((hasCat) => hasCat.id === cat.id)
      )
    : [];

  // 处理可选分类点击
  const handleCategoryClick = (categoryId: number) => {
    setSelectedCategoryIds((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // 处理已绑定分类的移除
  const handleRemoveHasCategory = (categoryId: number) => {
    setCurrentHasCategoryList((prev) =>
      prev.filter((cat) => cat.id !== categoryId)
    );
  };

  // 确认绑定
  const handleOk = () => {
    // 返回：新选中的分类 + 剩余已绑定分类的id
    const allCategoryIds = [
      ...selectedCategoryIds,
      ...currentHasCategoryList.map((cat) => cat.id),
    ];
    onOk(allCategoryIds);
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      onOk={handleOk}
      title="绑定分类"
      destroyOnClose
    >
      {/* 可选分类 */}
      <div style={{ marginBottom: 8, fontWeight: 500 }}>可选分类（点击选择）：</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
        {availableCategories && availableCategories.length > 0 ? (
          (showAllCategories
            ? availableCategories
            : availableCategories.slice(0, MAX_VISIBLE_CATEGORIES)
          ).map((cat) => {
            const selected = selectedCategoryIds.includes(cat.id);
            return (
              <Tag
                key={cat.id}
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
                onClick={() => handleCategoryClick(cat.id)}
              >
                {cat.categoryName}
              </Tag>
            );
          })
        ) : (
          <div>暂无可选分类</div>
        )}
        {availableCategories.length > MAX_VISIBLE_CATEGORIES && (
          <Button
            type="link"
            size="small"
            style={{ alignSelf: 'center', padding: 0, fontSize: 14 }}
            onClick={() => setShowAllCategories((prev) => !prev)}
          >
            {showAllCategories ? (
              <>
                收起 <UpOutlined />
              </>
            ) : (
              <>
                展开全部分类 <DownOutlined />
              </>
            )}
          </Button>
        )}
      </div>

      {/* 已绑定分类 */}
      <div style={{ margin: '16px 0 8px 0', fontWeight: 500 }}>已绑定分类（可移除）：</div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {currentHasCategoryList && currentHasCategoryList.length > 0 ? (
          currentHasCategoryList.map((cat) => (
            <Tag
              key={cat.id}
              color="blue"
              closable
              closeIcon={<CloseOutlined />}
              onClose={async (e) => {
                e.preventDefault();
                try {
                  const res = await onRemove(cat.id, cat.categoryName);
                  if (res === 0) return;
                  if (res.code === 200) {
                    handleRemoveHasCategory(cat.id);
                    message.success('移除分类成功');
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
              {cat.categoryName}
            </Tag>
          ))
        ) : (
          <div>暂无已绑定分类</div>
        )}
      </div>
    </Modal>
  );
};

export default CategoryModal;
