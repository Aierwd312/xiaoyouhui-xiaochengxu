// 应用全局配置
const config = {
   //cloud后台网关地址
   baseUrl: 'http://10.155.10.148:8090/prod-api',
   // 应用信息
   appInfo: {
     // 应用名称
     name: "ruoyi-app-vue3",
     // 应用版本
     version: "1.1.0",
     // 应用logo
     logo: "/static/logo.png",
     // 官方网站
     site_url: "http://ruoyi.vip",
     // 政策协议
     agreements: [{
         title: "隐私政策",
         url: "https://ruoyi.vip/protocol.html"
       },
       {
         title: "用户服务协议",
         url: "https://ruoyi.vip/protocol.html"
       }
     ]
   }
 }

 export default config