import Vuex from 'vuex'

const store = new Vuex.Store({
	state: {
		hasLogin: false,
		userInfo: {},
	},
	mutations: {
		login(state, provider) {
			state.hasLogin = true;
			state.userInfo = provider;
			uni.setStorage({//缓存用户登陆状态
			    key: 'userInfo',  
			    data: provider  
			}) 
		},
		logout(state) {
			debugger
			state.hasLogin = false;
			state.userInfo = {};
			uni.removeStorage({  
                key: 'userInfo'  
            });
			uni.removeStorage({
			    key: 'token'  
			})
		}
	},
	actions: {
		// 初始化 store 状态
		  initializeStore({ commit }) {
		    // 从本地存储读取用户信息
		    uni.getStorage({
		      key: 'userInfo',
		      success: (res) => {
		        if (res.data) {
		          commit('login', res.data); // 提交 login mutation 更新状态
		        }
		      }
		    });
		    // 如果需要 token，可以一并读取
		    uni.getStorage({
		      key: 'token',
		      success: (res) => {
		        if (res.data) {
		          commit('setToken', res.data); // 假设有 setToken mutation
		        }
		      }
		    });
		  }
	}
})

export default store
