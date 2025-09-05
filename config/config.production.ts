import { defineConfig } from "@umijs/max";

const prodUrl = 'https://data.dramapark.cc' // 后端接口

export default defineConfig({
    define: {
        APP_ENV: process.env.APP_ENV_PRODUCTION,
    },
    layout: {
        title: "DramPark",
    },
    proxy: {
        '/admin/': {
            // 要代理的地址
            target: prodUrl,
            // 配置了这个可以从 http 代理到 https
            // 依赖 origin 的功能可能需要这个，比如 cookie
            changeOrigin: true,
            pathRewrite: { '^/admin': '' },
        },
        '/profile/avatar/': {
            target: prodUrl,
            changeOrigin: true,
        }
    },
});
