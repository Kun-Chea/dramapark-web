import { request } from '@umijs/max';

// 获取数据列表
export function getPageList(query: Record<string, any>) {
  return request('/admin/drama/app/list', {
    method: 'GET',
    params: query,
  });
}

// 新增数据
export function addForm(data: Record<string, any>) {
  return request('/admin/drama/app', {
    method: 'POST',
    data,
  });
}

// 修改数据
export function editForm(data: Record<string, any>) {
  return request('/admin/drama/app', {
    method: 'PUT',
    data,
  });
}

// 删除数据
export function deleteForm(ids: number[] | string[]) {
  return request(`/admin/drama/app/${ids}`, {
    method: 'DELETE',
  });
}

// 获取数据详细信息
export function detailForm(id: number | string) {
  return request(`/admin/drama/app/${id}`, {
    method: 'GET',
  });
}

// 导出数据
export function exportForm(data: Record<string, any>) {
  return request('/admin/drama/app/export', {
    method: 'POST',
    data,
  });
}
