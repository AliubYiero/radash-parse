# [radash 源码解析#4] `radash.select` 的使用和源码实现

## 0. 前言

内容先行预览:

- `radash.select` 函数的说明和使用方法.
- 在 `Array.prototype.reduce()` 方法上标注泛型. 

## 1. 说明

### 函数说明

`radash.select()` 是将 **一个数组先过滤, 然后重新赋值** , 最后输出为 **一个新的数组** 的函数.

这个函数相当于对输入的数组 `list`, 先进行一次 `list.filter()` 操作, 然后再进行一个 `list.map()` 操作, 但是这样的操作需要遍历两次 `list`. 
`radash.select()` 帮助实现了上述的操作, 但只遍历一次 `list` .



## 2. 使用

### 用法

> 引入 `radash.select()`

```ts
import { select } from 'radash';
```

> 使用 `radash.select()`

```ts
// 第一个参数输入任意数组
const list = [];
// 第二个参数输入任意 map 函数, 等同于 Array.prototype.map(list, mapper);
const mapper = (item, index) => item;
// 第三个参数输入任意 filter 函数, 等同于 Array.prototype.filter(list, filter);
const filter = (item, index) => item;
// 获取结果
const result = select( list, mapper, filter );
```

**参数**

- `list`:
  一个任意类型的数组. 
- `mapper`:
  一个回调函数, 类型为: `(item: unknown, index: number) => unknown`.
  其类型等同于 `Array.prototype.map(list, mapper)` 中的 `mapper` 参数.
- `filter`: 
  一个回调函数, 类型为: `(item: unknown, index: number) => boolean`.
  其类型等同于 `Array.prototype.filter(list, filter)` 中的 `filter` 参数.

> - `item`: 
>   遍历出 `list` 中的每一项
> - `index`:
>   遍历出 `list` 中的每一项对应的索引

**返回值**

一个新的数组. 

### 示例

```ts
import { select } from 'radash';

const array = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

// 筛选出 大于等于4, 小于等于8 的数字, 并筛选之后的数字乘以 2 输出为一个新数组
const result = select(
	array,
	( item ) => item * 2, // mapper
	( item ) => item >= 4 || item <= 8, // filter
);

console.log( result );
// -> [ 8, 10, 12, 14, 16 ]
```



### 原生实现方法

> 使用 `filter()` + `map()` .

```ts
const array = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

// filter
let result = array.filter( ( item ) => item >= 4 && item <= 8 );

// map
result = array.map( ( item ) => item * 2 );

console.log( result );
// -> [ 8, 10, 12, 14, 16 ]
```

> 使用 `reduce()`

```ts
const array = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

let result = array.reduce<number[]>( ( result, item ) => {
    if ( item >= 4 && item <= 8 ) {
        result.push( item * 2 );
    }

    return result;
}, [] );

console.log( result );
// -> [ 8, 10, 12, 14, 16 ]
```

> 使用 `for-of`

```ts
const array = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ];

let result = [];
for ( const item of array ) {
    if ( item >= 4 && item <= 8 ) {
        result.push( item * 2 );
    }
}

console.log( result );
// -> [ 8, 10, 12, 14, 16 ]
```



## 3. 源码实现 - TypeScript

### Step - 1: 定义参数类型和返回值类型

**1. 定义输入和输出的泛型**

> 首先定义两个泛型 `<T, K>` , 泛型`T` 表示任意输入的数组项的类型, 泛型 `K` 表示任意输出的数组项的类型. 
> 因为 **输入** 和 **输出** 并不统一, 可以通过 `mapper` 重新定义输出的值, 所以定义两个泛型. 

```ts
const select = <T, K>(
	list: T[],
    mapper: Function,
    filter: Function,
) => {}
```



---

**2. 定义 `mapper` 参数的类型**

> `mapper` 参数传入两个参数, `item` 和 `index` . 
> `item` 的类型就是泛型 `T` , `index` 的类型则是 `number` 因为是 `list` 遍历出来的索引值. 
> 返回值的类型是泛型 `K` , 表示未知但不同于 `T` 的类型. 

```ts
const select = <T, K>(
	list: T[],
    mapper: ( item: T, index: number ) => K,
    filter: Function,
) => {}
```



---

**3. 定义 `filter` 参数的类型**

> `filter` 参数的传入和 `mapper` 一样, 返回值不同而已. 
> `filter` 返回类型 `boolean` . 因为 `filter` 需要进行判断, 当前遍历到的数组项是否支持写入新数组. 

```ts
const select = <T, K>(
	list: T[],
	mapper: ( item: T, index: number ) => K,
	filter: ( item: T, index: number ) => boolean,
) => {}
```



---

**4. 完整的类型定义**

> 最后加上返回值的类型 `K[]` 就可以了. 

```ts
const select = <T, K>(
	// 传入一个T类型的数组list
	list: T[],
	// 传入一个函数mapper，参数为T类型的item，返回值为K类型
	mapper: ( item: T, index: number ) => K,
	// 传入一个函数filter，参数为T类型的item，返回值为boolean类型
	filter: ( item: T, index: number ) => boolean,
): K[] => {}
```



### Step - 2: 具体的遍历和判断逻辑编写

> 因为 `radash.select()` 使用了 `Array.prototype.reduce()` , 所以具体示例就不使用 `reduce()` 了. 使用 `for-i` 先编写一遍, 后面我会贴出一份用 `reduce()` 写的版本, 指出一些问题. 

> 具体逻辑在上文 *[2.使用 - 原生实现方法]* 中已经写得比较清楚了, 只是将里面的判断逻辑和重新赋值逻辑, 抽象出来而已, 就不进行详细的解释了. 

```ts
// 下面只贴出函数体
{
	// 定义一个K类型的空数组resultList
	let resultList: K[] = [];
	
	// 遍历list数组
	for ( let index = 0; index < list.length; index++ ) {
		const item = list[ index ];
		// 如果filter函数返回值为false，则跳过当前循环
        const isFilter = !filter( item, index );
		if ( isFilter ) {
			continue;
		}
		
		// 将mapper函数返回值添加到resultList数组中
        const newItem = mapper( item, index );
		resultList.push( newItem );
	}
	
	// 返回resultList数组
	return resultList;
}
```



### Step - 3: 错误处理

> 进行简单的错误处理, 如果输入的 `list` 的类型不为数组类型, 则返回一个空数组. 
> 这里注释了一行, 注释的行是**抛出错误**, 两种处理逻辑都可以, `radash` 是输出空数组, 就跟着 `radash` 的实现. 

```ts
{
	// 判断list是否为数组类型，如果不是抛出错误
	if ( !Array.isArray( list ) ) {
		// throw new TypeError( 'Input parma "list" must be type Array.' );
		return [];
	}
    
    /* Step-2 的代码 (下略) */
}
```

### 完整代码

```ts
const select = <T, K>(
	// 传入一个T类型的数组list
	list: T[],
	// 传入一个函数mapper，参数为T类型的item，返回值为K类型
	mapper: ( item: T, index: number ) => K,
	// 传入一个函数filter，参数为T类型的item，返回值为boolean类型
	filter: ( item: T, index: number ) => boolean,
): K[] => {
	// 判断list是否为数组类型，如果不是抛出错误
	if ( !Array.isArray( list ) ) {
		// throw new TypeError( 'Input parma "list" must be type Array.' );
		return [];
	}
	
	// 定义一个K类型的空数组resultList
	let resultList: K[] = [];
	
	// 遍历list数组
	for ( let index = 0; index < list.length; index++ ) {
		const item = list[ index ];
		// 如果filter函数返回值为false，则跳过当前循环
		if ( !filter( item, index ) ) {
			continue;
		}
		
		// 将mapper函数返回值添加到resultList数组中
		resultList.push( mapper( item, index ) );
	}
	
	// 返回resultList数组
	return resultList;
};
```





### Step - Extra: 使用 `Array.prototype.reduce()` 实现

> `radash` 使用 `Array.prototype.reduce()` 方法喜欢在 `initValue` 处**声明类型断言**, 防止类型错误报错. 
> 但其实可以直接在 `Array.prototype.reduce()` 方法上**标注泛型**, 这样就不会报错了, 我认为会比在 `initValue` 上声明类型断言更好一些.
>
> 两种方法的比较如下: 
>
> ```ts
> // 在 `initValue` 上声明类型断言: 
> [].reduce( ( r ) => r, [] as number[] );
> ```
>
> ```ts
> // 在 `Array.prototype.reduce()` 方法上标注泛型
> [].reduce<number[]>( ( r ) => r, [] );
> ```

```ts
const select = <T, K>(
    // 传入一个T类型的数组list
    list: T[],
    // 传入一个函数mapper，参数为T类型的item，返回值为K类型
    mapper: ( item: T ) => K,
    // 传入一个函数filter，参数为T类型的item，返回值为boolean类型
    filter: ( item: T ) => boolean,
): K[] => {
    // 判断list是否为数组类型，如果不是抛出错误
    if ( !Array.isArray( list ) ) {
        // throw new TypeError( 'Input parma "list" must be type Array.' );
        return [];
    }

    // 使用reduce函数遍历list数组，将mapper函数返回值添加到resultList数组中
    return list.reduce<K[]>( ( resultList, item ) => {
        // 如果filter函数返回值为true，则将mapper函数返回值添加到resultList数组中
        if ( filter( item ) ) {
            resultList.push( mapper( item ) );
        }

        return resultList;
    }, [] );
};
```



## 4. radash 源码

### `TypeScript`

```ts
/**
 * select 方法使用 reduce 内部执行 filter 和 map，
 * 只迭代数组一次.
 *
 * @example
 * select([1, 2, 3, 4], x => x*x, x > 2) --> [9, 16]
 */
export const select = <T, K>(
	array: readonly T[],
	mapper: ( item: T, index: number ) => K,
	condition: ( item: T, index: number ) => boolean,
) => {
	if ( !array ) return [];
	return array.reduce( ( acc, item, index ) => {
		if ( !condition( item, index ) ) return acc;
		acc.push( mapper( item, index ) );
		return acc;
	}, [] as K[] );
};
```



### `JavaScript`

```ts
const select = ( array, mapper, condition ) => {
	if ( !array )
		return [];
	return array.reduce( ( acc, item, index ) => {
		if ( !condition( item, index ) )
			return acc;
		acc.push( mapper( item, index ) );
		return acc;
	}, [] );
};
```



## 附页

> ---
>
> - [npm - radash](https://www.npmjs.com/package/radash)
> - [github - radash](https://github.com/rayepps/radash)
>
> ---
