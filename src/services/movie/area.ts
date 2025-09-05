import { request } from '@umijs/max';

// 新增短剧地区
export function addArea(data: Record<string, any>) {
    return request('/admin/drama/area', {
        method: 'POST',
        data,
    })
}

// 修改短剧地区
export function updateArea(data: Record<string, any>) {
    return request('/admin/drama/area', {
        method: 'PUT',
        data,
    })
}

// 查询短剧地区列表
export function listArea(query: Record<string, any>) {  
    return request('/admin/drama/area/list', {
        method: 'GET',
        params: query
    })
}

// 批量删除短剧地区
export function delAreaBatch(ids: number[] | string[]) {
    return request(`/admin/drama/area/${ids}`, {
        method: 'DELETE',
    })
}

// 查询短剧地区详细
export function getArea(id: number | string) {
    return request('/admin/drama/area/' + id, {
        method: 'GET',
    })
}