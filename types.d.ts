//提供模块类型信息
//来解决Vite在处理JavaScript文件时默认启用了一些TypeScript特性的问题

import { de } from "element-plus/es/locale";

// Vite使用了ESBuild，ESBuild会尝试解析TypeScript类型注释，即使在JavaScript文件中也是如此
declare module 'highlight.js/lib/languages/css';
declare module 'highlight.js/lib/languages/javascript';
declare module 'highlight.js/lib/languages/typescript';
declare module 'jsmind';