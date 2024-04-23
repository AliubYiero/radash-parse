/**
 * isPromise.spec.ts
 *
 * created by 2024/4/23
 * @file FILE_DESCRIPTION
 * @author  Yiero
 * */

import { isPromise } from '../../src/2-type/2-_isPromise/4-achieve';
import { assert, describe, test } from 'vitest';
import { isFunction } from 'radash';

describe( 'isPromise function', () => {
	test( 'return true for Promise values', () => {
		assert.isTrue( isPromise( new Promise( res => res( 0 ) ) ) );
		assert.isTrue( isPromise( new Promise( res => res( '' ) ) ) );
		assert.isTrue( isPromise( ( async () => {} )() ) );
		assert.isTrue( isPromise( { then: () => {} } ) );
	} );
	test( 'return false for non-Date values', () => {
		assert.isFalse( isPromise( 22 ) );
		assert.isFalse( isPromise( { name: 'x' } ) );
		assert.isFalse( isPromise( 'abc' ) );
		assert.isFalse( isPromise( String( 'abc' ) ) );
		assert.isFalse( isPromise( [ 1, 2, 3 ] ) );
		assert.isFalse( isPromise( function work() {} ) );
		assert.isFalse( isPromise( () => {} ) );
		assert.isFalse( isPromise( Symbol( '' ) ) );
		assert.isFalse( isPromise( Symbol( 'hello' ) ) );
		assert.isFalse( isPromise( { then: 2 } ) );
	} );
	
	test( '1', () => {
		class a {
			get [ Symbol.toStringTag ]() {
				return 'Array';
			};
		}
		
		console.log( typeof a === 'function' );
		console.log( isFunction( a ) );
	} );
	// describe( 'runtime', () => {
	// 	test( 'runtime for myself', () => {
	// 		for ( let i = 0; i < 1_000_000; i++ ) {
	// 			assert.isFalse( isPromise( 22 ) );
	// 			assert.isFalse( isPromise( { name: 'x' } ) );
	// 			assert.isFalse( isPromise( 'abc' ) );
	// 			assert.isFalse( isPromise( String( 'abc' ) ) );
	// 			assert.isFalse( isPromise( [ 1, 2, 3 ] ) );
	// 			assert.isFalse( isPromise( function work() {} ) );
	// 			assert.isFalse( isPromise( () => {} ) );
	// 			assert.isFalse( isPromise( Symbol( '' ) ) );
	// 			assert.isFalse( isPromise( Symbol( 'hello' ) ) );
	// 			assert.isFalse( isPromise( { then: 2 } ) );
	// 		}
	// 	} );
	// 	test( 'runtime for radash', () => {
	// 		for ( let i = 0; i < 1_000_000; i++ ) {
	// 			assert.isFalse( _isPromise( 22 ) );
	// 			assert.isFalse( _isPromise( { name: 'x' } ) );
	// 			assert.isFalse( _isPromise( 'abc' ) );
	// 			assert.isFalse( _isPromise( String( 'abc' ) ) );
	// 			assert.isFalse( _isPromise( [ 1, 2, 3 ] ) );
	// 			assert.isFalse( _isPromise( function work() {} ) );
	// 			assert.isFalse( _isPromise( () => {} ) );
	// 			assert.isFalse( _isPromise( Symbol( '' ) ) );
	// 			assert.isFalse( _isPromise( Symbol( 'hello' ) ) );
	// 			assert.isFalse( _isPromise( { then: 2 } ) );
	// 		}
	// 	} );
	// } );
} );
