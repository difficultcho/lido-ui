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
