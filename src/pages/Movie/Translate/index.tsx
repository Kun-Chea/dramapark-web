import React, { useEffect, useState, useMemo } from 'react';
import { useLocation, history } from '@umijs/max';
import { Card, Button, Tag, Table, Input, message, Modal, Image, Typography } from 'antd';
import { PageHeader } from '@ant-design/pro-components';
import { EditOutlined } from '@ant-design/icons';
import ImageDesign from '@/components/ImageDesign';
import {
  queryTranslateByMovieId,
  updateMovieI18n,
  listEpisode,
  refuseMovieI18nState,
  updateMovieI18nState,
} from '@/services/movie/details';
import './index.less';
import 'xgplayer/dist/index.min.css';
import VideoPreview from '@/components/VideoPreview';
const { TextArea } = Input;

const Translate = () => {
  const location = useLocation();
  // 解析原文和翻译数据
  const { original: originalStr, translate: translateStr } = (location.state as any) || {};
  // 原文和翻译数据
  const [original, setOriginal] = useState<any>({});
  const [translate, setTranslate] = useState<any>({});
  // 当前选中的语言
  const [activeLanguage, setActiveLanguage] = useState<any>({});
  // 语言列表
  const [languageList, setLanguageList] = useState<any[]>([]);
  // 编辑中的翻译数据
  const [editTranslate, setEditTranslate] = useState<any>({});
  // 保存按钮loading
  const [saving, setSaving] = useState(false);
  // 海报上传loading
  const [avatarUploading, setAvatarUploading] = useState(false);
  // 设计图片弹窗
  const [openDesign, setOpenDesign] = useState(false);
  // 设计图片url
  const [dialogImageUrl, setDialogImageUrl] = useState<any>(undefined);
  // 剧集相关
  const [episodes, setEpisodes] = useState<any[]>([]);
  // 当前剧集
  const [currentEpisode, setCurrentEpisode] = useState<number>(0);
  // 当前字幕
  const [currentTextTrack, setCurrentTextTrack] = useState<any>(undefined);
  // 当前翻译的片名
  const [currentText, setCurrentText] = useState<any>(undefined);

  useEffect(() => {
    if (!originalStr && !translateStr) return;
    const originalData = JSON.parse(originalStr || '{}');
    setOriginal(originalData);
    setLanguageList(originalData.languageConfigList || []);
    //获取翻译结果
    let trans = JSON.parse(translateStr || '{}')[0];
    const currentLanguage =
      originalData.languageConfigList && trans
        ? originalData.languageConfigList.find((l: any) => l.code === trans.languageCode)
        : {};
    setActiveLanguage(currentLanguage);
    handleLanguageChange(currentLanguage, originalData);
    handlePlayMovie(originalData.id);
  }, [originalStr, translateStr]);

  useEffect(() => {
    console.log('dialogImageUrl', dialogImageUrl);
  }, [dialogImageUrl]);

  // 处理返回
  const goBack = () => {
    history.replace('/movie/detail');
  };

  useEffect(() => {
    return () => {
      window.history.replaceState({}, document.title);
    };
  }, []);

  // 获取语言中文名
  const getLanguageName = (code: string) => {
    const lang = languageList.find((l) => l.code === code);
    return lang ? lang.zhName : code;
  };

  // 处理语言切换
  const handleLanguageChange = async (lang: any, originalData: any) => {
    if (activeLanguage && activeLanguage.code === lang.code) return;
    setActiveLanguage(lang);
    try {
      const res = await queryTranslateByMovieId({
        movieId: originalData.id,
        languageCode: lang.code,
      });
      if (res.code === 200) {
        let trans = res.data;
        const t = Array.isArray(trans) ? trans[0] || {} : trans;
        setTranslate(t);
        
        setDialogImageUrl(
          t.coverImage && t.coverImage !== 'null' ? t.coverImage : originalData.coverImageNoWord,
        );
        setEditTranslate({ ...t });
      }
    } catch (err) {
      message.error('获取翻译失败');
    }
  };

  // 处理保存
  const handleSave = async () => {
    if (!editTranslate.title) {
      message.warning('片名不能为空');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...editTranslate,
        movieId: original.id,
        languageCode: editTranslate.languageCode || (activeLanguage && activeLanguage.code),
      };
      const res = await updateMovieI18n(payload);
      if (res.code === 200) {
        message.success('翻译内容已保存');
        setTranslate({ ...editTranslate });
      } else {
        message.error('保存失败');
      }
    } catch (err) {
      message.error('保存失败');
    } finally {
      setSaving(false);
    }
  };

  // 拒绝翻译
  const handleRefuse = async () => {
    try {
      const res = await updateMovieI18nState({
        id: translate.id,
        movieId: translate.movieId,
        status: 2,
        languageCode: activeLanguage.code,
      });
      if (res.code === 200) {
        message.success('拒绝成功');
        goBack();
      }
    } catch (err) {
      message.error('拒绝失败');
    }
  };

  // 通过翻译
  const handleApprove = async () => {
    try {
      const res = await updateMovieI18nState({
        id: translate.id,
        movieId: translate.movieId,
        status: 1,
        languageCode: activeLanguage.code,
      });
      if (res.code === 200) {
        message.success('通过成功');
        goBack();
      } else if (res.code === 500) {
        message.error(res.msg);
      }
    } catch (err) {
      message.error('通过失败');
    }
  };

  // 剧集相关
  const playEpisode = (index: number) => {
    setCurrentEpisode(index);
  };

  // 获取剧集
  const handlePlayMovie = async (movieId: number) => {
    try {
      const res = await listEpisode(movieId);
      if (res.code === 200) {
        const newList = res.data.map((episode: any) => ({
          ...episode,
          videoI18nList: episode.videoI18nList.map((item: any) => ({
            id: item.id,
            url: item.subtitleUrl,
            language: item.languageCode,
            text: item.remark,
            default: activeLanguage.code == item.languageCode,
          })),
        }));
        setEpisodes(newList);
        setTimeout(() => {
          playEpisode(0);
        }, 0);
      }
    } catch (err) {
      message.error('获取影片集数失败');
    }
  };

  // 编辑输入变化
  const onInputChange = (key: string, value: string) => {
    setEditTranslate((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  // 需要展示的字段及类型
  const tableRows = useMemo(
    () => [
      {
        key: 'title',
        original: original.title,
        translate: editTranslate.title,
        type: 'text',
        label: '片名',
      },
      {
        key: 'director',
        original: original.director,
        translate: editTranslate.director,
        type: 'text',
        label: '导演',
      },
      {
        key: 'actors',
        original: original.actors,
        translate: editTranslate.actors,
        type: 'text',
        label: '主演',
      },
      {
        key: 'description',
        original: original.description,
        translate: editTranslate.description,
        type: 'text',
        label: '剧情介绍',
      },
    ],
    [original, editTranslate],
  );

  const handleDesignCallBack = async (url: string) => {
    setDialogImageUrl(url);
    try {
      const res = await updateMovieI18n({
        ...editTranslate,
        movieId: original.id,
        languageCode: editTranslate.languageCode || (activeLanguage && activeLanguage.code),
        coverImage: url,
      });
      if (res.code === 200) {
        message.success('海报替换成功');
        handleLanguageChange(activeLanguage, original);
      } else {
        message.error('海报替换失败');
      }
    } catch (error) {
      message.error('海报替换失败');
    } finally {
      setOpenDesign(false);
    }
  };

  return (
    <div className="movie-translate-container">
      <div className="page-header">
        <PageHeader onBack={goBack} title="影片翻译详情" />
      </div>
      <Card className="movie-translate-card" bordered={false} hoverable>
        <div className="movie-header">
          <div className="avatar-edit-wrapper">
            <Image
              src={dialogImageUrl}
              alt={original.title}
              className="movie-avatar"
              style={{
                width: 100,
                height: 150,
                borderRadius: 8,
                border: '1px solid #eee',
                marginBottom: 8,
              }}
            />
            <Button
              size="small"
              icon={<EditOutlined />}
              className="avatar-edit-btn"
              onClick={() => {
                setCurrentText(translate.title);
                setOpenDesign(true);
              }}
              style={{ marginTop: 0, padding: '2px 10px' }}
            >
              设计海报
            </Button>
          </div>
          <div className="movie-title-info">
            <div className="movie-title">
              <span>{original.name}</span>
              {original.languageName && (
                <Tag color="default" className="lang-tag">
                  {original.languageName}
                </Tag>
              )}
              <Tag color="processing" className="lang-tag">
                {getLanguageName(translate.languageCode)}
              </Tag>
            </div>
            {original.title && (
              <div className="movie-oldname">
                <Tag color="success" style={{ border: '1px solid #b7eb8f', background: '#f6ffed' }}>
                  原名：{original.title}
                </Tag>
              </div>
            )}
            <div className="movie-original-extra">
              {original.upTime && (
                <div className="movie-original-extra-item">
                  <span className="movie-original-extra-label">上映时间：</span>
                  <span>{original.upTime}</span>
                </div>
              )}
              {original.time && (
                <div className="movie-original-extra-item">
                  <span className="movie-original-extra-label">时长：</span>
                  <span>{original.time} 分钟</span>
                </div>
              )}
              {original.num && (
                <div className="movie-original-extra-item">
                  <span className="movie-original-extra-label">集数：</span>
                  <span>{original.num}</span>
                </div>
              )}
              {original.rating && (
                <div className="movie-original-extra-item">
                  <span className="movie-original-extra-label">评分：</span>
                  <span>{original.rating}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        {/* 语言切换标签 */}
        <div className="language-switch-tags">
          {languageList.map((lang: any) => (
            <Tag
              key={lang.code}
              color={activeLanguage.code === lang.code ? 'processing' : 'default'}
              className="switch-lang-tag"
              style={{
                cursor: 'pointer',
                marginRight: 10,
                marginBottom: 8,
                border: activeLanguage.code === lang.code ? '1px solid #1890ff' : undefined,
                background: activeLanguage.code === lang.code ? '#e6f7ff' : undefined,
              }}
              onClick={() => handleLanguageChange(lang, original)}
            >
              <img
                src={lang.icon}
                alt={lang.zhName}
                style={{ width: 16, height: 16, verticalAlign: 'middle', marginRight: 5 }}
              />
              {lang.zhName}
            </Tag>
          ))}
        </div>
        {/* 原文-译文表格 */}
        <Table
          className="translate-table"
          dataSource={tableRows}
          rowKey="key"
          bordered
          pagination={false}
          style={{ width: '100%', marginTop: 24 }}
        >
          <Table.Column
            title="原文"
            dataIndex="original"
            key="original"
            render={(_, row: any) =>
              row.type === 'content' ? (
                <div>
                  <span
                    className="movie-table-label"
                    style={{ color: '#909399', fontSize: 12, marginRight: 8 }}
                  >
                    {row.label}
                  </span>
                  <div
                    className="movie-content movie-table-original"
                    style={{ display: 'inline' }}
                    dangerouslySetInnerHTML={{ __html: row.original || '' }}
                  />
                </div>
              ) : (
                <div className="movie-table-original">
                  <span
                    className="movie-table-label"
                    style={{ color: '#909399', fontSize: 12, marginRight: 8 }}
                  >
                    {row.label}
                  </span>
                  {row.original}
                </div>
              )
            }
            width={220}
          />
          <Table.Column
            title={
              <span>
                译文
                <span style={{ float: 'right' }}>
                  <Button type="primary" size="small" loading={saving} onClick={handleSave}>
                    保存
                  </Button>
                </span>
              </span>
            }
            dataIndex="translate"
            key="translate"
            render={(_, row: any) =>
              row.type === 'content' ? (
                <TextArea
                  value={editTranslate[row.key]}
                  rows={3}
                  size="small"
                  onChange={(e) => onInputChange(row.key, e.target.value)}
                  className="movie-table-translate-input"
                />
              ) : (
                <Input
                  value={editTranslate[row.key]}
                  size="small"
                  onChange={(e) => onInputChange(row.key, e.target.value)}
                  className="movie-table-translate-input"
                />
              )
            }
            width={220}
          />
        </Table>
        {/* 播放器和剧集 */}
        <div className="player-container">
          <div className="video-container" style={{ opacity: episodes[currentEpisode] ? 1 : 0 }}>
            {episodes[currentEpisode] && (
              <VideoPreview
                videoId={episodes[currentEpisode].id}
                src={episodes[currentEpisode].videoUrl}
                pic={episodes[currentEpisode].coverImage}
                textTrackList={episodes[currentEpisode].videoI18nList}
                languageinfo={activeLanguage}
              />
            )}
          </div>
          <div className="episodes-container">
            <div className="movie-info">
              <Typography.Title level={3} style={{ marginBottom: 8 }}>
                {original.name} {original.oldname}
              </Typography.Title>
              <p>
                <strong>导演:</strong> {original.director}
              </p>
              <p>
                <strong>主演:</strong> {original.actors}
              </p>
              <p>
                <strong>简介:</strong> {original.description}
              </p>
            </div>
            <div className="episodes-list">
              {episodes.map((episode, index) => (
                <div className="episode-button-item" style={{ position: 'relative' }} key={index}>
                  <Button
                    size="small"
                    type={currentEpisode === index ? 'primary' : 'default'}
                    onClick={() => playEpisode(index)}
                    className="episode-button"
                  >
                    {episode.videoNum}
                  </Button>
                  {episode.isVip && (
                    <div style={{ position: 'absolute', bottom: -6, right: -4 }}>
                      <svg
                        viewBox="0 0 24 24"
                        style={{
                          width: 18,
                          height: 18,
                          color: '#909399',
                          padding: 2,
                          borderRadius: 2,
                        }}
                      >
                        <path
                          fill="currentColor"
                          d="M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V10A2,2 0 0,1 6,8H15V6A3,3 0 0,0 12,3A3,3 0 0,0 9,6H7A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18Z"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
        {/* 操作按钮 */}
        <div className="action-btns" style={{ marginTop: 32, textAlign: 'right' }}>
          <Button
            type="primary"
            size="middle"
            loading={saving}
            onClick={() => {
              Modal.confirm({
                title: '提示',
                content: '请确保所有封面图已上传，再提交翻译!',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                  handleApprove();
                },
              });
            }}
          >
            通过
          </Button>
          <Button
            type="primary"
            danger
            size="middle"
            style={{ marginLeft: 12 }}
            onClick={() => {
              Modal.confirm({
                title: '提示',
                content: '确定要拒绝该翻译吗？',
                okText: '确定',
                cancelText: '取消',
                onOk: () => {
                  handleRefuse();
                },
              });
            }}
          >
            拒绝
          </Button>
        </div>
      </Card>
      {/* 设计海报弹窗 */}
      <Modal
        width="80%"
        open={openDesign}
        title="设计海报"
        footer={null}
        onCancel={() => setOpenDesign(false)}
        destroyOnClose
        centered
      >
        <ImageDesign
          openDesign={openDesign}
          imageUrl={dialogImageUrl}
          originalImageUrl={original.coverImageNoWord}
          currentText={currentText}
          callBack={handleDesignCallBack}
        />
      </Modal>
    </div>
  );
};

export default Translate;
