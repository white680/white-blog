/**
 * 定义基本接口地址
 */
let baseUrl = "";
let baseImgUrl = "";

if (process.env.NODE_ENV == 'development') {
    // 开发环境下使用的接口地址
    baseUrl = 'http://127.0.0.1/3000';
    baseImgUrl = 'http://localhost:3000/files'
} else {
    // 打包后，在服务器上使用的环境，也就是正式环境
    baseUrl = 'http://127.0.0.1/3000';
    baseImgUrl = 'http://localhost:3000/files'
}

export {
    baseUrl,
    baseImgUrl
}