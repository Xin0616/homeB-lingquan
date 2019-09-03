import {request} from '@/common/request.js'

//领取优惠券
export function shopUserRegist(data){
	return request({
		url:'/home/shopuser/activityShopUserRegist',
		methods:"post",
		contentType: 'application/x-www-form-urlencoded',
		data
	}).then(function (res){
		let data = res.data;
		data.result = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
		return data
	});
}


// 校验手机号是否已经注册
export function checkShopUserMobile(mobile) { // 参数：用户名
	return request({
		url:'/home/shopuser/checkShopUserMobile',
		methods: 'post',//默认值---不需要则不要填写
		contentType: 'application/x-www-form-urlencoded', //默认值---不需要则不要填写
		data:{
			mobile
		}
	}).then(function (res){
		let data = res.data;
		data.result = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
		return data
	})
}

//获取动态验证码并发送到手机
export function getDynamicCode(mobile,codeType){
	return request({
		url:'/home/code/sendDynamicCode',
		methods:"post",
		contentType: 'application/x-www-form-urlencoded',
		data:{
			mobile,
			codeType
		}
	}).then(function (res){
		let data = res.data;
		data.result = typeof data.result === 'string' ? JSON.parse(data.result) : data.result;
		return data
	});
}