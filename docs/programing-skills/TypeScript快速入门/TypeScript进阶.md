# TypeScript进阶

## type

type是用来定义约束的别名的

1.一般约束

```typescript
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
  if (typeof n === 'string') {
    return n;
  } else {
    return n();
  }
}
```

2.特定约束

定义字面量，约束是特定值

 ```typescript
 type IObj = 'click' | 1 | true | null;
 // error
 const o1:IObj = 'Hello';
 // 不报错
 const o2:IObj = 1;
 // 不报错
 const o3:IObj = true;
 // error
 const o4:IObj = false;
 ```

## 元组

数组合并了相同类型的对象，而元组（Tuple）合并了不同类型的对象。

```typescript
let tom: [string, number, boolean] = ['Tom', 18, false];
```

**元组就是限定每个位置是啥类型的数组**，上述中tom[1]必须是number类型，如果是其他类型会报错

## 枚举

### 普通枚举

原生JS中没有枚举，在TS中加入了枚举内容：

```typescript
// 原生赋值
enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};
// 手动赋值
enum Days {Sun = 7, Mon, Tue, Wed, Thu, Fri, Sat = <any>"S"};
// 带有计算所得项, Red是常数项, Blue是计算所得项
enum Color {Red, Green, Blue = "blue".length};
```

使用：

```typescript
// 双向寻值
console.log(Days["Sun"] === 0); // true
console.log(Days[0] === "Sun"); // true
```

第二项的编译结果：

```js
var Days;
(function (Days) {
    Days[Days["Sun"] = 7] = "Sun";
    Days[Days["Mon"] = 8] = "Mon";
    Days[Days["Tue"] = 9] = "Tue";
    Days[Days["Wed"] = 10] = "Wed";
    Days[Days["Thu"] = 11] = "Thu";
    Days[Days["Fri"] = 12] = "Fri";
    Days[Days["Sat"] = "S"] = "Sat";
})(Days || (Days = {}));
```

### 常数枚举

使用`const enum`定义的枚举类型：

常数枚举与普通枚举的区别是，它会在编译阶段被删除，并且**不能包含计算成员。**

```ts
const enum Directions {
  Up,
  Down,
  Left,
  Right
}
```

编译结果：

```js
var directions = [0 /* Up */, 1 /* Down */, 2 /* Left */, 3 /* Right */];
```

## 类

### JS中的类

1.属性和方法

```javascript
class Animal {
  // 属性写在构造器中
  constructor(name) {
    this.name = name;
  }
  // 方法
  sayHi() {
    return `My name is ${this.name}`;
  }
}
```

2.继承

```javascript
class Cat extends Animal {
  constructor(name) {
    // 调用父类的 constructor(name)
    super(name);
    console.log(this.name);
  }
  sayHi() {
    // 调用父类的 sayHi()
    return 'Meow, ' + super.sayHi();
  }
}
```

3.getter和setter

```javascript
class Animal {
  constructor(name) {
    this.name = name;
  }
  get name() {
    return 'Jack';
  }
  set name(value) {
    console.log('setter: ' + value);
  }
}
```

4.静态方法

```javascript
class Animal {
  static showAnimal() {
    console.log('调用静态方法');
  }
}
// 通过类名静态调用，调用成功
Animal.showAnimal();
// 通过对象调用，error
let anl = new Animal();
anl.showAnimal();
```

5.实例属性（ES7）

ES6中属性只能写在构造器中，ES7中属性可以单独定义

```javascript
class Animal {
  name = 'Jack';
  constructor() {
    // ...
  }
}
let a = new Animal();
console.log(a.name); // Jack
```

6.静态属性（ES7）

```javascript
class Animal {
  static num = 42;
  constructor() {
    // ...
  }
}
console.log(Animal.num); // 42
```

### TS中的类

1.`public`、`private`和`protected`

```typescript
class Animal {
    private name;
    public constructor(name) {
        this.name = name;
    }
}
```

需要注意的是，TypeScript 编译之后的代码中，并没有限制 `private` 属性在外部的可访问性。

这个类似于Java中的效果

2.readonly

只读属性关键字，只允许出现在属性声明或索引签名或构造函数中。

```typescript
class Animal {
    // public readonly name;
    public constructor(public readonly name) {
        // this.name = name;
    }
}
```

3.抽象类的使用

```typescript
abstract class Animal {
    public name;
    public constructor(name) {
        this.name = name;
    }
    public abstract sayHi();
}

class Cat extends Animal {
    public sayHi() {
        console.log(`Meow, My name is ${this.name}`);
    }
}

let cat = new Cat('Tom');
```

## 类与接口

### 类实现接口

对类的约束分为两块，实例部分和静态部分

```javascript
// 约束实例部分
interface IPerson {
  sex: string;
  age: number;
  show(): void;
}
// 约束静态部分
interface IPersonConstructor {
  new(sex: string, age: number): IPerson;
  college: string;
}
const dog: IPersonConstructor = class Teacher implements IPerson {
  sex: string;
  age: number;
  static college: string;
  constructor(sex: string, age: number) {
    this.sex = sex;
    this.age = age;
  }
  show() {
    console.log('老师今年' + this.age + '岁,性别' + this.sex);
  }
}
```

当然静态部分的new不一定用类实现，也可以自己写个函数：

```typescript
function createPerson(ctor: IPersonConstructor, sex: string, age: number): IPerson {
  return new ctor(sex, age);
}
```

### 接口继承接口

很好理解，子接口是父接口的约束扩展

```typescript
interface Alarm {
    alert(): void;
}
interface LightableAlarm extends Alarm {
    lightOn(): void;
    lightOff(): void;
}
```

### 接口继承类

> 怪异操作，在TypeScript中竟然可以让接口继承类。
>
> 实际上「接口继承类」和「接口继承接口」没有什么本质的区别。

实际上，当我们在声明 `class Point` 时，除了会创建一个名为 `Point` 的类之外，同时也创建了一个名为 `Point` 的接口。

因此 `Point` 既可以当做一个类来用【使用 `new Point` 创建它的实例】，也可以将 `Point` 当做一个类型来用【使用 `:Point` 表示参数的类型】。

```typescript
/*
// 创建类同时创建的隐藏的接口
interface PointInstanceType {
  x: number;
  y: number;
}
*/
class Point {
  x: number;
  y: number;
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}
// 接口继承类。等价于 interface Point3d extends PointInstanceType
interface Point3d extends Point {
  z: number;
}
// 把类当做接口使用。等价于 p: PointInstanceType
function printPoint(p: Point) {
  console.log(p.x, p.y);
}
```

## 泛型

### 基本用法

#### 函数泛型

注意这种写法，在声明函数名后定义泛型，这样后面才能使用

```typescript
function swap<T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}
// 完整写法，返回值的约束，函数泛型都有
let res1: [number, string] = swap<string, number>(['eight', 8]);
console.log(res1);		// [ 8, 'eight' ]
// 简洁写法，通过类型推导得到
let res2 = swap(['nine', 9]);
console.log(res2);		// [ 9, 'nine' ]
```

除了声明式写法，还有变量式写法：

```typescript
// 变量式
let swap: <T, U>(tuple: [T, U]) => [U, T] = function <T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}
// 箭头函数式,注意前后两个箭头=>表示含义不一样
let swap: <T, U>(tuple: [T, U]) => [U, T] = <T, U>(tuple: [T, U]): [U, T] => {
  return [tuple[1], tuple[0]];
}
```

#### 接口泛型

由于变量式的存在，因此引入了接口泛型，优化上述的写法

```typescript
interface IFunc<T, U> {
  (tuple: [T, U]): [U, T];
}
let swap: IFunc<number, number> = function <T, U>(tuple: [T, U]): [U, T] {
  return [tuple[1], tuple[0]];
}
```

#### 类的泛型

泛型标注在类名上，然后再定义类的内部中使用

```typescript
class Animal<T>{
  constructor(private animals: T[]) { }
  getAnimals(index: number): T {
    return this.animals[index];
  }
}
const animal = new Animal<string>(['狮子', '大象', '鲸鱼'])
console.log(animal.getAnimals(2));	// 鲸鱼
```

> 泛型也可以设置默认类型：`<T = string>`

### 泛型约束

通过泛型约束限定了泛型T的某些特性

```typescript
interface Animal {
  name: string;
}
// 接口约束,T被约束为对象且必须有name属性
class SelectAnimal<T extends Animal>{
  constructor(private animals: T[]) { }
  getAnimals(index: number): string {
    return this.animals[index].name;
  }
}
// 必须传入对象数组且每个对象必须含有name属性
const animal = new SelectAnimal<Animal>([
  { name: '大象' },
  { name: '鲸鱼' },
  { name: '老虎' }
])
console.log(animal.getAnimals(2));
```

## 命名空间

因为大型的前端项目中可能存在命名中途的问题，因此引入命名空间的概念。

命名空间是可以嵌套的。

```typescript
namespace 命名空间名{
    export namespace 命名空间名{
        
    }
    ……
    export function fn(){
        ……
    }
}
```

当涉及到多文件时，我们必须确保所有编译后的代码都被加载了，有两种方式：

- 把所有的输入文件编译为一个输出文件，需要使用`--outFile`标记：`tsc --outFile sample.js Test.ts Test2.ts Test3.ts`
- 编译成多个单个文件，然后用script引入