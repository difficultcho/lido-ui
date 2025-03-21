//import request from '@/utils/requestUtil'

export function memberLogin(data) {
	const immediatePromise = new Promise((resolve) => {
		const jsonObject = {
			data: {
				tokenHead: 'TOKENHEAD',
				token: 'TOKEN'
			}
		};
		resolve(jsonObject);
	});

	return immediatePromise;
	// 	return request({
	// 		method: 'POST',
	// 		url: '/sso/login',
	// 		header: {
	// 			'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
	// 		},
	// 		data: data
	// 	})
}

export function memberInfo() {
	const immediatePromise = new Promise((resolve) => {
		const jsonObject = {
			data: {
				name: '张淼'
			}
		};
		resolve(jsonObject);
	});

	return immediatePromise;
	// return request({
	// 	method: 'GET',
	// 	url: '/sso/info'
	// })
}

export function getMenu() {
	const immediatePromise = new Promise((resolve) => {
		const menus = [{
				text: '首页',
				name: 'Home',
				icon: 'home'
			},
			{
				text: '用户管理',
				name: 'User',
				icon: 'person'
			},
			{
				text: '订单管理',
				name: 'Order',
				icon: 'cart'
			}
		];
		resolve(menus);
	});

	return immediatePromise;
	// return request({
	// 	method: 'GET',
	// 	url: '/sso/info'
	// })
}