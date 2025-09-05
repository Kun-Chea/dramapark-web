// drama/page-config
import { request } from '@umijs/max';

//新增页面配置
export const addPageConfig = (data: Record<string, any>) => {
    return request(`/admin/drama/page-config`, {
        method: 'POST',
        data,
    });
};

// 修改页面配置
export const updatePageConfig = (data: Record<string, any>) => {
    return request(`/admin/drama/page-config`, {
        method: 'PUT',
        data,
    });
};

// 查询页面配置
export const getPageConfig = (params: Record<string, any>) => {
    return request(`/admin/drama/page-config/list`, {
        method: 'GET',
        params,
    });
};


//获取详情
export const getPageConfigDetail = (id: string) => {
    return request(`/admin/drama/page-config/${id}`, {
        method: 'GET',
    });
};

//删除页面配置
export const deletePageConfig = (ids: string[]) => {
    return request(`/admin/drama/page-config/${ids}`, {
        method: 'DELETE',
    });
};