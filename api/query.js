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
				title: '人员管理',
				isFolder: true,
				isOpen: false,
				children: [{
						id: 'user',
						title: '学生管理',
						component: 'User',
						icon: 'person'
					},
					{
						id: 'role',
						title: '教师管理',
						component: 'Role',
						icon: 'staff'
					}
				]
			},
			{
				id: 'order',
				title: '课程管理',
				isFolder: true,
				isOpen: false,
				children: [{
						id: 'order-list',
						title: '课程列表',
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