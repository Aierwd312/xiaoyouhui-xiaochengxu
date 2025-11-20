// myFriendsPage.js
// 这个文件主要处理"我的好友"页面的数据和逻辑

import { getStudentInfo, getStudentsList, getFriendsList, addFriend, removeFriend, getFriendRequests, handleFriendRequest, searchUsers } from '@/api/friends'

// 获取学生详细信息
export const getStudentDetail = async (studentId) => {
    try {
        const response = await getStudentInfo(studentId);
        return response.data || {};
    } catch (error) {
        console.error('获取学生详细信息失败:', error);
        throw error;
    }
};

// 查询校友数据列表
export const getAlumniList = async (queryParams = {}) => {
    try {
        const response = await getStudentsList(queryParams);
        return {
            total: response.total || 0,
            list: response.rows || [],
            code: response.code || 200,
            message: response.msg || ''
        };
    } catch (error) {
        console.error('查询校友数据列表失败:', error);
        throw error;
    }
};

// 构建校友查询参数
export const buildAlumniQueryParams = ({
    id = '',
    name = '',
    academy = '',
    classname = '',
    studentNumber = '',
    grade = '',
    idCard = '',
    phone = '',
    email = '',
    industry = '',
    company = '',
    userId = null,
    createdAt = '',
    updatedAt = '',
    createBy = '',
    createTime = '',
    updateBy = '',
    updateTime = '',
    remark = '',
    params = {}
} = {}) => {
    const queryParams = {};
    
    // 只添加非空参数
    if (id) queryParams.id = id;
    if (name) queryParams.name = name;
    if (academy) queryParams.academy = academy;
    if (classname) queryParams.classname = classname;
    if (studentNumber) queryParams.studentNumber = studentNumber;
    if (grade) queryParams.grade = grade;
    if (idCard) queryParams.idCard = idCard;
    if (phone) queryParams.phone = phone;
    if (email) queryParams.email = email;
    if (industry) queryParams.industry = industry;
    if (company) queryParams.company = company;
    if (userId !== null) queryParams.userId = userId;
    if (createdAt) queryParams.createdAt = createdAt;
    if (updatedAt) queryParams.updatedAt = updatedAt;
    if (createBy) queryParams.createBy = createBy;
    if (createTime) queryParams.createTime = createTime;
    if (updateBy) queryParams.updateBy = updateBy;
    if (updateTime) queryParams.updateTime = updateTime;
    if (remark) queryParams.remark = remark;
    
    // 添加其他参数
    if (params && typeof params === 'object') {
        Object.keys(params).forEach(key => {
            if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
                queryParams[`params.${key}`] = params[key];
            }
        });
    }
    
    return queryParams;
};

// 使用示例函数
export const alumniListExample = async () => {
    try {
        // 示例1: 查询所有校友
        const allAlumni = await getAlumniList();
        console.log('所有校友:', allAlumni);
        
        // 示例2: 按条件查询校友
        const queryParams = buildAlumniQueryParams({
            name: '张三',
            academy: '计算机学院',
            grade: '2020',
            industry: 'IT互联网'
        });
        const filteredAlumni = await getAlumniList(queryParams);
        console.log('筛选后的校友:', filteredAlumni);
        
        // 示例3: 复杂查询
        const complexQuery = buildAlumniQueryParams({
            userId: 1,
            company: '腾讯',
            params: {
                KEY: 'value'
            }
        });
        const complexResult = await getAlumniList(complexQuery);
        console.log('复杂查询结果:', complexResult);
        
        return {
            allAlumni,
            filteredAlumni,
            complexResult
        };
    } catch (error) {
        console.error('校友查询示例失败:', error);
        throw error;
    }
};

// 搜索用户
export const searchFriends = async (keyword) => {
    try {
        const response = await searchUsers(keyword);
        return response.data || [];
    } catch (error) {
        console.error('搜索用户失败:', error);
        throw error;
    }
};

// 添加好友
export const addNewFriend = async (friendId) => {
    try {
        const response = await addFriend(friendId);
        return response;
    } catch (error) {
        console.error('添加好友失败:', error);
        throw error;
    }
};

// 模拟好友分类数据
const mockFriendCategories = [
    {
        code: 'all',
        name: '全部好友',
        icon: 'user-heart',
        color: '#FF5722',
        count: '8/8'
    },
    {
        code: 'friends',
        name: '朋友',
        icon: 'user-smile',
        color: '#333333',
        count: '3/3'
    },
    {
        code: 'teachers',
        name: '老师',
        icon: 'book-open',
        color: '#333333',
        count: '1/1'
    },
    {
        code: 'classmates',
        name: '同学',
        icon: 'graduation-cap',
        color: '#2A6DCF',
        count: '4/4'
    },
    {
        code: 'alumni',
        name: '校友',
        icon: 'building-4',
        color: '#333333',
        count: '2/2'
    }
];

// 模拟好友数据
const mockFriends = [
    {
        id: '001',
        name: '张教授',
        avatar: '/static/images/avatar/avatar1.png',
        department: '计算机学院',
        enrollYear: '2010',
        major: '计算机科学与技术',
        categories: ['all', 'teachers'],
        phone: '13800138000',
        wechat: 'zhangprof',
        qq: '123456789',
        email: 'zhang@example.com',
        remark: ''
    },
    {
        id: '002',
        name: '李同学',
        avatar: '/static/images/avatar/avatar2.png',
        department: '计算机学院',
        enrollYear: '2018',
        major: '软件工程',
        categories: ['all', 'classmates', 'friends'],
        phone: '13900139000',
        wechat: 'li_student',
        qq: '987654321',
        email: 'li@example.com',
        remark: '前端开发小组组长'
    },
    {
        id: '003',
        name: '王同学',
        avatar: '/static/images/avatar/avatar3.png',
        department: '计算机学院',
        enrollYear: '2018',
        major: '人工智能',
        categories: ['all', 'classmates'],
        phone: '13700137000',
        wechat: 'wang_ai',
        qq: '456789123',
        email: 'wang@example.com',
        remark: ''
    },
    {
        id: '004',
        name: '赵同学',
        avatar: '/static/images/avatar/avatar4.png',
        department: '计算机学院',
        enrollYear: '2018',
        major: '网络工程',
        categories: ['all', 'classmates'],
        phone: '13600136000',
        wechat: 'zhao_net',
        qq: '789123456',
        email: 'zhao@example.com',
        remark: ''
    },
    {
        id: '005',
        name: '钱同学',
        avatar: '/static/images/avatar/avatar5.png',
        department: '计算机学院',
        enrollYear: '2018',
        major: '信息安全',
        categories: ['all', 'classmates', 'friends'],
        phone: '13500135000',
        wechat: 'qian_security',
        qq: '321654987',
        email: 'qian@example.com',
        remark: ''
    },
    {
        id: '006',
        name: '孙校友',
        avatar: '/static/images/avatar/avatar6.png',
        department: '计算机学院',
        enrollYear: '2016',
        major: '软件工程',
        categories: ['all', 'alumni'],
        phone: '13400134000',
        wechat: 'sun_alumni',
        qq: '654987321',
        email: 'sun@example.com',
        remark: '现就职于腾讯'
    },
    {
        id: '007',
        name: '周校友',
        avatar: '/static/images/avatar/avatar7.png',
        department: '计算机学院',
        enrollYear: '2015',
        major: '计算机科学与技术',
        categories: ['all', 'alumni', 'friends'],
        phone: '13300133000',
        wechat: 'zhou_alumni',
        qq: '159357486',
        email: 'zhou@example.com',
        remark: '现就职于阿里巴巴'
    },
    {
        id: '008',
        name: '吴同学',
        avatar: '/static/images/avatar/avatar8.png',
        department: '电子工程学院',
        enrollYear: '2019',
        major: '电子工程',
        categories: ['all'],
        phone: '13200132000',
        wechat: 'wu_ee',
        qq: '258369147',
        email: 'wu@example.com',
        remark: ''
    }
];

// 模拟好友申请数据
const mockFriendRequests = [
    {
        id: 'req001',
        userId: '101',
        name: '朱同学',
        avatar: '/static/images/avatar/avatar9.png',
        department: '机械工程学院',
        enrollYear: '2019',
        major: '机械设计与制造',
        message: '我是朱同学，想加你为好友',
        time: '2023-09-15 14:30',
        status: 'pending' // pending, accepted, rejected
    },
    {
        id: 'req002',
        userId: '102',
        name: '陈教授',
        avatar: '/static/images/avatar/avatar10.png',
        department: '电子工程学院',
        enrollYear: '2008',
        major: '电子信息工程',
        message: '我是电子工程学院的陈教授，看到你在论坛上发表的文章很有见解，希望加你为好友交流',
        time: '2023-09-14 09:15',
        status: 'pending'
    },
    {
        id: 'req003',
        userId: '103',
        name: '刘校友',
        avatar: '/static/images/avatar/avatar11.png',
        department: '计算机学院',
        enrollYear: '2015',
        major: '信息安全',
        message: '我是2015级信息安全专业毕业的刘校友，现在在华为工作，想和你交流一下',
        time: '2023-09-12 16:45',
        status: 'pending'
    }
];

// 获取好友分类
export const getFriendCategories = () => {
    return new Promise((resolve) => {
        // 模拟API请求延迟
        setTimeout(() => {
            resolve(mockFriendCategories);
        }, 300);
    });
};

// 获取我的好友列表
export const getMyFriends = async () => {
    try {
        const response = await getFriendsList();
        return response.data || [];
    } catch (error) {
        console.error('获取好友列表失败:', error);
        // 如果API调用失败，返回模拟数据作为备用
        return mockFriends;
    }
};

// 获取好友申请列表
export const getMyFriendRequests = async () => {
    try {
        const response = await getFriendRequests();
        return response.data || [];
    } catch (error) {
        console.error('获取好友申请列表失败:', error);
        // 如果API调用失败，返回模拟数据作为备用
        return mockFriendRequests;
    }
};

// 删除好友
export const deleteFriend = async (friendId) => {
    try {
        const response = await removeFriend(friendId);
        return response;
    } catch (error) {
        console.error('删除好友失败:', error);
        throw error;
    }
};

// 移动好友到指定分组
export const moveFriendToCategory = (friendId, categoryCode) => {
    return new Promise((resolve) => {
        // 模拟API请求延迟
        setTimeout(() => {
            // 实际应用中这里会调用后端API
            console.log(`将好友 ${friendId} 移动到分组 ${categoryCode}`);
            resolve({ success: true });
        }, 800);
    });
};

// 设置好友备注
export const setFriendRemark = (friendId, remark) => {
    return new Promise((resolve) => {
        // 模拟API请求延迟
        setTimeout(() => {
            // 实际应用中这里会调用后端API
            console.log(`为好友 ${friendId} 设置备注: ${remark}`);
            resolve({ success: true });
        }, 800);
    });
};

// 创建新分组
export const createCategory = (categoryName) => {
    return new Promise((resolve) => {
        // 模拟API请求延迟
        setTimeout(() => {
            // 实际应用中这里会调用后端API
            const newCategory = {
                code: `custom_${Date.now()}`,
                name: categoryName,
                icon: 'folder-user',
                color: '#333333',
                count: '0/0'
            };
            console.log(`创建新分组: ${categoryName}`);
            resolve(newCategory);
        }, 800);
    });
};

// 删除分组
export const deleteCategory = (categoryCode) => {
    return new Promise((resolve) => {
        // 模拟API请求延迟
        setTimeout(() => {
            // 实际应用中这里会调用后端API
            console.log(`删除分组: ${categoryCode}`);
            resolve({ success: true });
        }, 800);
    });
};

// 重命名分组
export const renameCategory = (categoryCode, newName) => {
    return new Promise((resolve) => {
        // 模拟API请求延迟
        setTimeout(() => {
            // 实际应用中这里会调用后端API
            console.log(`重命名分组 ${categoryCode} 为: ${newName}`);
            resolve({ success: true });
        }, 800);
    });
};

// 处理好友申请（接受/拒绝）
export const handleMyFriendRequest = async (requestId, action) => {
    try {
        const response = await handleFriendRequest(requestId, action);
        return response;
    } catch (error) {
        console.error('处理好友申请失败:', error);
        throw error;
    }
};

// 清空好友验证信息
export const clearFriendRequests = () => {
    return new Promise((resolve) => {
        // 模拟API请求延迟
        setTimeout(() => {
            // 实际应用中这里会调用后端API
            console.log('清空所有好友验证信息');
            
            // 返回模拟数据
            const result = {
                success: true,
                message: '已清空所有验证信息'
            };
            
            resolve(result);
        }, 1000);
    });
};
