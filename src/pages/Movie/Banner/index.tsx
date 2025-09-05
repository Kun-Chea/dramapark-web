import { getPageList, addForm, editForm, deleteForm } from '@/services/movie/banner';
import { getLanguageList } from '@/services/config/index';
import CardContainer from '@/components/CardContainer';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button, Image, Modal, message } from 'antd';
import DetailModal from './components/detailModal';
import { useEffect, useState } from 'react';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { getPageList as getAppPageList } from '@/services/app';

const MovieBanner = () => {
  const [searchMovieParams, setSearchMovieParams] = useState<Record<string, any>>({
    pageNum: 1,
    pageSize: 10,
    /** 是否触发请求 */
    feildChange: false,
  });

  /** 新增/编辑弹窗 */
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  /** 新增/编辑弹窗类型 */
  const [detailModalType, setDetailModalType] = useState<'add' | 'edit'>('add');
  /** 新增/编辑弹窗当前行 */
  const [detailModalCurrentRow, setDetailModalCurrentRow] = useState<any>(null);
  /** 新增/编辑弹窗标题 */
  const [detailModalTitle, setDetailModalTitle] = useState<string>('');
  const [appList, setAppList] = useState([]);

  const [languageList, setLanguageList] = useState([]);

  const { data, loading, run } = useRequest(() => getPageList(searchMovieParams));

  // 打开新增/编辑弹窗
  const openModal = (type: 'add' | 'edit', record?: any) => {
    setDetailModalType(type);
    setDetailModalVisible(true);
    setDetailModalTitle(type === 'add' ? '新增轮播图' : '编辑轮播图');
    setDetailModalCurrentRow(record);
  };

  // 新增/编辑提交
  const handleOk = async (values: any) => {
    if (detailModalType === 'add') {
      await addForm(values);
    } else {
      await editForm({
        ...detailModalCurrentRow,
        ...values,
      });
    }
    setDetailModalVisible(false);
    run();
  };

  // 删除电影
  const handleDelete = async (record: any) => {
    Modal.confirm({
      title: '删除轮播图',
      content: `确定要删除轮播图「${record.remark}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await deleteForm(record.id);
          message.success('删除成功');
          run();
        } catch (e) {
          message.error('删除失败');
        }
      },
    });
  };

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
    if (searchMovieParams.feildChange) {
      run();
    }
  }, [searchMovieParams]);

  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      hideInSearch: true,
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '所属App',
      dataIndex: 'appId',
      width: 200,
      render: (_, record) => {
        return (
          (appList as Array<{ value: number; label: string }>).find(
            (item) => item.value == record.appId,
          )?.label || '-'
        );
      },
    },
    {
      title: '封面',
      dataIndex: 'coverImage',
      valueType: 'image',
      hideInSearch: true,
      width: 130,
      render: (_, record) => (
        <Image
          src={record.imageUrl}
          alt="cover"
          width={120}
          height={120}
          style={{ objectFit: 'cover', borderRadius: 8 }}
          preview={!!record.imageUrl}
        />
      ),
    },
    {
      title: '多语言code',
      dataIndex: 'languageCode',
      hideInSearch: true,
      width: 120,
      render: (_, record) => {
        const language: any = languageList.find((item: any) => item.code == record.languageCode);
        return language?.zhName || '-';
      },
    },
    // {
    //   title: '备注',
    //   dataIndex: 'remark',
    //   hideInSearch: false,
    //   width: 120,
    // },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      valueType: 'dateTime',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_, record) => (
        <Button.Group style={{ width: 230, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <Button
            key="edit"
            type="link"
            icon={<FormOutlined />}
            style={{ color: '#1890ff', padding: 0, textAlign: 'left', flex: 1 }}
            onClick={() => openModal('edit', record)}
          >
            编辑
          </Button>
          <Button
            key="delete"
            type="link"
            icon={<DeleteOutlined />}
            style={{ color: '#f5222d', padding: 0, textAlign: 'left', flex: 1 }}
            onClick={() => handleDelete(record)}
          >
            删除
          </Button>
        </Button.Group>
      ),
    },
  ];
  return (
    <CardContainer title="轮播图管理">
      <ProTable<any>
        scroll={{ x: 'max-content' }}
        loading={loading}
        columns={columns}
        dataSource={data?.rows}
        rowKey="id"
        onSubmit={async (params) => {
          setSearchMovieParams((prev) => ({
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
          setSearchMovieParams({
            pageNum: 1,
            pageSize: 10,
            feildChange: true,
          });
        }}
        pagination={{
          pageSize: searchMovieParams.pageSize,
          total: data?.total,
          current: searchMovieParams.pageNum,
          showSizeChanger: true,
          showQuickJumper: true,
          onChange: (page, pageSize) => {
            setSearchMovieParams((prev) => ({
              ...prev,
              pageNum: page,
              pageSize: pageSize,
              feildChange: true,
            }));
          },
        }}
        toolBarRender={() => [
          <Button type="primary" key="add" onClick={() => openModal('add')}>
            新增轮播图
          </Button>,
        ]}
      />
      <DetailModal
        title={detailModalTitle}
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        onOk={async (values) => {
          await handleOk(values);
        }}
        currentRow={detailModalCurrentRow}
      />
    </CardContainer>
  );
};

export default MovieBanner;
