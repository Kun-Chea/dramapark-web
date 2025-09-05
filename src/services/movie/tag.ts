import { request } from '@umijs/max';

// 查询标签列表
export function listTag(query: Record<string, any>) {
    return request('/admin/system/tag/list', {
        method: 'GET',
        params: query
    })
}

// 查询标签详细
export function getTag(tagId: string) {
    return request('/admin/system/tag/' + tagId, {
        method: 'GET',
    })
}

// 新增标签
export function addTag(data: Record<string, any>) {
    return request('/admin/system/tag', {
        method: 'POST',
        data,
    })
}

// 修改标签
export function updateTag(data: Record<string, any>) {
    return request('/admin/system/tag', {
        method: 'PUT',
        data,
    })
}

// 删除标签
export function delTag(tagId: string) {
    return request('/admin/system/tag/' + tagId, {
        method: 'DELETE',
    })
} 

// 查询标签绑定的电影
export function listTagMovies(tagId: number) {
  return request(`/admin/drama/movieTag/list/movies/${tagId}`, {
    method: 'GET',
  });
}

// 绑定电影
export function bindMovies(tagId: number, movieIds: number[]) {
  return request(`/admin/drama/movieTag/bind/movies/${tagId}`, {
    method: 'PUT',
    data: movieIds,
  });
}
