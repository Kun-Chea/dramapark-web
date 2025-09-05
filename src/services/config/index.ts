import { request } from '@umijs/max';

// 获取大包语言列表
export function getLanguageList(query: Record<string, any>) {
  return request('/admin/drama/languageConfig/list', {
    method: 'GET',
    params: query,
  });
}