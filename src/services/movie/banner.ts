import { request } from '@umijs/max';

// 获取轮播图数据列表
export function getPageList(query: Record<string, any>) {
  return request('/admin/drama/banner/list', {
    method: 'GET',
    params: query,
  });
}

// 新增轮播图数据
export function addForm(data: Record<string, any>) {
  return request('/admin/drama/banner', {
    method: 'POST',
    data,
  });
}

// 修改轮播图数据
export function editForm(data: Record<string, any>) {
  return request('/admin/drama/banner', {
    method: 'PUT',
    data,
  });
}

// 删除轮播图数据
export function deleteForm(ids: number[] | string[]) {
  return request(`/admin/drama/banner/${ids}`, {
    method: 'DELETE',
  });
}

// 获取轮播图数据详细信息
export function detailForm(id: number | string) {
  return request(`/admin/drama/banner/${id}`, {
    method: 'GET',
  });
}

// 导出轮播图数据
export function exportForm(data: Record<string, any>) {
  return request('/admin/drama/banner/export', {
    method: 'POST',
    data,
  });
}
