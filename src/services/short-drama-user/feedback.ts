import { request } from '@umijs/max';


//新增用户反馈
export function addFeedback(data: Record<string, any>) {
    return request('/admin/drama/feedback', {
        method: 'POST',
        data,
    })
}

//查询用户反馈列表
export function listFeedback(query: Record<string, any>) {
    return request('/admin/drama/feedback/list', {
        method: 'GET',
        params: query,
    })
}

//删除用户反馈
export function deleteFeedback(ids: number[]) {
    return request(`/admin/drama/feedback/${ids}`, {
        method: 'DELETE',
    })
}
