/**
 * #2-usage.ts
 *
 * created by 2024/4/22
 * @file 使用 isPromise 函数
 * @author  Yiero
 * */
import { group } from 'radash';

( () => {
	const inventory = [
		{ name: '芦笋', type: '蔬菜', quantity: 5 },
		{ name: '香蕉', type: '水果', quantity: 0 },
		{ name: '山羊', type: '肉', quantity: 23 },
		{ name: '樱桃', type: '水果', quantity: 5 },
		{ name: '鱼', type: '肉', quantity: 22 },
	];
	
	const result = group( inventory, ( { type } ) => type );
	
	console.log( result );
	/* 结果是：
	{
	  蔬菜: [
	    { name: "芦笋", type: "蔬菜", quantity: 5 },
	  ],
	  水果: [
	    { name: "香蕉", type: "水果", quantity: 0 },
	    { name: "樱桃", type: "水果", quantity: 5 }
	  ],
	  肉: [
	    { name: "山羊", type: "肉", quantity: 23 },
	    { name: "鱼", type: "肉", quantity: 22 }
	  ]
	}
	*/
} )();

( () => {
	const inventory = [
		{ name: '芦笋', type: '蔬菜', quantity: 5 },
		{ name: '香蕉', type: '水果', quantity: 0 },
		{ name: '山羊', type: '肉', quantity: 23 },
		{ name: '樱桃', type: '水果', quantity: 5 },
		{ name: '鱼', type: '肉', quantity: 22 },
		{ name: '鱼', type: '肉', quantity: 55 },
	];
	
	const result = group( inventory, ( {
		                                   name,
		                                   type,
	                                   } ) => `${ name }-${ type }` );
	
	console.log( result );
	/* 结果是：
	{
	  '芦笋-蔬菜': [ { name: '芦笋', type: '蔬菜', quantity: 5 } ],
	  '香蕉-水果': [ { name: '香蕉', type: '水果', quantity: 0 } ],
	  '山羊-肉': [ { name: '山羊', type: '肉', quantity: 23 } ],
	  '樱桃-水果': [ { name: '樱桃', type: '水果', quantity: 5 } ],
	  '鱼-肉': [
	    { name: '鱼', type: '肉', quantity: 22 },
	    { name: '鱼', type: '肉', quantity: 55 }
	  ]
	}
	*/
} )();
