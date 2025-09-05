import { request } from '@umijs/max';

//新增短剧配置
export function addMovieConfig(data: Record<string, any>) {
    return request('/admin/drama/config', {
        method: 'POST',
        data,
    })
}

export function updateMovieConfig(data: Record<string, any>) {  
    return request('/admin/drama/config', {
        method: 'PUT',
        data,
    })
}

export function getMovieConfig(id: number | string) {
    return request('/admin/drama/config/' + id, {
        method: 'GET',
    })
}

// 查询短剧配置列表
export function listMovieConfig(query: Record<string, any>) {
    return request('/admin/drama/config/list', {
        method: 'GET',
        params: query,
    })
}

// 批量删除短剧配置
export function delMovieConfig(ids: number[] | string[]) {
    return request(`/admin/drama/config/${ids}`, {
        method: 'DELETE',
    })
}