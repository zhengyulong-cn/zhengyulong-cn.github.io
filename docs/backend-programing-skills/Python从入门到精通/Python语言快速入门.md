# Python语言快速入门

## 数据类型

#### Number

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

#### String

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

#### List

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

### 
