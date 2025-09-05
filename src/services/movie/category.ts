import { request } from '@umijs/max';

// 查询分类列表
export function listCategory(query: Record<string, any>) {
    return request('/admin/drama/category/list', {
        method: 'GET',
        params: query
    })
}

// 查询分类详细
export function getCategory(id: number | string) {
    return request('/admin/drama/category/' + id, {
        method: 'GET',
    })
}

// 新增分类
export function addCategory(data: Record<string, any>) {
    return request('/admin/drama/category', {
        method: 'POST',
        data,
    })
}

// 修改分类
export function updateCategory(data: Record<string, any>) {
    return request('/admin/drama/category', {
        method: 'PUT',
        data,
    })
}

// 删除分类
export function delCategory(id: number | string) {
    return request('/admin/drama/category/' + id, {
        method: 'DELETE',
    })
}
//获取所有分类
export function listAllCategory() {
  return request('/admin/drama/category/listAll', {
    method: 'GET',
  });
}

// 获取分类绑定的电影列表
export function listMovieCategoryByCategoryId(categoryId: number) {
  return request(`/admin/drama/movieCategory/list/movies/${categoryId}`, {
    method: 'GET',
  });
}

// 绑定电影
export function bindMovie(categoryId: number, movieIds: number[]) {
  return request(`/admin/drama/movieCategory/bind/movies/${categoryId}`, {
    method: 'PUT',
    data: movieIds,
  });
}



