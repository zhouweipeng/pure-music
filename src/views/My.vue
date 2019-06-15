<template>
	<div class="my">
		
		<van-loading color="#8a8a8a" size="1rem" class="load" v-show="isLoad" />
		
		<div v-show="!isLoad">
			<div class="userBox">
				<img :src="loginData.backgroundUrl" class="auto_img" />
				<div class="avatarBox">
					<img :src="loginData.avatarUrl" class="avatar" @click="exit" />
					<h2>{{loginData.nickname}}</h2>
				</div>
			</div>
			<div class="listBox">
				<h2>创建的歌单</h2>
				<div v-for="(item, index) in playList" :key="index" v-if="item.userId == loginData.userId" @click="playListDetails(item)">
					<img v-lazy="item.coverImgUrl" class="cover" />
					<div class="textBox">
						<p>{{item.name}}</p>
						<p>{{item.trackCount}}首</p>
					</div>
				</div>
				<h2>收藏的歌单</h2>
				<div v-for="(item, index) in playList" :key="index" v-if="item.userId != loginData.userId" @click="playListDetails(item)">
					<img v-lazy="item.coverImgUrl" class="cover" />
					<div class="textBox">
						<p>{{item.name}}</p>
						<p>{{item.trackCount}}首</p>
					</div>
				</div>
			</div>
			<!-- 详情弹出层 -->
			<popup :detailsPop="detailsData"></popup>
		</div>
		
	</div>
</template>

<script>
	import popup from '../components/Popup.vue'
	
	export default {
		
		name: 'my',
		
		components: {
			popup
		},
		
		data(){
			return {
				playList: [],
				detailsData: {},
				// 加载中
				isLoad: true
			}
		},
		
		computed: {
			loginData(){
				return this.$store.state.loginData
			}
		},
		
		methods: {
			// 退出登录
			exit(){
				this.$dialog.confirm({
					message: '要退出该账号吗？'
				}).then(() => {
					this.$store.state.loginData = {}
					this.axios({
						methods: 'get',
						url: 'http://localhost:3000/logout'
					}).then(r => {
						this.$store.state.itemList = []
						this.$store.state.item = {}
						this.$store.state.index = -1
						this.$router.push({name: 'login'})
					})
				}).catch(() => {})
			},
			// 查看歌单详情
			playListDetails(item){
				this.$store.state.isPopupLoad = true
				this.detailsData = {}
				this.$store.state.isDetails = !this.$store.state.isDetails
				this.axios({
					methods: 'get',
					url: 'http://localhost:3000/playlist/detail?id=' + item.id
				}).then(r => {
					this.detailsData = {
						cover: r.data.playlist.coverImgUrl,
						title: r.data.playlist.name,
						avatar: r.data.playlist.creator.avatarUrl,
						name: r.data.playlist.creator.nickname,
						des: r.data.playlist.description,
						songList: r.data.playlist.tracks
					}
					this.$store.state.isPopupLoad = false
				})
			},
		},
		
		created(){
			// 用户歌单
			this.axios({
				methods: 'get',
				url: 'http://localhost:3000/user/playlist?uid=' + this.loginData.userId
			}).then(r => {
				this.playList = r.data.playlist
				this.isLoad = false
			})
		}
		
	}
</script>

<style lang="less" scoped>
	.load{
		margin: 50% auto;
	}
	.my{
		.userBox{
			position: relative;
			.avatarBox{
				position: absolute;
				left: 10%;
				bottom: 20%;
				.avatar{
					height: 2rem;
					width: 2rem;
					border-radius: 50%;
				}
				h2{
					padding: 0.1rem;
				}
			}
		}
		
		.listBox{
			position: relative;
			left: 0;
			top: -2rem;
			bottom: 0;
			border-radius: 0.5rem;
			background: #fff;
			box-shadow: 0 0 10PX #ececec;
			h2{
				margin: 0;
				padding: 0.4rem 1rem;
			}
			>div{
				width: 90%;
				margin: 0 auto 0.2rem;
				border-radius: 0.3rem;
				box-shadow: 0 0 10PX #ececec;
				.cover{
					margin: 0.3rem;
					height: 1.5rem;
					width: 1.5rem;
					border-radius: 0.3rem;
					box-shadow: 0 0 10PX #ececec;
					vertical-align: middle;
				}
				.textBox{
					display: inline-block;
					vertical-align: middle;
					width: calc(~"100% - 2.1rem");
					p{
						text-overflow: ellipsis;
						white-space: nowrap;
						overflow: hidden;
					}
				}
			}
		}
		
	}
</style>
