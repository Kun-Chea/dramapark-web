import { PageContainer } from '@ant-design/pro-components';
import { ReactNode, useEffect, useState } from 'react';
import { Card, Layout } from 'antd';
import { useModel } from '@umijs/max';
// import { Navigate } from "@umijs/max";

// // 错误原因：withAuth 函数期望接收一个 React 组件类型（FC/Component），
// // 但是传入的是 ReactNode 类型，这两种类型不兼容
// // 修改为接收 React 组件类型
// export const withAuth = (Component: any) => () => {
//   const token = localStorage.getItem('token');
//   if (token) {
//     return <Component />;
//   } else {
//     return <Navigate to="/login" />;
//   }
// }

/**
 * 卡片容器
 * @param param0
 * @returns
 */
interface CardContainerProps {
  children: ReactNode;
  title: string;
}

const CardContainer: React.FC<CardContainerProps> = ({ children, title }) => {
  return (
    <Layout.Content className={`min-h-[calc(100vh-56px)]`}>
      <div className="rounded-md h-full">
        <PageContainer title={title}>{children}</PageContainer>
      </div>
    </Layout.Content>
  );
};

export default CardContainer;
