import { request } from '@umijs/max';

// 获取用户行为日志列表
export function listUserBehaviorLog(params: Record<string, any>) {
    return request('/admin/drama/userBehaviorLog/list', {
        method: 'GET',
        params,
    });
}