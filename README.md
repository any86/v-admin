# v-admin
基于Vue3 / Typescript / Vite / ant-design-vue / [v-curd](https://github.com/any86/v-curd) 的后台. 


## 🚀演示
https://v-admin-sage.vercel.app


## 修改主题色
通过修改`ant`组件库预定义的变量来实现, 分2步:
1. 查看ant组件定义的css变量:`node_modules\ant-design-vue\lib\style\themes\default.less`
2. 复制变量到`./src/theme.less`中进行修改,比如把ant组件库的主色调改成绿色:

```less
@primary-color:#42b883;
```