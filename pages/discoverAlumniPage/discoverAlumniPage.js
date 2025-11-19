// discoverAlumniPage.js
// 这个文件主要用于处理"发现校友"页面的额外逻辑，可以按需扩展

// 模拟学院数据
export const departmentList = [
    { code: '01', name: '计算机学院' },
    { code: '02', name: '电子工程学院' },
    { code: '03', name: '机械工程学院' },
    { code: '04', name: '经济管理学院' },
    { code: '05', name: '医学院' },
    { code: '06', name: '法学院' },
    { code: '07', name: '文学院' },
    { code: '08', name: '外国语学院' },
    { code: '09', name: '数学学院' },
    { code: '10', name: '物理学院' }
];

// 模拟入学类型数据
export const schoolTypeList = [
    { code: '01', name: '本科生' },
    { code: '02', name: '硕士研究生' },
    { code: '03', name: '博士研究生' },
    { code: '04', name: '教职工' },
    { code: '05', name: '校友' }
];

// 模拟行业数据
export const industryList = [
    { code: '01', name: '信息技术' },
    { code: '02', name: '金融' },
    { code: '03', name: '教育' },
    { code: '04', name: '医疗健康' },
    { code: '05', name: '制造业' },
    { code: '06', name: '互联网' },
    { code: '07', name: '文化创意' },
    { code: '08', name: '法律' },
    { code: '09', name: '公共服务' },
    { code: '10', name: '其他' }
];

// 模拟搜索结果数据
export const mockSearchResults = {
    total: 5,
    list: [
        {
            id: '001',
            name: '张三',
            avatar: '/static/images/avatar/avatar1.png',
            department: '计算机学院',
            enrollYear: '2015',
            residence: '北京市海淀区',
            industry: '互联网',
            company: '腾讯科技',
            distance: '2.5公里'
        },
        {
            id: '002',
            name: '李四',
            avatar: '/static/images/avatar/avatar2.png',
            department: '经济管理学院',
            enrollYear: '2016',
            residence: '上海市浦东新区',
            industry: '金融',
            company: '中国银行',
            distance: '4.8公里'
        },
        {
            id: '003',
            name: '王五',
            avatar: '/static/images/avatar/avatar3.png',
            department: '法学院',
            enrollYear: '2017',
            residence: '广州市天河区',
            industry: '法律',
            company: '广东正大律师事务所',
            distance: '12.3公里'
        },
        {
            id: '004',
            name: '赵六',
            avatar: '/static/images/avatar/avatar4.png',
            department: '医学院',
            enrollYear: '2014',
            residence: '深圳市南山区',
            industry: '医疗健康',
            company: '深圳市第一人民医院',
            distance: '18.6公里'
        },
        {
            id: '005',
            name: '钱七',
            avatar: '/static/images/avatar/avatar5.png',
            department: '外国语学院',
            enrollYear: '2016',
            residence: '杭州市西湖区',
            industry: '教育',
            company: '杭州外国语学校',
            distance: '25.1公里'
        }
    ]
};

// 模拟同学数据
export const mockClassmatesData = {
    total: 9,
    list: [
        {
            id: '101',
            name: '陈一',
            avatar: '/static/images/avatar/avatar6.png',
            department: '计算机学院',
            enrollYear: '2018',
            specialty: '软件工程'
        },
        {
            id: '102',
            name: '林二',
            avatar: '/static/images/avatar/avatar7.png',
            department: '计算机学院',
            enrollYear: '2018',
            specialty: '人工智能'
        },
        {
            id: '103',
            name: '黄三',
            avatar: '/static/images/avatar/avatar8.png',
            department: '计算机学院',
            enrollYear: '2018',
            specialty: '网络工程'
        },
        {
            id: '104',
            name: '杨四',
            avatar: '/static/images/avatar/avatar9.png',
            department: '计算机学院',
            enrollYear: '2018',
            specialty: '信息安全'
        },
        {
            id: '105',
            name: '周五',
            avatar: '/static/images/avatar/avatar10.png',
            department: '计算机学院',
            enrollYear: '2018',
            specialty: '数据科学'
        },
        {
            id: '106',
            name: '吴六',
            avatar: '/static/images/avatar/avatar11.png',
            department: '计算机学院',
            enrollYear: '2018',
            specialty: '软件工程'
        },
        {
            id: '107',
            name: '郑七',
            avatar: '/static/images/avatar/avatar12.png',
            department: '计算机学院',
            enrollYear: '2018',
            specialty: '人工智能'
        },
        {
            id: '108',
            name: '冯八',
            avatar: '/static/images/avatar/avatar13.png',
            department: '计算机学院',
            enrollYear: '2018',
            specialty: '网络工程'
        },
        {
            id: '109',
            name: '朱九',
            avatar: '/static/images/avatar/avatar14.png',
            department: '计算机学院',
            enrollYear: '2018',
            specialty: '信息安全'
        }
    ]
};

// 处理校友搜索请求
export const searchAlumni = (params) => {
    return new Promise((resolve, reject) => {
        // 在实际开发中，这里应该是API请求
        // 模拟异步请求
        setTimeout(() => {
            // 模拟校友数据
            const mockData = mockSearchResults;
            
            resolve(mockData);
        }, 1500);
    });
};

// 获取用户位置
export const getUserLocation = () => {
    return new Promise((resolve, reject) => {
        uni.getLocation({
            type: 'gcj02',
            success: (res) => {
                resolve({
                    latitude: res.latitude,
                    longitude: res.longitude
                });
            },
            fail: (err) => {
                reject(err);
            }
        });
    });
};

// 存储搜索历史
export const saveSearchHistory = (searchParams) => {
    try {
        // 获取现有历史
        const history = uni.getStorageSync('alumni_search_history') || [];
        
        // 添加新记录（实际应用中可能需要去重处理）
        history.unshift({
            id: Date.now(),
            params: searchParams,
            time: new Date().toISOString()
        });
        
        // 仅保留最近10条记录
        const newHistory = history.slice(0, 10);
        
        // 保存回存储
        uni.setStorageSync('alumni_search_history', newHistory);
        
        return true;
    } catch (e) {
        console.error('保存搜索历史失败', e);
        return false;
    }
};

// 格式化入校类型数据 - 修正为字符串数组或对象数组
export const formatSchoolTypeData = () => {
    // 方式1：使用简单的字符串数组（推荐，更简单的处理方式）
    return schoolTypeList.map(item => item.name);
    
    // 方式2：如果需要对象数组格式
    // return schoolTypeList.map(item => {
    //     return { text: item.name, value: item.code };
    // });
};

// 格式化院系数据
export const formatDepartmentData = () => {
    const years = ['全部'].concat(['2023', '2022', '2021', '2020', '2019', '2018', '2017', '2016']);
    const departments = ['全部'].concat(departmentList.map(item => item.name));
    
    return [years, departments];
};

// 格式化居住地数据（三级联动）
export const formatResidenceData = () => {
    // 这里简化处理，实际开发中需要使用完整的地区数据
    return [
        {
            text: '中国',
            value: 'china',
            children: [
                {
                    text: '北京市',
                    value: 'beijing',
                    children: [
                        { text: '海淀区', value: 'haidian' },
                        { text: '朝阳区', value: 'chaoyang' },
                        { text: '西城区', value: 'xicheng' }
                    ]
                },
                {
                    text: '上海市',
                    value: 'shanghai',
                    children: [
                        { text: '浦东新区', value: 'pudong' },
                        { text: '徐汇区', value: 'xuhui' },
                        { text: '黄浦区', value: 'huangpu' }
                    ]
                },
                {
                    text: '广东省',
                    value: 'guangdong',
                    children: [
                        { text: '广州市', value: 'guangzhou' },
                        { text: '深圳市', value: 'shenzhen' },
                        { text: '珠海市', value: 'zhuhai' }
                    ]
                }
            ]
        },
        {
            text: '美国',
            value: 'usa',
            children: [
                {
                    text: '加利福尼亚州',
                    value: 'california',
                    children: [
                        { text: '洛杉矶', value: 'la' },
                        { text: '旧金山', value: 'sf' },
                        { text: '圣地亚哥', value: 'sd' }
                    ]
                },
                {
                    text: '纽约州',
                    value: 'newyork',
                    children: [
                        { text: '纽约市', value: 'nyc' },
                        { text: '布法罗', value: 'buffalo' },
                        { text: '罗切斯特', value: 'rochester' }
                    ]
                }
            ]
        }
    ];
};

// 格式化行业数据 - 修正为字符串数组或对象数组
export const formatIndustryData = () => {
    // 方式1：使用简单的字符串数组（推荐，更简单的处理方式）
    return industryList.map(item => item.name);
    
    // 方式2：如果需要对象数组格式
    // return industryList.map(item => {
    //     return { text: item.name, value: item.code };
    // });
};
