// @ts-ignore
/* eslint-disable */
import { request } from '@umijs/max';

/** 此处后端没有提供注释 GET /admin/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/admin/notices', {
    method: 'GET',
    ...(options || {}),
  });
}
