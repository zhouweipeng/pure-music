<template>
    <div class="home">
		
		<div class="topNavBox">
			<van-row type="flex" justify="center" class="topNav">
				<van-col span="4" v-for="(item, index) in topNavText" :key="index"><div :class="{page: true, active: tIndex==index}" @touchstart="changePage(item, index)">{{item.title}}</div></van-col>
			</van-row>
		</div>
		
		<router-view />
		
    </div>
</template>

<script>

    export default {

        name: 'home',

        data(){
			return {
				// 分页标题
				topNavText: [
					{title: '我的', view: 'my'},
					{title: '发现', view: 'find'},
					{title: '榜单', view: 'top'},
					{title: '搜索', view: 'search'}
				],
				// 分页下标
				tIndex: 1,
			}
		},
		
		methods: {
			changePage(item, index){
				this.tIndex = index
				this.$router.push({name: item.view})
			}
		},

    }
</script>

<style lang="less" scoped>
	.home{
		.topNavBox{
			position: sticky;
			left: 0;
			top: 0;
			padding: 0.25rem 0;
			z-index: 101;
			background: #fff;
			.topNav{
				width: 100%;
				.page{
					height: 1rem;
					background: #fff;
					border-radius: 0.5rem;
					text-align: center;
					line-height: 1rem;
					font-family: '宋体';
					transition: all 0.5s;
				}
				.active{
					font-size: 16PX;
					background: #ececec;
				}
			}
		}
		
    }
</style>
