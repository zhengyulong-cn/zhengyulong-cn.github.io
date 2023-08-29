# TypeScript基础

> TS的思想核心：
>
> - 一切皆为约束
> - 既然是约束，那必然是在相关操作前，已有的操作是不能约束的

## 数据类型的约束

### 基本类型

JS的7种基本数据类型：

+ boolean
+ number
+ big number
+ string
+ null
+ undefined
+ Symbol

TS新增类型：

- any：任意
- void：函数返回值为undefined或空
- never：从不

1.boolean

```typescript
let isDone: boolean = false;
let createdByBoolean: boolean = Boolean(1);
```

注意：new Boolean()返回的是一个对象，不是布尔值

2.number

```typescript
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
// ES6 中的二进制表示法
let binaryLiteral: number = 0b1010;
// ES6 中的八进制表示法
let octalLiteral: number = 0o744;
let notANumber: number = NaN;
let infinityNumber: number = Infinity;
```

3.string

```typescript
let myName: string = 'Tom';
let myAge: number = 25;
// 模板字符串
let sentence: string = `Hello, my name is ${myName}.
I'll be ${myAge + 1} years old next month.`;
```

4.void

```typescript
function alertName(): void {
    alert('My name is Tom');
}
```

声明一个 `void` 类型的变量没有什么用，因为你只能将它赋值为 `undefined` 和 `null`

5.`null` 和 `undefined`

```typescript
let u: undefined = undefined;
let n: null = null;
```

6.any

> 用TS作用的角度看，any类型就是没有约束

如果是一个普通类型，在赋值过程中改变类型是不被允许的；但如果是 `any` 类型，则允许被赋值为任意类型。

```typescript
let myFavoriteNumber: any = 'seven';
myFavoriteNumber = 7;
```

### 联合类型

```typescript
let myFavoriteNumber: string | number;
myFavoriteNumber = true;

// index.ts(2,1): error TS2322: Type 'boolean' is not assignable to type 'string | number'.
//   Type 'boolean' is not assignable to type 'number'.
```

联合类型的变量在被赋值的时候，会根据类型推论的规则推断出一个类型：

```typescript
let myFavoriteNumber: string | number;
myFavoriteNumber = 'seven';
console.log(myFavoriteNumber.length); // 5
myFavoriteNumber = 7;
console.log(myFavoriteNumber.length); // 编译时报错

// index.ts(5,30): error TS2339: Property 'length' does not exist on type 'number'.
```

## 接口

> 接口是对**对象形状**的约束

```typescript
interface Person {
    // 只读属性
    readonly id: number;
    name: string;
    // 可选属性
    age?: number;
    // 任意属性
    [propName: string]: any;
}

let tom: Person = {
    // 只读属性必须在这里赋值，不能单独赋值
    id: 8,
    name: 'Tom',
    // sex是可选属性，要么有要么没有
    // 任意属性必须符合接口样式，可以有多个
    gender: 'male',
    hobby: 'chess'
}
```

**赋值的时候，变量的形状必须和接口的形状保持一致。变量内的普通属性不能多也不能少。**

- 一般情况下接口约束必须是完全匹配
- 如果有可选类型则匹配子集
- 如果有任意属性`[propName: string]: any;`则匹配【key为string，value为any】符合该模式的超集
- 如果设置了`readonly`，是**作用于给对象赋值时候**，而不是定义时候

> 注意：使用任意属性是有坑的
>
> 1.**一旦定义了任意属性，那么确定属性和可选属性的类型都必须是它的类型的子集**：
>
> ```typescript
> interface Person {
>   name: string;
>   age?: number;
>   [propName: string]: string;
> }
> 
> let tom: Person = {
>   name: 'Tom',
>   age: 25,
>   gender: 'male'
> };
> 
>  // index.ts(3,5): error TS2411: Property 'age' of type 'number' is not assignable to string index type 'string'.
>  // index.ts(7,5): error TS2322: Type '{ [x: string]: string | number; name: string; age: number; gender: string; }' is not assignable to type 'Person'.
>  // Index signatures are incompatible.
>  // Type 'string | number' is not assignable to type 'string'.
>  // Type 'number' is not assignable to type 'string'.
> ```
> 2.**一个接口中只能定义一个任意属性。**如果接口中有多个类型的属性，则可以在任意属性中使用联合类型
>
> ```typescript
> interface Person {
>   name: string;
>   age?: number;
>   [propName: string]: string | number;
> }
> ```

## 数组

1.“类型 + 方括号”表示法

```typescript
// 这样定义的每个数组元素都必须是number类型
let fibonacci: number[] = [1, 1, 2, 3, 5];
```

2.数组泛型

```typescript
let fibonacci: Array<number> = [1, 1, 2, 3, 5];
```

3.用接口表示数组

```typescript
// 索引必须是number类型,值必须是number类型
interface NumberArray {
    [index: number]: number;
}
let fibonacci: NumberArray = [1, 1, 2, 3, 5];
```

> 一般情况下不用接口表示数组，而是用接口表示类数组：

```typescript
// arguments是个类数组
function sum() {
  let args: {
    [index: number]: number;
    length: number;
    callee: Function;
  } = arguments;
}
```

事实上常用的类数组都有自己的接口定义，如 `IArguments`, `NodeList`, `HTMLCollection` 等。

## 函数

1.函数声明：

```typescript
function sum(x: number, y: number): number {
    return x + y;
}
```

2.函数表达式：

```typescript
// 注意mySum约束的定义,是直接定义
let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
    return x + y;
};

// 这种写法也对,但是通过类型定义推导出来的约束,是间接定义
let mySum = function (x: number, y: number): number {
    return x + y;
};
```

注意不要混淆了 TypeScript 中的 `=>` 和 ES6 中的 `=>`。在 TypeScript 的类型定义中，`=>` 用来表示函数的定义，左边是输入类型，需要用括号括起来，右边是输出类型。

3.用接口定义函数形状约束：

```typescript
interface SearchFunc {
    (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;
mySearch = function(source: string, subString: string) {
    return source.search(subString) !== -1;
}
```

4.参数的约束

依次为：

- 普通参数
- 可选参数：可有可无
- 默认参数：不传值就是默认值Cat
- 剩余参数：接收多余的参数

```typescript
function buildName(one: string, two?: string, three: string = 'Cat', ...res: any[]) {
    // ...
}
```

5.重载

```typescript
// 重载
function padding(all: number);
function padding(topAndBottom: number, leftAndRight: number);
function padding(top: number, right: number, bottom: number, left: number);
function padding(a: number, b?: number, c?: number, d?: number) {
  if (b === undefined && c === undefined && d === undefined) {
    b = c = d = a;
  } else if (c === undefined && d === undefined) {
    c = a;
    d = b;
  }
  return {
    top: a,
    right: b,
    bottom: c,
    left: d
  };
}
```

当调用`padding()`时候，会从上到下匹配，匹配到哪个就调用哪个

```typescript
padding(1); // Okay: all
padding(1, 1); // Okay: topAndBottom, leftAndRight
padding(1, 1, 1, 1); // Okay: top, right, bottom, left
// 因为重载没有传入3个参数的，因此会报错
padding(1, 1, 1); // Error: Not a part of the available overloads
```

## 类型断言

写法：

- `值 as 类型`
- `<类型>值`
  - 这种写法在TSX中不行

> 断言可以理解为**确定为某种约束**

### 几种用法

1.将一个联合类型断言为其中一个类型

```typescript
interface ICat {
  name: string;
  run(): void;
}
interface IFish {
  name: string;
  swim(): void;
}
function isFish(animal: ICat | IFish) {
  if (typeof (animal as IFish).swim === 'function') {
    return true;
  }
  return false;
}
```

没有断言会报错，因为Cat中没有swim，但加上断言后就可以解决访问 `animal.swim` 时报错的问题了。

2.将一个父接口断言为更加具体的子接口

```typescript
interface IApiError extends Error {
  code: number;
}
function isApiError(error: Error) {
  if (typeof (error as IApiError).code === 'number') {
    return true;
  }
  return false;
}
```

3.将任何一个类型断言为 `any`

```typescript
(window as any).foo = 1;
```

4.将 `any` 断言为一个具体的类型

```typescript
function getCacheData(key: string): any {
  return (window as any).cache[key];
}
interface ICat {
  name: string;
  run(): void;
}
// 确定为使用ICat约束
const tom = getCacheData('tom') as ICat;
tom.run();
```

### 断言规则

断言是有条件的，假设现在有两个约束A和B，要么约束A条件**完全包含**B，要么完全被包含，这样才能使用断言。

```typescript
interface IAnimal {
  name: string;
}
interface ICat {
  name: string;
  run(): void;
}
function testAnimal(animal: IAnimal) {
  return (animal as ICat);
}
function testCat(cat: ICat) {
  return (cat as IAnimal);
}
```

### 断言 vs 类型转换 vs 类型声明

- 类型转换：JavaScript原生就有，将某种类型转换成另一种类型，如：`Boolean(1)`

- 类型断言：只影响TypeScript编译时的类型，断言语句会在编译结果被删除，如：`let tom = animal as ICat;`
- 类型声明：只影响TypeScript编译时的类型，约定变量的类型，如：`const tom: ICat = getCacheData('tom');`

实际上类型声明比类型断言要更严格，类型声明很像Java中：

```typescript
interface IAnimal {
  name: string;
}
interface ICat {
  name: string;
  run(): void;
}
const animal: IAnimal = {name: 'tom'};
// let tom = animal as ICat;
let tom: ICat = animal;		// error
```

**类型声明必须是子约束赋值给父约束**，不能是父约束赋值给子约束。