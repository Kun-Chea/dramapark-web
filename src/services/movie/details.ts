import { request } from '@umijs/max';
// 查询短剧列表
export function listMovie(query: Record<string, any>) {
  return request('/admin/drama/movie/list', {
    method: 'GET',
    params: query,
  });
}

// 查询短剧详细
export function getMovie(id: number | string) {
  return request('/admin/drama/movie/' + id, {
    method: 'GET',
  });
}

// 查询所有短剧
export function listAllMovie() {
  return request('/admin/short_center/movie/list_all', {
    method: 'GET',
  });
}

// 查询短剧剧集
export function listEpisode(id: number | string) {
  return request('/admin/drama/video/getByMovieId/' + id, {
    method: 'GET',
  });
}

// 新增短剧
export function addMovie(data: Record<string, any>) {
  return request('/admin/drama/movie', {
    method: 'POST',
    data,
  });
}

// 修改短剧
export function updateMovie(data: Record<string, any>) {
  return request('/admin/drama/movie', {
    method: 'PUT',
    data,
  });
}

// 删除短剧
export function delMovie(id: number | string) {
  return request('/admin/drama/movie/' + id, {
    method: 'DELETE',
  });
}

// 导出短剧
export function exportVideo(data: Record<string, any>) {
  return request('/admin/drama/movie/export', {
    method: 'POST',
    data,
  });
}

// 添加归属
export function addMovieApps(data: Record<string, any>) {
  return request('/admin/drama/movieApp', {
    method: 'POST',
    data,
  });
}

// 查询短剧归属
export function listMovieApp(query: Record<string, any>) {
  return request('/admin/drama/movieApp/list', {
    method: 'GET',
    params: query,
  });
}

// 删除短剧归属
export function delMovieApp(ids: number | string) {
  return request(`/admin/drama/movieApp/${ids}`, {
    method: 'DELETE',
  });
}

// 检查短剧文件完整性接口 -- movieId
export function checkMovieFile(query: Record<string, any>) {
  return request('/admin/short_center/movie/checkMovieFile', {
    method: 'GET',
    params: query,
  });
}

// 查询短剧多语言
export function listLanguageConfig(movieId: number | string) {
  return request(`/admin/drama/languageConfig/getAccessLanguageConfig/${movieId}`, {
    method: 'GET'
  });
}

// 翻译短剧多语言
export function translateMovieI18n(data: Record<string, any>) {
  return request('/admin/drama/movieI18n/translateMovieI18n', {
    method: 'POST',
    data,
  });
}

// 获取翻译结果
export function getMovieI18nList(query: Record<string, any>) {
  return request('/admin/drama/movieI18n/getMovieI18nList', {
    method: 'GET',
    params: query,
  });
}

// 查询翻译结果
export function queryTranslateByMovieId(query: Record<string, any>) {
  return request('/admin/drama/movieI18n/getMovieI18nList', {
    method: 'GET',
    params: query,
  });
}
// 拒绝翻译结果
export function refuseMovieI18nState(data: Record<string, any>) {
  return request('/admin/drama/movieI18n/refuseMovieI18nState', {
    method: 'POST',
    data,
  });
}


//修改影片翻译
export function updateMovieI18n(data: Record<string, any>) {
  return request('/admin/drama/movieI18n', {
    method: 'PUT',
    data,
  });
}

//通过或拒绝
export function updateMovieI18nState(data: Record<string, any>) {
  return request('/admin/drama/movieI18n/updateMovieI18nState', {
    method: 'POST',
    data,
  });
}

// 删除翻译
export function deleteMovieI18n(params: Record<string, any>) {
  return request('/admin/drama/movieI18n/delete', {
    method: 'DELETE',
    params,
  });
}

// 新增或保存短剧扣费规则
export function saveMovieCoinRule(data: Record<string, any>) {
  return request('/admin/drama/movieCoinRule/saveMovieCoinRule', {
    method: 'POST',
    data,
  });
}

// 新增广告规则
export function saveMovieAdRule(data: Record<string, any>) {
  return request('/admin/drama/rule', {
    method: 'POST',
    data,
  });
}

// 修改广告规则
export function editMovieAdRule(data: Record<string, any>) {
  return request('/admin/drama/rule', {
    method: 'PUT',
    data,
  });
}

// 广告规则详情
export function detailMovieAdRule(id: Record<string, any>) {
  return request(`/admin/drama/rule/${id}`, {
    method: 'GET',
  });
}

// 获取广告规则列表
export function getRuleList(query: Record<string, any>) {
  return request('/admin/drama/rule/list', {
    method: 'GET',
    params: query,
  });
}

// 根据指定APP下关联的短剧
export function getMovieByAppList(query: Record<string, any>) {
  return request('/admin/drama/movie/queryByAppId', {
    method: 'GET',
    params: query,
  });
}
