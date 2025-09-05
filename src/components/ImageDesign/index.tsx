import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Button, Input, message, Row, Spin } from 'antd';
import { toPng } from 'html-to-image';
import classNames from 'classnames';
import './index.less';
import { uploadFile } from '@/services/common/commont';
import { CloseOutlined } from '@ant-design/icons';

interface TextItem {
  id: number;
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontFamily: string;
  fontSize: number;
  color: string;
  bold: boolean;
  italic: boolean;
  underline: boolean;
  effect: string;
}

interface FontItem {
  label: string;
  value: string;
}

interface ImageDesignProps {
  originalImageUrl?: string;
  imageUrl?: string;
  currentText?: string;
  callBack?: (url: string) => void;
  openDesign?: boolean;
}

const fontList: FontItem[] = [
  { label: 'Artistic Words FZHuazhi1', value: 'FZHuazhi1' },
  { label: 'Ink Wander FZHuazhi2', value: 'FZHuazhi2' },
  { label: 'Life Rhythm FZHuazhi3', value: 'FZHuazhi3' },
  { label: 'Nature Canvas FZHuazhi4', value: 'FZHuazhi4' },
  { label: 'Power of Words FZHuazhi5', value: 'FZHuazhi5' },
  { label: 'Dancing Leaves Words FZHuazhi6', value: 'FZHuazhi6' },
  { label: 'Color Symphony FZHuazhi7', value: 'FZHuazhi7' },
  { label: 'Dreams Canvas FZHuazhi8', value: 'FZHuazhi8' },
  { label: 'Words Force FZHuazhi9', value: 'FZHuazhi9' },
  { label: 'ArtierEN-2 FZHuazhi10', value: 'FZHuazhi10' },
  { label: 'ggth-2 FZHuazhi11', value: 'FZHuazhi11' },
  { label: 'xactoblade-davz FZHuazhi12', value: 'FZHuazhi12' },
  { label: 'flavoristafree-dyva3 FZHuazhi13', value: 'FZHuazhi13' },
  { label: 'Cube-Font-1 FZHuazhi14', value: 'FZHuazhi14' },
  { label: 'LittleBirdsRegular-lg81w-2 FZHuazhi16', value: 'FZHuazhi16' },
  { label: 'MissalUncialeMaster-2 FZHuazhi17', value: 'FZHuazhi17' },
  { label: 'FetteGotisch-D-OT-Regular-2 FZHuazhi18', value: 'FZHuazhi18' },
];

const colorList = ['#222', '#fff', '#f5222d', '#faad14', '#52c41a', '#1890ff', '#722ed1'];

const effectList = [
  { label: '无', value: '' },
  { label: '发光', value: 'glow' },
  { label: '描边', value: 'stroke' },
];

const ImageDesign: React.FC<ImageDesignProps> = ({
  originalImageUrl,
  imageUrl: propImageUrl,
  currentText,
  callBack,
  openDesign = false,
}) => {
  // 画布和图片
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const editorImageRef = useRef<HTMLImageElement>(null);
  const editInputRef = useRef<any>(null);
  const editorTextRefs = useRef<(HTMLDivElement | null)[]>([]);

  // 状态
  const [canvasWidth, setCanvasWidth] = useState<number>(0);
  const [canvasHeight, setCanvasHeight] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<any>(propImageUrl || originalImageUrl);
  const [texts, setTexts] = useState<TextItem[]>([]);
  const [selectedTextId, setSelectedTextId] = useState<number | null>(null);
  const [editingTextId, setEditingTextId] = useState<number | null>(null);
  const [dragInfo, setDragInfo] = useState<any>(null);
  const [resizeInfo, setResizeInfo] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState<boolean>(false);
  const [renderLoading, setRenderLoading] = useState<boolean>(false);
  const [isEditingInput, setIsEditingInput] = useState<boolean>(false);

  // 监听图片变化
  useEffect(() => {
    setImageUrl(propImageUrl || originalImageUrl);
  }, [propImageUrl, originalImageUrl]);

  // 监听openDesign和画布尺寸变化，自动重置
  useEffect(() => {
    if (canvasWidth > 0 && canvasHeight > 0 && openDesign) {
      commonReset();
    }
    // eslint-disable-next-line
  }, [canvasWidth, canvasHeight, openDesign]);

  // 字体加载
  useEffect(() => {
    (async () => {
      try {
        // 等待字体加载
        // @ts-ignore
        if (document.fonts && document.fonts.ready) {
          await (document.fonts as any).ready;
        }
        // 检查字体
        const fontFamilies = [
          'FZHuazhi1',
          'FZHuazhi2',
          'FZHuazhi3',
          'FZHuazhi4',
          'FZHuazhi5',
          'FZHuazhi6',
          'FZHuazhi7',
          'FZHuazhi8',
          'FZHuazhi9',
          'FZHuazhi10',
          'FZHuazhi11',
          'FZHuazhi12',
          'FZHuazhi13',
          'FZHuazhi14',
          'FZHuazhi16',
          'FZHuazhi17',
          'FZHuazhi18',
        ];
        fontFamilies.forEach((font) => {
          // @ts-ignore
          if (document.fonts && document.fonts.check) {
            // @ts-ignore
            const isLoaded = document.fonts.check(`16px "${font}"`);
            if (!isLoaded) {
              // eslint-disable-next-line
              console.warn(`字体 ${font} 未正确加载`);
            }
          }
        });
      } catch (e) {
        // eslint-disable-next-line
        console.warn('字体加载检查失败:', e);
      }
    })();
  }, []);

  // 监听全局拖拽和缩放
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      onDrag(e);
      onResize(e);
    };
    const handleMouseUp = () => {
      stopDrag();
      stopResize();
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    // eslint-disable-next-line
  }, [dragInfo, resizeInfo, texts, canvasWidth, canvasHeight]);

  // 图片加载后设置画布尺寸
  const onImageLoad = useCallback(() => {
    const img = editorImageRef.current;
    if (img) {
      setCanvasWidth(img.naturalWidth);
      setCanvasHeight(img.naturalHeight);
    }
  }, []);

  // 选中的文本
  const selectedText = texts.find((t) => t.id === selectedTextId);

  // 重置
  const commonReset = useCallback(() => {
    setTexts([]);
    setSelectedTextId(null);
    setEditingTextId(null);
    setDragInfo(null);
    setResizeInfo(null);
    setPreviewMode(false);
    if (canvasWidth > 0 && canvasHeight > 0) {
      setTimeout(() => {
        addText();
      }, 0);
    }
    // eslint-disable-next-line
  }, [canvasWidth, canvasHeight, currentText]);

  // 重置图片
  const resetImage = () => {
    setImageUrl(originalImageUrl);
    commonReset();
  };

  // 添加文本
  const addText = () => {
    const id = Date.now() + Math.random();
    const text: TextItem = {
      id,
      content: currentText || '请输入文字',
      x: canvasWidth / 2 - 100,
      y: canvasHeight / 2 - 20,
      width: 120,
      height: 40,
      fontFamily: 'FZHuazhi1',
      fontSize: 20,
      color: '#fff',
      bold: false,
      italic: false,
      underline: false,
      effect: 'glow',
    };
    setTexts((prev) => [...prev, text]);
    setSelectedTextId(id);
    setEditingTextId(id);
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
      }
    }, 100);
  };

  // 选中文本
  const selectText = (id: number) => {
    if (previewMode) return;
    if (isEditingInput) return;
    setSelectedTextId(id);
    setEditingTextId(null);
  };

  // 编辑文本
  const editText = (id: number) => {
    if (previewMode) return;
    setSelectedTextId(id);
    setEditingTextId(id);
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.focus();
      }
    }, 100);
  };

  // 确认编辑
  const confirmEditText = () => {
    setEditingTextId(null);
    setIsEditingInput(false);
    updateText();
  };

  // 删除文本
  const removeText = (idx: number) => {
    setTexts((prev) => {
      const newArr = [...prev];
      newArr.splice(idx, 1);
      if (newArr.length === 0) {
        setSelectedTextId(null);
        setTimeout(() => addText(), 0);
      } else {
        setSelectedTextId(newArr[idx - 1] ? newArr[idx - 1].id : newArr[0] ? newArr[0].id : null);
      }
      return newArr;
    });
  };

  // 拖动
  const startDragText = (e: React.MouseEvent, text: TextItem, idx: number) => {
    if (previewMode) return;
    if (e.button !== 0) return;
    if (resizeInfo) return;
    setDragInfo({
      id: text.id,
      offsetX: e.clientX - text.x,
      offsetY: e.clientY - text.y,
      idx,
    });
    selectText(text.id);
  };

  const onDrag = (e: MouseEvent) => {
    if (previewMode) return;
    if (!dragInfo) return;
    setTexts((prev) => {
      const idx = prev.findIndex((t) => t.id === dragInfo.id);
      if (idx === -1) return prev;
      const editorTextRef = editorTextRefs.current[idx];
      const editorTextWidth = editorTextRef?.offsetWidth || 60;
      const editorTextHeight = editorTextRef?.offsetHeight || 30;
      let x = e.clientX - dragInfo.offsetX;
      let y = e.clientY - dragInfo.offsetY;
      x = Math.max(0, Math.min(canvasWidth - editorTextWidth, x));
      y = Math.max(0, Math.min(canvasHeight - editorTextHeight, y));
      const newArr = [...prev];
      newArr[idx] = { ...newArr[idx], x, y };
      return newArr;
    });
  };

  const stopDrag = () => {
    setDragInfo(null);
  };

  // 缩放
  const startResizeText = (e: React.MouseEvent, text: TextItem, corner: string, idx: number) => {
    if (previewMode) return;
    if (e.button !== 0) return;
    setResizeInfo({
      id: text.id,
      startX: e.clientX,
      startY: e.clientY,
      startFontSize: text.fontSize,
      startWidth: text.width,
      startHeight: text.height,
      startTextX: text.x,
      startTextY: text.y,
      corner,
      idx,
    });
    selectText(text.id);
  };

  const onResize = (e: MouseEvent) => {
    if (previewMode) return;
    if (!resizeInfo) return;
    setTexts((prev) => {
      const idx = prev.findIndex((t) => t.id === resizeInfo.id);
      if (idx === -1) return prev;
      const text = prev[idx];
      const {
        startX,
        startY,
        startFontSize,
        startWidth,
        startHeight,
        startTextX,
        startTextY,
        corner,
      } = resizeInfo;
      let dx = e.clientX - startX;
      let dy = e.clientY - startY;
      let scale = 1;
      if (corner === 'tl') {
        scale = 1 - (dx + dy) / 120;
      } else if (corner === 'tr') {
        scale = 1 + (dx - dy) / 120;
      } else if (corner === 'bl') {
        scale = 1 + (-dx + dy) / 120;
      } else if (corner === 'br') {
        scale = 1 + (dx + dy) / 120;
      }
      scale = Math.max(0.3, Math.min(5, scale));
      let newFontSize = Math.round(startFontSize * scale);
      newFontSize = Math.max(10, Math.min(200, newFontSize));
      let newWidth = Math.max(60, Math.round(startWidth * scale));
      let newHeight = Math.max(30, Math.round(startHeight * scale));
      let newX = startTextX;
      let newY = startTextY;
      if (corner === 'tl') {
        newX = startTextX + (startWidth - newWidth);
        newY = startTextY + (startHeight - newHeight);
      } else if (corner === 'tr') {
        newY = startTextY + (startHeight - newHeight);
      } else if (corner === 'bl') {
        newX = startTextX + (startWidth - newWidth);
      }
      newX = Math.max(0, Math.min(canvasWidth - newWidth, newX));
      newY = Math.max(0, Math.min(canvasHeight - newHeight, newY));
      const newArr = [...prev];
      newArr[idx] = {
        ...text,
        fontSize: newFontSize,
        width: newWidth,
        height: newHeight,
        x: newX,
        y: newY,
      };
      return newArr;
    });
  };

  const stopResize = () => {
    setResizeInfo(null);
  };

  // 更新文本
  const updateText = () => {
    setTexts((prev) => [...prev]);
  };

  // 加粗
  const toggleBold = () => {
    if (selectedText) {
      setTexts((prev) => prev.map((t) => (t.id === selectedText.id ? { ...t, bold: !t.bold } : t)));
    }
  };

  // 下划线
  const toggleUnderline = () => {
    if (selectedText) {
      setTexts((prev) =>
        prev.map((t) => (t.id === selectedText.id ? { ...t, underline: !t.underline } : t)),
      );
    }
  };

  // 预览
  const togglePreview = () => {
    setPreviewMode((v) => !v);
  };

  // 上传图片
  const update = async (file: File) => {
    if (!file) {
      message.error('上传文件为空，请重试');
      return;
    }
    setRenderLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await uploadFile(formData);
      if (res.code === 200) {
        callBack && callBack(res.url);
      } else {
        message.error(res.msg);
      }
    } catch (error) {
      message.error('上传失败');
    } finally {
      setRenderLoading(false);
    }
  };

  // dataURL转Blob
  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1] || 'image/png';
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  // Blob转File
  const blobToFile = (theBlob: Blob, fileName: string) => {
    // @ts-ignore
    theBlob.lastModifiedDate = new Date();
    // @ts-ignore
    theBlob.name = fileName;
    return theBlob as File;
  };

  // 保存为图片
  const saveToImage = async () => {
    if (!previewMode) return;
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;
    setRenderLoading(true);
    try {
      // 等待字体加载
      // @ts-ignore
      if (document.fonts && document.fonts.ready) {
        await (document.fonts as any).ready;
      }
      // 检查字体
      const usedFonts = [...new Set(texts.map((text) => text.fontFamily).filter(Boolean))];
      for (const fontFamily of usedFonts) {
        // @ts-ignore
        if (document.fonts && document.fonts.check) {
          // @ts-ignore
          const isLoaded = document.fonts.check(`16px "${fontFamily}"`);
          if (!isLoaded) {
            // eslint-disable-next-line
            console.warn(`字体 ${fontFamily} 未完全加载，可能影响生成效果`);
          }
        }
      }
      // 强制刷新
      setTexts((prev) => [...prev]);
      await new Promise((resolve) => setTimeout(resolve, 100));
      const dataUrl = await toPng(canvasEl, {
        quality: 1,
        scale: 1,
        pixelRatio: 2,
        style: {
          margin: '0',
          padding: '0',
          border: 'none',
          boxShadow: 'none',
        },
        useCORS: true,
      } as any);
      const blob = dataURLtoBlob(dataUrl);
      const file = blobToFile(blob, 'image-design.png');
      update(file);
    } catch (error) {
      // eslint-disable-next-line
      console.error('保存图片出错:', error);
      message.error('图片保存失败，请重试');
    } finally {
      setRenderLoading(false);
    }
  };

  // 输入框样式
  const getInputStyle = (text: TextItem) => {
    let minWidth = Math.max(300, text.width || 300);
    let maxWidth = canvasWidth - text.x - 10;
    if (maxWidth < 60) maxWidth = 60;
    return {
      width: minWidth,
      maxWidth: maxWidth,
      minWidth: 60,
      fontSize: 16,
      fontFamily: text.fontFamily,
      color: text.color,
      fontWeight: text.bold ? 'bold' : 'normal',
      fontStyle: text.italic ? 'italic' : 'normal',
      textDecoration: text.underline ? 'underline' : 'none',
      // background: 'rgba(255,255,255,0.95)',
      borderRadius: 6,
      boxShadow: '0 0 8px #409EFF22',
      padding: '2px 8px',
    } as React.CSSProperties;
  };

  // 文本样式
  const getTextStyle = (text: TextItem) =>
    ({
      position: 'absolute' as const,
      left: text.x,
      top: text.y,
      minWidth: 60,
      minHeight: 30,
      fontFamily: text.fontFamily,
      fontSize: text.fontSize,
      color: text.color,
      fontWeight: text.bold ? 'bold' : 'normal',
      fontStyle: text.italic ? 'italic' : 'normal',
      textDecoration: text.underline ? 'underline' : 'none',
      cursor: previewMode ? 'default' : resizeInfo ? 'nwse-resize' : 'move',
      userSelect: editingTextId === text.id ? 'text' : 'none',
      zIndex: selectedTextId === text.id && !previewMode ? 10 : 1,
      boxShadow: selectedTextId === text.id && !previewMode ? '0 0 8px #409EFF' : 'none',
      padding: '2px 8px',
      borderRadius: 6,
      transition: 'box-shadow 0.2s',
      boxSizing: 'border-box' as const,
      background:
        selectedTextId === text.id && !previewMode ? 'rgba(64, 158, 255, 0.08)' : undefined,
      outline: selectedTextId === text.id && !previewMode ? '2px solid #409EFF' : undefined,
    }) as React.CSSProperties;

  // 特效样式
  const getTextEffectStyle = (text: TextItem) => {
    let style: React.CSSProperties = {};
    if (text.effect === 'glow') {
      style.textShadow = '0 0 8px #fff, 0 0 16px #409EFF';
    } else if (text.effect === 'highlight') {
      style.background = 'linear-gradient(90deg, #fffbe6 60%, #ffe58f 100%)';
    } else if (text.effect === 'stroke') {
      style.textShadow = '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000';
    }
    return style;
  };

  // 输入框事件
  const onInputMouseDown = () => setIsEditingInput(true);
  const onInputMouseUp = () => setTimeout(() => setIsEditingInput(false), 100);

  // 渲染
  return (
    <Spin spinning={renderLoading} tip="海报生成中...">
      <div className="image-editor-container" ref={containerRef} style={{ position: 'relative' }}>
        <div className="editor-canvas-container">
          <div
            className="editor-canvas"
            ref={canvasRef}
            style={{ width: canvasWidth, height: canvasHeight }}
          >
            {imageUrl && (
              <img
                src={imageUrl}
                className="editor-image"
                ref={editorImageRef}
                onLoad={onImageLoad}
                style={{ width: canvasWidth, height: canvasHeight }}
                alt=""
                draggable={false}
              />
            )}
            {texts.map((text, idx) => (
              <div
                key={text.id}
                ref={(el) => (editorTextRefs.current[idx] = el)}
                className={classNames('editor-text', {
                  selected: selectedTextId === text.id && !previewMode,
                })}
                style={getTextStyle(text)}
                onMouseDown={(e) => !previewMode && !isEditingInput && startDragText(e, text, idx)}
                onClick={(e) => {
                  e.stopPropagation();
                  !previewMode && !isEditingInput && selectText(text.id);
                }}
              >
                {editingTextId === text.id ? (
                  <Input
                    ref={editInputRef}
                    value={text.content}
                    size="small"
                    onChange={(e) => {
                      const val = e.target.value;
                      setTexts((prev) =>
                        prev.map((t) => (t.id === text.id ? { ...t, content: val } : t)),
                      );
                    }}
                    onBlur={confirmEditText}
                    onPressEnter={confirmEditText}
                    onMouseDown={onInputMouseDown}
                    onMouseUp={onInputMouseUp}
                  />
                ) : (
                  <>
                    <span
                      style={getTextEffectStyle(text)}
                      dangerouslySetInnerHTML={{ __html: text.content }}
                      onDoubleClick={() => !previewMode && editText(text.id)}
                    />
                    {selectedTextId === text.id && !previewMode && (
                      <>
                        <CloseOutlined
                          onClick={(e) => {
                            e.stopPropagation();
                            removeText(idx);
                          }}
                          className="el-icon-circle-close delete-btn"
                        />
                        <span
                          className="resize-corner resize-corner-tl"
                          onMouseDown={(e) => startResizeText(e, text, 'tl', idx)}
                          title="拖动缩放"
                        />
                        <span
                          className="resize-corner resize-corner-tr"
                          onMouseDown={(e) => startResizeText(e, text, 'tr', idx)}
                          title="拖动缩放"
                        />
                        <span
                          className="resize-corner resize-corner-bl"
                          onMouseDown={(e) => startResizeText(e, text, 'bl', idx)}
                          title="拖动缩放"
                        />
                        <span
                          className="resize-corner resize-corner-br"
                          onMouseDown={(e) => startResizeText(e, text, 'br', idx)}
                          title="拖动缩放"
                        />
                      </>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="editor-actions-container">
          {/* 文字编辑工具栏 */}
          <div className="text-toolbar">
            <div className="font-list-container">
              {fontList.map((font) => (
                <div
                  key={font.value}
                  className={classNames('font-list-item', {
                    active: selectedText && selectedText.fontFamily === font.value,
                  })}
                  style={{
                    fontFamily: font.value,
                    cursor: 'pointer',
                    padding: '10px 20px',
                    marginBottom: 0,
                    borderRadius: 8,
                    background:
                      selectedText && selectedText.fontFamily === font.value
                        ? 'linear-gradient(90deg, #e6f7ff 60%, #bae7ff 100%)'
                        : 'rgba(255,255,255,0.7)',
                    fontSize: 16,
                    fontWeight:
                      selectedText && selectedText.fontFamily === font.value ? 'bold' : 'normal',
                    boxShadow:
                      selectedText && selectedText.fontFamily === font.value
                        ? '0 2px 12px #91d5ff'
                        : 'none',
                    border:
                      selectedText && selectedText.fontFamily === font.value
                        ? '2px solid #1890ff'
                        : '1px solid #e6e6e6',
                    transition: 'all 0.2s',
                  }}
                  onClick={() => {
                    if (selectedText) {
                      setTexts((prev) =>
                        prev.map((t) =>
                          t.id === selectedText.id ? { ...t, fontFamily: font.value } : t,
                        ),
                      );
                      updateText();
                    }
                  }}
                >
                  {font.label}
                </div>
              ))}
            </div>
            <div className="color-list-container">
              <span className="color-label">颜色：</span>
              {colorList.map((color) => (
                <div
                  key={color}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    border:
                      selectedText && selectedText.color === color
                        ? '2px solid #1890ff'
                        : '1px solid #e6e6e6',
                    background: color,
                    cursor: 'pointer',
                    boxShadow:
                      selectedText && selectedText.color === color ? '0 2px 8px #1890ff44' : 'none',
                    marginRight: 4,
                    display: 'inline-block',
                  }}
                  onClick={() => {
                    if (selectedText) {
                      setTexts((prev) =>
                        prev.map((t) => (t.id === selectedText.id ? { ...t, color } : t)),
                      );
                      updateText();
                    }
                  }}
                />
              ))}
            </div>
            <Button.Group>
              <Button
                type={selectedText && selectedText.bold ? 'primary' : 'default'}
                icon={<span className="el-icon-magic-stick" />}
                onClick={toggleBold}
                size="small"
              >
                清新
              </Button>
              <Button
                type={selectedText && selectedText.underline ? 'primary' : 'default'}
                icon={<span className="el-icon-edit" />}
                onClick={toggleUnderline}
                size="small"
              >
                下划线
              </Button>
            </Button.Group>
            <div className="effect-list-container">
              <span className="effect-label">特效：</span>
              {effectList.map((effect) => (
                <Button
                  key={effect.value}
                  type={
                    selectedText && selectedText.effect === effect.value ? 'primary' : 'default'
                  }
                  size="small"
                  onClick={() => {
                    if (selectedText) {
                      setTexts((prev) =>
                        prev.map((t) =>
                          t.id === selectedText.id ? { ...t, effect: effect.value } : t,
                        ),
                      );
                      updateText();
                    }
                  }}
                  style={{ marginRight: 4 }}
                >
                  {effect.label}
                </Button>
              ))}
            </div>
          </div>
          {/* 操作按钮区 */}
          <div className="editor-actions">
            {!previewMode && (
              <Button className="add-text-btn" type="primary" size="small" onClick={addText}>
                添加文字
              </Button>
            )}
            <Button
              className="preview-btn"
              type="primary"
              size="small"
              style={{ background: '#67c23a', border: 'none' }}
              onClick={togglePreview}
            >
              {previewMode ? '返回编辑' : '确定预览'}
            </Button>
            <Button
              className="save-btn"
              type="primary"
              size="small"
              onClick={saveToImage}
              disabled={!previewMode || renderLoading}
            >
              替换海报
            </Button>
            <Button className="add-text-btn" type="primary" size="small" onClick={resetImage}>
              重置海报
            </Button>
          </div>
        </div>
      </div>
    </Spin>
  );
};

export default ImageDesign;
