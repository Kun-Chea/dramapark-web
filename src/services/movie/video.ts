import { request } from '@umijs/max';
// 获取剧集列表
export function listVideo(query: Record<string, any>) {
    return request('/admin/drama/video/list', {
      method: 'GET',
      params: query
    })
  }
  
  // 获取剧集详细信息   
  export function getVideo(id: string) {
    return request('/admin/drama/video/' + id, {
      method: 'GET',
    })
  }
  
  // 新增剧集
  export function addVideo(data: Record<string, any>) {
    return request('/admin/drama/video', {
      method: 'POST',
      data,
    })
  }
  
  // 修改剧集
  export function updateVideo(data: Record<string, any>) {
    return request('/admin/drama/video', {
      method: 'PUT',
      data,
    })
  }
  
  // 删除剧集
  export function delVideo(id: string) {
    return request('/admin/drama/video/' + id, {
      method: 'DELETE',
    })
  }
  
  // 导出剧集
  export function exportVideo(data: Record<string, any>) {
    return request('/admin/drama/video/export', {
      method: 'POST',
      data,
    })
  }