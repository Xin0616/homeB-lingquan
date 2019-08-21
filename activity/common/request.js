import config from './config.js'

export async function request(params){
	return new Promise(function (resolve,reject){
		uni.showLoading({title: ''});
		const {...rest} = params.data;
		// const userInfo = uni.getStorageSync('userInfo');
		// const token = userInfo.token;
		uni.request({
			url: config.host + params.url,
			method: params.methods ? params.methods : 'get',
			header: {
				"content-type": params.contentType ? params.contentType : 'application/x-www-form-urlencoded'
				// "Authorization": token
			},
			data: rest,
			success:function (data){
				uni.hideLoading();
				// if(data.data.code == '3'){
				// 	uni.navigateTo({
				// 		url: '/pages/login/login.vue'
				// 	})
				// }
				resolve(data)
			},
			fail: function (err){
				uni.hideLoading();
				reject(err)
			}
		})
	})
}