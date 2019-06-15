<template>
	<div>
		<!-- 标题栏 -->
		<van-nav-bar fixed class="navBar" @click-left="back">
			<div slot="left">
				<van-icon name="arrow-left" color="#000" />
				<span>{{singer.name}}</span>
				<span v-show="singer.alias.length != 0">({{singer.alias[0]}})</span>
			</div>
		</van-nav-bar>
		
		<!-- 歌手图片 -->
		<img :src="singer.picUrl" class="auto_img" />
		
		<van-tabs sticky title-active-color="#000" title-inactive-color="#8a8a8a" color="#8a8a8a" animated @click="changeData">
			<van-tab title="热门单曲">
				<van-loading color="#8a8a8a" size="1rem" class="load" v-show="isLoad" />
				<div class="content" v-show="!isLoad">
					<van-cell :title="item.name" v-for="(item, index) in hotSongs" :key="index" @click="play(hotSongs, item, index)">
						<div slot="label">
							<span>{{item.ar[0].name}}</span>
							<span> - {{item.al.name}}</span>
						</div>
					</van-cell>
				</div>
			</van-tab>
			<van-tab title="专辑">
				<van-loading color="#8a8a8a" size="1rem" class="load" v-show="isLoad" />
				<div class="content" v-show="!isLoad">
					<van-cell :title="item.name" v-for="(item, index) in hotAlbums" :key="index" @click="albumDetails(item)">
						<img v-lazy="item.picUrl" slot="icon" class="cover" />
						<div slot="label">
							<span>{{item.artists[0].name}} </span>
							<span> {{new Date(item.publishTime).toLocaleDateString()}}</span>
						</div>
					</van-cell>
				</div>
			</van-tab>
			<van-tab title="艺人信息">
				<van-loading color="#8a8a8a" size="1rem" class="load" v-show="isLoad" />
				<div class="content" v-show="!isLoad">
					<h2 class="title">{{singer.name}}简介</h2>
					<p class="txt">{{personData.briefDesc}}}</p>
					<div v-for="(item, index) in personData.introduction" :key="index">
						<h2 class="title">{{item.ti}}</h2>
						<p class="txt">{{item.txt}}</p>
					</div>
				</div>
			</van-tab>
		</van-tabs>
		
		<!-- 详情弹出层 -->
		<popup :detailsPop="detailsData"></popup>
	</div>
</template>

<script>
	import popup from '../components/Popup.vue'
	
	export default {
		name: 'singer',
		
		components: {
			popup
		},
		
		data(){
			return {
				active: 0,
				// 热门单曲
				hotSongs: [],
				// 专辑
				hotAlbums: [],
				personData: {
					briefDesc: '',
					introduction: []
				},
				detailsData: {},
				isLoad: true
			}
		},
		
		computed: {
			singer(){
				return this.$store.state.singerData
			},
		},
		
		methods: {
			// 返回
			back(){
				this.$router.push({name: 'find'})
			},
			// 切换
			changeData(index){
				if(this.activeX == index){
					return
				}
				this.activeX = index
				this.getData(index)
			},
			// 获取数据
			getData(index){
				this.isLoad = true
				if(index == 0){
					var url = 'http://localhost:3000/artists?id=' + this.singer.id
				}else if(index == 1){
					var url = 'http://localhost:3000/artist/album?id=' + this.singer.id
				}else{
					var url = 'http://localhost:3000/artist/desc?id=' + this.singer.id
				}
				this.axios({
					methods: 'get',
					url
				}).then(r => {
					switch(index){
						case 0:
							this.hotSongs = r.data.hotSongs
							break;
						case 1:
							this.hotAlbums = r.data.hotAlbums
							break;
						case 2:
							this.personData = {
								briefDesc: r.data.briefDesc,
								introduction: r.data.introduction
							}
							break;
					}
					this.isLoad = false
				})
			},
			// 播放
			play(itemList, item, index){
				this.$store.state.itemList = itemList
				this.$store.state.item = item
				this.$store.state.index = index
			},
			// 查看专辑详情
			albumDetails(item){
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
				})
			},
		},
		
		created(){
			this.getData(0)
		}
	}
</script>

<style lang="less" scoped>
	.load{
		margin: 50% auto;
	}
	.navBar{
		span{
			margin-left: 0.3rem;
		}
	}
	.content{
		width: 90%;
		margin: 0 auto;
	}
	.cover{
		width: 1.2rem;
		height: 1.2rem;
		margin-right: 0.4rem;
	}
	.title{
		border-left: 5PX solid #c4b7d7;
		padding-left: 0.5rem;
	}
	.txt{
		color: #8a8a8a;
	}
</style>
