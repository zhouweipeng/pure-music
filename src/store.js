import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		// 登录信息
		loginData: {},
		// 歌词列表
		lrcList: {},
		// 当前播放的歌单、歌曲及下标
		itemList: [],
		item: {},
		index: -1,
		// 播放器的大小
		isBS: true,
		// popup组件的显示隐藏
		isDetails: false,
		// 歌手信息
		singerData: {},
		// 弹出框加载动画
		isPopupLoad: true
	}
});
