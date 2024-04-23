/**
 * 4-achieve.ts
 *
 * created by 2024/4/22
 * @file 手动实现 _try
 * @author  Yiero
 * */

export const isPromise = ( value: any ): value is Promise<any> => {
	return Boolean(
		value
		&& ( [ 'object', 'function' ].includes( typeof value ) )
		&& value.then
		&& typeof value.then === 'function',
	);
};


( () => {
	// @ts-ignore 忽略没有使用的 isPromise 报错
	const isPromise = ( value: any ): boolean => {
		return Boolean(
			value
			&& ( [ 'object', 'function' ].includes( typeof value ) )
			&& value.then
			&& typeof value.then === 'function',
		);
	};
	
	/*
	* 这里通过 counter 进行的三元运算符给 x 赋值是为了模拟正常代码环境中复杂的变量使用场景
	* 如果直接给 x 赋值, 这种简单场景 ts 会导致直接就推断出来了 x 的类型
	* */
	let counter = 1;
	let x: string | Promise<string> = counter ?
		'20'
		: new Promise( ( resolve ) => resolve( '20' ) );
	
	if ( isPromise( x ) ) {
		// 进行类型断言 x: Promise<string>
		( <Promise<string>> x ).then( ( res ) => {
			console.log( res );
		} );
	}
	
	console.log( x );
	
} )();
