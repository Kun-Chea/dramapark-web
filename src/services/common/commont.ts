import { request } from '@umijs/max';


/**
 * 通用上传接口
 */
export function uploadFile(data: Record<string, any>) {
    return request('/admin/drama/file/upload', {
        method: 'POST',
        data,
    })
}


        