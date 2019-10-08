<script>
	export default {
		onLaunch: function() {
			// #ifdef H5
			// 友盟埋点
			//material 媒体素材号,orderSource 订单来源, channel 媒体渠道
			let sourceInfo = {};
			sourceInfo = {
				material: this.geturlkey('material')?this.geturlkey('material'):'',
				orderSource: this.geturlkey('orderSource')?this.geturlkey('orderSource'):'',
				channel: this.geturlkey('channel')?this.geturlkey('channel'):''
			}
			uni.setStorageSync('sourceInfo', sourceInfo)
			// #endif
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		mounted() {
			// 友盟统计添加
			const script = document.createElement("script");
			script.src = "https://s9.cnzz.com/z_stat.php?id=1277890458&web_id=1277890458";
			script.language = "JavaScript";
			document.body.appendChild(script);
		},
		methods: {
			geturlkey: function(name){
				return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [, ""])[1].replace(/\+/g, '%20')) || null
			}
		}
	}
</script>

<style>
	@import './common/uni.css';
	/*每个页面公共css */
	page{
		height:100%;
		background: #efefef;
	}
</style>
