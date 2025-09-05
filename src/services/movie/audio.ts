import { request } from '@umijs/max';


//新增音讯
export function addAudio(data: Record<string, any>) {   
    return request('/admin/drama/audio', {
        method: 'POST',
        data,
    })
}

//修改音讯
export function updateAudio(data: Record<string, any>) {
    return request('/admin/drama/audio', {    
        method: 'PUT',
        data,
    })
}

//查询音讯列表
export function listAudio(query: Record<string, any>) {
    return request('/admin/drama/audio/list', {
        method: 'GET',
        params: query,
    })
}

//删除音讯
export function deleteAudio(ids: number[] | string[]) {
    return request(`/admin/drama/audio/${ids}`, {
        method: 'DELETE',
    })
}

//查询音讯详情
export function getAudio(id: number | string) {
    return request(`/admin/drama/audio/${id}`, {
        method: 'GET',
    })
}