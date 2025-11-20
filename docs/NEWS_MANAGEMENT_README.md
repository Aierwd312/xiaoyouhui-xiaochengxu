# 新闻管理功能说明

## 功能概述

在"母校资讯"模块中新增了完整的新闻管理功能，包括：
- 导出新闻管理列表
- 获取新闻管理详细信息
- 新闻列表展示
- 新闻搜索功能
- 新闻详情查看

## API接口

### 1. 导出新闻管理列表
- **接口地址**: `POST /core/news/export`
- **请求参数**: 
  ```javascript
  {
    id: 1,
    title: "",
    backgroundImage: "",
    url: "",
    createdAt: "2025-11-03 15:34:51",
    updatedAt: "2025-11-03 15:34:51",
    createBy: "",
    createTime: "2025-11-03 15:34:51",
    updateBy: "",
    updateTime: "2025-11-03 15:34:51",
    remark: "",
    "params.KEY": ""
  }
  ```

### 2. 获取新闻详细信息
- **接口地址**: `GET /core/news/{id}`
- **请求参数**: 新闻ID
- **响应数据**: 新闻完整信息

### 3. 获取新闻列表
- **接口地址**: `GET /core/news/list`
- **请求参数**: 
  ```javascript
  {
    pageNum: 1,
    pageSize: 10,
    title: "搜索关键词"
  }
  ```

## 文件结构

```
├── api/
│   └── news.js                    # 新闻管理API接口
├── pages/
│   ├── schoolNewsPage/
│   │   └── schoolNewsPage.vue     # 母校资讯页面（已完善）
│   └── newsDetailPage/
│       └── newsDetailPage.vue     # 新闻详情页面（新增）
├── test/
│   └── news-api-test.js          # API测试文件
└── docs/
    └── NEWS_MANAGEMENT_README.md  # 本说明文档
```

## 功能特性

### 母校资讯页面 (`schoolNewsPage.vue`)
1. **新闻列表展示**
   - 支持分页加载
   - 显示新闻标题、发布时间、发布人、摘要
   - 支持新闻封面图片展示

2. **搜索功能**
   - 按新闻标题搜索
   - 实时搜索结果更新

3. **导出功能**
   - 一键导出新闻管理列表
   - 支持按搜索条件导出

4. **交互功能**
   - 点击新闻项跳转到详情页面
   - 下拉刷新
   - 上拉加载更多

### 新闻详情页面 (`newsDetailPage.vue`)
1. **详情展示**
   - 完整的新闻标题和内容
   - 新闻元信息（发布时间、发布人、更新时间）
   - 新闻封面图片
   - 相关链接

2. **操作功能**
   - 分享新闻
   - 返回上一页
   - 打开外部链接

## 使用方法

### 1. 从首页进入
1. 在首页点击"母校资讯"功能项
2. 进入新闻列表页面

### 2. 浏览新闻
1. 在新闻列表中浏览所有新闻
2. 使用搜索框搜索特定新闻
3. 点击新闻项查看详情

### 3. 导出新闻
1. 在新闻列表页面点击"导出列表"按钮
2. 系统将导出当前搜索条件下的所有新闻

### 4. 查看详情
1. 点击任意新闻项
2. 进入新闻详情页面
3. 查看完整的新闻信息

## 技术实现

### API调用
```javascript
import { getNewsList, getNewsDetail, exportNewsList } from '@/api/news'

// 获取新闻列表
const response = await getNewsList({
  pageNum: 1,
  pageSize: 10,
  title: '搜索关键词'
})

// 获取新闻详情
const detail = await getNewsDetail(newsId)

// 导出新闻列表
const exportResult = await exportNewsList({
  title: '搜索关键词'
})
```

### 页面跳转
```javascript
// 跳转到新闻详情页面
uni.navigateTo({
  url: `/pages/newsDetailPage/newsDetailPage?id=${newsId}`
})
```

## 样式设计

- **主色调**: #004299（与应用整体风格保持一致）
- **辅助色**: 
  - 绿色 #52c41a（导出按钮）
  - 蓝色 #1890ff（刷新按钮）
  - 灰色 #666666（返回按钮）
- **布局**: 响应式设计，适配不同屏幕尺寸
- **交互**: 平滑的动画效果和用户反馈

## 错误处理

1. **网络错误**: 显示友好的错误提示
2. **数据为空**: 显示"暂无数据"状态
3. **加载失败**: 提供重试机制
4. **参数错误**: 自动处理和容错

## 测试

使用 `test/news-api-test.js` 文件进行API功能测试：

```javascript
import { runAllTests, testWithMockData } from '@/test/news-api-test'

// 运行完整测试
await runAllTests()

// 使用模拟数据测试
testWithMockData()
```

## 注意事项

1. **权限控制**: 确保用户已登录才能访问新闻功能
2. **数据安全**: 所有API调用都包含必要的身份验证
3. **性能优化**: 实现了分页加载和图片懒加载
4. **兼容性**: 支持微信小程序和H5平台

## 后续优化建议

1. 添加新闻收藏功能
2. 支持新闻评论和点赞
3. 增加新闻分类筛选
4. 实现新闻推送通知
5. 添加新闻阅读统计
