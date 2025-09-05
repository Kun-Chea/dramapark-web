import { defineConfig } from "@umijs/max";
// const devUrl = `http://localhost:8080` // 后端接口
const devUrl = `https://test.dramapark.cc`
export default defineConfig({
    define: {
        APP_ENV: process.env.APP_ENV_DEVELOP,
    },
    layout: {
        title: "DramPark开发环境",
    },
    proxy: {
        '/admin/': {
            // 要代理的地址
            target: devUrl,
            changeOrigin: true,
            pathRewrite: { '^/admin': '' },
        },
        '/profile/avatar/': {
            target: devUrl,
            changeOrigin: true,
        }
    },
});
