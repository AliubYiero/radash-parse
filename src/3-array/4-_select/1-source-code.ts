/**
 * #1-source-code.ts
 *
 * created by 2024/4/25
 * @file 源码实现
 * @author  Yiero
 * */

/**
 * select 方法使用 reduce 内部执行 filter 和 map，
 * 只迭代数组一次.
 *
 * @example
 * select([1, 2, 3, 4], x => x*x, x > 2) --> [9, 16]
 */
export const select = <T, K>(
	array: readonly T[],
	mapper: ( item: T, index: number ) => K,
	condition: ( item: T, index: number ) => boolean,
) => {
	if ( !array ) return [];
	return array.reduce( ( acc, item, index ) => {
		if ( !condition( item, index ) ) return acc;
		acc.push( mapper( item, index ) );
		return acc;
	}, [] as K[] );
};
