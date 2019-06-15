<template>
	<div class="find">
		
		<!-- 广告轮播 -->
		<van-swipe :autoplay="3000" class="swipeBox" ref="swipe">
			<van-swipe-item v-for="(item, index) in swipeImages" :key="index">
				<img v-lazy="item.pic" class="auto_img" @click="bannerUrl" />
			</van-swipe-item>
		</van-swipe>
		
		<div class="content">
			<!-- 推荐歌单 -->
			<div class="recList">
				<p class="title">推荐歌单</p>
				<van-row>
					<van-col span="8" v-for="(item, index) in recList" :key="index" v-show="index < isAllRec">
						<div class="box" @click="playListDetails(item)">
							<img class="auto_img" v-lazy="item.picUrl" />
							<p>{{item.name}}</p>
						</div>
					</van-col>
				</van-row>
				<van-icon name="arrow-down" size="16PX" class="arrow" @click="showAllRec" v-if="isAllRec == 6" />
				<van-icon name="arrow-up" size="16PX" class="arrow" @click="showAllRec" v-else />
			</div>
		</div>
		
		<div class="content">
			<!-- 新碟 -->
			<div class="newAlbum">
				<p class="title">新碟</p>
				<van-row>
					<van-col span="8" v-for="(item, index) in newAlbum" :key="index" v-show="index < isAllAlbum">
						<div class="box" @click="albumDetails(item)">
							<img class="auto_img" v-lazy="item.picUrl" />
							<p>{{item.name}}</p>
						</div>
					</van-col>
				</van-row>
				<van-icon name="arrow-down" size="16PX" class="arrow" @click="showAllAlbum" v-if="isAllAlbum == 6" />
				<van-icon name="arrow-up" size="16PX" class="arrow" @click="showAllAlbum" v-else />
			</div>
		</div>
		
		<!-- 详情弹出层 -->
		<popup :detailsPop="detailsData"></popup>
		
	</div>
</template>

<script>
	import popup from '../components/Popup.vue'
	
	export default {
		
		name: 'find',
		
		components: {
			popup
		},
		
		data(){
			return {
				swipeImages: [],
				recList: [],
				isAllRec: 6,
				newAlbum: [],
				isAllAlbum: 6,
				detailsData: {},
			}
		},
		
		methods: {
			// 轮播图链接
			bannerUrl(){
				this.$toast('sorry ~ not found')
			},
			// 展示全部推荐歌单
			showAllRec(){
				if(this.isAllRec == 6){
					this.isAllRec = this.recList.length
				}else{
					this.isAllRec = 6
				}
			},
			// 展示全部新碟
			showAllAlbum(){
				if(this.isAllAlbum == 6){
					this.isAllAlbum = this.newAlbum.length
				}else{
					this.isAllAlbum = 6
				}
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
			// 查看专辑详情
			albumDetails(item){
				this.$store.state.isPopupLoad = true
				this.detailsData = {}
				this.$store.state.isDetails = !this.$store.state.isDetails
				this.axios({
					methods: 'get',
					url: 'http://localhost:3000/album?id=' + item.id
				}).then(r => {
					this.detailsData = {
						cover: r.data.album.picUrl,
						title: r.data.album.name,
						avatar: r.data.album.artists[0].picUrl,
						name: r.data.album.artists[0].name,
						des: r.data.album.description,
						songList: r.data.songs
					}
					this.$store.state.isPopupLoad = false
				})
			},
		},
		
		created(){
			// 获取轮播图
			this.axios({
				methods: 'get',
				url: 'http://localhost:3000/banner?type=1'
			}).then(r => {
				this.swipeImages = r.data.banners
			})
			
			// 推荐歌单
			this.axios({
				methods: 'get',
				url: 'http://localhost:3000/personalized'
			}).then(r => {
				this.recList = r.data.result
			})
			
			// 最新专辑
			this.axios({
				methods: 'get',
				url: 'http://localhost:3000/album/newest'
			}).then(r => {
				this.newAlbum = r.data.albums
			})
		},
		
	}
</script>

<style lang="less" scoped>
	.find{
		.swipeBox{
			width: 90%;
			height: 35vw;
			border-radius: 0.5rem;
			box-shadow: 0 0 10PX #ececec;
			margin: 0 auto;
		}
		
		.content{
			width: 90%;
			border-radius: 0.5rem;
			margin: 0.5rem auto;
			box-shadow: 0 0 10PX #ececec, 0 0 10PX #ececec inset;
			.title{
				font-size: 16PX;
				margin: 0;
				padding: 0.3rem;
			}
			.arrow{
				display: block;
				text-align: center;
				animation: arrow 1s infinite alternate;
			}
			.box{
				height: calc(~"30vw + 0.7rem");
				margin: 0 0.2rem;
				transition: all 1s;
				img{
					border-radius: 0.3rem;
					box-shadow: 0 0 10PX #ececec;
					overflow: hidden;
				}
				p{
					font-size: 10PX;
					margin: 0.1rem;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
			}
		}
		
	}
	
	@keyframes arrow{
		from{
			transform: translateY(-10PX);
		}
		to{
			transform: translateY(10PX);
		}
	}
</style>
