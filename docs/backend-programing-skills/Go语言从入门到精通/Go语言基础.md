## 一、安装

### Linux

```Shell
wget https://golang.google.cn/dl/go1.21.3.linux-amd64.tar.gz
# 删除旧的go版本
sudo rm -rf /usr/local/go
# 解压
sudo tar -C /usr/local -xzf go1.21.3.linux-amd64.tar.gz
# 配置PATH环境变量
export PATH=$PATH:/usr/local/go/bin
# 查看go的版本
go version
# 配置国内镜像源
go env -w GOPROXY=https://goproxy.cn,direct
go env -w GO111MODULE=on
```

### Windows

1. 官网下载 `go1.21.3.windows-amd64.msi` 安装包。
2. 选择安装目录安装即可，最后命令行执行 `go version` 查看是否安装成功。如果没有配置环境变量需要手动配置。

## 二、基础

### 第一段程序

1.新建文件夹并进入，执行 `go mod init example/hello` ，生成了 `go.mod` 文件，该文件是用来跟踪包模块的。

2.写入如下代码：

```go
package main
import "fmt"
import "rsc.io/quote/v4"

func main() {
    // 这是我的第一个简单的程序
    fmt.Println(quote.Go())
}
```

通过在 [https://pkg.go.dev/](https://pkg.go.dev/) 中查找到 `rsc.io/quote/v4` 包，可以看到该包的相关变量及函数。

3.执行 `go mod tidy` ，添加相关模块，并生成 `go.sum` 文件。

4.执行 `go run .` 运行代码。

从上面代码可知，Go 语言基础组成：

- 包声明
- 引入包
- 函数
- 变量
- 语句 & 表达式
- 注释

### 基础语法

1.行分隔符

一行代表一个语句结束，不需要分号 `;` 结尾，这些工作都将由 Go 编译器自动完成。

如果打算多个语句写在同一行，则必须用 `;` 人为区分，实际开发中不鼓励这样做。

2.注释，只有经典两种

```go
// 单行注释
/*多行注释
 */
```

3.字符串连接

可以通过 `+` 实现：

```go
fmt.Println("Google" + "Runoob")
```

4.格式化字符串

- `fmt.Sprintf`：根据格式化参数生成并返回该字符串。

- `fmt.Printf`：根据格式化参数生成并写入标准输出。

```go
package main

import "fmt"

func main() {
	var code = 123
	var endDate = "2023-11-01"
	var targetUrl = fmt.Sprintf("Code=%d&endDate=%s", code, endDate)
	fmt.Println(targetUrl)
}
```

### 变量声明

1.指定变量类型，如果没有初始化就默认为零值。

- 布尔类型：false
- 数字类型：0
- 字符串类型：""
- 其他类型：一般是 `nil` ，也有特殊情况

2.根据值自行判断变量类型

```go
// bool类型
var d = true
```

3.如果变量已经用 `var` 声明过了，那么再使用 `:=` 声明变量会产生编译错误。

```go
func main() {
	var num int
	// num := 1
	num = 1
	fmt.Println(num)
}
```

可以将 `var num int = 1` 简写为 `num := 1`。

4.多变量声明

```go
// 多个变量相同类型
var num1, num2, num3 int32 = 1, 2, 3
// 多个变量不同类型
var code, isEmpty = 200, true
code isEmpty := 200, true
```

:::danger

注意：`:=` 操作符是初始化时候用的，不能用于变量赋值。

:::

### 常量

使用 `const` 关键字来定义常量。

1.基本用法

```go
const LENGTH int = 10
```

2.定义枚举

```go
const (
    Unknown = 0
    Female = 1
    Male = 2
)
```

3.`iota` 

可以认作是编译器可修改的常量，`const` 中每新增一行常量声明将使 `iota` 计数一次

```go
const (
	i = 10 + iota
	j 
	k
	l
)
fmt.Println(i,j,k,l)  // 10 11 12 13
```

以上代码中 `j` 也为 `10 + iota` ，但此时 `iota` 值为 1 了，所以得到 `j` 的值为 11，以此类推。

4.无类型常量

虽然常量可以有任意一个确定的基本类型，但许多常量并没有明确的基础类型，编译器为其提供比基础类型更高精度的算术运算。

比如 `ZiB` 和 `YiB` 的值已经超过任何 Go 语言中整数类型能表达的范围，但它们依然是合法是常量。

```go
fmt.Println(YiB/ZiB)
```

### 运算符

- 算数运算符：`+`、`-`、`*`、`/`、`%`、`++`、`--`
    - 注意没有`**`
- 关系运算符：和其他高级语言一样
- 逻辑运算符：和其他高级语言一样
- 位运算符：和其他高级语言一样
- 赋值运算符：和其他高级语言一样
- 其他运算符
    - `&`：返回变量存储地址
    - `*`：指针变量

### 条件与循环

#### 条件

1.`if…else if…else`

```go
if num < 0 {
	// ...
} else if num < 10 {
	// ...
} else {
	// ...
}
```

2.`switch`

和其他语言不同，默认是携带 `break` 的，所以就不用写了，如果像强制执行后面的 `case` 语句，需要使用 `fallthrough` 关键字。

Type Switch用法：

```go
func main() {
   var x interface{}
     
   switch i := x.(type) {
      case nil:  
         fmt.Printf(" x 的类型 :%T",i)                
      case int:  
         fmt.Printf("x 是 int 型")                      
      case float64:
         fmt.Printf("x 是 float64 型")          
      case func(int) float64:
         fmt.Printf("x 是 func(int) 型")                      
      case bool, string:
         fmt.Printf("x 是 bool 或 string 型" )      
      default:
         fmt.Printf("未知型")    
   }
}
```

3.`select`

> 通道的使用见后续吧。

```go
func main()  {
    c1 := make(chan string)
    c2 := make(chan string)

    go func() {
        c1 <- "one"
    }()
    go func() {
        c2 <- "two"
    }()

    for i := 0; i < 10; i++ {
        select {
        case msg1 := <-c1:
            fmt.Println("received", msg1)
        case msg2 := <-c2:
            fmt.Println("received", msg2)
		default:
			// 如果两个通道都没有可用的数据，则执行这里的语句
			fmt.Println("no message received")
		}
    }
}
```

#### 循环

Go语言中只有 `for` 循环，没有 `while` 和 `forEach` 这些。

```go
// 标准for循环
for i:=0; i < 10; i++ {
	fmt.Println(i)
}

// 这种for等同于其他语言的while
count := 0
for count < 10 {
	fmt.Println(count)
	count++
}

// for…range，迭代获取key和value值，可以用于数组、Map等
strings := []string{"Google", "Baidu"}
for key, val :=range strings {
	fmt.Println(key, val)
}
```

## 三、数据类型

### 数据类型汇总

1.布尔类型

2.数字类型

- 基于架构的类型
    - uint8、uint16、uint32、uint64：无符号整型
    - int8、int16、int32、int64：有符号整型
- 浮点型
    - float32、float64：IEEE-754 浮点型数
    - complex64、complex128：实数和虚数
- 其他数字类型
    - byte：和uint8等价
    - rune：和int32等价
    - uint
    - int
    - uintptr

3.字符串类型

4.派生类型

- 指针类型（Pointer）
- 数组类型
- 结构化类型(struct)
- Channel 类型
- 函数类型
- 切片类型
- 接口类型（interface）
- Map 类型

### 基础数据类型

#### 整型

Go 语言同时提供了有符号和无符号的整数类型，有8、16、32、64位长度。

Unicode 字符 `rune` 类型是和 `int32` 等价的类型，通常用于表示一个 Unicode 码点，这两个名称可以互换使用。同理 `byte` 和 `uint8` 等价。

即使 Go 提供了无符号数的运算，但还是建议在绝大数情况下使用有符号数，比如下面代码，如果 `len()` 返回值是无符号数，那么 `i` 的值最终会变成 `unit` 类型最大值（可能是 `2e63 - 1`），然后将会发生异常：

```go
medals := []string{"gold", "silver", "bronze"}
for i := len(medals) - 1; i >= 0; i-- {
    fmt.Println(medals[i]) // "bronze", "silver", "gold"
}
```

正是这个原因，无符号数往往在位运算或其他特殊场景时候才使用。

类型不匹配问题，比如 `int32` 和 `int16` 直接加和计算，则会报错，但可以将它们显式转型为常见类型：

```go
var apples int32 = 1
var oranges int16 = 2
// 显式转型
var compote = int(apples) + int(oranges)
```

#### 浮点型

Go 提供了两种精度的浮点数 `float32` 和 `float64`，`float32` 能精确表示的正整数并不是很大，通常应优先使用 `float64`。

浮点数字面量表示：

```go
const e = 2.71828
const Avogadro = 6.02214129e23  // 阿伏伽德罗常数
```

在 `math` 包中提供了特殊值的创建和测试：

- `+Inf`：正无穷大
- `-Inf`：负无穷大
- `NaN`：非数

`math.IsNaN()` 用于测试一个数是否为 `NaN`，`NaN` 和任何数不相等，包括它自己。

#### 复数

Go 语言提供了两种精度的复数类型：`complex64` 和 `complex128`，分别对应 `float32` 和 `float64` 两种浮点数精度。

`complex` 函数用于构建复数，`real` 和 `imag` 函数分别返回复数的实部和虚部。

如果整数或浮点数后跟着 `i` ，那么它将构成复数的虚部。

```go
var x complex128 = complex(1, 2) // 1+2i
var y complex128 = complex(3, 4) // 3+4i
fmt.Println(x*y)                 // "(-5+10i)"
fmt.Println(real(x*y))           // "-5"
fmt.Println(imag(x*y))           // "10"
x := 1 + 2i
y := 3 + 4i
```

Go语言提供了两种精度的复数类型：`complex64` 和 `complex128`，分别对应 `float32` 和 `float64` 两种浮点数精度。

#### 布尔型

`&&` 和 `||` 的短路行为，如果运算符左边值已经可以确定整个布尔表达式的值，那么运算符右边的值将不再被求值，因此下面的语句是正确的：

```go
s != "" && s[0] == 'x'
```

和静态语言不同，布尔值并不会隐式转换为数字值0或1，反之亦然。

#### 字符串

**字符串是不可改变的字节序列**，文本字符串通常被解释为采用 `UTF8` 编码的 `Unicode` 码点（rune）序列。

内置的 `len()` 函数可以返回一个字符串中的字节数目，**注意不是 rune 字符个数。**

```go
func main()  {
	str:= "Hello"
	fmt.Println(len(str))  // 5
	str2:= "你好"
	fmt.Println(len(str2))  // 6
    fmt.Println(str[1:4])  // ell
}
```

访问超出字符串索引范围的字节将报错。

可以通过 `s[i:j]` 来截取字符串生成子串，包含 `[i, j)` 索引区间内的。可以通过 `+` 操作符可以将多个字符串连接

转义字符：

```Plain Text
\a      响铃
\b      退格
\f      换页
\n      换行
\r      回车
\t      制表符
\v      垂直制表符
\'      单引号（只用在 '\'' 形式的rune符号面值中）
\"      双引号（只用在 "..." 形式的字符串面值中）
\\      反斜杠
```

可以使用 ```` 表示原生的字符串面值，没有转义操作，全部都是字母意思，包括换行和退格，可以多行。

`UTF8` 是一个将 `Unicode` 码点编码为字节序列的变长编码，现在已经是 `Unicode` 的标准。`UTF8` 编码使用1到4个字节来表示每个 `Unicode` 码点，`ASCII` 部分字符只使用1个字节，常用字符部分使用2或3个字节表示。如果第一个字节的高端 bit 为 0，则表示对应 7bit 的 `ASCII` 字符，`ASCII` 字符每个字符依然是一个字节，和传统的 `ASCII` 编码兼容。如果第一个字节的高端 bit 是 110，则说明需要 2 个字节；后续的每个高端 bit 都以 10 开头。Go语言的源文件采用 `UTF8` 编码。 

```Plain Text
0xxxxxxx                             runes 0-127    (ASCII)
110xxxxx 10xxxxxx                    128-2047       (values <128 unused)
1110xxxx 10xxxxxx 10xxxxxx           2048-65535     (values <2048 unused)
11110xxx 10xxxxxx 10xxxxxx 10xxxxxx  65536-0x10ffff (other values unused)
```

有些字符很难输入，Go 支持通过编码方式输入，下面这些字符串都是等价的：

```Plain Text
"世界"
"\xe4\xb8\x96\xe7\x95\x8c"
"\u4e16\u754c"
"\U00004e16\U0000754c"
```

得益于 `UTF8` 编码优良的设计，诸多字符串操作都不需要解码操作。我们可以不用解码直接测试一个字符串是否是另一个字符串的前缀：

```Plain Text
"世界"
"\xe4\xb8\x96\xe7\x95\x8c"
"\u4e16\u754c"
"\U00004e16\U0000754c"
```

使用 `len()` 函数获取的是字符串字节数，如果是中文就不等于字符串长度了，想要准确获取长度需要使用 `unicode/utf8` 包中的 `utf8.RuneCountInString(s)` 。

解码有两种方式：

1.使用 `utf8.DecodeRuneInString(s)` 对字符串解码：

```go
func main()  {
	str := "Hello, 世界! 你好！"
	for i := 0; i < len(str); {
		r, s := utf8.DecodeRuneInString(str[i:])
		fmt.Printf("%c\n", r)
		fmt.Println(r, s)
		i += s
	}
}
```

2.使用 `for…range` 结构，隐式解码：

```go
func main()  {
	str := "Hello, 世界! 你好！"
	for i, r := range str {
		fmt.Printf("%d\t%q\t%d\n", i, r, r)
	}
}
```

### 复合数据类型

#### 数组

定义数组：

```go
// 定义长度为3的数组并给定初始值
var arr1 [3]int = [3]int{1, 2}
// 定义数组，数组长度根据初始值个数来计算
arr2 := [...]int{1, 2, 3, 4}
// 定义一个含有100个元素的数组，最后一个元素被初始化为-1，其它元素都初始化为0
arr3 := [...]int{99: -1}
```

定义带索引的数组：

```go
type Currency int
const (
	USD Currency = 10 + iota // 美元
	EUR                      // 欧元
	GBP                      // 英镑
	RMB                      // 人民币
)
symbol := [...]string{USD: "$", EUR: "€", GBP: "￡", RMB: "￥"}
fmt.Println(symbol, len(symbol))	// [          $ € ￡ ￥] 14
```

:::danger

注意：

1.数组长度必须是常量表达式，因为数组长度需要在编译阶段确定。

2.`[2]int` 和 `[3]int` 是两种不同类型，是不能比较的！

```go
a := [2]int{1, 2}
b := [...]int{1, 2}
c := [2]int{1, 3}
fmt.Println(a == b, a == c, b == c) // true false false
d := [3]int{1, 2}
fmt.Println(a == d) // compile error: cannot compare [2]int == [3]int
```

:::

在调用函数时，函数每个调用参数都会被赋值给函数内部的参数变量，所以函数参数接收的是一个复制的副本，而不是原始调用的变量。在这个方面，Go 对待数组方式和其他编程语言不同，Java、JavaScript这些的都是将数组作为引用或指针对象传入被调用的函数，它的机制与 C 语言最近似。

想要传递索引，可以显示传入数组指针：

```go
func zero(ptr *[32]byte) {
    for i:= range ptr {
        prt[i] = 0
    }
}
```

#### Slice（切片） 

Slice 代表变长的序列，序列中每个元素都有相同的类型，一般写作 `[]T`，其中 `T` 代表 Slice 中元素类型。

Slice 由三部分组成：指针、长度、容量。指针指向第一个 Slice 元素对应的底层数组元素的地址，长度对应 Slice中元素数目，容量是从 Slice 开始位置到结尾位置，长度不能超过容量。

可以通过 `len()` 获取 Slice 长度，通过 `cap()` 获取 Slice 容量。

