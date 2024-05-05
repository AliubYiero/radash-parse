import { assert, describe, test } from 'vitest';
import { select } from 'radash';
import {
	select as _select,
} from '../../src/3-array/4-_select/4-achieve';

describe( 'select function', () => {
	test( 'test', () => {
		const array = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];
		
		const result = select(
			array,
			( item ) => item * 2,
			( item ) => item >= 4 && item <= 8,
		);
		
		console.log( result );
	} );
	
	test( 'does not fail on bad input', () => {
		assert.deepEqual(
			select(
				null as unknown as any[],
				x => x,
				x => x,
			),
			[],
		);
		assert.deepEqual(
			select(
				undefined as unknown as any[],
				x => x,
				x => x,
			),
			[],
		);
	} );
	test( 'returns mapped and filtered values', () => {
		const list = [
			{ group: 'a', word: 'hello' },
			{ group: 'b', word: 'bye' },
			{ group: 'a', word: 'oh' },
			{ group: 'b', word: 'hey' },
			{ group: 'c', word: 'ok' },
		];
		const result = select(
			list,
			x => x.word,
			x => x.group === 'a',
		);
		assert.deepEqual( result, [ 'hello', 'oh' ] );
	} );
	test( 'does not fail on empty input list', () => {
		const list: any[] = [];
		const result = select(
			list,
			( x: any ) => x.word,
			x => x.group === 'a',
		);
		assert.deepEqual( result, [] );
	} );
	test( 'works with index', () => {
		const letters = [ 'a', 'b', 'c', 'd' ];
		const result = select(
			letters,
			( l, idx ) => `${ l }${ idx }`,
			( _, idx ) => idx > 1,
		);
		assert.deepEqual( result, [ 'c2', 'd3' ] );
	} );
} );


describe( '_select function', () => {
	test( 'does not fail on bad input', () => {
		assert.deepEqual(
			_select(
				null as unknown as any[],
				x => x,
				x => x,
			),
			[],
		);
		assert.deepEqual(
			_select(
				undefined as unknown as any[],
				x => x,
				x => x,
			),
			[],
		);
	} );
	test( 'returns mapped and filtered values', () => {
		const list = [
			{ group: 'a', word: 'hello' },
			{ group: 'b', word: 'bye' },
			{ group: 'a', word: 'oh' },
			{ group: 'b', word: 'hey' },
			{ group: 'c', word: 'ok' },
		];
		const result = _select(
			list,
			x => x.word,
			x => x.group === 'a',
		);
		assert.deepEqual( result, [ 'hello', 'oh' ] );
	} );
	test( 'does not fail on empty input list', () => {
		const list: any[] = [];
		const result = _select(
			list,
			( x: any ) => x.word,
			x => x.group === 'a',
		);
		assert.deepEqual( result, [] );
	} );
	test( 'works with index', () => {
		const letters = [ 'a', 'b', 'c', 'd' ];
		const result = _select(
			letters,
			( l, idx ) => `${ l }${ idx }`,
			( _, idx ) => idx > 1,
		);
		assert.deepEqual( result, [ 'c2', 'd3' ] );
	} );
} );
