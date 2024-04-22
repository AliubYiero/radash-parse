/**
 * #1-source-code.ts
 *
 * created by 2024/4/22
 * @file 源码实现
 * @author  Yiero
 * */

import { isPromise } from 'radash';

/**
 * A helper to try an async function without forking
 * the control flow. Returns an error first callback _like_
 * array response as [Error, result]
 */
export const tryit = <Args extends any[], Return>(
	func: ( ...args: Args ) => Return,
) => {
	return (
		...args: Args
	): Return extends Promise<any>
		? Promise<[ Error, undefined ] | [ undefined, Awaited<Return> ]>
		: [ Error, undefined ] | [ undefined, Return ] => {
		try {
			const result = func( ...args );
			if ( isPromise( result ) ) {
				return result
					.then( value => [ undefined, value ] )
					.catch( err => [ err, undefined ] ) as Return extends Promise<any>
					? Promise<[ Error, undefined ] | [ undefined, Awaited<Return> ]>
					: [ Error, undefined ] | [ undefined, Return ];
			}
			
			return [ undefined, result ] as Return extends Promise<any>
				? Promise<[ Error, undefined ] | [ undefined, Awaited<Return> ]>
				: [ Error, undefined ] | [ undefined, Return ];
		}
		
		catch ( err ) {
			return [ err as any, undefined ] as Return extends Promise<any>
				? Promise<[ Error, undefined ] | [ undefined, Awaited<Return> ]>
				: [ Error, undefined ] | [ undefined, Return ];
		}
	};
};
