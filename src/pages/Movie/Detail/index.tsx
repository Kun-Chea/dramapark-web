import {
  listMovie,
  addMovie,
  updateMovie,
  delMovie,
  listLanguageConfig,
  translateMovieI18n,
  getMovieI18nList,
  deleteMovieI18n,
  saveMovieCoinRule,
  saveMovieAdRule,
} from '@/services/movie/details';
import { listTag } from '@/services/movie/tag';
import { getMovieTagList, postMovieBind, deleteMovieTag } from '@/services/movie/moviebindtag';
import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import CardContainer from '@/components/CardContainer';
import { ProColumns, ProTable } from '@ant-design/pro-components';
import { Button, Modal, message, Image, Space, Typography, Tag } from 'antd';
import {
  FormOutlined,
  HeartOutlined,
  PlayCircleOutlined,
  SearchOutlined,
  StarOutlined,
  DeleteOutlined,
  DollarOutlined,
  UnorderedListOutlined,
  EditOutlined,
  BorderOuterOutlined,
} from '@ant-design/icons';
import DetailModal from './components/detailModal';
import BindModal from './components/bindModal';
import RuleModal from './components/ruleModal';
import { listCategory } from '@/services/movie/category';
import CategoryModal from './components/categoryModal';
import {
  deleteMovieCategory,
  getMovieCategoryList,
  postMovieCategory,
} from '@/services/movie/moviebingcategoty';
import PriceModal from './components/priceModal';
import ImageDesign from '@/components/ImageDesign';
import LanguageModal from './components/languageModal';
import BelongingModal from './components/belongingModal';
import AdModal from './components/adModal';
import { history } from '@umijs/max';
import { listArea } from '@/services/movie/area';
import { listAudio } from '@/services/movie/audio';

const formatCount = (count: number) => {
  if (count >= 1000000000) return `${(count / 1000000000).toFixed(1)}B`;
  if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
  if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
  return count;
};
const MovieDetail = () => {
  const [searchMovieParams, setSearchMovieParams] = useState<Record<string, any>>({
    pageNum: 1,
    pageSize: 10,
    orderByColumn: 'id',
    isAsc: 'desc',
    /** 标题 */
    title: undefined,
    /** 导演 */
    director: undefined,
    /** 演员 */
    actors: undefined,
    /** 状态 */
    status: undefined,
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

  /** 绑定标签弹窗 */
  const [bindModalVisible, setBindModalVisible] = useState(false);
  /** 绑定标签弹窗当前行 */
  const [bindModalCurrentRow, setBindModalCurrentRow] = useState<any>(null);

  /** 绑定分类弹窗 */
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  /** 绑定分类弹窗当前行 */
  const [categoryModalCurrentRow, setCategoryModalCurrentRow] = useState<any>(null);

  /** 设置自定义价格弹窗 */
  const [customPriceModalVisible, setCustomPriceModalVisible] = useState(false);
  /** 设置自定义价格弹窗当前行 */
  const [customPriceModalCurrentRow, setCustomPriceModalCurrentRow] = useState<any>(null);
  /** 设置自定义价格弹窗标题 */
  const [customPriceModalTitle, setCustomPriceModalTitle] = useState<string>('');

  /** 设置广告规则弹窗 */
  const [customAdModalVisible, setCustomAdModalVisible] = useState(false);
  /** 设置广告规则弹窗当前行 */
  const [customAdModalCurrentRow, setCustomAdModalCurrentRow] = useState<any>(null);
  /** 设置广告规则弹窗标题 */
  const [customAdModalTitle, setCustomAdModalTitle] = useState<string>('');

  /** 设计海报弹窗 */
  const [designModalVisible, setDesignModalVisible] = useState(false);
  /** 设计海报弹窗当前行 */
  const [designModalCurrentRow, setDesignModalCurrentRow] = useState<any>(null);

  /** 分发语言弹窗 */
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  /** 分发语言弹窗当前行 */
  const [languageModalCurrentRow, setLanguageModalCurrentRow] = useState<any>(null);
  /** 分发语言弹窗应用语言数据 */
  const [appLanguageData, setAppLanguageData] = useState<any[]>([]);

  const { data, loading, run } = useRequest(() => listMovie(searchMovieParams));

  const { data: tagList } = useRequest(() =>
    listTag({
      pageNum: 1,
      pageSize: 1000,
      status: 1,
    }),
  );

  const { data: categoryList } = useRequest(() =>
    listCategory({
      pageNum: 1,
      pageSize: 1000,
      status: 1,
    }),
  );

  const { data: audioList } = useRequest(() =>
    listAudio({
      pageNum: 1,
      pageSize: 1000,
      status: 1,
    }),
  );
  // console.log('categoryList======<<<', categoryList);

  const { data: areaList } = useRequest(() =>
    listArea({
      pageNum: 1,
      pageSize: 1000,
      status: 1,
    }),
  );

  const [hasTagList, setHasTagList] = useState<any[]>([]);
  const [currentHasTagList, setCurrentHasTagList] = useState<any[]>([]);
  const [hasCategoryList, setHasCategoryList] = useState<any[]>([]);
  const [currentHasCategoryList, setCurrentHasCategoryList] = useState<any[]>([]);
  useEffect(() => {
    if (searchMovieParams.feildChange) {
      run();
    }
  }, [searchMovieParams]);

  // 打开新增/编辑弹窗
  const openModal = (type: 'add' | 'edit', record?: any) => {
    setDetailModalType(type);
    setDetailModalVisible(true);
    setDetailModalTitle(type === 'add' ? '新增电影' : '编辑电影');
    setDetailModalCurrentRow(record);
  };

  // 删除电影
  const handleDelete = async (record: any) => {
    Modal.confirm({
      title: '删除电影',
      content: `确定要删除电影「${record.title}」吗？`,
      okText: '确认',
      cancelText: '取消',
      onOk: async () => {
        try {
          await delMovie(record.id);
          message.success('删除成功');
          run();
        } catch (e) {
          message.error('删除失败');
        }
      },
    });
  };

  // 新增/编辑提交
  const handleOk = async (values: any) => {
    if (detailModalType === 'add') {
      await addMovie(values);
    } else {
      await updateMovie({
        ...detailModalCurrentRow,
        ...values,
        releaseDate: values.releaseDate ? values.releaseDate.format('YYYY-MM-DD') : undefined,
      });
    }
    setDetailModalVisible(false);
    run();
  };

  // 让handleRemoveTag返回一个Promise，在Modal.confirm的onOk/onCancel中resolve或reject
  const handleRemoveTag = (tagId: number, tagName: string) => {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: '移除标签',
        content: `确定要移除标签「${tagName}」吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          try {
            console.log('currentHasTagList======<<<', currentHasTagList);
            const currentHasTag = currentHasTagList.find((item: any) => item.tagId === tagId);
            console.log('currentHasTag======<<<', currentHasTag);
            if (currentHasTag) {
              const res = await deleteMovieTag([currentHasTag.id]);
              resolve(res);
            } else {
              resolve(0);
            }
          } catch (e) {
            reject(e);
          }
        },
        onCancel: () => {
          resolve(0);
        },
      });
    });
  };

  /** 打开绑定标签弹窗 */
  const openBindModal = async (record: any) => {
    try {
      const res = await getMovieTagList({ movieId: record.id, pageNum: 1, pageSize: 1000 });
      if (res.code === 200) {
        const hasTagList = tagList?.rows.filter((item: any) =>
          res.rows.some((tag: any) => tag.tagId === item.tagId),
        );
        setCurrentHasTagList(res.rows);
        setHasTagList(hasTagList);
        setBindModalCurrentRow(record);
        setBindModalVisible(true);
      } else {
        message.error('获取标签失败');
      }
    } catch (error) {
      // message.error('获取标签失败');
      console.log('error======<<<', error);
    }
  };
  /** 绑定标签提交 */
  const handleBindOk = async (selectedTagIds: number[]) => {
    try {
      const res = await Promise.all(
        selectedTagIds.map(async (tagId) => {
          return await postMovieBind({
            movieId: bindModalCurrentRow.id,
            tagId,
          });
        }),
      );
      const failed = res.filter((item: any) => item.code !== 200);
      if (failed.length > 0) {
        message.error('绑定标签失败');
        return;
      } else {
        message.success('绑定标签成功');
        setBindModalVisible(false);
        setBindModalCurrentRow(null);
      }
      run();
    } catch (error: any) {
      message.error('error', error);
    }
  };

  const handleCategoryOk = async (selectedCategoryIds: number[]) => {
    try {
      const res = await Promise.all(
        selectedCategoryIds.map(async (categoryId) => {
          return await postMovieCategory({
            movieId: categoryModalCurrentRow.id,
            categoryId,
          });
        }),
      );
      const failed = res.filter((item: any) => item.code !== 200);
      if (failed.length > 0) {
        message.error('绑定分类失败');
        return;
      } else {
        setCategoryModalVisible(false);
        setCategoryModalCurrentRow(null);
        message.success('绑定分类成功');
      }
      run();
    } catch (error) {
      message.error('绑定分类失败');
      console.log('error======<<<', error);
    }
  };

  const handleRemoveCategory = (categoryId: number, categoryName: string) => {
    return new Promise((resolve, reject) => {
      Modal.confirm({
        title: '移除分类',
        content: `确定要移除分类「${categoryName}」吗？`,
        okText: '确认',
        cancelText: '取消',
        onOk: async () => {
          try {
            const currentHasCategory = currentHasCategoryList.find(
              (item: any) => item.categoryId === categoryId,
            );
            console.log('currentHasCategoryList======<<<', currentHasCategoryList);
            if (currentHasCategory) {
              const res = await deleteMovieCategory([currentHasCategory.id]);
              resolve(res);
            } else {
              resolve(0);
            }
          } catch (e) {
            reject(e);
          }
        },
        onCancel: () => {
          resolve(0);
        },
      });
    });
  };

  /** 打开绑定分类弹窗 */
  const openCategoryModal = async (record: any) => {
    try {
      const res = await getMovieCategoryList({ movieId: record.id, pageNum: 1, pageSize: 1000 });
      if (res.code === 200) {
        const hasCategoryList = categoryList?.rows.filter((item: any) =>
          res.rows.some((category: any) => category.categoryId === item.id),
        );
        setCurrentHasCategoryList(res.rows);
        console.log('hasCategoryList======>>>', hasCategoryList);
        setHasCategoryList(hasCategoryList);
        setCategoryModalCurrentRow(record);
        setCategoryModalVisible(true);
      } else {
        message.error('获取分类失败');
      }
    } catch (error) {
      message.error('获取分类失败');
      console.log('error======<<<', error);
    }
  };

  /** 新增/编辑弹窗 */
  const [belongingModalVisible, setBelongingModalVisible] = useState(false);
  /** 新增/编辑弹窗当前行 */
  const [belongingModalCurrentRow, setBelongingModalCurrentRow] = useState<any>(null);
  /** 新增/编辑弹窗标题 */
  const [belongingModalTitle, setBelongingModalTitle] = useState<string>('');

  /**规则列表 */
  const [ruleModalVisible, setRuleModalVisible] = useState(false);

  const openCustomPriceModal = (record: any) => {
    setCustomPriceModalVisible(true);
    setCustomPriceModalCurrentRow(record);
    setCustomPriceModalTitle('设置自定义价格');
  };

  const openCustomAdModal = (record: any) => {
    setCustomAdModalVisible(true);
    setCustomAdModalCurrentRow(record);
    setCustomAdModalTitle('设置广告规则');
  };

  // 打开新增/编辑弹窗
  const openBelongingModal = (record?: any) => {
    setBelongingModalVisible(true);
    setBelongingModalTitle('影片归属管理');
    setBelongingModalCurrentRow(record);
  };

  const handleDistribute = async (record: any) => {
    try {
      const res = await listLanguageConfig(record.id);
      if (res.code === 200) {
        setLanguageModalVisible(true);
        setLanguageModalCurrentRow(record);
        setAppLanguageData(res.data);
      } else {
        message.error('获取分发语言失败');
      }
    } catch (error) {
      console.log('error======<<<', error);
    }
  };

  // 归属
  const handleBelongingOk = async (values: any) => {
    console.log(values, '9090');
  };

  // 分发loading
  const [languageDistributeLoading, setLanguageDistributeLoading] = useState(false);
  const confirmDistribute = async (selectedLanguage: any) => {
    setLanguageDistributeLoading(true);
    const { languageConfigList } = languageModalCurrentRow;
    console.log('languageConfigList======<<<', languageConfigList);
    console.log('selectedLanguage======<<<', selectedLanguage);
    const languageConfig = languageConfigList?.find(
      (item: any) => item.code === selectedLanguage.code,
    );
    console.log('languageConfig======<<<', languageConfig);
    if (languageConfig && languageConfig.translateStatus == 1) {
      message.error('当前影片已翻译，请勿重复翻译');
      return;
    }
    try {
      const res = await translateMovieI18n({
        movieId: languageModalCurrentRow.id,
        language: selectedLanguage.zhName,
        languageCode: selectedLanguage.code,
      });
      if (res.code === 200) {
        message.success('已提交翻译，稍后更新');
        setLanguageDistributeLoading(false);
        setLanguageModalVisible(false);
        run();
      } else {
        setLanguageDistributeLoading(false);
        message.error('翻译失败');
      }
    } catch (error) {
      console.log('error======<<<', error);
    }
  };

  const getTranslateMovieInfo = async (record: any, code: string) => {
    try {
      const res = await getMovieI18nList({
        movieId: record.id,
        languageCode: code,
      });
      if (res.code === 200) {
        console.log('res======<<<', res);
        history.replace('/movie/translate', {
          original: JSON.stringify(record),
          translate: JSON.stringify(res.data),
        });
      } else {
        message.error('获取翻译结果失败');
      }
    } catch (error) {
      console.log('error======<<<', error);
    }
  };
  const columns: ProColumns<any>[] = [
    {
      title: 'ID',
      hideInSearch: true,
      dataIndex: 'id',
      width: 60,
    },
    {
      title: '封面',
      dataIndex: 'coverImage',
      valueType: 'image',
      hideInSearch: true,
      width: 130,
      render: (_, record) => (
        <Image
          src={record.coverImage}
          alt="cover"
          width={120}
          height={120}
          style={{ objectFit: 'cover', borderRadius: 8 }}
          preview={!!record.coverImage}
        />
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '是否推荐',
      dataIndex: 'recommendFlag',
      valueType: 'select',
      valueEnum: {
        '1': { text: '是', status: 'Success' },
        '0': { text: '否', status: 'Error' },
      },
      width: 100,
    },
    {
      title: '状态',
      dataIndex: 'status',
      valueType: 'select',
      valueEnum: {
        '1': { text: '已发布', status: 'Success' },
        '0': { text: '待审核', status: 'Error' },
      },
      width: 100,
      fieldProps: {
        onChange: (value: string) => {
          setSearchMovieParams((prev) => ({
            ...prev,
            status: value,
            feildChange: true,
          }));
        },
      },
    },
    {
      title: '短剧名称',
      dataIndex: 'name',
      hideInSearch: false,
      ellipsis: true,
      copyable: true,
    },
    {
      title: '翻译',
      dataIndex: 'i18nList',
      hideInSearch: true,
      render: (_, record) => {
        const list = record.languageConfigList || [];
        if (!list.length) {
          // 没有多语言，显示“翻译”灰色Tag
          return (
            <Tag color="default" style={{ color: '#bfbfbf' }}>
              未翻译
            </Tag>
          );
        }
        return (
          <div>
            {list.map((item: any) => (
              <Tag
                onClose={async () => {
                  const res = await deleteMovieI18n({
                    movieId: record.id,
                    languageCode: item.code,
                  });
                  if (res.code === 200) {
                    message.success('删除成功');
                    run();
                  } else {
                    message.error('删除失败');
                  }
                }}
                closable
                onClick={() => getTranslateMovieInfo(record, item.code)}
                key={item.code}
                color={item.translateStatus === '1' ? 'blue' : 'default'}
                style={{
                  color: item.translateStatus === '1' ? '#1890ff' : '#bfbfbf',
                  borderColor: item.translateStatus === '1' ? '#1890ff' : '#d9d9d9',
                  display: 'inline-flex',
                  alignItems: 'center',
                  marginBottom: 4,
                }}
              >
                {item.icon && (
                  <img
                    src={item.icon}
                    alt={item.zhName}
                    style={{
                      width: 16,
                      height: 16,
                      marginRight: 4,
                      borderRadius: 2,
                      verticalAlign: 'middle',
                    }}
                  />
                )}
                {item.zhName || item.name}
              </Tag>
            ))}
          </div>
        );
      },
    },
    {
      title: '简介',
      dataIndex: 'description',
      hideInSearch: true,
      ellipsis: true,
      copyable: true,
      width: 200,
    },
    // {
    //   title: '用户数据',
    //   hideInSearch: true,
    //   width: 150,
    //   render: (_, record) => (
    //     <Space
    //       direction="vertical"
    //       size={12}
    //       style={{ width: '100%', paddingTop: '5px', paddingBottom: '5px' }}
    //     >
    //       <Space align="center" size={6}>
    //         <PlayCircleOutlined style={{ fontSize: 14 }} />
    //         <Typography.Text style={{ fontSize: 15, color: '#595959' }}>播放</Typography.Text>
    //         <Typography.Text strong style={{ color: '#1890ff', fontSize: 16 }}>
    //           {formatCount(record.playCount ?? 0)}
    //         </Typography.Text>
    //       </Space>
    //       <Space align="center" size={6}>
    //         <HeartOutlined style={{ fontSize: 14 }} />
    //         <Typography.Text style={{ fontSize: 15, color: '#595959' }}>喜欢</Typography.Text>
    //         <Typography.Text strong style={{ color: '#ff4d4f', fontSize: 16 }}>
    //           {formatCount(record.likeCount ?? 0)}
    //         </Typography.Text>
    //       </Space>
    //       <Space align="center" size={6}>
    //         <StarOutlined style={{ fontSize: 14 }} />
    //         <Typography.Text style={{ fontSize: 15, color: '#595959' }}>收藏</Typography.Text>
    //         <Typography.Text strong style={{ color: '#faad14', fontSize: 16 }}>
    //           {formatCount(record.collectCount ?? 0)}
    //         </Typography.Text>
    //       </Space>
    //       <Space align="center" size={6}>
    //         <SearchOutlined style={{ fontSize: 14 }} />
    //         <Typography.Text style={{ fontSize: 15, color: '#595959' }}>搜索</Typography.Text>
    //         <Typography.Text strong style={{ color: '#1890ff', fontSize: 16 }}>
    //           {formatCount(record.searchCount ?? 0)}
    //         </Typography.Text>
    //       </Space>
    //     </Space>
    //   ),
    // },
    {
      title: '导演',
      dataIndex: 'director',
      width: 80,
    },
    {
      title: '演员',
      dataIndex: 'actors',
      width: 120,
    },
    // {
    //   title: '地区',
    //   dataIndex: 'area',
    //   width: 80,
    //   render: (_, record) => {
    //     const area = areaList?.rows?.find((item: any) => item.id === record.areaId);
    //     return area?.area;
    //   },
    // },
    // {
    //   title: '音频语言',
    //   dataIndex: 'audio',
    //   width: 80,
    //   render: (_, record) => {
    //     const audio = audioList?.rows?.find((item: any) => item.id === record.audioId);
    //     return audio?.audio;
    //   },
    // },
    {
      title: '上映日期',
      dataIndex: 'releaseDate',
      valueType: 'date',
      hideInSearch: false,
      width: 120,
    },
    {
      title: '总集数',
      dataIndex: 'totalVideos',
      hideInSearch: true,
      width: 80,
      render: (text) => (
        <span
          style={{
            color: '#faad14',
            fontWeight: 'bold',
            fontSize: 18,
            background: '#fffbe6',
            borderRadius: 4,
            padding: '2px 8px',
            display: 'inline-block',
            boxShadow: '0 0 4px #ffe58f',
          }}
        >
          {text}集
        </span>
      ),
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
          {/* <Button
            key="tag"
            type="link"
            icon={<TagOutlined />}
            onClick={() => openBindModal(record)}
            style={{ color: '#1890ff', padding: 0, textAlign: 'left', flex: 1 }}
          >
            绑定标签
          </Button> */}
          {/* <Button
            key="category"
            type="link"
            icon={<AppstoreOutlined />}
            style={{ color: '#1890ff', padding: 0, textAlign: 'left', flex: 1 }}
            onClick={() => openCategoryModal(record)}
          >
            绑定分类
          </Button> */}
          {/* <Button
            key="customPrice"
            type="link"
            icon={<DollarOutlined />}
            style={{ color: '#1890ff', padding: 0, textAlign: 'left', flex: 1 }}
            onClick={() => openCustomPriceModal(record)}
          >
            设置自定义价格
          </Button> */}
          <Button
            key="customAd"
            type="link"
            icon={<DollarOutlined />}
            style={{ color: '#1890ff', padding: 0, textAlign: 'left', flex: 1 }}
            onClick={() => openCustomAdModal(record)}
          >
            设置广告规则
          </Button>
          <Button
            key="ruleList"
            type="link"
            icon={<UnorderedListOutlined />}
            style={{ color: '#1890ff', padding: 0, textAlign: 'left', flex: 1 }}
            onClick={() => {
              setRuleModalVisible(true);
              setCustomAdModalCurrentRow(record);
            }}
          >
            广告规则列表
          </Button>
          <Button
            key="language"
            type="link"
            icon={<EditOutlined />}
            style={{ color: '#1890ff', padding: 0, textAlign: 'left', flex: 1 }}
            onClick={() => {
              handleDistribute(record);
            }}
          >
            分发
          </Button>
          <Button
            key="belonging"
            type="link"
            icon={<BorderOuterOutlined />}
            style={{ color: '#1890ff', padding: 0, textAlign: 'left', flex: 1 }}
            onClick={() => {
              openBelongingModal(record);
            }}
          >
            归属管理
          </Button>
        </Button.Group>
      ),
    },
  ];

  return (
    <CardContainer title="电影详情">
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
            orderByColumn: 'id',
            isAsc: 'desc',
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
            新增电影
          </Button>,
        ]}
      />
      <DetailModal
        title={detailModalTitle}
        open={detailModalVisible}
        areaList={areaList?.rows || []}
        audioList={audioList?.rows || []}
        onCancel={() => setDetailModalVisible(false)}
        onOk={async (values) => {
          await handleOk(values);
        }}
        currentRow={detailModalCurrentRow}
      />
      <BindModal
        onRemove={async (tagId, tagName) => {
          return await handleRemoveTag(tagId, tagName);
        }}
        open={bindModalVisible}
        onCancel={() => setBindModalVisible(false)}
        onOk={handleBindOk}
        tagList={tagList?.rows || []}
        hasTagList={hasTagList}
      />
      <CategoryModal
        open={categoryModalVisible}
        onCancel={() => setCategoryModalVisible(false)}
        onOk={handleCategoryOk}
        onRemove={async (categoryId, categoryName) => {
          return await handleRemoveCategory(categoryId, categoryName);
        }}
        categoryList={categoryList?.rows || []}
        hasCategoryList={hasCategoryList}
      />
      <PriceModal
        visible={customPriceModalVisible}
        onCancel={() => setCustomPriceModalVisible(false)}
        onOk={(values) => {
          console.log('values======<<<', values);
          saveMovieCoinRule(values)
            .then((res) => {
              setCustomPriceModalVisible(false);
            })
            .catch((err) => {
              message.error(err);
            });
        }}
        currentRow={customPriceModalCurrentRow}
      />
      {/* 广告规则 */}
      <AdModal
        visible={customAdModalVisible}
        operationType="add"
        onCancel={() => setCustomAdModalVisible(false)}
        onOk={(values) => {
          console.log('values======<<<', values);
          saveMovieAdRule(values)
            .then((res) => {
              setCustomAdModalVisible(false);
            })
            .catch((err) => {
              message.error(err);
            });
        }}
        currentRow={customAdModalCurrentRow}
        rowId=""
      />
      <RuleModal
        title="广告规则列表"
        open={ruleModalVisible}
        onCancel={() => setRuleModalVisible(false)}
        currentRow={customAdModalCurrentRow}
      />
      <Modal
        width={'60%'}
        open={designModalVisible}
        onCancel={() => setDesignModalVisible(false)}
        onOk={() => {}}
      >
        <ImageDesign
          originalImageUrl={designModalCurrentRow?.coverImage}
          imageUrl={designModalCurrentRow?.coverImage}
          currentText={designModalCurrentRow?.title}
          callBack={(url) => {
            console.log('url======<<<', url);
          }}
          openDesign={designModalVisible}
        />
      </Modal>
      <LanguageModal
        visible={languageModalVisible}
        onClose={() => setLanguageModalVisible(false)}
        onSubmit={confirmDistribute}
        appLanguageData={appLanguageData}
        distributeButLoading={languageDistributeLoading}
      />
      <BelongingModal
        title={belongingModalTitle}
        open={belongingModalVisible}
        onCancel={() => setBelongingModalVisible(false)}
        onOk={async (values) => {
          await handleBelongingOk(values);
        }}
        currentRow={belongingModalCurrentRow}
      />
    </CardContainer>
  );
};

export default MovieDetail;
