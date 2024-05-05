/**
 * 4-achieve.ts
 *
 * created by 2024/4/25
 * @file 手动实现 _group
 * @author  Yiero
 * */

// 导出一个名为select的函数
export const select = <T, K>(
	// 传入一个T类型的数组list
	list: T[],
	// 传入一个函数mapper，参数为T类型的item，返回值为K类型
	mapper: ( item: T, index: number ) => K,
	// 传入一个函数filter，参数为T类型的item，返回值为boolean类型
	filter: ( item: T, index: number ) => boolean,
): K[] => {
	// 判断list是否为数组类型，如果不是抛出错误
	if ( !Array.isArray( list ) ) {
		// throw new TypeError( 'Input parma "list" must be type Array.' );
		return [];
	}
	
	// 定义一个K类型的空数组resultList
	let resultList: K[] = [];
	
	// 遍历list数组
	for ( let index = 0; index < list.length; index++ ) {
		const item = list[ index ];
		// 如果filter函数返回值为false，则跳过当前循环
		if ( !filter( item, index ) ) {
			continue;
		}
		
		// 将mapper函数返回值添加到resultList数组中
		resultList.push( mapper( item, index ) );
	}
	
	// 返回resultList数组
	return resultList;
};

// /*
( () => {
	// @ts-ignore
	const select = <T, K>(
		// 传入一个T类型的数组list
		list: T[],
		// 传入一个函数mapper，参数为T类型的item，返回值为K类型
		mapper: ( item: T ) => K,
		// 传入一个函数filter，参数为T类型的item，返回值为boolean类型
		filter: ( item: T ) => boolean,
	): K[] => {
		// 判断list是否为数组类型，如果不是抛出错误
		if ( !Array.isArray( list ) ) {
			throw new TypeError( 'Input parma "list" must be type Array.' );
		}
		
		// 如果list为空，返回空数组
		if ( !list ) {
			return [];
		}
		
		// 使用reduce函数遍历list数组，将mapper函数返回值添加到resultList数组中
		return list.reduce<K[]>( ( resultList, item ) => {
			// 如果filter函数返回值为true，则将mapper函数返回值添加到resultList数组中
			if ( filter( item ) ) {
				resultList.push( mapper( item ) );
			}
			
			return resultList;
		}, [] );
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
