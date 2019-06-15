<template>
	<div>
		<van-popup v-model="isDetails" class="popup" @click-overlay="close" position="bottom">
			<van-loading color="#8a8a8a" size="1rem" class="load" v-show="isPopupLoad" />
			<div class="topBox" v-show="!isPopupLoad">
				<van-row type="flex" justify="space-around">
					<van-col span="10" class="coverBox">
						<img :src="detailsPop.cover" class="auto_img" />
					</van-col>
					<van-col span="12" class="textBox">
						<h2>{{detailsPop.title}}</h2>
						<img :src="detailsPop.avatar" />
						<span>{{detailsPop.name}}</span>
						<p>{{detailsPop.des}}</p>
					</van-col>
				</van-row>
			</div>
			<div class="bottomBox" v-show="!isPopupLoad">
				<van-cell v-for="(item, index) in detailsPop.songList" :key="index" @click="play(detailsPop.songList, item, index)">
					<div slot="title" class="limit">{{item.name}}</div>
					<div slot="label" class="limit">
						<span>{{item.ar[0].name}} - </span>
						<span>{{item.al.name}}</span>
					</div>
				</van-cell>
			</div>
		</van-popup>
	</div>
</template>

<script>
	export default {
		name: 'popup',
		
		data(){
			return {
				isMore: -1,
			}
		},
		
		computed: {
			isDetails:{
				get: function(){
					return this.$store.state.isDetails
				},
				set: function(){}
			},
			isPopupLoad(){
				return this.$store.state.isPopupLoad
			}
		},
		
		props: {
			// 大标题
			detailsPop: {
				type: Object
			},
		},

		methods: {
			// 播放
			play(itemList, item, index){
				this.$store.state.itemList = itemList
				this.$store.state.item = item
				this.$store.state.index = index
				this.$store.state.isDetails = false
				this.isMore = -1
			},
			// 更多
			moreFn(index){
				if(this.isMore == index){
					this.isMore = -1
				}else{
					this.isMore = index
				}
			},
			// 点击蒙层关闭
			close(){
				this.$store.state.isDetails = false
				this.isMore = -1
			},
		},
		
	}
</script>

<style lang="less" scoped>
	.load{
		margin: 50% auto;
	}
	.popup{
		width: 90vw;
		height: 90vh;
		margin-bottom: 5vh;
		border-radius: 0.5rem;
		.topBox{
			padding: 5%;
			background: #f5f5f5;
			border-radius: 0.5rem;
			z-index: 99;
			position: sticky;
			top: 0;
			left: 0;
			.coverBox{
				img{
					border-radius: 0.3rem;
				}
			}
			.textBox{
				h2{
					margin-top: 0.1rem;
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
				img{
					height: 0.5rem;
					width: 0.5rem;
					border-radius: 50%;
					vertical-align: middle;
					margin-right: 0.1rem;
				}
				span{
					width: 2rem;
					vertical-align: middle;
					white-space: nowrap;
					text-overflow: ellipsis;
					overflow: hidden;
				}
				p{
					text-overflow: ellipsis;
					display: -webkit-box;
					-webkit-box-orient: vertical;
					-webkit-line-clamp: 2;
					overflow: hidden;
				}
			}
		}
		.bottomBox{
			.limit{
				width: calc(~"90vw - 0.8rem");
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
		}
	}
</style>