/**
 * try.spec.ts
 *
 * created by 2024/4/23
 * @file try测试用例
 * @author  Yiero
 * */

import { describe, test } from 'vitest';
import { _try } from '../../src/1-async/1-_.try/4-achieve';
import { assert } from 'chai';

describe( '_.try function', () => {
	test( 'returns error when error is thrown', async () => {
		const fn = _try( async () => {
			throw new Error( 'not good enough' );
		} );
		const [ err, result ] = await fn();
		assert.isUndefined( result );
		assert.isNotNull( err );
		assert.equal( err!.message, 'not good enough' );
	} );
	test( 'returns result when no error is thrown', async () => {
		const [ err, result ] = await _try( async () => {
			return 'hello';
		} )();
		assert.isUndefined( err );
		assert.isNotNull( result );
		assert.equal( result, 'hello' );
	} );
	test( 'handles non-async function results', async () => {
		const [ err, result ] = _try( () => {
			return 'hello';
		} )();
		assert.isUndefined( err );
		assert.isNotNull( result );
		assert.equal( result, 'hello' );
	} );
	test( 'handles non-async function errors', async () => {
		const [ err, result ] = _try( () => {
			if ( 1 < 0 ) return '';
			throw new Error( 'unknown' );
		} )();
		assert.isUndefined( result );
		assert.isNotNull( err );
		assert.equal( err!.message, 'unknown' );
	} );
} );
