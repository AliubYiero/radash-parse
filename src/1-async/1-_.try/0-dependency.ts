/**
 * 0-dependency.ts
 *
 * created by 2024/4/22
 * @file 项目依赖的配置/函数
 * @author  Yiero
 * */

/**
 * 模拟请求
 * */
export const api = {
	gods: {
		create: ( options: { name: string } ): Promise<string> => {
			return new Promise( ( res, rej ) => {
				if ( options.name !== 'Jesus' ) {
					rej( 'Your god is weak and could not be created' );
					return;
				}
				res( 'create god successfully' );
			} );
		},
	},
};
