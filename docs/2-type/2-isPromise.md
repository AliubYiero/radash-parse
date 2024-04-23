# [radash 源码解析#2] `radash.isPromise` 的使用和源码实现

## 0. 前言

内容先行预览: 

- `radash.isPromise()` 函数的**说明**和**使用方法**
- 通过`TypeScript` 类型操作符 - `is`进行函数返回值的**类型保护**
- `radash.isFunction()` 的简单说明



> [上一篇 `radash.try`](https://bbs.tampermonkey.net.cn/thread-6908-1-1.html) 用到了 `isPromise` , 所以这篇就讲一讲 `isPromise` 吧. 

## 1. 说明

### 函数说明

```ts
radash.isPromise( value ): boolean;
```

本函数用于判断一个**值**是否为 `Promise` , 采用**最小 `Promise` 判断**, ECMAScript 将符合**最小 `Promise` 判断**的值视为一个 `Promise` 对象. 

> 关于最小 Promise 判断, 详细可以看我之前发布的一篇文章 [[JavaScript理论学习] 什么是Promise (含如何判断一个值是Promise)](https://bbs.tampermonkey.net.cn/thread-5022-1-1.html) . 这里面详细解释了如何规定和判断一个 Promise .
>
> 简单来说, 我们可以通过以下的定义, 来判断一个**值**是否为 `Promise` : 
> 当一个**函数**或者**对象**, 拥有 **`.then` 方法/属性**, 并且该 **`.then` 方法/属性**是一个**函数**, 那么就可以称该**函数/对象**为一个 **`Promise` 对象**.
>
> 也就是说, 如果满足以下三个条件, 那么该值就可以称为 `Promise` : 
>
> - `<value>` 的类型是**函数** / **对象**;
> - `<value>` 存在属性 `.then`;
> - `value.then` 是一个**函数**. 



## 2. 使用

### 用法

> 引入 `isPromise`

```ts
import { isPromise } from 'radash';
```

> 使用 `isPromise`

```ts
const value = new Promise( () => {} );

if ( isPromise( value ) ) {
    value.then();
}
```



### 示例

```ts
import { isPromise } from 'radash';

( async () => {
	console.log( isPromise( 22 ) );
	// -> false
	
	console.log( isPromise( new Promise( () => {} ) ) );
	// -> true
	
	console.log( isPromise( { then: () => {} } ) );
	// -> true
} )();
```



## 3. 源码实现 - TypeScript

### Step - 1: 实现 Promise 的三个判定

> - `<value>` 的类型是**函数** / **对象**;
> - `<value>` 存在属性 `.then`;
> - `value.then` 是一个**函数**. 

 ```ts
 const isPromise = ( value: any ): boolean => {
 	return Boolean(
 		value
 		&& [ 'object', 'function' ].includes( typeof value )
 		&& value.then
 		&& typeof value.then === 'function',
 	);
 };
 ```

> 方法都大差不差, `radash` 的实现少了一步判断 `value` 的类型, 以及 `radash` 每一步都进行返回. 效率没差的, `&&` 也是同样的短路返回. 



### Step - 2: 繁琐的类型判断

通过上述的实现之后, 可以判断一个值是否为 `Promise` , 但是因为类型不明确, 所以如果传入的值 `x` 是 `Promise` , 还需要通过一步类型断言才能够将 `x` 视为一个 `Promise` , 使用 `Promise` 的方法. 

```ts
/*
* 这里通过 counter 进行的三元运算符给 x 赋值是为了模拟正常代码环境中复杂的变量使用场景
* 如果直接给 x 赋值, 这种简单场景 ts 会导致直接就推断出来了 x 的类型
* */
let counter = 1;
let x: string | Promise<string> = counter ?
	'20'
	: new Promise( ( resolve ) => resolve( '20' ) );

// 如果 x 是 Promise
if ( isPromise( x ) ) {
	// 进行类型断言 x: Promise<string>
	( <Promise<string>> x ).then( ( res ) => {
		console.log( res );
	} );
}

// 进行类型断言 x: string
console.log( <string> x );
```

> `( <Promise<string>> x ).then( ( res ) => {} );` 如果不进行类型断言, 直接使用 `x.then( ( res ) => {} );` , 将会抛出以下错误: 
> TS2339: Property  `then`  does not exist on type  `string | Promise<string>` 
> Property  `then`  does not exist on type  `string` .



### Step - 3: 给返回值添加上类型保护

基于 `Step - 2` 的问题, 可以给 `isPromise` 的返回值添加上**类型保护**: 

> **类型保护**的意思是: **返回值**仍然是一个布尔值, 不过返回值声明不是直接通过 `boolean` 声明, 而是通过一个具体的**值(参数)**推断出来的, 如果返回的是 `true` , 则说明该 **值(参数)** 就是对应的类型, 不用进行额外的类型断言. 

> 这里 `value is Promise<any>` 的意思是: 如果 `value` 的类型是 `Promise<any>`, 那么返回值是 `true`, 反之则返回 `false`.
> 在表面上看和直接书写返回值类型为 `boolean` 似乎没有区别, 但是通过这样推断出来的布尔值返回值, 可以在 `value` 返回 `true` 的时候, 自动地将 `value` 的类型推断为 `Promise<any>` , 而不用手动进行类型断言.  

```ts
// 将 isPromise 的返回值从 `boolean` 变成 `value is Promise<any>`
const isPromise = ( value: any ): value is Promise<any> => {
	return Boolean(
		value
		&& [ 'object', 'function' ].includes( typeof value )
		&& value.then
		&& typeof value.then === 'function',
	);
};
```

> 现在使用 `isPromise` 函数就不用进行类型断言了, 如果 `isPromise( x )` 返回的值是 `true`, 那么 `x` 的类型就会自动被推断为 `Promise<any>` 了.

```ts
let counter = 1;
let x: string | Promise<string> = counter ?
	'20'
	: new Promise( ( resolve ) => resolve( '20' ) );

if ( isPromise( x ) ) {
	x.then( ( res ) => {
		console.log( res );
	} );
}

console.log( x );
```

## 4. radash 源码

### `TypeScript`

```ts
import { isFunction } from 'radash';

/**
 * This is really a _best guess_ promise checking.
 * You should probably use Promise.resolve(value) to be 100%
 * sure you're handling it correctly.
 */
export const isPromise = ( value: any ): value is Promise<any> => {
	if ( !value ) return false;
	if ( !value.then ) return false;
	if ( !isFunction( value.then ) ) return false;
	return true;
};
```

> `radash` 使用了内部的 `radash.isFunction()`  方法来判断一个值是否为函数. 



### `JavaScript`

```js
import { isFunction } from 'radash';

const isPromise = ( value ) => {
    // 判断 value 是否存在
	if ( !value )
		return false;
    
    // 判断 value.then 是否存在
	if ( !value.then )
		return false;
    
    // 判断 value.then 是否为一个函数
	if ( !isFunction( value.then ) )
		return false;
    
    // 三个判断都成功, 返回 true
	return true;
};
```



#### 碎碎念之 `radash.isFunction()`

> 在这里顺便讲一下 `radash.isFunction()` , 也许后面不会单独开一篇文章来讲了. 

`radash.isFunction()` 的实现其实让我蛮困惑的, 下面是它的实现: 

```js
const isFunction = (value: any): value is Function => {
  return !!(value && value.constructor && value.call && value.apply)
}
```

`typeof value === 'function'` 是一定不会出现错误返回的, `Symbol.toStringTag` 也无法篡改 `typeof` 的返回值, 唯一的解释就是 IE 兼容. 

但是既然都用 `radash` , 那么 IE 肯定是不兼容的, 所以完全没有必要这么判断. 

---

所以如果我的想法, 我会把 `isFunction` 函数这样写: 

```ts
const isFunction = (value: any): value is Function => {
  return typeof value === 'function';
}
```



## 附页

> - [TypeScript 类型运算符 - is 运算符](https://typescript.p6p.net/typescript-tutorial/operator.html#is-%E8%BF%90%E7%AE%97%E7%AC%A6)
> - [TypeScript 的类型断言](https://typescript.p6p.net/typescript-tutorial/assert.html)



> - [[JavaScript理论学习] 什么是Promise (含如何判断一个值是Promise)](https://bbs.tampermonkey.net.cn/thread-5022-1-1.html) 