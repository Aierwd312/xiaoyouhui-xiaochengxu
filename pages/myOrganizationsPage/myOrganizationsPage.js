// myOrganizationsPage.js - API接口和模拟数据

// 模拟数据 - 仅用于开发测试
const mockJoinedOrganizations = [
  {
    id: '1',
    name: '重庆财经校友总会',
    type: '校友总会',
    logoUrl: '/static/images/org_logo_default.png',
    qrCodeUrl: 'https://doc.firstui.cn'
  },
  {
    id: '2',
    name: '北京校友分会',
    type: '地方分会',
    logoUrl: '/static/images/org_logo_default.png',
    qrCodeUrl: 'https://doc.firstui.cn'
  },
  {
    id: '3',
    name: '经济学院校友会',
    type: '院系分会',
    logoUrl: '/static/images/org_logo_default.png',
    qrCodeUrl: 'https://doc.firstui.cn'
  }
];

const mockDiscoverableOrganizations = {
  total: 20,
  data: [
    {
      id: '4',
      name: '上海校友分会',
      type: '地方分会',
      description: '覆盖上海地区的校友联络与活动组织',
      logoUrl: '/static/images/org_logo_default.png',
      status: 'joinable'
    },
    {
      id: '5',
      name: '深圳校友分会',
      type: '地方分会',
      description: '覆盖深圳地区的校友联络与活动组织',
      logoUrl: '/static/images/org_logo_default.png',
      status: 'pending'
    },
    {
      id: '6',
      name: '金融学院校友会',
      type: '院系分会',
      description: '金融学院毕业生校友交流平台',
      logoUrl: '/static/images/org_logo_default.png',
      status: 'joinable'
    },
    {
      id: '7',
      name: '会计学院校友会',
      type: '院系分会',
      description: '会计学院校友互助平台',
      logoUrl: '/static/images/org_logo_default.png',
      status: 'joinable'
    },
    {
      id: '8',
      name: '会计师校友分会',
      type: '专业分会',
      description: '从事会计行业校友的交流平台',
      logoUrl: '/static/images/org_logo_default.png',
      status: 'joinable'
    }
  ]
};

/**
 * 获取用户已加入的组织列表
 * @returns {Promise<Array>} 已加入的组织列表数组
 */
export const getMyJoinedOrganizations = () => {
  return new Promise((resolve, reject) => {
    // 实际开发中替换为真实接口调用
    setTimeout(() => {
      // 模拟网络请求
      try {
        // 模拟成功响应
        resolve(mockJoinedOrganizations);
      } catch (error) {
        console.error('获取已加入组织列表失败:', error);
        reject(error);
      }
    }, 500); // 模拟网络延迟
  });
};

/**
 * 获取可发现的组织列表
 * @param {Object} params 查询参数
 * @param {number} params.page 页码
 * @param {number} params.limit 每页数量
 * @param {string} params.keyword 搜索关键词
 * @param {string} params.category 筛选类别
 * @returns {Promise<Object>} 返回带有total和data的对象
 */
export const getDiscoverableOrganizations = ({ page = 1, limit = 10, keyword = '', category = '' }) => {
  return new Promise((resolve, reject) => {
    // 实际开发中替换为真实接口调用
    setTimeout(() => {
      try {
        // 模拟筛选和分页
        let filteredData = [...mockDiscoverableOrganizations.data];
        
        // 关键词筛选
        if (keyword) {
          filteredData = filteredData.filter(org => 
            org.name.includes(keyword) || 
            org.type.includes(keyword) || 
            (org.description && org.description.includes(keyword))
          );
        }
        
        // 类别筛选
        if (category) {
          const categoryMap = {
            'main': '校友总会',
            'local': '地方分会',
            'college': '院系分会',
            'major': '专业分会'
          };
          filteredData = filteredData.filter(org => org.type === categoryMap[category]);
        }
        
        // 分页处理
        const startIdx = (page - 1) * limit;
        const endIdx = page * limit;
        const pageData = filteredData.slice(startIdx, endIdx);
        
        resolve({
          total: filteredData.length,
          data: pageData
        });
      } catch (error) {
        console.error('获取可发现组织列表失败:', error);
        reject(error);
      }
    }, 500); // 模拟网络延迟
  });
};

/**
 * 申请加入组织
 * @param {string} organizationId 要加入的组织ID
 * @returns {Promise<Object>} 申请结果
 */
export const requestToJoinOrganization = (organizationId) => {
  return new Promise((resolve, reject) => {
    // 实际开发中替换为真实接口调用
    setTimeout(() => {
      try {
        // 模拟成功响应
        resolve({
          success: true,
          message: '申请已提交',
          status: 'pending'
        });
      } catch (error) {
        console.error('申请加入组织失败:', error);
        reject(error);
      }
    }, 800); // 模拟网络延迟
  });
};

/**
 * 保存二维码图片到相册
 * @param {string} url 图片URL或本地路径
 * @returns {Promise<boolean>} 是否保存成功
 */
export const saveImageToPhotosAlbum = async (url) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 获取授权
      const settingRes = await uni.getSetting();
      if (!settingRes.authSetting['scope.writePhotosAlbum']) {
        await uni.authorize({ scope: 'scope.writePhotosAlbum' }).catch(err => {
          uni.showModal({
            title: '提示',
            content: '需要您授权保存图片到相册',
            success: (res) => {
              if (res.confirm) {
                uni.openSetting();
              }
            }
          });
          throw new Error('未授权保存图片');
        });
      }
      
      // 处理图片来源
      let localPath = url;
      if (url.startsWith('http')) {
        uni.showLoading({ title: '下载图片中...' });
        try {
          const downloadRes = await uni.downloadFile({ url });
          if (downloadRes.statusCode === 200) {
            localPath = downloadRes.tempFilePath;
          } else {
            throw new Error('下载图片失败');
          }
        } finally {
          uni.hideLoading();
        }
      }
      
      // 保存到相册
      await uni.saveImageToPhotosAlbum({ filePath: localPath });
      uni.showToast({
        title: '保存成功',
        icon: 'success'
      });
      resolve(true);
    } catch (error) {
      console.error('保存图片失败:', error);
      uni.showToast({
        title: '保存失败，请检查授权',
        icon: 'none'
      });
      resolve(false);
    }
  });
};
