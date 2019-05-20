<template>
	<div class="login">
		
		<!-- 花里胡哨 -->
		<table>
			<tr>
				<td></td>
				<td></td>
				<td></td>
				<td :class="{zxc: isZXC, qwe: isQWE}" style="transition-delay: 0s;"></td>
				<td :class="{zxc: isZXC, qwe: isQWE}" style="transition-delay: 0.07s;"></td>
			</tr>
			<tr>
				<td></td>
				<td></td>
				<td></td>
				<td :class="{zxc: isZXC, qwe: isQWE}" style="transition-delay: 0.14s;"></td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td></td>
				<td></td>
				<td :class="{zxc: isZXC, qwe: isQWE}" style="transition-delay: 0.21s;"></td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td :class="{zxc: isZXC, qwe: isQWE}" style="transition-delay: 0.28s;"></td>
				<td :class="{zxc: isZXC, qwe: isQWE}" style="transition-delay: 0.35s;"></td>
				<td :class="{zxc: isZXC, qwe: isQWE}" style="transition-delay: 0.42s;"></td>
				<td></td>
			</tr>
			<tr>
				<td :class="{zxc: isZXC, qwe: isQWE}" style="transition-delay: 0.49s;"></td>
				<td :class="{zxc: isZXC, qwe: isQWE}" style="transition-delay: 0.56s;"></td>
				<td :class="{zxc: isZXC, qwe: isQWE}" style="transition-delay: 0.63s;"></td>
				<td :class="{zxc: isZXC, qwe: isQWE}" style="transition-delay: 0.7s;"></td>
				<td></td>
			</tr>
			<tr>
				<td></td>
				<td :class="{zxc: isZXC, qwe: isQWE}" style="transition-delay: 0.77s;"></td>
				<td :class="{zxc: isZXC, qwe: isQWE}" style="transition-delay: 0.84s;"></td>
				<td></td>
				<td></td>
			</tr>
		</table>
		
		<!-- 登录表单 -->
		<div :class="{formBoxB: isBS, formBoxS: !isBS}">
			<van-field class="field" v-model="phoneValue" placeholder="手机号" left-icon="manager" />
			<van-field class="field" v-model="pwdValue" placeholder="密码" left-icon="lock" type="password" />
			<van-button class="btn" @click="loginFn" :loading="isLoading">登录</van-button>
		</div>
		
	</div>
</template>

<script>
	export default {
		name: 'login',
		
		data(){
			return {
				isZXC: false,
				isQWE: false,
				isBS: false,
				isLoading: false,
				phoneValue: '',
				pwdValue: ''
			}
		},
		
		methods: {
			loginFn(){
				if(this.phoneValue == '' || this.pwdValue == ''){
					return this.$toast('不能为空');
				}
				this.isLoading = true
				this.axios({
					methods: 'get',
					url: 'http://localhost:3000/login/cellphone?phone=' + this.phoneValue + '&password=' + this.pwdValue
				}).then(r => {
					this.isLoading = false
					this.$store.state.loginData = r.data.profile
					this.$router.push({name: 'home'})
				}).catch(e => {
					this.$toast('密码错误或用户不存在')
					this.isLoading = false
					console.log(e)
				})
			}
		},
		
		created(){
			this.$store.state.itemList = []
			this.$store.state.item = {}
			this.$store.state.index = -1
		},
		
		mounted(){
			setTimeout(() => {
				this.isZXC = true
				this.isQWE = true
				this.isBS = true
				setInterval(() => {
					this.isQWE = !this.isQWE
				}, 3000)
			}, 100)
		}
	}
</script>

<style lang="less" scoped>
	.login{
		table{
			width: 5rem;
			height: 6rem;
			margin: 2rem auto 0;
			td{
				transition: all 1s;
				position: relative;
				left: 0;
				top: 6rem;
			}
		}
		.zxc{
			width: 1rem;
			height: 1rem;
			background: #ececec;
			border-radius: 50%;
			top: 0;
			left: 0;
		}
		.qwe{
			transform: rotateX(360deg) rotateY(360deg) rotateZ(360deg);
			background: #000;
		}
		.formBoxS{
			width: 0;
			height: 0;
			font-size: 0;
			*{
				width: 0;
				height: 0;
				font-size: 0;
			}
		}
		.formBoxB{
			transition: all 1.2s;
			width: 80%;
			height: 6rem;
			background: #f5f5f5;
			border-radius: 0.5rem;
			position: fixed;
			left: 10%;
			bottom: 1.5rem;
			.field{
				width: 80%;
				margin: 0.6rem 10%;
			}
			.btn{
				border: none;
				width: 80%;
				margin-left: 10%;
				color: #000;
				font-size: 18PX;
				font-family: '宋体';
			}
		}
		
	}
</style>
