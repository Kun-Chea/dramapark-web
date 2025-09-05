import { downLoadXlsx } from '@/utils/downloadfile';
import { request } from '@umijs/max';


// 获取用户列表
export function listAppUser(params: Record<string, any>) {
    return request('/admin/system/appUser/list', {
        method: 'GET',
        params,
    });
}

// 导出定时任务调度
export function exportAppUser(params?: Record<string, any>) {
    return downLoadXlsx(`/admin/system/appUser/export`, { params }, `appUser_${new Date().getTime()}.xlsx`);
}