/**
 * group.spec.ts
 *
 * created by 2024/4/25
 * @file group 测试用例
 * @author  Yiero
 * */

import { assert, describe, test } from 'vitest';

import { group } from '../../src/3-array/3-_group/4-achieve';

describe( 'group function', () => {
	
	test( 'groups by provided attribute', () => {
		const list = [
			{ group: 'a', word: 'hello' },
			{ group: 'b', word: 'bye' },
			{ group: 'a', word: 'oh' },
			{ group: 'b', word: 'hey' },
			{ group: 'c', word: 'ok' },
		];
		const groups = group( list, x => x.group );
		assert.equal( groups.a?.length, 2 );
		assert.equal( groups.b?.length, 2 );
		assert.equal( groups.c?.length, 1 );
		assert.equal( groups.c?.[ 0 ].word, 'ok' );
	} );
	
	test( 'groups by multi attribute', () => {
		const inventory = [
			{ name: '芦笋', type: '蔬菜', quantity: 5 },
			{ name: '香蕉', type: '水果', quantity: 0 },
			{ name: '山羊', type: '肉', quantity: 23 },
			{ name: '樱桃', type: '水果', quantity: 5 },
			{ name: '鱼', type: '肉', quantity: 22 },
			{ name: '鱼', type: '肉', quantity: 55 },
		];
		
		const resultList = group( inventory, ( {
			                                       name,
			                                       type,
		                                       } ) => `${ name }-${ type }` );
		assert.equal( resultList[ '芦笋-蔬菜' ]?.length, 1 );
		assert.equal( resultList[ '香蕉-水果' ]?.length, 1 );
		assert.equal( resultList[ '山羊-肉' ]?.length, 1 );
		assert.equal( resultList[ '樱桃-水果' ]?.length, 1 );
		assert.equal( resultList[ '鱼-肉' ]?.length, 2 );
		assert.equal( resultList[ '鱼-肉' ]?.[ 0 ].quantity, 22 );
	} );
} );
