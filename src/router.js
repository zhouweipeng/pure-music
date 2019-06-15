import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

export default new Router({
	routes: [
		{
			path: "/login",
			name: "login",
			component: r => require(['./views/Login.vue'], r),
		},
		{
			path: "/home",
			name: "home",
			component: r => require(['./views/Home.vue'], r),
			children: [
				{
					path: "/home/my",
					name: "my",
					component: r => require(['./views/My.vue'], r),
				},
				{
					path: "/home/find",
					name: "find",
					component: r => require(['./views/Find.vue'], r),
				},
				{
					path: "/home/top",
					name: "top",
					component: r => require(['./views/Top.vue'], r),
				},
				{
					path: "/home/search",
					name: "search",
					component: r => require(['./views/Search.vue'], r),
				}
			],
			redirect: '/home/find'
		},
		{
			path: "/singer",
			name: "singer",
			component: r => require(['./views/Singer.vue'], r),
		},
		{
			path: '/',
			redirect: '/login'
		}
	]
});
