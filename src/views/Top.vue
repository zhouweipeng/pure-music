<template>
	
	<div class="top">
		<van-loading color="#8a8a8a" size="1rem" class="load" v-show="isLoad" />
		<div v-show="!isLoad">
			<div v-show="isBigX">
				<h2>官方榜</h2>
				<div class="topBox">
					<div v-for="(item, index) in topList" :key="index" v-if="item.tracks.length != 0" @click="details(item, index)" :ref="'top' + index">
						<img v-lazy="item.coverImgUrl" class="coverT" />
						<div class="textBox">
							<p>1.{{item.tracks[0].first}} - {{item.tracks[0].second}}</p>
							<p>2.{{item.tracks[1].first}} - {{item.tracks[1].second}}</p>
							<p>3.{{item.tracks[2].first}} - {{item.tracks[2].second}}</p>
						</div>
					</div>
				</div>
				<h2>更多榜单</h2>
				<div class="moreBox">
					<van-row>
						<van-col span="8" v-for="(item, index) in topList" :key="index" v-if="item.tracks.length == 0">
							<div class="colBox" @click="details(item, index)" :ref="'more' + index">
								<img v-lazy="item.coverImgUrl" class="auto_img coverM" />
								<p>{{item.name}}</p>
							</div>
						</van-col>
					</van-row>
				</div>
			</div>
			<!-- 返回 -->
			<div :class="{tab: true, tabB: isBig}">
				<van-icon name="arrow-left" size="18PX" class="back" @click="back" />
				<h2>{{detailsData.name}}</h2>
			</div>
			<!-- 详情 -->
			<div :class="{detailsBox: true, detailsBoxB: isBig}" ref="detailsBox" v-show="isDetails">
				<van-loading color="#8a8a8a" size="1rem" class="load" v-show="isDetailLoad" />
				<div v-show="!isDetailLoad">
					<img :src="detailsData.cover" class="auto_img" />
					<div class="listBox"> <!-- @click="play(detailsData.list, item, index)" -->
						<van-cell v-for="(item, index) in detailsData.list" :key="index">
							<div slot="icon" :class="{rank: true, red: index < 3}" @click="play(detailsData.list, item, index)">{{index + 1}}</div>
							<div slot="title" class="limit" @click="play(detailsData.list, item, index)">{{item.name}}</div>
							<div slot="label" class="limit" @click="play(detailsData.list, item, index)">
								<span>{{item.ar[0].name}} - </span>
								<span>{{item.al.name}}</span>
							</div>
						</van-cell>
					</div>
				</div>
			</div>
		</div>
	</div>
	
</template>

<script>
	
	export default {
		name: 'top',
		
		data(){
			return {
				topList: [],
				isDetails: false,
				isBig: false,
				isBigX: true,
				detailsData: {},
				isLoad: true,
				isDetailLoad: true
			}
		},
		
		methods: {
			// 播放
			play(itemList, item, index){
				this.$store.state.itemList = itemList
				this.$store.state.item = item
				this.$store.state.index = index
			},
			// 查看榜单详情
			details(item, index){
				this.isDetailLoad = true
				this.detailsData = {}
				this.axios({
					methods: 'get',
					url: 'http://localhost:3000/playlist/detail?id=' + item.id
				}).then(r => {
					this.detailsData = {
						name: r.data.playlist.name,
						cover: r.data.playlist.coverImgUrl,
						list: r.data.playlist.tracks
					}
					this.isDetailLoad = false
				})
				if(item.tracks.length != 0){
					this.$refs.detailsBox.style.width = this.$refs['top' + index][0].offsetWidth + 'px'
					this.$refs.detailsBox.style.height = this.$refs['top' + index][0].offsetHeight + 'px'
					this.$refs.detailsBox.style.top = this.$refs['top' + index][0].offsetTop - window.scrollY + 'px'
					this.$refs.detailsBox.style.left = this.$refs['top' + index][0].offsetLeft + 'px'
				}else{
					this.$refs.detailsBox.style.width = this.$refs['more' + index][0].offsetWidth + 'px'
					this.$refs.detailsBox.style.height = this.$refs['more' + index][0].offsetHeight + 'px'
					this.$refs.detailsBox.style.top = this.$refs['more' + index][0].offsetTop - window.scrollY + 'px'
					this.$refs.detailsBox.style.left = this.$refs['more' + index][0].offsetLeft + 'px'
				}
				this.isDetails = true
				setTimeout(() => {
					this.isBig = true
				}, 0)
				setTimeout(() => {
					this.isBigX = false
				}, 0)
			},
			back(){
				this.isBig = false
				this.isDetails = false
				this.isBigX = true
			}
		},
		
		created(){
			this.axios({
				methods: 'get',
				url: 'http://localhost:3000/toplist/detail'
			}).then(r => {
				this.topList = r.data.list
				this.isLoad = false
			})
		}
		
	}
</script>

<style lang="less" scoped>
	.load{
		margin: 50% auto;
	}
	.top{
		h2{
			margin: 0;
			padding: 0.4rem 1rem;
		}
		
		.topBox{
			>div{
				width: 90%;
				margin: 0 auto 0.2rem;
				border-radius: 0.3rem;
				box-shadow: 0 0 10PX #ececec;
				.coverT{
					margin: 0.3rem;
					height: 2rem;
					width: 2rem;
					border-radius: 0.3rem;
					box-shadow: 0 0 10PX #8a8a8a;
					vertical-align: middle;
				}
				.textBox{
					display: inline-block;
					vertical-align: middle;
					width: calc(~"100% - 3rem");
					p{
						text-overflow: ellipsis;
						white-space: nowrap;
						overflow: hidden;
					}
				}
			}
		}
		
		.moreBox{
			width: 90%;
			margin: 0 auto;
			.colBox{
				height: 40vw;
				.coverM{
					border-radius: 0.3rem;
					box-shadow: 0 0 10PX #8a8a8a;
					width: 90%;
					margin: 0 auto;
				}
				p{
					margin: 0;
					padding: 5%;
				}
			}
		}
		
		.tab{
			width: 100%;
			height: 1.5rem;
			position: fixed;
			left: 0;
			top: -1.5rem;
			background: #fff;
			z-index: 103;
			transition: all 0.5s;
			line-height: 1.5rem;
			.back{
				margin: 0 0 0 0.5rem;
				vertical-align: middle;
			}
			h2{
				margin: 0;
				padding: 0 0 0 0.5rem;
				display: inline-block;
				vertical-align: middle;
			}
		}
		.tabB{
			top: 0;
		}
		
		.detailsBox{
			transition: all 0.5s;
			box-shadow: 0 0 10PX transparent;
			position: fixed;
			z-index: 102;
			background: rgba(0,0,0,0.1);
			overflow-y: scroll;
			.listBox{
				background: #fff;
				position: relative;
				top: -1.5rem;
				.rank{
					width: 1.2rem;
					height: 1.2rem;
					line-height: 1.2rem;
					text-align: center;
					font-size: 0.5rem;
				}
				.red{
					color: #e4393c;
				}
				.limit{
					width: 70vw;
					text-overflow: ellipsis;
					white-space: nowrap;
					overflow: hidden;
				}
			}
		}
		.detailsBoxB{
			background: #fff!important;
			width: 100%!important;
			height: 100%!important;
			left: 0!important;
			top: 0!important;
		}
	}
</style>