<template>
	<div class="search">
		
		<!-- 搜索框 -->
		<van-search v-model="searchValue" placeholder="请输入搜索关键词" shape="round" @search="onSearch(1, 10, true)" @input="onInput" />
		
		<!-- 默认显示，历史纪录和热搜 -->
		<div class="defaultBox" v-show="!isResult">
			<h2 v-show="historySearch.length != 0">
				历史纪录
				<van-icon name="delete" class="delete" @click="deleteHistory" />
			</h2>
			<div class="history" v-show="historySearch.length != 0">
				<span v-for="(item, index) in historySearch" :key="index" @click="clickSearch(item)">{{item}}</span>
			</div>
			<h2>热搜榜</h2>
			<div class="hotItem" v-for="(item, index) in hots" :key="index" @click="clickSearch(item.first)">
				<div :class="{left: true, red: index < 3}">{{index + 1}}</div>
				<div class="right">{{item.first}}</div>
			</div>
		</div>
		
		<!-- 搜索结果 -->
		<div class="resultBox" v-show="isResult">
			<van-loading color="#8a8a8a" size="1rem" class="load" v-show="isLoad" />
			<van-tabs v-model="active" type="card" title-active-color="#8a8a8a" title-inactive-color="#8a8a8a" color="#ececec" animated @click="changeResult" v-show="!isLoad">
				<van-tab title="单曲">
					<div>
						<van-cell :title="item.name" v-for="(item, index) in resultData[0].data" :key="index" @click="play(item)">
							<div slot="label">
								<span>{{item.artists[0].name}} - </span>
								<span>{{item.album.name}}</span>
							</div>
						</van-cell>
						<van-cell title="更多" is-link @click="onLoad(0)" />
					</div>
				</van-tab>
				<van-tab title="专辑">
					<div>
						<van-cell :title="item.name" v-for="(item, index) in resultData[1].data" :key="index" @click="albumDetails(item)">
							<img v-lazy="item.picUrl" slot="icon" class="cover" />
							<div slot="label">
								<span>{{item.artists[0].name}} </span>
								<span> {{new Date(item.publishTime).toLocaleDateString()}}</span>
							</div>
						</van-cell>
						<van-cell title="更多" is-link @click="onLoad(1)" />
					</div>
				</van-tab>
				<van-tab title="歌手">
					<div>
						<van-cell :title="item.name" v-for="(item, index) in resultData[2].data" :key="index" @click="singerDetails(item)">
							<img v-lazy="item.img1v1Url" slot="icon" class="avatar" />
							<div slot="label">
								<span v-for="(it, i) in item.alias" :key="i">({{it}})</span>
							</div>
						</van-cell>
						<van-cell title="更多" is-link @click="onLoad(2)" />
					</div>
				</van-tab>
				<van-tab title="歌单">
					<div>
						<van-cell v-for="(item, index) in resultData[3].data" :key="index" @click="playListDetails(item)">
							<img v-lazy="item.coverImgUrl" slot="icon" class="cover" />
							<div slot="title" class="title">
								{{item.name}}
							</div>
							<div slot="label">
								<span>{{item.trackCount}}首</span>
								<span> by {{item.creator.nickname}}</span>
							</div>
						</van-cell>
						<van-cell title="更多" is-link @click="onLoad(3)" />
					</div>
				</van-tab>
			</van-tabs>
		</div>
		
		<!-- 详情弹出层 -->
		<popup :detailsPop="detailsData"></popup>
		
	</div>
</template>

<script>
	import popup from '../components/Popup.vue'
	var timer
	
	export default {
		name: 'search',
		
		components: {
			popup
		},
		
		data(){
			return {
				// 热搜
				hots: [],
				// 搜索关键字
				searchValue: '',
				// 历史纪录
				historySearch: [],
				// 显示结果
				isResult: false,
				// 标签栏下标
				active: 0,
				// 标签栏上一次下标
				activeX: 0,
				// 搜索结果
				resultData: [
					{type: 1, limit: 10, data: []},
					{type: 10, limit: 10, data: []},
					{type: 100, limit: 10, data: []},
					{type: 1000, limit: 10, data: []}
				],
				// 详情
				detailsData: {},
				isLoad: true
			}
		},
		
		methods: {
			// 删除历史纪录
			deleteHistory(){
				this.$dialog.confirm({
					message: '确定要删除历史纪录吗？'
				}).then(() => {
					this.historySearch = []
					localStorage.setItem('historySearch', JSON.stringify(this.historySearch))
				}).catch(() => {})
			},
			// 搜索  1: 单曲, 10: 专辑, 100: 歌手, 1000: 歌单
			onSearch(type, limit, isReset){
				if(this.searchValue == '' || this.searchValue.trim() == ''){
					this.searchValue = ''
					return
				}
				this.isLoad = true
				if(isReset){
					// console.log('重新搜索')
					this.active = 0
					this.resultData[0].data = []
					this.resultData[1].data = []
					this.resultData[2].data = []
					this.resultData[3].data = []
				}
				// 历史纪录中没有就存进去
				if(this.historySearch.indexOf(this.searchValue) == -1){
					this.historySearch.push(this.searchValue)
					localStorage.setItem('historySearch', JSON.stringify(this.historySearch))
				}
				// clearTimeout(timer)
				// timer = null
				this.axios({
					methods: 'get',
					url: 'http://localhost:3000/search?keywords=' + this.searchValue + '&type=' + type + '&limit=' + limit
				}).then(r => {
					switch(type){
						case 1:
							this.resultData[0].data = r.data.result.songs
							break;
						case 10:
							this.resultData[1].data = r.data.result.albums
							break;
						case 100:
							this.resultData[2].data = r.data.result.artists
							break;
						case 1000:
							this.resultData[3].data = r.data.result.playlists
							break;
					}
					this.isLoad = false
				})
				this.isResult = true
			},
			// 搜索建议
			onInput(){
				if(this.searchValue == ''){
					this.isResult = false
				}
				// clearTimeout(timer)
				// timer = null
				// timer = setTimeout(() => {
				// 	if(this.searchValue != '' || this.searchValue.trim() == ''){
				// 		this.axios({
				// 			methods: 'get',
				// 			url: 'http://localhost:3000/search/suggest?keywords=' + this.searchValue
				// 		}).then(r => {
				// 			console.log(r.data)
				// 		})
				// 	}
				// }, 1000)
			},
			// 更换搜索类型
			changeResult(index){
				if(this.activeX == index){
					return
				}
				this.activeX = index
				this.onSearch(this.resultData[index].type, this.resultData[index].limit)
			},
			// 播放
			play(item){
				this.axios({
					methods: 'get',
					url: 'http://localhost:3000/song/detail?ids=' + item.id
				}).then(r => {
					this.$store.state.index = this.$store.state.itemList.length
					this.$store.state.itemList.push(r.data.songs[0])
					this.$store.state.item = r.data.songs[0]
				})
			},
			// 加载更多
			onLoad(index){
				this.resultData[index].limit += 10
				this.onSearch(this.resultData[index].type, this.resultData[index].limit)
			},
			// 查看歌单详情
			playListDetails(item){
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
				})
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
			// 歌手详情
			singerDetails(item){
				this.$store.state.singerData = item
				this.$router.push({name: 'singer'})
			},
			// 点击搜索
			clickSearch(keywords){
				this.searchValue = keywords
				this.onSearch(1, 10, true)
			}
		},
		
		created(){
			// 热搜
			this.axios({
				methods: 'get',
				url: 'http://localhost:3000/search/hot'
			}).then(r => {
				this.hots = r.data.result.hots
			})
			// 历史纪录
			var historySearch = JSON.parse(localStorage.getItem('historySearch'))
			if(historySearch){
				this.historySearch = historySearch
			}
		}
	}
</script>

<style lang="less" scoped>
	.load{
		margin: 50% auto;
	}
	.search{
		.defaultBox{
			width: 90%;
			margin: 0 auto;
			.delete{
				float: right;
			}
			.history{
				white-space: nowrap;
				overflow-X: scroll;
				height: 1rem;
				line-height: 1rem;
				span{
					display: inline-block;
					height: 0.8rem;
					line-height: 0.8rem;
					background: #ececec;
					border-radius: 0.4rem;
					padding: 0 0.2rem;
					margin-right: 0.2rem;
				}
			}
			.red{
				color: #e4393c;
				font-weight: 900;
			}
			.hotItem{
				*{
					font-size: 16PX;
					float: left;
					height: 1rem;
					line-height: 1rem;
				}
				.left{
					width: 10%;
					text-align: center;
				}
				.right{
					width: 90%;
				}
			}
		}
		
		.resultBox{
			.cover{
				width: 1.2rem;
				height: 1.2rem;
				margin-right: 0.4rem;
			}
			.avatar{
				width: 1.2rem;
				height: 1.2rem;
				border-radius: 50%;
				margin-right: 0.4rem;
			}
			.title{
				width: calc(~"90vw - 1.6rem");
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
		}
	}
</style>
