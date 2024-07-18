# Python常用操作

## List API

- `list.append(x)`：末尾添加元素 x。
- `list.extend(L)`：扩展列表。

```python
list1 = [1, 2, 3, 4, 5]
list2 = [6, 7, 8, 9, 10]
list1.extend(list2)
print(list1)    # [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

- `list.insert(i, x)`：在 i 的位置插入元素 x。
- `list.remove(x)`：删除第一个值为 x 的元素，未找到元素时触发 `ValueError` 异常。
- `list.pop([i])`：移除列表中的第 i 个元素，并返回该元素的值。如果传参为空，则移除末尾的元素，列表为空或索引越界触发 `IndexError` 异常。
- `list.clear()`：清空列表。
- `list.index(x[, start[, end]])`：获取元素 x 在列表中的索引，未找到元素时触发 `ValueError` 异常。
- `list.count(x)`：获取元素 x 出现的次数。
- `list.sort(*, key=None, reverse=False)`：列表排序。
- `list.reverse()`：列表反转。
- `list.copy()`：浅拷贝，相当于 `list[:]`。
- `del`语句：按照索引删除列表元素。

```python
list1 = [1, 2, 3, 4, 5]
del list1[1]
print(list1)    # [1, 3, 4, 5]
```

- `map()`：对列表每个元素应用一个函数，并返回一个迭代器。

```python
numbers = [1, 2, 3, 4, 5]
# squared是迭代器
squared = map(lambda x: x**2, numbers)
squares = list(squared)
print(squares)  # [1, 4, 9, 16, 25]
```