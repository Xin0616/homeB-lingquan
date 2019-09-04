<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
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
