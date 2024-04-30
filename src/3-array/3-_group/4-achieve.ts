/**
 * 4-achieve.ts
 *
 * created by 2024/4/25
 * @file 手动实现 _group
 * @author  Yiero
 * */

// 导出一个名为_group的函数
export const group = <T, Key extends string | number | symbol>(
	items: readonly T[],
	getGroupIdFn: ( item: T ) => Key,
): Partial<Record<Key, T[]>> => {
	// 定义一个空对象result
	const result: Partial<Record<Key, T[]>> = {};
	// 遍历items数组
	for ( let item of items ) {
		// 获取callback函数的返回值key
		const key = getGroupIdFn( item );
		
		// 如果result中不存在key属性，则赋值为空数组
		result[ key ] ||= [];
		
		// 将item添加到result[key]中
		( <T[]> result[ key ] ).push( item );
	}
	// 返回result对象
	return result;
};

/*
( () => {
	const group = <T>( items: T[], getGroupIdFn: ( item: T ) => string | number | symbol ) => {
	};
} )();
// */


/*
( () => {
	const group = <T, Key extends string | number | symbol>(
		items: readonly T[],
		getGroupIdFn: ( item: T ) => Key,
	): { [prop in Key]?: T[] } => {
	
	};
} )();
// */

/*
( () => {
	const group = <T, Key extends string | number | symbol>(
		items: readonly T[],
		getGroupIdFn: ( item: T ) => Key,
	): Partial<Record<Key, T[]>> => {
	};
} )();
// */
