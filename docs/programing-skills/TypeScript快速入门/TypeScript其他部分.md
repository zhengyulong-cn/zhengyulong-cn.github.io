# TypeScript其他部分
## 工具泛型
1.Partial：让传入类型全部可选

```typescript
interface Student {
  name: string;
  age: number;
}
// 报错，student1不能为空，必须含有name和age属性
const student1: Student = {}
// 正常，接口Student类型都变成可选
const student2: Partial<Student> = {}
```
2.Required：让传入类型全部必选

3.Readonly：让传入类型全部只读

4.Pick：选择传入类型中的部分属性组成新类型

```typescript
interface Student {
  name: string;
  age: number;
}
// 正常，只挑出了name属性
const s1: Pick<Student, 'name'> = {
  name: 'Alice'
}
// 报错，age属性没被挑出
const s2: Pick<Student, 'name'> = {
  name: 'Bob',
  age: 20
}
```
5.Record：构建一个类型，这个类型用来描述一个对象，这个对象的属性都具有相同的类型

```typescript
const student1: Record<string, any> = {
  name: '张三',
  age: 20
}
```
Record应该是日常使用频率较高的内置类型了，主要用来描述对象，一般建议是不用Object来描述对象，而是用Record代替，`Record<string, any>`几乎可以说是万金油了

6.Exclude：针对联合类型，A-B

7.Extract：针对联合类型，A∩B

```typescript
type MenuChoose = 'businessLine' | 'productLine' | 'LineChoonse';
type LineType = 'businessLine' | 'productLine';
// 报错，businessLine被从约束集除去
const r1: Exclude<MenuChoose, LineType> = 'businessLine';
// 正常
const r2: Exclude<MenuChoose, LineType> = 'LineChoonse';
// 正常
const r3: Extract<MenuChoose, LineType> = 'businessLine';
// 报错，LineChoonse没有加入到约束集
const r4: Extract<MenuChoose, LineType> = 'LineChoonse';
```

8.Omit：省略接口属性

```typescript
interface Student {
  name: string;
  age: number;
  class: string;
  school: string;
}
type PersonAttr = 'name' | 'age'
// 正常
const student1: Omit<Student, PersonAttr> = {
    class:'大四',
    school:'AHU'
}
// 报错，name不在约束集中
const student2:Omit<Student, PersonAttr> = {
    name: 'Alice',
    class:'大四',
    school:'AHU',
}
```

9.NonNullable：不能为null

```typescript
interface Student {
  name: string;
  age: number;
}
// 报错，不能赋值为null
const student1: NonNullable<Student | undefined | null> = null;
```

10.Parameters：获取函数的传入参数类型

11.ReturnType：获取函数的返回类型

12.ConstructorParameters：获取构造函数的传入参数类型

13.InstanceType：获取构造函数的返回类型

```typescript
interface Student {
    name: string;
    age: number;
}
interface StudentFunc {
    (name: string, age: number): Student;
}
interface StudentConstructor {
    new(name: string, age: number): Student;
}
// 普通函数
const s1: Parameters<StudentFunc> = ['Alice', 22];
const s2: ReturnType<StudentFunc> = {
    name: 'Alice',
    age: 20,
}
// 构造函数
const s3: ConstructorParameters<StudentConstructor> = ['Alice', 22];
const s4: InstanceType<StudentConstructor> = {
    name: 'Alice',
    age: 20,
}
```
14.Uppercase：全大写

15.Lowercase：全小写

16.Capitalize：首字母大写

17.Uncapitalize：首字母小写

## 声明文件

> 可查找库是否有官方声明文件，有的话安装`@types/*`的依赖：[TypeScript官方声明文件搜索](https://www.typescriptlang.org/dt/search?search=axios)

calculator.d.ts声明文件：

```ts
type IOperator = 'plus' | 'minus';
interface ICalculator {
  (operator: IOperator, number: number[]): number;
  plus: (numbers: number[]) => number;
  minus: (numbers: number[]) => number;
}
declare const calculator: ICalculator;
```

在JS文件中使用，发现并没有报错：

```js
calculator.plus([3, 2])
calculator.minus([3, 4]);
```