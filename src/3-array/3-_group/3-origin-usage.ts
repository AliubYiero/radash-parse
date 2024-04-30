/**
 * 3-origin-usage.ts
 *
 * created by 2024/4/22
 * @file 原生js/ts使用
 * @author  Yiero
 * */

const groupBy = <Key extends PropertyKey, T>(
	items: Iterable<T>,
	getGroupIdFn: ( item: T, index: number ) => Key,
): Partial<Record<Key, T[]>> => {
	// 定义一个空对象result, 并声明其类型为 `Partial<Record<Key, T[]>>`
	const result: Partial<Record<Key, T[]>> = {};
	
	let index = 0;
	for ( let item of items ) {
		const key = getGroupIdFn( item, index++ );
		
		result[ key ] ||= [];
		
		// 这里会报错 `result[ key ]` 可能为空, 但是因为上面已经写入数组了, 不可能为空, 所以直接用类型断言就可以了
		( <T[]> result[ key ] ).push( item );
	}
	
	// 返回result对象
	return result;
};
