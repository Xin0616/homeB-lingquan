<template>
	<view class="cativity">
		<view class="headerBox">
			<image src='../../static/banner.png' class="indexImg"></image>
			<view class='formBox'>
				<template v-if='!showType'>
					<view class='lineLi'>
						<view class="leftBox">
							<view class='title'>手机号</view>
							<view class="middle">
								<view class="errorMsg" v-if='errorInfo.mobile'>手机号错误，请重新输入</view>
								<text class="section"></text>
								<input v-model="info.mobile" maxlength="11" type="text" placeholder="请输入手机号码">
							</view>
						</view>
					</view>
					<view class='lineLi'>
						<view class="leftBox">
							<view class='title'>验证码</view>
							<view class="middle">
								<view class="errorMsg" v-if='errorInfo.code'>验证码错误，请重新输入</view>
								<text class="section"></text>
								<input v-model="info.code" type="text" placeholder="请输入动态码">
							</view>
						</view>
						<text v-if="!isGotCode" class="title code" @tap='getCode'>获取验证码</text>
						<text v-else class="title code">{{timeDown}}s</text>
					</view>
				</template>
				<template v-else>
					<view class="afterLogin">
						<view class="codeText">
							{{showText}}
						</view>
						<view class="codeImage">
							<view class="codeLeft">
								<view style="font-weight: 600;">	
									<text class="num">{{couponInfo.discountRate * 10}}</text>
									<text class="zhe">折</text>
								</view>
								<view>全场通用</view>
							</view>
							<view class="codeRight">
								<view class="name">{{couponInfo.couponName}}</view>
								<view class="time">有效期至：{{couponInfo.invalidTime}}</view>
							</view>
						</view>
					</view>
				</template>
				<button @tap='submit' class='btn'>{{btnText}}</button>
			</view>
		</view>
		<view class="middleBox">
			<view class="codeImg">
				<image src='../../static/code.png'></image>
			</view>
			<view @tap="imgPath">
				<image  src='../../static/upgrade.png' class="upgrade"></image>
			</view>
			<view class="">
				<image src='../../static/rule.png' class="textImg"></image>
			</view>
		</view>
		<view class="footer">
			北京焱炎科技有限公司&nbsp;&nbsp;京ICP&nbsp;备&nbsp;19024458&nbsp;号&nbsp;-1
		</view>
	</view>
</template>

<script>
	import {
		checkShopUserMobile,
		getDynamicCode,
		shopUserRegist
	} from "@/common/activity.js"
	export default {
		data() {
			return {
				isGotCode: false,
				timeDown: 90,
				errorInfo: {
					code: false,
					mobile: false
				},
				timer: null,
				info: {
					code: '',
					mobile: ''
				},
				showType: false,
				btnText:'立即领取',
				showText:'恭喜！您已成功领取优惠券',
				showImgPath: '../../static/coupon.png',
				couponInfo:{}
			};
		},
		watch: {
			info:{
				deep: true,
				handler: function (){
					this.errorInfo.code = false
					this.errorInfo.mobile = false
				}
			}
		},
		
		methods: {
			submit() {
				if(this.btnText == '立即领取'){ 
					// 注册登录并领取优惠券
					if(this.checkMobile(this.info.mobile)){
						this.errorInfo.mobile = false;
					}else{
						this.errorInfo.mobile = true;
						return;
					}
					if (this.checkCode()) {
						this.errorInfo.code = false;
					} else {
						this.errorInfo.code = true;
						return;
					}
					this.shopUserRegist();
				}else if(this.btnText == '立即使用'){
					this.toUseCoupon()
				}
			},
			//去使用优惠券
			toUseCoupon(){
				let urlHost = location.origin
				location.href = urlHost + '/daojiab'
			},
			//注册登录-领取优惠券
			async shopUserRegist() {
				let data = {
					mobile: this.info.mobile,
					dynamicCode: this.info.code,
					quickType: 10
				}
				let { code, result, msg } = await shopUserRegist(data);
				if (code == 0) {
					this.btnText = '立即使用'
					this.showType = true
					// 存储跟daojiaB所需的登录信息
					uni.setStorageSync('userInfo', result.shopInfo);
					// 优惠券信息展示
					this.couponInfo = result.coupon
					// 区分是否领取过当前优惠券
					if(!result.isReceive){ // isReceive -false-已领取 -true-未领取
						this.showText = '您已领取过优惠券'
					}
				} else {
					this.showErr(msg);
				}
			},
			async getCode() { // 1.校验手机号
				if(this.checkMobile(this.info.mobile)){
					let { code, result, msg } = await checkShopUserMobile(this.info.mobile);
					if (code == 0) {
						let codeType = 0;
						//105:用户注册；106:手机号登录；107:修改密码;
						if (result.isRegister == 0) { //未注册
							codeType = 105
						} else { // 已注册
							codeType = 106
						}
						this.getDynamicCode(codeType);
					} else {
						this.showErr(msg);
					}
				}else{
					this.errorInfo.mobile = true;
				}
			},
			async getDynamicCode(codeTyoe) { // 2.获取动态验证码
				let { code, result, msg } = await getDynamicCode(this.info.mobile, codeTyoe);
				if (code == 0) {
					this.showErr('验证码已发送');
					this.isGotCode = true
					this.timer = setInterval(() => {
						this.timeDown -= 1
						if (this.timeDown === 0) {
							clearInterval(this.timer)
							this.isGotCode = false
							this.timer = null
							this.timeDown = 90
						}
					}, 1000)
				} else {
					clearInterval(this.timer)
					this.isGotCode = false
					this.timer = null
					this.timeDown = 90
					this.showErr(msg || '获取验证码失败')
				}
			},
			imgPath(){
				window.open('https://h5.youzan.com/wscump/salesman/index?kdt_id=43411823#/','_blank');
			},
			checkMobile() {
				let reg = /^1[3456789]\d{9}$/
				return reg.test(this.info.mobile);
			},
			checkCode() {
				let reg = /^\d{6}$/;
				return reg.test(this.info.code);
			},
			showErr (msg){
				uni.showToast({
					icon: 'none',
					title: msg
				})
			}
		}
	}
</script>

<style lang="scss">
	.cativity {
		height: 100%;
		box-sizing: border-box;

		.footer {
			font-size: 20upx;
			color: #fff;
			text-align: center;
			height: 70upx;
			line-height: 70upx;
			background: #0A2B2D;
		}

		.middleBox {
			margin: 40upx 41upx;

			image {
				width: 100%;
			}

			.codeImg {
				height: 768upx;
				image{
					width: 100%;
					height: 100%;
					-webkit-touch-callout: default!important;
				}
			}

			.upgrade {
				margin: 40upx 0;
				height: 413upx;
			}

			.textImg {
				height: 508upx;
			}
		}

		.headerBox {
			background: #fff;

			.indexImg {
				width: 100%;
				height: 900upx;
			}

			.formBox {
				padding: 1upx 41upx;

				.btn {
					width: 100%;
					line-heigt: 98upx;
					font-size: 30upx;
					border: none;
					color: #fff;
					text-align: center;
					background-color: #fa4650;
					border-radius: 8upx;
					margin: 77upx 0;
				}
				.afterLogin{
					text-align: center;
					padding-top: 60upx;
					display: flex;
					justify-content: center;
					flex-direction: column;
					.codeText{
						margin-bottom: 40upx;
						font-size: 40upx;
						font-weight: 600;
					}
					.codeImage{
						margin: 0 auto;
						width: 580upx;
						height: 190upx;
						background: url('../../static/coupon.png') no-repeat;
						background-size: 100% 100%;
						display: flex;
						justify-content: space-around;
						align-items: center;
						color: #fff;
						overflow: hidden;
						.codeLeft{
							width: 30%;
							font-size: 24upx;
							.num{
								font-size: 80upx;
							}
							.zhe{
								font-size: 32upx;
							}
						}
						.codeRight{
							width: 58%;
							font-size: 24upx;
							text-align: left;
							.name{
								font-size: 40upx;
								font-weight: 600;
								height: 104upx;
								line-height: 104upx;
							}
						}
					}
				}
				
				.lineLi {
					padding-top: 1upx;
					display: flex;
					justify-content: space-between;
					font-size: 30upx;
					border-bottom: 2upx solid #d8d8d8;
					padding-bottom: 25upx;

					.leftBox {
						display: flex;
						flex-grow: 1;
						justify-content: flex-start;

						.title {
							color: #333333;
							align-self: flex-end;
							margin-right: 39upx;
							flex-shrink: 0;
						}

						.middle {
							flex-grow: 1;
							min-height: 100upx;
							display: flex;
							flex-direction: column;
							padding-top: 28upx;

							.section {
								flex: 1 0 auto
							}

							.errorMsg {
								font-size: 24upx;
								color: #fa4650;
								flex: 0 0 auto;
								height: 24upx;
							}

							input {
								color: #999999;
								flex: 0 0 auto;
							}
						}
					}

					.code {
						align-self: flex-end;
						flex-shrink: 0;
					}
				}
			}
		}

	}
</style>
