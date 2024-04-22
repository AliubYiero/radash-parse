/**
 * 4-achieve.ts
 *
 * created by 2024/4/22
 * @file 手动实现 _try
 * @author  Yiero
 * */
import { isPromise } from 'radash';


// 成功返回类型
type Resolve<T> = [ undefined, T ];
// 错误返回类型
type Reject = [ Error, undefined ];
// 总返回值
type ReturnValue<T> = Resolve<T> | Reject;
export const _try = <Args extends any[], Return>( func: ( ...arg: Args ) => Return ) => {
	// 参数类型是原来的类型 (泛型 Args)
	return ( ...args: Args ):
		Return extends Promise<any>
			? Promise<ReturnValue<Awaited<Return>>>
			: ReturnValue<Return> => {
		try {
			const result: Return = func( ...args );
			
			// 实现 Promise 函数的异常捕获
			if ( isPromise( result ) ) {
				return result
					.then( ( value: Return ): Resolve<Return> => [ void 0, value ] )
					.catch( ( err: any ): Reject => [ err, void 0 ] ) as Return extends Promise<any>
					? Promise<ReturnValue<Awaited<Return>>>
					: ReturnValue<Return>;
			}
			
			return [ void 0, result ] as Return extends Promise<any>
				? Promise<Resolve<Awaited<Return>>>
				: Resolve<Return>;
		}
		catch ( err: any ) {
			return [ err, void 0 ] as Return extends Promise<any>
				? Promise<Reject>
				: Reject;
		}
	};
};
