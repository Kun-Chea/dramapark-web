import { request } from '@umijs/max';

/** 新增短剧关联分类 */
export function postMovieCategory(data: Record<string, any>) {
  return request('/admin/drama/movieCategory', {
    method: 'POST',
    data,
  });
}


/** 修改短剧关联分类 */
export function putMovieCategory(data: Record<string, any>) {
  return request('/admin/drama/movieCategory', {
    method: 'PUT',
    data,
  });
}

/** 获取短剧关联分类列表 */
export function getMovieCategoryList(params: Record<string, any>) {
  return request('/admin/drama/movieCategory/list', {
    method: 'GET',
    params,
  });
}

/** 删除短剧关联分类 */
export function deleteMovieCategory(ids: number[]) {
  return request(`/admin/drama/movieCategory/${ids}`, {
    method: 'DELETE',
  });
}

/** 获取短剧关联分类详细信息 */
export function getMovieCategoryDetail(id: string) {
  return request(`/admin/drama/movieCategory/${id}`, {
    method: 'GET',
  });
}





