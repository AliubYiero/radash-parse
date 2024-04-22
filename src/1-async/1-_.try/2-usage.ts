/**
 * #2-usage.ts
 *
 * created by 2024/4/22
 * @file 使用 _.try 函数
 * @author  Yiero
 * */
import { try as _try } from 'radash';
import { api } from './0-dependency.ts';


( async () => {
	// test 1
	const [ err, response ] = await _try( api.gods.create )( { name: 'Ra' } );
	if ( err ) {
		throw new Error( 'Your god is weak and could not be created' );
	}
	console.log( ' test 2-1', response );
} )();

( async () => {
	// test 2
	const [ err, response ] = await _try( api.gods.create )( { name: 'Jesus' } );
	if ( err ) {
		throw new Error( 'Your god is weak and could not be created' );
	}
	console.log( 'test 2-2', response );
} )();
