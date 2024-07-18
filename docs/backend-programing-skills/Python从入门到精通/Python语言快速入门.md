# Python语言快速入门

## 运算符

数值运算：

- 四则运算、`//` 整除、`%`、`**` 幂。

逻辑运算：

- 比较：<、==、>、<=、>=、!=
- 逻辑运算：and、or、not
- 类型转换：int(a)、float(b)、str(a)

海象运算符：在表达式同时进行赋值和返回赋值的值。

```python
if (n := len(a)) > 10:
    print(f"List is too long ({n} elements, expected <= 10)")
```

位运算：

- &（与）、|（或）、^（异或）、~（取反）、<<、>>

成员运算符：

- `in`、`not in`：如果在**指定序列**中（没）找到值。

身份运算符：

- `is`、`is not`：判断两个标识符是否引用自一个对象。

:::tip

`is` 与 `==` 区别：`is` 用于判断两个变量引用对象是否为同一个， `==` 用于判断引用变量的值是否相等。

```python
a = [1, 2, 3]
b = a
print(a == b)   # True
print(a is b)   # True
b = a[:]
print(a == b)   # True
print(a is b)   # False
```

:::

## 数据类型

### Number

```python
a, b, c, d = 20, 5.5, True, 4+3j
print(type(a), type(b), type(c), type(d)) # <class 'int'> <class 'float'> <class 'bool'> <class 'complex'>
```

1.`int`：表示长整数类型。

2.`bool`：True 为 1，False 为 0。

在 Python3 中，bool 是 int 的子类，可以和数字相互运算。

```python
a = True
b = False
# 逻辑运算符
print(a and b)  # False
print(a or b)   # True
print(not a)    # False
# 类型转换
print(int(a))   # 1
print(float(b)) # 0.0
print(str(a), type(str(a)))   # True <class 'str'>
# 和数字相互运算
print(a + 2)    # 3
```

3.`float`：表示浮点数类型。

```python
# 除法总是返回浮点数
print(14 / 7, 14 // 7)  # 2.0 2
```

4.`complex`：表示复数类型。

### String

字符串是不可变的，因此不能索引赋值和切片赋值。

1.索引：`new_str[1]`。但**索引越界会报错**。

2.切片：

```python
new_str = "Hello,world!"
# 切片截取
print(new_str[0:2])		# He
print(new_str[:2])		# He
print(new_str[0:-2])	# Hello,worl
# 跨度为2的截取，如果为负数则表示逆向截取
print(new_str[0:-2:2])  # Hlowr
```

3.重复：`new_str * 2`

4.连接：使用 `+` 运算符连接字符串

5.长度：`len(new_str)`

6.f 字符串：

```python
name = "zhengyu"
new_str = f"Hello,{name}!"
print(new_str)	# Hello,zhengyu!
width = 10
precision = 4
value = 12.34567
# 格式化为宽度为width的字符串，并且小数点后保留precision位数字
print(f"result: {value:{width}.{precision}}")	# result:      12.35
```

:::tip

切片操作的第三个参数如果不传入，默认是1。如果为正，则左闭右开取；如果为负，则左开右闭取。

:::

:::danger

一个很坑的点，python 中有 `str()` 函数，所以变量命名就不能用 `str` 了。

:::

### List

列表是可变的。

1.索引：

```python
list = [1, "Hello", "World", "筝语", "Yotta"]
# 索引获取值
print(list[0])
# 索引赋值
list[0] = "First"
```

2.切片：

```python
list = [1, "Hello", "World", "筝语", "Yotta"]
# 切片截取
print(list[0:3])	# [1, 'Hello', 'World']
print(list[2:])		# ['World', '筝语', 'Yotta']
print(list[-2:])	# ['筝语', 'Yotta']
# 跨度为2的截取
print(list[0:3:2])	# [1, 'World']
# 切片赋值
list[0:2] = ["你好", "世界"]
list[4:] = []
print(list)     # ['你好', '世界', 'World', '筝语']
# 列表置为空
letters[:] = []
```

3.重复：`list* 2`

4.连接：使用 `+` 运算符连接字符串

5.长度：`len(list)`

6.推导式

推导式包含一个表达式，后面为一个 for 子句，然后是零个或多个 for 或 if 子句。

```python
nums = [x for x in range(10)]
print(nums)     # [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
pointsList = [(x, y) for x in [1,2,3] for y in [1,2,3] if x != y]
print(pointsList)   # [(1, 2), (1, 3), (2, 1), (2, 3), (3, 1), (3, 2)]
```

### Tuple

元组和列表类似，不同之处在于**元组的元素不能修改**，写在小括号内 `()`。也可以索引、截取、`+` 操作符拼接。

```python
# 定义元组时，园括号可有可无
tuple1 = 1, 2, 3, 4, 5
tuple2 = (6, 7, 8, 9)
tuple3 = tuple1 + tuple2
# tuple4定义了嵌套的元组
tuple4 = tuple1, tuple2
print(tuple1)   # (1, 2, 3, 4, 5)
print(tuple2)   # (6, 7, 8, 9)
print(tuple3)   # (1, 2, 3, 4, 5, 6, 7, 8, 9)
print(tuple4)   # ((1, 2, 3, 4, 5), (6, 7, 8, 9))
```

### Set

创建集合用花括号 `{}` 或 `set()` 函数创建。

:::danger

注意：创建**空集合**只能用 `set()`，不能用 `{}`，因为 `{}` 创建的是空字典。

:::

```python
set1 = {1, "Baidu", 2, "Zhihu", 3, "Bilibili"}
set2 = {4, "Zhihu"}
print(set1)
print(set1 & set2)	# 交集
print(set1 | set2)	# 并集
print(set1 - set2)	# 差集
print(set1 ^ set2)	# 对称差集
```

集合也支持推导式：

```python
a = set(x for x in 'abracadabra' if x in 'abc')
print(a)
```

### Dictionary

创建字典用花括号 `{}` 或 `dict()` 函数创建，字典是无序的 `key:value` 键值对集合。

**键（key）必须使用不可变类型。**

```python
dicts = {
    "name": "P4V列",
    "type": "P4VPath"
}
del dicts["name"]
dicts["property"] = {
    "targetFieldId": "fld28it65nv",
    "closeList": [1, 2, 3],
}
print(dicts)    # {'type': 'P4VPath', 'property': {'targetFieldId': 'fld28it65nv', 'closeList': [1, 2, 3]}}
# 可以用dict()构造函数直接键值对序列创建字典
dicts2 = dict([('sape', 4139), ('guido', 4127), ('jack', 4098)])
print(dicts2)   # {'sape': 4139, 'guido': 4127, 'jack': 4098}
```

字典也支持推导式：

```python
dicts = {x: x**2 for x in (2, 4, 6)}
print(dicts)   # {2: 4, 4: 16, 6: 36}
```

### bytes

表示**不可变的二进制序列**，可以使用 `b` 前缀创建，也可以使用哦个 `bytes()` 函数将其他类型的对象转换为 `bytes` 类型。`bytes()` 函数的第一个参数是要转换的对象，第二个参数是编码方式，如果省略第二个参数，则默认使用 `UTF-8` 编码。

```python
x = bytes("hello", encoding="utf-8")
```

与字符串类型类似，`bytes` 类型也支持许多操作和方法，如切片、拼接、查找、替换等等。同时，由于 `bytes` 类型是不可变的，因此在进行修改操作时需要创建一个新的 `bytes` 对象。

```python
bts = b"Hello"
res = bts[1:3] + b"World"
print(res)		# b'elWorld'
```

## 流程控制

### if...elif...else

```python
import math
def getPowNums(num: int) -> int:
    if num < 0:
        return 0
    elif num >=0 and num <= 10:
        return int(math.pow(num, 2))
    else:
        return 10
```

### for循环

和其他语言不同，python 中的 for 循环必须以 `for...in...` 使用，**列表、元组、字符串都是序列，是在任意序列的元素上迭代，按它们在序列中出现的顺序**。python 的 for 循环最后可以接 else，循环结束时候会执行。

break 可以跳出 for 和 while，**如果循环终止，对应的 else 不会执行**。continue 可以跳过当此循环块的剩余语句，然后进行下次循环。

`range(start, stop, step)` 函数：返回等差数列的可迭代对象。

```python
print(list(range(5, 10)))       # [5, 6, 7, 8, 9]
print(list(range(0, 10, 3)))    # [0, 3, 6, 9]
print(list(range(0, -10, -2)))  # [0, -2, -4, -6, -8]
```

```python
for i in range(5):
    print(i)
else:
    print("循环结束")
```

### while循环

```python
count = 0
while count < 5:
   print (count, "小于 5")
   count = count + 1
else:
   print (count, "大于或等于 5")
```

### match...case

基础用法，类似于其它语言的`switch...case`。

```python
def http_error(status):
    match status:
        case 400|401|402:
            return "客户端请求错误"
        case 500|501|502:
            return "服务端内部错误"
        # 相当于其他语言的default
        case _:
            return "Something's wrong with the internet"
```

高级用法，用到解包和模式匹配。

```python
def process_list(lst):
    match lst:
        case [x, y] if x > 10:
            print(f"两个元素，x大于10：{x} 和 {y}")
        case [x, y] if x <= 10:
            print(f"两个元素，x不大于10：{x} 和 {y}")
        case [x, *rest]:
            print(f"第一个元素：{x}，其余元素：{rest}")
        case []:
            print("空列表")
        case _:
            print("其他情况")

process_list([11, 2])
process_list([10, 2])
process_list([1, 2, 3, 4, 5])
process_list([])
```

### 循环辅助函数

`enumerate()`：返回一个迭代器，迭代器返回元组，元组第一个元素是索引，第二个元素是元素本身。

而字典类型，可以使用字典的方法：

- `dict.keys()`：返回一个迭代器，迭代器返回键构成的列表。
- `dict.items()`：返回一个迭代器，迭代器返回元组，元组第一个元素是键，第二个元素是值。

`zip()`：在多个迭代器上并行迭代，从每个迭代器返回一个数据项组成元组，遍历次数取两者更短的。

```python
new_str = "你好世界"
lists = list([1, 2, 3, 4, 5])
tuples = 1, 2, 3
sets = set(['a', 'b', 'b', 'c', 'a'])
dicts = dict([('sape', 4139), ('guido', 4127), ('jack', 4098)])
# 遍历字符串
for ch in new_str:
    print(ch, end=" ")
for index, ch in enumerate(new_str):
    print(f"{index}-{ch}", end=" ")
# 遍历列表或元组
for ch in tuples:
    print(ch, end=" ")
for index, ch in enumerate(lists):
    print(f"{index}-{ch}", end=" ")
# 遍历集合
for ch in sets:
    print(ch, end=" ")
# 遍历字典
for k, v in dicts.items():
    print(f"{k}-{v}", end=" ")
# 组合遍历
for q, a in zip(tuples, dicts.items()):
    print(q, a)
```

## 函数参数

1.默认参数：`def process_list(lst: list = [1, 1])`

:::danger

注意：默认参数虽然能赋值，但最好只拿来用。

比如下面例子，L默认参数是空的，但函数会累加后续调用时传递的参数。

```python
def f(a, L=[]):
    L.append(a)
    return L

print(f(1))     # [1]
print(f(2))     # [1, 2]
print(f(3))     # [1, 2, 3]
```

如果不想后续调用共享默认值，需要这样写：

```python
def f(a, L=None):
    if L is None:
        L = []
    L.append(a)
    return L
```

:::

2.关键字参数

函数调用时，可以传入关键字参数，参数名必须与函数定义时参数名一致。

3.可变参数列表和可变关键字参数列表

`def cheeseshop(kind, *arguments, **keywords)` 中，`arguments` 是可变参数列表，元组类型，`keywords` 是可变关键字参数列表，字典类型。

```python
def getPos(x: int, y: int, z: int = 0, *arguments, **keywords) -> None:
    print("x, y, z的值为", [x, y, z])
    print(arguments)
    print(keywords)

getPos(1, 2)
getPos(1, 2, 3, 4, 5)      # arguments为(4, 5)
getPos(z = 1, x = 2, y = 3)
getPos(x = 1, z = 2, y = 3, alpha = 0.5, beta = 0.6)    # keywords为{'alpha': 0.5, 'beta': 0.6}
```

4.解包可变参数列表和解包可变关键字参数列表

用 `*` 把实参从列表或元组解包出来，用 `**` 把实参从字典解包出来。

```python
def getStyle(bold: int, color: str, bgColor: str = "white"):
    print(bold, color, bgColor)

list = [400, 'cyan']
getStyle(*list)     # 400 cyan white
d = { "bold": 500, "color": 'red', "bgColor": 'black' }
getStyle(**d)       # 500 red black
```

5.位置参数和关键字参数的分隔

```
def f(pos1, pos2, /, pos_or_kwd, *, kwd1, kwd2):
      -----------    ----------     ----------
        |             |                  |
        |        Positional or keyword   |
        |                                - Keyword only
         -- Positional only
```

在 `/` 前的必须是位置参数，在 `*` 后的必须为关键字参数，两者之间的是两种参数类型都行。


```python
def getPos2(pos1, pos2, /, pos_or_kwd, *, kwd1, kwd2):
    print(pos1, pos2, pos_or_kwd, kwd1, kwd2)

getPos2(pos1 = 1, pos2 = 2, pos_or_kwd = 3, kwd1 = 4, kwd2 = 5)     # TypeError: getPos2() got some positional-only arguments passed as keyword arguments: 'pos1, pos2'
getPos2(1, 2, pos_or_kwd = 3, kwd1 = 4, kwd2 = 5)       # 正常执行
getPos2(1, 2, 3, kwd1 = 4, kwd2 = 5)        # 正常执行
getPos2(1, 2, 3, 4, kwd2 = 5)   # TypeError: getPos2() takes 3 positional arguments but 4 positional arguments (and 1 keyword-only argument) were given
```

5.函数作为实参

函数可以作为实参传递给另一个函数，下面是排序操作的 key 函数例子。

```python
pairs:list[tuple[int, str]] = [(1, 'one'), (3, "three"), (2, 'two')]
def sortDesc(pair):
    return -pair[0]
pairs.sort(key=sortDesc)
```

当然也可以使用 Lambda 表达式。

```python
pairs.sort(key=lambda pair: -pair[0])
```

## 模块

