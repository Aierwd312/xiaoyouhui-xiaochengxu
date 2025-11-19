<template>
	<view class="content-area">
		<!-- 导航栏 -->
		<fui-nav-bar :title="'添加学籍信息'" :background="navBackground" :titleColor="navTitleColor" @leftClick="goBack">
			<template v-slot:default>
				<fui-icon name="arrowleft" :color="navTitleColor" size="40"></fui-icon>
			</template>
			<template v-slot:right>
				<view style="display: flex; align-items: center;">
					<fui-icon name="more-vertical" :color="navTitleColor" size="40" style="margin-right: 20rpx;"></fui-icon>
					<fui-icon name="target" :color="navTitleColor" size="40"></fui-icon>
				</view>
			</template>
		</fui-nav-bar>
		
		<!-- 表单内容区域 -->
		<view class="form-content">
			<!-- 入校类型 -->
			<fui-form-item label="入校类型" arrow highlight @click="showTypePicker">
				<fui-input :borderBottom="false" :padding="[0]" placeholder="请选择入校类型" disabled 
					backgroundColor="transparent" v-model="formData.enrollmentType"></fui-input>
			</fui-form-item>
			
			<!-- 入校院系 -->
			<fui-form-item label="入校院系" arrow highlight @click="showDeptPicker">
				<fui-input :borderBottom="false" :padding="[0]" placeholder="请选择入校院系" disabled 
					backgroundColor="transparent" v-model="formData.enrollmentDept"></fui-input>
			</fui-form-item>
			
			<!-- 学号 (选填) -->
			<fui-form-item label="学号">
				<fui-input :borderBottom="false" :padding="[0]" placeholder="选填" 
					v-model="formData.studentId"></fui-input>
			</fui-form-item>
			
			<!-- 信息提示框 -->
			<view class="info-box">
				<text>支持接受过重庆财经学院普通高等学历学位教育的校友注册</text>
				<text>* 暂不支持在校生</text>
				<text>* 如果匹配失败可尝试入校年份+毕业院系</text>
			</view>
		</view>
		
		<!-- 底部提交按钮 -->
		<view class="bottom-button-area">
			<view class="submit-button" @click="submitForm">提交</view>
		</view>
		
		<!-- 入校类型选择器 -->
		<fui-picker :options="typeOptions" :show="typePickerShow" title="请选择入校类型" 
			confirmText="确定" cancelText="取消" @change="selectType" @cancel="typePickerShow = false"
			:height="650" :size="14"></fui-picker>
		
		<!-- 入校院系选择器 -->
		<fui-picker linkage :layer="2" :options="deptOptions" :show="deptPickerShow" 
			title="请选择入校院系" confirmText="确定" cancelText="取消" 
			@change="selectDept" @cancel="deptPickerShow = false"
			:height="650" :size="14"></fui-picker>
	</view>
</template>

<script>
	import studentInfoPageJs from './studentInfoPage.js';
	export default studentInfoPageJs;
</script>

<style>
	@import url("./studentInfoPage.css");
</style>
