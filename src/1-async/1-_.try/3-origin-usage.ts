/**
 * 3-origin-usage.ts
 *
 * created by 2024/4/22
 * @file 原生js/ts使用
 * @author  Yiero
 * */

import { api } from './0-dependency.ts';

( async () => {
	// test 1
	let response: string = '';
	try {
		response = await api.gods.create( { name: 'Ra' } );
	}
	catch ( e ) {
		throw new Error( 'Your god is weak and could not be created' );
	}
	console.log( 'test 3-1', response );
} )();

( async () => {
	// test 2
	let response: string = '';
	try {
		response = await api.gods.create( { name: 'Jesus' } );
	}
	catch ( e ) {
		throw new Error( 'Your god is weak and could not be created' );
	}
	console.log( 'test 3-2', response );
} )();
