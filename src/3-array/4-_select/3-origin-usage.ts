/**
 * 3-origin-usage.ts
 *
 * created by 2024/4/22
 * @file 原生js/ts实现该方法的对应的效果
 * @author  Yiero
 * */

( () => {
	const array = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
	
	// filter
	let result = array.filter( ( item ) => item >= 4 && item <= 8 );
	
	// map
	result = array.map( ( item ) => item * 2 );
	
	console.log( result );
	// -> [ 8, 10, 12, 14, 16 ]
} )();

( () => {
	const array = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
	
	let result = array.reduce<number[]>( ( result, item ) => {
		if ( item >= 4 && item <= 8 ) {
			result.push( item * 2 );
		}
		
		return result;
	}, [] );
	
	console.log( result );
	// -> [ 8, 10, 12, 14, 16 ]
} )();

( () => {
	const array = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
	
	let result = [];
	for ( const item of array ) {
		if ( item >= 4 && item <= 8 ) {
			result.push( item * 2 );
		}
	}
	
	console.log( result );
	// -> [ 8, 10, 12, 14, 16 ]
} )();
