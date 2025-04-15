export function userLogin(data) {
	// const immediatePromise = new Promise((resolve) => {
	// 	const jsonObject = {
	// 		data: {
	// 			tokenHead: 'TOKENHEAD',
	// 			token: 'TOKEN'
	// 		}
	// 	};
	// 	resolve(jsonObject);
	// });

	// return immediatePromise;
	return uni.request({
	    url: 'https://lidomock.free.beeceptor.com/login',
	    data: {},
	    header: {
	        'custom-header': 'hello'
	    }
	});
}

export function getUserInfo() {
	// const immediatePromise = new Promise((resolve) => {
	// 	const jsonObject = {
	// 		data: {
	// 			name: '张淼'
	// 		}
	// 	};
	// 	resolve(jsonObject);
	// });

	// return immediatePromise;
	return uni.request({
	    url: 'https://lidomock.free.beeceptor.com/userInfo',
	    data: {},
	    header: {
	        'custom-header': 'hello'
	    }
	});
}

export function getMenu() {
	const immediatePromise = new Promise((resolve) => {
		const menus = [{
				id: 'sys',
				title: '客户管理',
				isFolder: true,
				isOpen: false,
				children: [{
						id: 'user',
						title: '客户列表',
						component: 'User',
						icon: 'person'
					},
					{
						id: 'role',
						title: '数据分析',
						component: 'Role',
						icon: 'staff'
					}
				]
			},
			{
				id: 'order',
				title: '订单管理',
				isFolder: true,
				isOpen: false,
				children: [{
						id: 'order-list',
						title: '订单列表',
						component: 'Order',
						icon: 'shop'
					}
				]
			}
		];
		resolve(menus);
	});

	return immediatePromise;
}