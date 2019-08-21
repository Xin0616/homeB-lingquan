<template>
	<view class="cativity">
		<view class="headerBox">
			<image src='../../static/banner.png' class="indexImg"></image>
			<view class='formBox' v-if='true'>
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
					<text v-else class="title code">{{timeDown}}S</text>
				</view>
				<button @tap='submit' class='btn'>立即领取</button>
			</view>
		</view>
		<view class="middleBox">
			<image src='../../static/code.png' class="codeImg"></image>
			<image src='../../static/upgrade.png' class="upgrade"></image>
			<image src='../../static/rule.png' class="textImg"></image>
		</view>
		<view class="footer">
			北京焱焱科技有限公司&nbsp;&nbsp;京ICP&nbsp;备&nbsp;19024458&nbsp;号&nbsp;-1
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
				info: {
					code: '',
					mobile: ''
				}
			};
		},
		methods: {
			submit() {
				if (this.checkMobile()) {
					this.errorInfo.mobile = false;
				} else {
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
			},
			async shopUserRegist() { // 3.注册
				let data = {
					mobile: this.info.mobile,
					dynamicCode: this.info.code,
					quickType: 10
				}
				let {
					code,
					result,
					msg
				} = await shopUserRegist(data);
				if (code == 0) {
					//登录

				} else {
					uni.navigateTo({
						title: msg,
						icon: 'none'
					})
				}

			},
			async getCode() { // 1.校验手机号
				let {
					code,
					result,
					msg
				} = await checkShopUserMobile(this.info.mobile);
				if (code == 0) {
					if (result.isRegister == 0) {
						this.getDynamicCode();
					} else {
						uni.showToast({
							icon: 'none',
							title: '改手机号已注册MOTI小店'
						})
					}

				} else {
					uni.showToast({
						title: msg,
						icon: 'none'
					})
				}
			},
			async getDynamicCode() { // 2.获取动态验证码
				let {
					code,
					result,
					msg
				} = await getDynamicCode(this.info.mobile, 106);
				if (code == 0) {
					uni.showToast({
						title: '验证码已发送',
						icon: 'none'
					})
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
					uni.showToast({
						title: msg || '获取验证码失败',
						icon: 'none'
					})
				}
			},
			checkMobile() {
				let reg = /^1[3456789]\d{9}$/
				return reg.test(this.info.mobile);
			},
			checkCode() {
				let reg = /^\d{6}$/;
				return reg.test(this.info.code);
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
					}
				}
			}
		}

	}
</style>
