/**
 * #2-usage.ts
 *
 * created by 2024/4/22
 * @file 用法
 * @author  Yiero
 * */

import { select } from 'radash';

( () => {
	const array = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

// 筛选出 大于等于4, 小于等于8 的数字, 并筛选之后的数字乘以 2 输出为一个新数组
	const result = select(
		array,
		( item ) => item * 2,
		( item ) => item >= 4 || item <= 8,
	);
	
	console.log( result );
// -> [ 8, 10, 12, 14, 16 ]
} )();
