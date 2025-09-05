import { getPageList, addForm, editForm, getOutLink } from '@/services/movie/link';
import { getLanguageList } from '@/services/config/index';
import { listMovie } from '@/services/movie/details';
import CardContainer from '@/components/CardContainer';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { useRequest } from 'ahooks';
import { Button, Image, Modal, Typography } from 'antd';
import DetailModal from './components/detailModal';
import { useEffect, useState } from 'react';
import { FormOutlined, DeleteOutlined } from '@ant-design/icons';
import { getPageList as getAppPageList } from '@/services/app';
const { Paragraph, Text } = Typography;

const MovieLink = () => {
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

  const { data, loading, run } = useRequest(() => getPageList(searchMovieParams));

  const [languageList, setLanguageList] = useState([]);
  const [appList, setAppList] = useState([]);
  const [page, setPage] = useState(1);
  const [options, setOptions] = useState<{ label: string; value: string }[]>([]);
  const [total, setTotal] = useState(0);

  // 打开新增/编辑弹窗
  const openModal = (type: 'add' | 'edit', record?: any) => {
    setDetailModalType(type);
    setDetailModalVisible(true);
    setDetailModalTitle(type === 'add' ? '添加投放链接' : '编辑投放链接');
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

  // 获取推广链接
  const handleGetLink = async (record: any) => {
    getOutLink(record.id).then((res) => {
      Modal.confirm({
        title: '推广链接',
        content: <Paragraph copyable>{res.msg}</Paragraph>,
      });
    });
  };

  useEffect(() => {
    getLanguageList({}).then((res) => {
      setLanguageList(res.rows);
    });
    // 初始化加载第一页
    fetchMovies(1, '');
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

  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      hideInSearch: true,
      dataIndex: 'id',
      // valueType: 'indexBorder',
      width: 60,
    },
    {
      title: '规则名称',
      dataIndex: 'adTemplateName',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '语言',
      dataIndex: 'language',
      hideInSearch: true,
      width: 120,
      render: (_, record) => {
        const language: any = languageList.find((item: any) => item.code == record.language);
        return language?.zhName || '-';
      },
    },
    {
      title: '平台',
      dataIndex: 'platform',
      hideInSearch: true,
      width: 120,
    },
    {
      title: '名称',
      dataIndex: 'name',
      hideInSearch: false,
      width: 120,
    },
    {
      title: '短剧',
      dataIndex: 'movieName',
      hideInSearch: false,
      valueType: 'select',
      width: 120,
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
      title: '深链类型',
      dataIndex: 'linkType',
      width: 180,
      valueType: 'select',
      valueEnum: {
        1: { text: 'web To app', status: '1' },
        2: { text: 'app To app', status: '2' },
      },
      align: 'center',
      search: {
        transform: (value: string | number) => {
          return { linkType: value };
        },
      },
    },
    // {
    //   title: '投放目标',
    //   dataIndex: 'target',
    //   hideInSearch: true,
    //   width: 120,
    // },
    {
      title: '创建时间',
      dataIndex: 'createTime',
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
            key="get"
            type="link"
            icon={<DeleteOutlined />}
            style={{ color: '#1890ff', padding: 0, textAlign: 'left', flex: 1 }}
            onClick={() => handleGetLink(record)}
          >
            获取链接
          </Button>
        </Button.Group>
      ),
    },
  ];
  return (
    <CardContainer title="投放链接">
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
            添加投放链接
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

export default MovieLink;
