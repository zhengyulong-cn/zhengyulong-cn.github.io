# Go语言常用API操作

## 数组和切片基础操作

1.`[...]`：自动根据初始值推导数组长度

```go
arr := [...]int{1,2,3}
```

2.`len()`：返回数组或切片长度

3.`cap()`：返回切片容量

4.range迭代数组或切片

```go
for index, value := range arr {}
```

5.`append()`：向切片追加元素

6.`copy()`：复制切片元素，多余的舍去

## slices包

1.`BinarySearch` 和 `BinarySearchFunc`

作用：在切片中查找指定元素。

```go
names := []string{"Alice", "Bob", "Vera"}
index, found := slices.BinarySearch(names, "Bob")
fmt.Println(index, found)
```

BinarySearchFunc：

```go
type Person struct {
	Name string
	Age  int
}
people := []Person{
    {"Alice", 55},
    {"Bob", 24},
    {"Gopher", 13},
}
n, found := slices.BinarySearchFunc(people, Person{"Bob", 16}, func(a, b Person) int {
    return cmp.Compare(a.Name, b.Name)
})
fmt.Println(n, found)
```

2.`Clip` 和 `Grow`

作用：`Clip` 从切片中删除未使用的容量，返回 `s[:len(s)]`。`Grow` 增加切片容量。

3.`Clone`

作用：切片浅克隆。

4.`Contains` 和 `ContainsFunc`

作用：判断是否包含指定元素。

```go
// 判断是否包含字符串
names := []string{"Alice", "Bob", "Vera"}
isContain := slices.Contains(names, "Alice")
fmt.Println(isContain)
// 判断是否有偶数
numbers := []int{0, 2, 4, 5}
hasOdd := slices.ContainsFunc(numbers, func(n int) bool {
    return n%2 != 0
})
fmt.Println(hasOdd)
```

:::tip

普通形式和函数形式的区别在对指定值判断逻辑更换为了函数形式，传入参数是各个切片的元素，返回值为 bool。

:::

5.`Compact` 和 `CompactFunc`

作用：删除相邻的重复元素。

Compact：

```go
seq := []int{0, 1, 1, 2, 2, 1, 1}
seq = slices.Compact(seq)
fmt.Println(seq) // [0 1 2 1]
```

CompactFunc：

```go
names := []string{"bob", "Bob", "alice", "VERA", "Vera"}
names = slices.CompactFunc(names, func(a, b string) bool {
    return strings.ToLower(a) == strings.ToLower(b)
})
fmt.Println(names)
```

:::tip

经过该操作，**切片的容量是不变的，长度可能不变，可能变短。**

:::

6.`Delete` 和 `DeleteFunc`

作用：删除元素。

```go
// 删除[1,4)区间的元素
letters := []string{"a", "b", "c", "d", "e"}
letters = slices.Delete(letters, 1, 4)
fmt.Println(letters) // [a e]
// 删除偶数
seq := []int{0, 1, 1, 2, 3, 5, 8}
seq = slices.DeleteFunc(seq, func(n int) bool {
    return n%2 != 0
})
fmt.Println(seq)
```

7.`Equal` 和 `EqualFunc`

作用：判断是否相等。

```go
numbers := []int{0, 42, 8}
fmt.Println(slices.Equal(numbers, []int{0, 42, 8}))
fmt.Println(slices.Equal(numbers, []int{10}))
```

8.`Index` 和 `IndexFunc`

作用：查找第一个元素的坐标，没查找到则返回 -1。

```go
numbers := []int{0, 42, 8}
fmt.Println(slices.Index(numbers, 8))	// 2
fmt.Println(slices.Index(numbers, 7))	// -1
```

9.`Insert`

作用：在指定位置插入元素。

```go
numbers := []int{0, 42, 8}
numbers = slices.Insert(numbers, 1, 100)
fmt.Println(numbers)
```

10.`Max` 和 `MaxFunc`

作用：查找切片中最大的元素。

```go
numbers := []int{0, 42, -10, 8}
fmt.Println(slices.Max(numbers))	// 42
```

10.`Min` 和 `MinFunc`

作用：查找切片中最小的元素。

11.`Replace`

作用：替换切片区间为指定元素。

```go
// 替换[1,3)的元素
names := []string{"Alice", "Bob", "Vera", "Zac"}
names = slices.Replace(names, 1, 3, "Bill", "Billie", "Cat")
fmt.Println(names)	// [Alice Bill Billie Cat Zac]
```

12.`Reverse`

作用：转置。

13.`Sort`、`SortFunc`、`SortStableFunc`

作用：排序。

```go
smallInts := []int8{0, 1, 12, 11, 8, 10, -10}
slices.Sort(smallInts)
fmt.Println(smallInts)	// [-10 0 1 8 10 11 12]
```

:::tip

`SortFunc` 和 `SortStableFunc` 区别是后者依照排序条件的同时保持相等元素的原始顺序。

:::

## strings包

1.`Clone`

作用：字符串浅克隆。

2.`Compare`

作用：字符串比较大小。

3.`Contains`、`ContainsAny`、`ContainsRune`、`ContainsFunc`

作用：判断是否包含指定元素。

- `Contains`：针对子字符串。
- `ContainsAny`：针对字符集合。
- `ContainsRune`：针对 Unicode 码点。

```go
// 包含子字符串foo
fmt.Println(strings.Contains("seafood", "foo")) // true
// 包含字符集合中的字符e
fmt.Println(strings.ContainsAny("failure", "ae")) // true
// 97的Unicode对应的就是a
fmt.Println(strings.ContainsRune("aardvark", 97)) // true
```

4.`Count`

作用：计算字串的数量。

5.`Cut`、`CutPrefix`、`CutSuffix`

作用：切割字符串。

传参：

- str：目标字符串
- sql：识别字符串，根据它来切割

返回值：

- before：切割后的前半部分
- after：切割后的后半部分
- ok：查找到识别字符串返回 true，否则为 false

```go
str := "你好，中国"
before, after, found := strings.Cut(str, "，")
fmt.Println(before, after, found) // 你好 中国 true
// 根据前缀切割
after2, found := strings.CutPrefix(str, "你")
fmt.Println(after2, found) // 好，中国 true
// 根据后缀切割
before2, found := strings.CutSuffix(str, "国")
fmt.Println(before2, found) // 你好，中 true
```

:::danger

这个操作只能对首次出现的识别字符串切割！

:::

6.`HasPrefix`、`HasSuffix`

作用：判断是否有前缀、后缀。

7.`EqualFold`

作用：忽略大小写判断是否相等。

```go
fmt.Println(strings.EqualFold("Go", "go"))	// true
```

8.`Index`、`IndexAny`、`IndexRune`、`IndexByte`、`IndexFunc`、`LastIndex`、`LastIndexAny`、`LastIndexByte`、`LastIndexFunc`

作用：查找第一个元素的坐标，没查找到则返回 -1。

- `Index`：针对子字符串。
- `IndexAny`：针对字符集合。
- `IndexRune`：针对 Unicode 码点。
- `IndexByte`：针对 byte 类型。

带有 Last 的则是从最后一个元素查找。

:::danger

注意：

1. strings 库中的 `Index` 系列函数是可以有 Last 的，但 splices 库没有！
2. strings 库中的 `Index` 系列函数的 rune 是没有 Last 的！

:::

9.`Join`

作用：字符串数组的连接。

```go
elems := []string{"Foo", "bar", "baz"}
fmt.Println(strings.Join(elems, ";"))	// Foo;bar;baz
```

10.`Map`

作用：根据函数将字符串的字符挨个处理后返回副本。

```go
str := "I have a cat."
str2 := strings.Map(func(r rune) rune {
    return unicode.ToUpper(r)
}, str)
fmt.Println(str2) // I HAVE A CAT.
```

11.`Repeat`

作用：生成叠词字符串。

```go
fmt.Println("ba" + strings.Repeat("na", 2))	// banana
```

12.`Replace` 和 `ReplaceAll`

作用：替换子串，`ReplaceAll` 则是替换所有的。

```go
// 将字符串中的k替换为ky，替换2个
fmt.Println(strings.Replace("oink oink oink", "k", "ky", 2)) // oinky oinky oink
```

13.`Split`、`SplitN`、`SplitAfter`、`SplitAfterN`

作用：分割字符串为字符串数组。

14.`Fields`

作用：按照单词拆分字符串。

:::tip

`Split` 和 `Fields` 很像，但还是有区别的：

- `Split` 是通过指定分隔符拆分字符串的；
- `Fields` 是根据单词拆分的，单词之间可以是多个空格、制表符、换行符；

`Split` 是更通用的分割方式，如果为了拆分长文本为单词，则 `Fields` 更方便些。

:::

15.`Trim`、`TrimLeft`、`TrimRight`

作用：去除首尾空格。

16.`ToLower` 和 `ToUpper`

作用：字符串所有字母转小写或大写。

## strconv包

1.Format：将其他类型转换为字符串类型。

`FormatBool`：

```go
str := strconv.FormatBool(true)
fmt.Println(str, reflect.TypeOf(str)) // true string
```

`FormatComplex`、`FormatFloat`：

传入参数：

- num：复数或浮点数
- fmt：格式说明符，表示复数的格式
- prec：精度，表示小数部分的位数
- bitSize：
  - 复数：实部和虚部的总位数，可以是 64 或 128
  - 浮点数：
    - 0：返回浮点数，具体类型由字符串表示的浮点数决定
    - 32：返回 `float32`
    - 64：返回 `float64`

```go
complexNum := complex(3, 4)
str := strconv.FormatComplex(complexNum, 'g', -1, 64)
fmt.Println(str) // (3+4i)
```

:::tip

格式说明符：

- `f`：十进制无指数形式
- `g`：十进制或科学计数法，根据实际情况而定
- `e`：科学计数法
- `b`：二进制
- `o`：八进制
- `x` 或 `X`：十六进制

:::

`FormatInt`：

```go
v := int64(-42)
// 转成16进制字符串
s16 := strconv.FormatInt(v, 16)
fmt.Printf(s16)	// -2a
```

`FormatUint`：

```go
v := uint64(42)
// 转成16进制字符串
s16 := strconv.FormatUint(v, 16)
fmt.Printf(s16) // 2a
```

2.Parse：将字符串解析为目标类型。

`ParseBool`：

```go
v := "true"
if b, err := strconv.ParseBool(v); err == nil {
    fmt.Println(b, reflect.TypeOf(b)) // true bool
}
```

`ParseComplex`、`ParseFloat`：

传入参数：

- num：复数或浮点数
- bitSize：
  - 复数：实部和虚部的总位数，可以是 64 或 128
  - 浮点数：
    - 0：返回浮点数，具体类型由字符串表示的浮点数决定
    - 32：返回 `float32`
    - 64：返回 `float64`

```go
complexStr := "3.14+2.7i"
if complexVal, err := strconv.ParseComplex(complexStr, 64); err == nil {
    fmt.Println(complexVal, reflect.TypeOf(complexVal))	// (3.140000104904175+2.700000047683716i) complex128
}
```

`ParseInt`：

- num：复数或浮点数
- base：进制
- bitSize：整数的位数，可以是0、8、16、32、64

```go
v32 := "-3546343822222222222"
if s, err := strconv.ParseInt(v32, 10, 64); err == nil {
    fmt.Printf(s)  // -3546343822222222222, int64
}
```

`ParseUint`：

```go
v := "42"
if s, err := strconv.ParseUint(v, 10, 32); err == nil {
    fmt.Printf("%v, %T\n", s, s)  // 42, uint64
}
```

2.`Atoi`

作用：相当于 `ParseInt(s, 10, 0)`

3.`Itoa`

作用：相当于 `FormatInt(int64(i), 10)`

4.`Quote`

作用：返回使用 Go 转义后的字符串。

```go
s := strconv.Quote(`"Hi, <span>Alice</span>\n"`)
fmt.Println(s) // "\"Hi, <span>Alice</span>\\n\""
```



