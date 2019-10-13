/* 
因为 excel-export 库，还没有声明文件可以下载，
所以，自己写了声明文件

导出的 execute 是生成 excel 的函数，
参数约束接口 Config 中，
    cols，表示列头，caption表示文字，type表示单元格类型，
    rows，表示每行内容
*/
declare module 'excel-export' {
    export function execute(config: Config): void;
    export interface Config {
        cols: { caption: string, type: string }[];
        rows: any[];
    }
}