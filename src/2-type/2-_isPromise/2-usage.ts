/**
 * #2-usage.ts
 *
 * created by 2024/4/22
 * @file 使用 isPromise 函数
 * @author  Yiero
 * */
import { isPromise } from 'radash';

( () => {
	const value = new Promise( () => {} );
	
	if ( isPromise( value ) ) {
		value.then();
	}
} )();

( async () => {
	console.log( isPromise( 22 ) );
	// -> false
	
	console.log( isPromise( new Promise( () => {} ) ) );
	// -> true
	
	console.log( isPromise( { then: () => {} } ) );
	// -> true
} )();
