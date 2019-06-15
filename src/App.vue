<template>
	<div id="app" :class="{bPadding: itemList.length != 0}">
		
		<router-view v-show="isBS" />
		
		<div :class="{music: true, musicB: !isBS, musicS: isBS}" @click.stop="changeBS(true)" v-show="itemList.length != 0">
			<!-- 顶栏 -->
			<div class="topNav">
				<div @click.stop="changeBS(false)" class="backBox">
					<p><van-icon name="arrow-left" color="#000" size="18PX" class="vIcon" /></p>
					<p>{{musicName}}</p>
				</div>
				<p>{{singer}}</p>
			</div>
			
			<!-- 封面图 -->
			<div class="cover-box">
				<img :src="picURL" class="auto_img" />
			</div>
			
			<!-- 小文本 -->
			<div class="textS" v-show="isBS">
				<p>{{musicName}}</p>
				<p>{{singer}}</p>
			</div>
			
			<!-- 小图标 -->
			<div class="iconS" v-show="isBS">
				<img src="./assets/play.png" class="auto-img" v-show="!isplayIcon" @click.stop="playMusic" />
				<img src="./assets/paused.png" class="auto-img" v-show="isplayIcon" @click.stop="playMusic" />
				<img src="./assets/songLists.png" class="auto-img" @click.stop="showList" />
			</div>
			
			<!-- 爱的魔力转圈圈 -->
			<div class="record-box" @click.stop="showVolume">
				<div class="record1" ref="zqq1"></div>
				<div class="record2" ref="zqq2"></div>
				<div class="record3" ref="zqq3"></div>
			</div>
			
			<!-- 歌词 -->
			<div class="lrcBox" ref='lrcBox'>
				<div>
					<p ref="head">   </p>
					<p v-for="(item, index) in lrcArr" :key="index" :class="{playing: playingTime == item.time}">{{item.lrcCN}}</p>
					<p>   </p>
				</div>
			</div>
			
			<!-- 播放器 -->
			<audio :src="musicURL" autoplay ref="audio"></audio>
			
			<!-- 底栏 -->
			<div class="bottomNav">
				<div class="progressBox">
					<span class="leftSpan">{{currentTimeSpan}}</span>
					<van-slider v-model="progress" :min="0" :max="100" active-color="#000" @change="changeProgress" class="progress" />
					<span class="rightSpan">{{totalTimeSpan}}</span>
				</div>
				<van-row type="flex" justify="space-around">
					<van-col span="2"><img :src="orderArr[orderIndex]" class="auto_img" @click.stop="changeOrder" /></van-col>
					<van-col span="2"><img src="./assets/previous.png" @click.stop="previousMusic" class="auto_img" /></van-col>
					<van-col span="2">
						<div @click.stop="playMusic">
							<img src="./assets/play.png" class="auto_img" v-show="!isplayIcon" />
							<img src="./assets/paused.png" class="auto_img" v-show="isplayIcon" />
						</div>
					</van-col>
					<van-col span="2"><img src="./assets/next.png" @click.stop="nextMusic" class="auto_img" /></van-col>
					<van-col span="2"><img src="./assets/songList.png" class="auto_img" @click.stop="showList" /></van-col>
				</van-row>
			</div>
			
			<!-- 音量调节 -->
			<van-popup v-model="isVolume" class="volumeBox" position="left">
				<div>
					<van-slider v-model="volume" :min="0" :max="100" active-color="#000" @change="changeVolume" class="volume" />
				</div>
			</van-popup>
			
			<!-- 评论区露头 -->
			<div :class="{commentHead: true, commentSmall: !isComment, commentBig: isComment}" @click.stop="comment">
				<h2>热门评论</h2>
				<div class="comBox" v-for="(item, index) in commentData" :key="index">
					<img v-lazy="item.user.avatarUrl" class="avatar" />
					<div class="rightBox">
						<div class="titleBox">
							<p>{{item.user.nickname}}</p>
							<p>{{new Date(item.time).toLocaleDateString()}}</p>
						</div>
						<p>{{item.content}}</p>
					</div>
				</div>
			</div>
		</div>
		
		<!-- 当前歌单 -->
		<van-popup position="bottom" v-model="isShowList" class="songListBox">
			<h2>
				播放列表
				<van-icon name="delete" class="delete" @click="deleteList" />
			</h2>
			<div class="ListBox">
				<van-cell v-for="(item, index) in itemList" :key="index" :class="{playing: index == musicIndex}" @click="play(item, index)">
					<div slot="title" class="limit">{{item.name}}</div>
					<div slot="label" class="limit">
						<span>{{item.ar[0].name}} - </span>
						<span>{{item.al.name}}</span>
					</div>
					<van-icon slot="right-icon" name="volume-o" class="playingIcon" v-if="index == musicIndex" />
				</van-cell>
			</div>
		</van-popup>
	</div>
</template>

<script>
	import lrcJS from './utils/lrc.js'
	import BScroll from 'better-scroll'
	
	var scroll
	
	export default {
	
		name: 'music',
	
		data(){
			return {
				// 播放顺序
				orderArr: [
					require('./assets/order-sx.png'),
					require('./assets/order-sj.png'),
					require('./assets/order-dq.png')
				],
				orderIndex: 0,
				// 播放暂停图标
				isplayIcon: true,
				// 播放地址
				musicURL: '',
				// 歌曲名
				musicName: '乐享音乐',
				// 歌手名
				singer: '周伟鹏',
				// 热评
				commentData: [],
				// 音乐图片
				picURL: require('./assets/default.png'),
				// 歌词数据
				lrcArr: [],
				// 音量
				volume: 50,
				// 播放进度百分比
				progress: 0,
				// 播放进度时间
				progressTime: 0,
				// 音乐总时间
				musicTime: 0,
				// 播放到对应歌词的时间
				playingTime: 0,
				// 展示当前歌单
				isShowList: false,
				// 展示音量调节
				isVolume: false,
				// 评论区
				isComment: false,
			}
		},
		
		computed: {
			isBS(){
				return this.$store.state.isBS
			},
			musicData(){
				return this.$store.state.item
			},
			musicIndex(){
				return this.$store.state.index
			},
			currentTimeSpan(){
				return lrcJS.dateToTimeFormat(this.progressTime)
			},
			totalTimeSpan(){
				return lrcJS.dateToTimeFormat(this.musicTime)
			},
			itemList(){
				return this.$store.state.itemList
			}
		},
	
		methods: {
			// 切换播放模式
			changeOrder(){
				if(this.orderIndex == 0){
					this.orderIndex = 1
					this.$toast('随机播放')
				}else if(this.orderIndex == 1){
					this.orderIndex = 2
					this.$toast('单曲循环')
				}else{
					this.orderIndex = 0
					this.$toast('顺序播放')
				}
			},
			// 播放
			play(item, index){
				this.$store.state.item = item
				this.$store.state.index = index
				this.isShowList = false
			},
			// 播放暂停
			playMusic(){
				if(this.isplayIcon == true){
					this.isplayIcon = false
					this.$refs.audio.pause()
					this.$refs.zqq1.style.animationPlayState = "paused"
					this.$refs.zqq2.style.animationPlayState = "paused"
					this.$refs.zqq3.style.animationPlayState = "paused"
				}else{
					this.isplayIcon = true
					this.$refs.audio.play()
					this.$refs.zqq1.style.animationPlayState = "running"
					this.$refs.zqq2.style.animationPlayState = "running"
					this.$refs.zqq3.style.animationPlayState = "running"
				}
			},
			// 音量弹出框
			showVolume(){
				this.isVolume = true
			},
			// 调音量
			changeVolume(){
				if(isNaN(this.volume / 100)){
					return
				}
				if(this.$refs.audio){
					this.$refs.audio.volume = (this.volume / 100)
				}
			},
			// 调进度
			changeProgress(){
				this.$refs.audio.currentTime = this.progress / 100 * this.musicTime
			},
			// 上一曲
			previousMusic(){
				if(this.$store.state.index == 0){
					this.$store.state.item = this.$store.state.itemList[this.$store.state.itemList.length - 1]
					this.$store.state.index = this.$store.state.itemList.length - 1
				}else{
					this.$store.state.item = this.$store.state.itemList[this.$store.state.index - 1]
					this.$store.state.index -= 1
				}
				this.isplayIcon = true
				this.$refs.zqq1.style.animationPlayState = "running"
				this.$refs.zqq2.style.animationPlayState = "running"
				this.$refs.zqq3.style.animationPlayState = "running"
			},
			// 下一曲
			nextMusic(){
				if(this.itemList.length == 1){
					this.$refs.audio.currentTime = 0
					this.$refs.audio.play()
					return
				}
				if(this.orderIndex == 0){ // 顺序播放
					if(this.$store.state.index == this.$store.state.itemList.length - 1){
						this.$store.state.item = this.$store.state.itemList[0]
						this.$store.state.index = 0
					}else{
						let num = this.$store.state.index + 1
						this.$store.state.item = this.$store.state.itemList[num]
						this.$store.state.index = num
					}
				}else if(this.orderIndex == 1){ // 随机播放
					let num = this.random()
					this.$store.state.item = this.$store.state.itemList[num]
					this.$store.state.index = num
				}else{ // 单曲循环
					this.$refs.audio.currentTime = 0
					this.$refs.audio.play()
				}
				this.isplayIcon = true
				this.$refs.zqq1.style.animationPlayState = "running"
				this.$refs.zqq2.style.animationPlayState = "running"
				this.$refs.zqq3.style.animationPlayState = "running"
			},
			// 产生不重复随机数随机播放
			random(){
				var num = Math.floor(Math.random() * this.$store.state.itemList.length)
				if(num == this.$store.state.index){
					this.random()
					return
				}
				return num
			},
			// 获取歌词
			getLRC(){
				var lrcData = JSON.parse(localStorage.getItem('lrcData'))
				if(!lrcData){
					this.axios({
						methods: 'get',
						url: 'http://localhost:3000/lyric?id=' + this.musicData.id
					}).then(r => {
						// console.log('一首歌词都没有，get请求歌词')
						lrcData = {}
						lrcData[this.musicData.id] = lrcJS.lrcFormat(r.data.lrc.lyric)
						this.$store.state.lrcList = lrcData
						localStorage.setItem('lrcData', JSON.stringify(lrcData))
						this.lrcArr = this.$store.state.lrcList[this.musicData.id]
					})
				}else if(!lrcData[this.musicData.id]){
					// console.log('没有这首歌词，get请求数据')
					this.axios({
						methods: 'get',
						url: 'http://localhost:3000/lyric?id=' + this.musicData.id
					}).then(r => {
						lrcData[this.musicData.id] = lrcJS.lrcFormat(r.data.lrc.lyric)
						this.$store.state.lrcList = lrcData
						localStorage.setItem('lrcData', JSON.stringify(lrcData))
						this.lrcArr = this.$store.state.lrcList[this.musicData.id]
					})
				}else{
					// console.log('请求本地数据')
					this.$store.state.lrcList = lrcData
					this.lrcArr = lrcData[this.musicData.id]
				}
			},
			// 获取音乐播放地址
			getMusicURL(){
				this.musicURL = 'https://music.163.com/song/media/outer/url?id=' + this.musicData.id + '.mp3'
			},
			// 获取图片地址
			getPicURL(){
				this.picURL = this.musicData.al.picUrl
			},
			// 获取音乐名字
			getMusicName(){
				this.musicName = this.musicData.name
			},
			// 获取歌手名字
			getSinger(){
				if(this.musicData.ar.length == 1){
					this.singer = this.musicData.ar[0].name
				}else{
					this.singer = ''
					for (var i = 0; i < this.musicData.ar.length; i++) {
						this.singer += this.musicData.ar[i].name + ' '
					}
				}
			},
			// 获取音乐时间
			getMusicTime(){
				this.musicTime = this.musicData.dt / 1000
			},
			// 获取热门评论
			getComment(){
				this.axios({
					methods: 'get',
					url: 'http://localhost:3000/comment/music?id=' + this.musicData.id
				}).then(r => {
					this.commentData = r.data.hotComments
				})
			},
			// 素质六连
			sixsixsix(){
				this.getLRC()
				this.getMusicURL()
				this.getPicURL()
				this.getMusicName()
				this.getSinger()
				this.getMusicTime()
				this.getComment()
			},
			// 展示当前歌单
			showList(){
				this.isShowList = !this.isShowList
			},
			// 评论区
			comment(){
				this.isComment = !this.isComment
			},
			changeBS(flag){
				if(flag){ // 点击全局
					this.$store.state.isBS = false
				}else{ // 点击箭头
					this.$store.state.isBS = true
				}
			},
			// 删除歌单
			deleteList(){
				this.$dialog.confirm({
					message: '确定要清空播放列表吗？'
				}).then(() => {
					this.$store.state.itemList = []
					this.$store.state.item = {}
					this.$store.state.index = -1
					this.isShowList = false
					this.$store.state.isBS = true
					this.$refs.audio.pause()
				}).catch(() => {})
			}
		},
	
		mounted(){
			// 初始化音量
			this.changeVolume()
			// 开始播放时动画开始
			this.$refs.audio.oncanplay = () => {
				this.isplayIcon = true
				this.$refs.zqq1.style.animationPlayState = "running"
				this.$refs.zqq2.style.animationPlayState = "running"
				this.$refs.zqq3.style.animationPlayState = "running"
				scroll.scrollToElement(this.$refs.head, 800)
			}
			// 实时更新播放进度
			this.$refs.audio.ontimeupdate = () => {
				this.progressTime = this.$refs.audio.currentTime
				this.progress = this.$refs.audio.currentTime / this.musicTime * 100
				for (var i = 0; i < this.lrcArr.length; i++) {
					if(this.$refs.audio.currentTime > this.lrcArr[i].time){
						this.playingTime = this.lrcArr[i].time
					}
				}
			}
			// 播放完之后
			this.$refs.audio.onended = () => {
				this.isplayIcon = false
				this.$refs.zqq1.style.animationPlayState = "paused"
				this.$refs.zqq2.style.animationPlayState = "paused"
			  	this.$refs.zqq3.style.animationPlayState = "paused"
				this.nextMusic()
			}
			// 歌词
			scroll = new BScroll(this.$refs.lrcBox, {
				click: true,
			})
		},
		
		watch: {
			playingTime(n, o){
				for (var i = 0; i < this.lrcArr.length; i++) {
					if(n == this.lrcArr[i].time){
						scroll.scrollToElement(document.querySelector('.playing'), 800)
					}
				}
			},
			musicData(n, o){
				if(n.name){
					this.sixsixsix()
					this.$refs.audio.currentTime = 0
					// this.$refs.audio.play()
				}
			}
		},
	
		// 退出页面时销毁
		beforeDestroy(){
			if(this.$refs.audio){
				this.$refs.audio.ontimeupdate = null
			}
		},
	
	}
</script>

<style lang="less">
	.auto_img{
		width: 100%;
		display: block;
	}
	
	.auto-img{
		height: 100%;
		display: block;
	}
	
	*{
		// font-family: '宋体';
		-webkit-transform: translate3d(250px,250px,250px)
		rotate3d(250px,250px,250px,-120deg)
		scale3d(0.5, 0.5, 0.5);
	}
</style>

<style lang="less" scoped>
	.bPadding{
		padding-bottom: 2rem;
	}
	.songListBox{
		height: 50vh;
		border-top-left-radius: 0.5rem;
		border-top-right-radius: 0.5rem;
		h2{
			height: 1.5rem;
			line-height: 1.5rem;
			margin: 0;
			padding: 0 0.4rem;
			.delete{
				float: right;
				margin-top: calc(~"0.75rem - 9px");
			}
		}
		.ListBox{
			height: calc(~"50vh - 1.5rem");
			overflow-y: scroll;
			.limit{
				width: 80vw;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
			.playing{
				color: #e4393c;
				.playingIcon{
					line-height: 1.2rem;
				}
			}
		}
	}
	.music{
		transition: all 0.5s;
		-webkit-backface-visibility: hidden;
		*{
			transition: all 0.5s;
			-webkit-backface-visibility: hidden;
		}
	}
	.musicB{
		height: 100%;
		width: 100%;
		.topNav{
			display: flex;
			justify-content: space-between;
			position: fixed;
			left: 0;
			right: 0;
			top: 0;
			z-index: 103;
			height: 1.8rem;
			padding: 0 0.3rem;
			font-family: '宋体';
			line-height: 1.8rem;
			background: #ececec;
			border-bottom-left-radius: 0.5rem;
			border-bottom-right-radius: 0.5rem;
			.backBox{
				z-index: 104;
			}
			.vIcon{
				margin-right: 0.3rem ;
				vertical-align: -11%;
			}
			p{
				margin: 0;
				padding: 0 0.1rem;
				display: inline-block;
				font-size: 18PX;
				font-weight: 500;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
				max-width: 30vw;
				text-align: right;
			}
		}
		
		.cover-box{
			width: 5rem;
			height: 5rem;
			border-radius: 50%;
			overflow: hidden;
			margin: 3.8rem auto;
		}
		
		.record-box{
			width: 100%;
			height: 10rem;
			position: absolute;
			top: 1.3rem;
			overflow: hidden;
			.record1{
				width: 8rem;
				height: 8rem;
				border-radius: 50%;
				box-sizing: border-box;
				border: 0.2rem solid transparent;
				border-top-color: #c4d7b7;
				border-left-color: #c4d7b7;
				position: absolute;
				left: calc(~"50% - 4rem");
				top: calc(~"50% - 4rem");
				animation: zqq 2s linear 0s infinite paused;
			}
			.record2{
				width: 7rem;
				height: 7rem;
				border-radius: 50%;
				box-sizing: border-box;
				border: 0.2rem solid transparent;
				border-bottom-color: #cccccb;
				border-right-color: #cccccb;
				position: absolute;
				left: calc(~"50% - 3.5rem");
				top: calc(~"50% - 3.5rem");
				animation: zqqx 2s linear 0s infinite paused;
			}
			.record3{
				width: 6rem;
				height: 6rem;
				border-radius: 50%;
				box-sizing: border-box;
				border: 0.2rem solid transparent;
				border-top-color: #c4b7d7;
				border-right-color: #c4b7d7;
				position: absolute;
				left: calc(~"50% - 3rem");
				top: calc(~"50% - 3rem");
				animation: zqq 2s linear 0s infinite paused;
			}
		}
		
		.lrcBox{
			// background: #f5f5f5;
			border-radius: 0.5rem;
			position: absolute;
			top: 10.8rem;
			right: 0;
			bottom: 4.2rem;
			left: 0;
			overflow: hidden;
			p{
				margin: 0;
				height: 1rem;
				line-height: 1rem;
				text-align: center;
				color: #808080;
				font-family: '宋体';
				transition: all 0.8s;
			}
			p.playing{
				color: #000;
				font-size: 14PX;
			}
		}
		
		.bottomNav{
			width: 100%;
			height: 4rem;
			background: #f5f5f5;
			border-top-left-radius: 0.5rem;
			border-top-right-radius: 0.5rem;
			position: fixed;
			left: 0;
			bottom: 0;
			right: 0;
			.progressBox{
				position: relative;
				height: 1rem;
				.progress{
					width: 60%;
					margin: 0.8rem auto;
				}
				span{
					height: 1rem;
					position: absolute;
					top: -0.15rem;
					width: 20%;
					text-align: center;
				}
				.leftSpan{
					left: 0;
				}
				.rightSpan{
					right: 0;
				}
			}
			.van-col--2{
				max-width: 1rem;
			}
		}
		
		.volumeBox{
			width: 100%;
			// height: 1rem;
			border-radius: 0.5rem;
			.volume{
				width: 60%;
				margin: 0.5rem auto;
			}
		}
		
		.commentHead{
			height: 0.5rem;
			width: 70%;
			background: #ececec;
			box-shadow: 0 0 5PX #cdcdcd;
			border-top-left-radius: 0.5rem;
			border-top-right-radius: 0.5rem;
			position: fixed;
			left: 15%;
			bottom: 0;
			transition: all 0.5s;
			h2{
				width: 90%;
				margin: 0.5rem auto;
			}
		}
		.commentSmall{
			*{
				width: 0;
				height: 0;
				font-size: 0;
				transition: width 0.5s, height 0.5s;
			}
		}
		.commentBig{
			height: 100%;
			width: 100%;
			left: 0;
			z-index: 104;
			border-radius: 0;
			background: #fff;
			overflow-y: scroll;
			.comBox{
				width: 90%;
				margin: 0.5rem auto;
			}
			.avatar{
				width: 1.2rem;
				height: 1.2rem;
				border-radius: 50%;
				vertical-align: top;
			}
			.rightBox{
				display: inline-block;
				width: calc(~"100% - 1.5rem");
				padding-left: 0.3rem;
				background: #f5f5f5;
				.titleBox{
					p{
						margin: 0;
						height: 0.6rem;
						line-height: 0.6rem;
					}
				}
			}
		}
	}
	
	.musicS{
		position: fixed;
		left: 0;
		bottom: 0;
		height: 2rem;
		width: 100%;
		background: linear-gradient(to bottom, #ececec, #f5f5f5);
		border-top-left-radius: 0.5rem;
		border-top-right-radius: 0.5rem;
		// box-shadow: 0 0 10PX #ececec;
		.topNav{width: 0;height: 0;overflow: hidden;}
		.record-box{width: 0;height: 0;overflow: hidden;}
		.lrcBox{width: 0;height: 0;overflow: hidden;}
		.bottomNav{width: 0;height: 0;overflow: hidden;}
		.commentHead{width: 0;height: 0;overflow: hidden;}
		.cover-box{
			width: 1.6rem;
			height: 1.6rem;
			border-radius: 50%;
			margin: 0.2rem;
			margin-left: 5%;
			overflow: hidden;
			float: left;
		}
		.textS{
			height: 2rem;
			line-height: 1rem;
			float: left;
			p{
				margin: 0;
				width: 50vw;
				text-overflow: ellipsis;
				white-space: nowrap;
				overflow: hidden;
			}
		}
		.iconS{
			height: 0.8rem;
			position: absolute;
			top: calc(~"50% - 0.4rem");
			right: 5%;
			img{
				display: inline-block;
				margin-left: 0.2rem;
			}
		}
	}
	
	@keyframes zqq {
		0%{
			transform: rotate(0deg);
		}
		100%{
			transform: rotate(360deg);
		}
	}
	
	@keyframes zqqx {
		0%{
			transform: rotate(0deg);
		}
		100%{
			transform: rotate(-360deg);
		}
	}
</style>