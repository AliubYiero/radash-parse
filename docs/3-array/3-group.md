# [radash 源码解析#3] `radash.group` 的使用和源码实现

## 0. 前言

内容先行预览:

- `radash.group()` 函数的说明和使用方法
- `TypeScript` 类型体操之**对象属性名的索引类型**, **类型 `in` 运算符**, **类型工具 `Record<Keys, Type>`**, **类型工具 `Partial<Type>`**
- `Object.groupBy()` 方法的使用

## 1. 说明

### 函数说明

`radash.group()` 函数是一个将**数组分类/分组**, 输出为一个**包含分类/分组结果对象**. 

这种分组方法在原生其实是存在的, `Object.groupBy()` 也同样实现了数组分组的方法. 而且它的用法更加强大, 在本文的后面章节也会简单介绍 `Object.groupBy()` 的使用. `radash.group()` 可以当成 `Object.groupBy()` 全面兼容之前的过渡方法使用.  

> `Object.groupBy()` 方法是一项**实验性内容**, 于 2023 年开始支持, 并在 2024 年在主流浏览器全面支持. 不过如果使用的 node 版本过低 (<= 20, node@21 若不支持需更新到最新版), 是无法在 node 环境中使用的. 

> TypeScript 打开 `Object.groupBy()` 支持, 需要在 `tsconfig.json` 文件中的 `lib` 选项中的 ES 版本支持更改为 `ESNext` , 2025年开始可以改成 `ES2024` .
>
> ```json
> // tsconfig.json
> {
>     "lib": [
>         "ESNext"
>     ]
> }
> ```

## 2. 使用

### 用法

> 引入 `radash.group()`

```ts
import { group } from 'radash';
```

> 使用 `radash.group()`

```ts
const groupObj = group( list, getGroupIdFn );
```



**参数**

- `list`
  一个将进行元素分组的**数组**. 
- `getGroupIdFn`: 
  对数组中的每个元素执行的函数. 它应该返回一个值, 可以被强制转换成属性键 (字符串, 数字或 [symbol](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol)) , 用于指示当前元素所属的分组. 该函数被调用时将传入以下参数: 

> `item`: 数组中当前正在处理的元素. 



**返回值**

一个带有所有分组属性的对象, 每个属性都分配了一个包含相关组元素的数组.



### 示例

> 单属性分组: 

```ts
import { group } from 'radash';

const inventory = [
    { name: '芦笋', type: '蔬菜', quantity: 5 },
    { name: '香蕉', type: '水果', quantity: 0 },
    { name: '山羊', type: '肉', quantity: 23 },
    { name: '樱桃', type: '水果', quantity: 5 },
    { name: '鱼', type: '肉', quantity: 22 },
];

const result = group( inventory, ( item ) => item.type );

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
```

> 多属性分组

```ts
const inventory = [
    { name: '芦笋', type: '蔬菜', quantity: 5 },
    { name: '香蕉', type: '水果', quantity: 0 },
    { name: '山羊', type: '肉', quantity: 23 },
    { name: '樱桃', type: '水果', quantity: 5 },
    { name: '鱼', type: '肉', quantity: 22 },
    { name: '鱼', type: '肉', quantity: 55 },
];

const result = group( inventory, ( { name,type } ) => `${ name }-${ type }` );

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
```



## 3. 源码实现 - TypeScript

### Step - 1: 通过 JavaScript 实现数组分类

```js
const group = ( items, getGroupIdFn ) => {
	// 定义一个空对象result
	const result = {};
	// 遍历items数组
	for ( let item of items ) {
		// 获取callback函数的返回值key
		const key = callback( item );
		
		// 如果result中不存在key属性，则赋值为空数组
		result[ key ] ||= [];
		
		// 将item添加到result[key]中
		result[ key ].push( item );
	}
	// 返回result对象
	return result;
};
```

### Step - 2: 添加 TypeScript 类型描述

**1. 定义参数的类型**

> 首先由于不知道传入数组是什么类型的数组, 所以给数组 `items` 传入一个*泛型* `T` 约束约束数组的类型.  
> 由于在函数进行过程中, 数组 `items` 的值是不会改变了, 所以我们可以给他添加上一个 `readonly` 标示符表示该属性是只读的. 
>
> 因为约束的类型, 所以用于传入类型的回调函数 `getGroupIdFn` 的参数的类型也明确了, 就是泛型 `T` . `getGroupIdFn()` 函数将返回一个**字符串(string) / 数字(number) / symbol** 用于传入用于分组的键名. 

```ts
const group = <T>( 
    items: readonly T[], 
    getGroupIdFn: ( item: T ) => string | number | symbol 
) => {
    /* code */
}
```

> 对于我前面文章讲过的类型通常我会一笔略过, 比如上文提到的*泛型*, 如果不了解可以去看我之前的文章, 或者看文末的附页中给出的参考资料. 

---



**2. 定义函数的返回值**

> `group` 函数的返回值是一个对象, **键(key)**是第一步中  `getGroupIdFn()` 的返回值, **值(value)**是一个新的 `T[]` . 所以这里添加了一个新的泛型 `Key` , 并将其的类型约束为 `string | number | symbol` .

```ts
const group = <T, Key extends string | number | symbol>(
    items: readonly T[],
    getGroupIdFn: ( item: T ) => Key,
) => {
    /* code */
};
```

> 然后我们就可以声明返回值类型了: `{ [prop in string | symbol | number]?: T[] }`.
>
> 首先, 因为我们不知道到底有多少个属性, 所以我们需要使用到**对象的属性名索引类型**声明. 
> 也就是定义一个对象 `{  }` , 里面的属性不写入具体的名称, 而是使用一对方括号表示, 在方括号里面就可以写 `[ 任意属性名: 属性类型 ]`. 如: `{ [prop: string]: any }` 就表示**任意类型为字符串(string)的属性名, 并且其值为 `any`** .
> 如果是方括号里的值是**复合类型**, 比如 `Key` 就是一个 `string | number | symbol` 复合类型, 就不能直接使用**冒号**, 而要使用 `in` 运算符, 表示将复合类型中的类型依次取出进行类型声明.
> 所以类型声明就是: `{ [prop in Key]: T[] }` .
>
> 因为传出的对象可能是一个**空对象**, 所以我们将对象值添加上可选声明 `?` : `{ [prop in Key]?: T[] }` .

```ts
const group = <T, Key extends string | number | symbol>(
    items: readonly T[],
    getGroupIdFn: ( item: T ) => Key,
): { [prop in Key]?: T[] } => {
    /* code */
};
```

> 如果返回值写成这样, 类型声明可读性不高, 所以使用类型工具重写一下:
>
> 类型工具: ``Record<Keys, Type>`` 返回一个对象, 对象的键的类型是 `Keys` , 值的类型是 `Type` . 
> 所以 `{ [prop in Key]: T[] }` 可以重写成 `Record<Key, T[]>`
>
> 类型工具: `Partial<Type>` 返回一个新类型, 新类型中将 `Type` 中的所有属性变为可选属性. 
> 所以 `{ [prop in Key]?: T[] }` 可以重写成 `Partial<Record<Key, T[]>>` .

```ts
const group = <T, Key extends string | number | symbol>(
	items: readonly T[],
	getGroupIdFn: ( item: T ) => Key,
): Partial<Record<Key, T[]>> => {
	/* code */
};
```

### 

---

**3. 在实际返回值中注明类型**

> 给 `result` 标注上类型 `Partial<Record<Key, T[]>>` 即可. 

```ts
const group = <T, Key extends string | number | symbol>(
	items: readonly T[],
	getGroupIdFn: ( item: T ) => Key,
): Partial<Record<Key, T[]>> => {
	// 定义一个空对象result, 并声明其类型为 `Partial<Record<Key, T[]>>`
	const result: Partial<Record<Key, T[]>> = {};

	for ( let item of items ) {
		const key = getGroupIdFn( item );
		
		result[ key ] ||= [];
		
		// 这里会报错 `result[ key ]` 可能为空, 但是因为上面已经写入数组了, 不可能为空, 所以直接用类型断言就可以了
		( <T[]> result[ key ] ).push( item );
	}
    
	// 返回result对象
	return result;
};
```

> `radash` 源码是使用了 `Array.reduce()` 直接将对象视为 `Record<Key, T[]>` , 所以不用进行额外的类型断言.



## 4. radash 源码

### `TypeScript`

```ts
/**
 * Sorts an array of items into groups. The return value is a map where the keys are
 * the group ids the given getGroupId function produced and the value is an array of
 * each item in that group.
 */
export const group = <T, Key extends string | number | symbol>(
	array: readonly T[],
	getGroupId: ( item: T ) => Key,
): Partial<Record<Key, T[]>> => {
	return array.reduce( ( acc, item ) => {
		const groupId = getGroupId( item );
		if ( !acc[ groupId ] ) acc[ groupId ] = [];
		acc[ groupId ].push( item );
		return acc;
	}, {} as Record<Key, T[]> );
};
```

### `JavaScript`

```js
const group = ( array, getGroupId ) => {
	return array.reduce( ( acc, item ) => {
		const groupId = getGroupId( item );
		if ( !acc[ groupId ] )
			acc[ groupId ] = [];
		acc[ groupId ].push( item );
		return acc;
	}, {} );
};
```



## 5.    `Object.groupBy()`

`Object.groupBy()` 的参数和返回值和 `radash.group()` 一样, 区别在于: 

- 第一个参数不仅可以接受数组, 只要是**可迭代对象**就都可以接收, 比如 `Set` / `Map` 等.
- 第二个参数具有第二个参数, `index` 索引, 其行为和 `Array.forEach()` 类似. 

> 修改稍微一下第三部分的代码实现就可以实现 `Object.groupBy()` 的效果: 

```ts
const groupBy = <Key extends PropertyKey, T>(
	items: Iterable<T>,
	getGroupIdFn: ( item: T, index: number ) => Key,
): Partial<Record<Key, T[]>> => {
	// 定义一个空对象result, 并声明其类型为 `Partial<Record<Key, T[]>>`
	const result: Partial<Record<Key, T[]>> = {};
	
	let index = 0;
	for ( let item of items ) {
		const key = getGroupIdFn( item, index++ );
		
		result[ key ] ||= [];
		
		// 这里会报错 `result[ key ]` 可能为空, 但是因为上面已经写入数组了, 不可能为空, 所以直接用类型断言就可以了
		( <T[]> result[ key ] ).push( item );
	}
	
	// 返回result对象
	return result;
};
```





## 附页

> - [TypeScript 的对象类型 - 只读属性](https://typescript.p6p.net/typescript-tutorial/object.html#%E5%8F%AA%E8%AF%BB%E5%B1%9E%E6%80%A7)
> - [TypeScript 的对象类型 - 属性名的索引类型](https://typescript.p6p.net/typescript-tutorial/object.html#%E5%B1%9E%E6%80%A7%E5%90%8D%E7%9A%84%E7%B4%A2%E5%BC%95%E7%B1%BB%E5%9E%8B)
> - [TypeScript 类型运算符 - in 运算符](https://typescript.p6p.net/typescript-tutorial/operator.html#in-%E8%BF%90%E7%AE%97%E7%AC%A6)
> - [TypeScript 的对象类型  - 可选属性](https://typescript.p6p.net/typescript-tutorial/object.html#%E5%8F%AF%E9%80%89%E5%B1%9E%E6%80%A7)
>
> ---
>
> - [TypeScript 类型工具 - `Record<Keys, Type>`](https://typescript.p6p.net/typescript-tutorial/utility.html#record-keys-type)
> - [TypeScript 类型工具 - `Partial<Type>`](https://typescript.p6p.net/typescript-tutorial/utility.html#partial-type)
>
> ---
>
> - [TypeScript 泛型](https://typescript.p6p.net/typescript-tutorial/generics.html)
> - [TypeScript 泛型 - 类型参数的约束条件](https://typescript.p6p.net/typescript-tutorial/generics.html#%E7%B1%BB%E5%9E%8B%E5%8F%82%E6%95%B0%E7%9A%84%E7%BA%A6%E6%9D%9F%E6%9D%A1%E4%BB%B6)
> - [TypeScript 的类型映射](https://typescript.p6p.net/typescript-tutorial/mapping.html#typescript-%E7%9A%84%E7%B1%BB%E5%9E%8B%E6%98%A0%E5%B0%84)
>
> ---
>
> - [MDN - 迭代协议](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Iteration_protocols#%E5%8F%AF%E8%BF%AD%E4%BB%A3%E5%8D%8F%E8%AE%AE)
> - [MDN - for...of](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/for...of)
> - [MDN - 迭代器 - Symbol.iterator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Symbol/iterator)