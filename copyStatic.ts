import * as shelljs from 'shelljs'
/* 
第1个参数 -R，表示递归拷贝
第2个参数，源文件
第3个参数，目标文件夹
*/
shelljs.cp('-R', 'public', 'dist')
shelljs.cp('-R', 'views', 'dist')