# Python语言快速入门

## Python基础

### 注释

```python
# 第1个注释
'''
第2注释
'''
"""
第3注释
"""
```

### 代码格式

1.缩进

Python 没有大括号 `{}`，通过缩进表示。缩进不一致，会导致运行错误。

2.多行语句

如果语句太长，可以用反斜杠 `\` 来实现。

在 `[]`, `{}`, 或 `()` 中的多行语句，不需要使用反斜杠 `\` 的。

```python
total = item_one + \
        item_two + \
        item_three\
total = ['item_one', 'item_two', 'item_three',
        'item_four', 'item_five']
```

3.空行

函数之间或类方法之间要用空行分隔，表示新的代码的开始。空行也是程序代码的一部分。

4.一行多条语句

可以使用 `;` 分割。

```python
import sys; x = 'runoob'; sys.stdout.write(x + '\n')
```

5.print 输出不换行，末尾添加 `end=""`。

```python
print(x, end="")
```

6.多变量赋值

```python
a, b, c = 1, 2, "runoob"
```

### import

```python
import sys
from sys import argv,path
from sys import *
```

### 数据类型

- Number
  - int
  - bool
  - float
  - complex
- String
- List
- Tuple
- Set
- Dictionary

#### Number

1.`int`：表示长整数类型。

```python
>>> a, b, c, d = 20, 5.5, True, 4+3j
>>> print(type(a), type(b), type(c), type(d))
<class 'int'> <class 'float'> <class 'bool'> <class 'complex'>
```

:::tip

`isinstance` 和 `type` 的区别：

- `type()` 不会认为子类是一种父类类型。
- `isinstance()` 会认为子类是一种父类类型。

:::

2.`bool`：True 为 1，False 为 0。

在 Python3 中，bool 是 int 的子类，可以和数字相互运算。

```python
>>> True+1
2
```



```python
a = True
b = False

# 逻辑运算符
print(a and b)  # False
print(a or b)   # True
print(not a)    # False

# 类型转换
print(int(a))   # 1
print(float(b)) # 0.0
print(str(a))   # "True"
```

#### String

```python
new_str = "Hello,world!"
# 索引
print(new_str[1])		# e
# 截取
print(new_str[0:2])		# He
print(new_str[:2])		# He
print(new_str[0:-2])	# Hello,worl
## 跨度为2的截取，如果为负数则表示逆向截取
print(new_str[0:-2:2])	# Hlowr
# 重复
print(new_str * 2)		# Hello,world!Hello,world!
# 连接
print(new_str + "你好")	# Hello,world!你好
```

:::danger

Python 的字符串不能给索引位置赋值，比如 `new_str[2]="m"` 就会报错。

:::

:::danger

一个很坑的点，python 中有 `str()` 函数，所以变量命名就不能用 `str` 了。

:::

#### List

```python
list = [1, "Hello", "World", "筝语", "Yotta"]
tinylist = [False, ["Zhengyu"]]
# 索引
print(list[0])
# 截取
print(list[0:3])	# [1, 'Hello', 'World']
print(list[2:])		# ['World', '筝语', 'Yotta']
print(list[-2:])	# ['筝语', 'Yotta']
print(list[0:3:2])	# [1, 'World']
# 重复
print(tinylist * 2)
# 连接
print(list + tinylist)		# [1, 'Hello', 'World', '筝语', 'Yotta', False, ['Zhengyu']]
```

:::tip

截取操作的第三个参数如果不传入，默认是1。如果为正，则左闭右开取；如果为负，则左开右闭取。

:::

有一个经典的例子，可以通过截取操作快速反转列表：

由于第 3 个参数 step 是负的，所以左开右闭取区间值。

```python
inputWord = ["H", "e", "l", "l", "o"]
res = inputWord[-1::-1]
print(res, res2)	# ['o', 'l', 'l', 'e', 'H']
```

#### Tuple

元组和列表类似，不同之处在于**元组的元素不能修改**，写在小括号内 `()`。也可以索引、截取、`+` 操作符拼接。

```python
tuple = ('abcd', 786 , 2.23, 'runoob', 70.2)
```

:::tip

字符串、列表、元组都属于序列。（sequence）

:::

#### Set

集合使用大括号 `{}` 表示，用逗号 `,` 分割，也可以使用 `set()` 函数创建。

Python 中集合运算是真方便！

```python
set1 = {1, "Baidu", 2, "Zhihu", 3, "Bilibili"}
set2 = {4, "Zhihu"}
print(set1)
print(set1 & set2)	# 交集
print(set1 | set2)	# 并集
print(set1 - set2)	# 差集
print(set1 ^ set2)	# 对称差集
```

#### Dictionary

字典是一种映射类型，用 `{}` 表示，是无序的 `key: value` 的集合，也可以使用 `dict()` 函数创建。

**键（key）必须使用不可变类型。**

```python
dicts = {}
dicts["type"] = "P4VPath"
dicts["property"] = {
    "targetFieldId": "fld28it65nv",
    "closeList": [1, 2, 3],
}
print(dicts)

"""
{'type': 'P4VPath', 'property': {'targetFieldId': 'fld28it65nv', 'closeList': [1, 2, 3]}}
"""
```

#### bytes

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

### 数据类型转换

#### 隐式转换

对两种不同类型的数据进行运算，较低数据类型（整数）就会转换为较高数据类型（浮点数）以避免数据丢失。

```python
num_int = 123
num_flo = 1.23
num_new = num_int + num_flo
print(type(num_int))	# <class 'int'>
print(type(num_flo))	# <class 'float'>
print(num_new)			# 124.23
print(type(num_new))	# <class 'float'>
```

但**数字类型和字符串类型是不能加和的！**需要进行显式转换。

#### 显式转换

- `int(x)`
- `float(x)`
- `str(x)`：转换为字符串
- `repr(x)`：转换为表达式字符串
- `complex()`
- `tuple(s)`
- `list(s)`
- `set(s)`
- `dict(d)`
- `chr(x)`：转换为一个字符
- `ord(x)`：字符转整数值
- `hex(x)`：整数转十六进制
- `oct(x)`：整数转八进制

### 运算符

数值运算：

- 四则运算、`//` 整除、`%`、`**` 幂。

逻辑运算：

-  比较：<、==、>、<=、>=、!=
-  逻辑运算：and、or、not
-  类型转换：int(a)、float(b)、str(a)

海象运算符：在表达式同时进行赋值和返回赋值的值。

```python
if (n := len(a)) > 10:
    print(f"List is too long ({n} elements, expected <= 10)")
```

位运算：

- &（与）、|（或）、^（异或）、~（取反）、<<、>>

成员运算符：

- in、not in：如果在指定**序列**中（没）找到值。

身份运算符：

- is、is not：判断两个标识符是否引用自一个对象。

:::tip

is 与 == 区别：

is 用于判断两个变量引用对象是否为同一个， == 用于判断引用变量的值是否相等。

```python
a = [1, 2, 3]
b = a
print(a == b)	# True
print(a is b)	# True
b = a[:]
print(a == b)	# True
print(a is b)	# False
```

:::

### 条件和循环

#### if...elif...else条件

```python
age = int(input("请输入你家狗狗的年龄: "))
if age < 0:
    print("狗狗的年龄输入错误")
elif age <= 3:
    print("小狗狗年龄是", age, "岁")
else:
    print("成年狗狗", age, "岁")
```

#### match...case条件

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

#### while循环

`while...else` 结构

```python
count = 0
while count < 5:
   print (count, "小于 5")
   count = count + 1
else:
   print (count, "大于或等于 5")
```

#### for循环

和其他语言不同，python 中的 for 循环必须以 `for...in...` 使用

```python
for count in range(0, 5, 1):
    print(count)
else:
    print("循环结束")
    
"""
0
1
2
3
4
循环结束
"""
```

`range` 函数：

- `range(5)`：生成 0~5 的数列
- `range(0, 10, 3)`：使用区间 `[0, 10)`，步长 3，生成数列
- `range(0, -10, -3)`：使用区间 `(-10, 0]`，步长 -3，生成数列

#### break和continue

break 可以跳出 for 和 while，**如果循环终止，对应的 else 不会执行**。

continue 可以跳过当此循环块的剩余语句，然后进行下次循环。

### 推导式

Python 推导式是一种独特的数据处理方式，可以**从一个数据序列构建另一个新的数据序列的结构体。**

```
{ expression for item in Sequence if conditional }
```

1.List推导式

2.字典推导式

```python
names = ['Bob','Tom','alice','Jerry','Wendy','Smith']
new_names = [name.upper()for name in names if len(name)>3]
new_dict = {key:len(key)for key in names if len(key)>3}
print(new_names)
print(new_dict)
```

3.集合推导式

```python
new_set = {x for x in 'abracadabra' if x not in 'abc'}
print(new_set)
```

4.元组推导式

```python
generator_obj = (x for x in range(1,10))	# 返回的是生成器对象
new_tuple = tuple(generator_obj)
print(generator_obj)
print(new_tuple)

"""
<generator object <genexpr> at 0x000001DD6AD51A40>
(1, 2, 3, 4, 5, 6, 7, 8, 9)
"""
```

### 迭代器和生成器

#### 迭代器

1.`iter()` 和 `next()`

```python
list=[1,2,3,4]
it = iter(list)    # 创建迭代器对象
# 使用next函数访问迭代器对象
print(next(it))
print(next(it))

# 使用for循环访问迭代器对象
for x in it:
    print (x, end=" ")
    
"""
1
2
3 4 
"""
```

2.类中的迭代器

使用 `__iter__(self)` 和 `__next__(self)`。

3.StopIteration

该异常用于标识迭代完成，防止出现无限循环的情况。

#### 生成器

使用 `yield` 定义生成器函数，使用 `yield` 语句时，函数执行会暂停，并将 `yield` 后面的表达式作为当前迭代的值返回。然后调用 `next()` 或 for 循环迭代时候，函数会从上次暂停的地方继续执行，直到遇到 `yield` 语句。这样生成器函数可以逐步产生值，而不需要一次性计算并返回所有结果。

```python
def countdown(n):
    while n > 0:
        print("before当前的n",n)
        yield n
        print("after当前的n",n)
        n -= 1
 
# 创建生成器对象
generator = countdown(5)
 
# 通过迭代生成器获取值
print(next(generator))  # 输出: 5
print(next(generator))  # 输出: 4
print(next(generator))  # 输出: 3
 
# 使用 for 循环迭代生成器
for value in generator:
    print(value)  # 输出: 2 1

"""
before当前的 n = 5
5
after当前的 n = 5
before当前的 n = 4
4
after当前的 n = 4
before当前的 n = 3
3
after当前的 n = 3
before当前的 n = 2
2
after当前的 n = 2
before当前的 n = 1
1
after当前的 n = 1
"""
```





