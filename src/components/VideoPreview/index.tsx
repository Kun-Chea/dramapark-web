import { useEffect, useRef, useState } from 'react';
import Player, { Events } from 'xgplayer';
import TextTrack from 'xgplayer/es/plugins/track';
import 'xgplayer/dist/index.min.css';
import HlsPlugin from 'xgplayer-hls';
import { Col, Row } from 'antd';
import React from 'react';

type VideoItemProps = {
  // 视频id
  videoId: number;
  // 视频地址
  src: string;
  // 视频封面
  pic: string;
  // 字幕列表
  textTrackList?: any[];
  // 语言信息
  languageinfo?: any;
};

const VideoPreview: React.FC<VideoItemProps> = React.memo(
  ({ videoId, src, pic, textTrackList, languageinfo }) => {
    const playerSdk = useRef<Player | null>(null);
    console.log('组件重新渲染', textTrackList, languageinfo);

    const initPlayer = async () => {
      // 处理字幕列表，设置默认语言
      const processedTracks =
        textTrackList?.map((track) => ({
          ...track,
          default: track.language == languageinfo.code,
        })) || [];

      playerSdk.current = new Player({
        id: `video-${videoId}`,
        url: src,
        poster: pic,
        height: 600,
        width: '100%',
        plugins: [HlsPlugin, TextTrack],
        autoplayMuted: true,
        autoplay: true,
        texttrack: {
          isDefaultOpen: true,
          position: 'controlsRight',
          index: 1,
          style: {
            follow: true, // 是否跟随控制栏调整位置
            mode: 'stroke', // 字体显示模式 stroke/bg（文字描边/文字背景），默认为stroke
            followBottom: 50, // 跟随底部控制栏的高度
            fitVideo: true, // 是否跟随视频自动调整字号
            offsetBottom: 2, // 字幕距离画面底部百分比，默认2%
            baseSizeX: 49, // 横屏视频适配基准字号
            baseSizeY: 28, // 竖屏视频适配基准字号
            minSize: 25, // pc端最小字号
            minMobileSize: 13, // 移动端最小字号
            line: 'double', // 最大显示行数 single/double/three
            fontColor: '#fff', // 字体颜色
          },
          closeText: { text: '不开启', iconText: '字幕' },
          list: processedTracks,
        },
      });
      //视频开始播放
      playerSdk.current.on(Events.READY, () => {});
      // 视频播放结束
      playerSdk.current.on(Events.ENDED, () => {});
    };

    

    useEffect(() => {
      initPlayer();
      if (playerSdk.current && textTrackList?.length && languageinfo?.code) {
        const index = textTrackList.findIndex((t) => t.language == languageinfo.code);
        if (index >= 0) {
          (playerSdk.current as any)?.textTrack?.switch(index); // ✅ 切换到指定字幕
        }
      }
      return () => {
        if (playerSdk.current) {
          playerSdk.current.destroy();
        }
      };
    }, [videoId, languageinfo, textTrackList]);

    return (
      <Row
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 25,
        }}
      >
        <div id={`video-${videoId}`} />
      </Row>
    );
  },
);

export default VideoPreview;
