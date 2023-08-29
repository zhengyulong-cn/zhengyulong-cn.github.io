# 操作系统理论

## 一、操作系统理论介绍

程序运行时会发生什么？正在运行的程序会做一件简单的事情：**执行指令**。处理器从内存中获取指令，对其解码，然后执行它，完成这条指令后，处理器会继续执行下一条，依次类推，直到程序最终完成。

操作系统是软件，通过虚拟化技术让程序运行变得更容易，即**操作系统将物理资源转化为更通用更强大的虚拟形式**，扮演资源管理角色（如CPU、内存、磁盘等等）。为了让用户可以告诉操作系统做什么，操作系统提供一些接口（API）供调用。由于操作系统提供这些调用来运行程序、访问内存和设备，并进行其他相关操作，我们有时也说操作系统为应用程序提供了一个**标准库**。

### 虚拟化CPU

```c
#include <stdio.h>
#include <stdlib.h>
#include <sys/time.h>
#include <assert.h>
#include "common.h"

int
main(int argc, char *argv[])
{
    if (argc != 2) {
        fprintf(stderr, "usage: cpu <string>\n");
        exit(1);
    }
    char *str = argv[1];
    while (1) {
        Spin(1);
        printf("%s\n", str);
    }
    return 0;
}
```

对于上述程序，运行同一个程序的许多不同实例：

```bash
prompt> ./cpu A & ; ./cpu B & ; ./cpu C & ; ./cpu D &
[1] 7353
[2] 7354
[3] 7355
[4] 7356
A
B
D
C
A
B
D
C
A
C
B
D
...
```

打印输出的结果，看着似乎4个程序在同时运行。事实上，在硬件帮助下，操作系统在运行多个程序时会提供拥有非常多CPU的假象。**将单个CPU转换为看似无限数量的CPU，从而让许多程序看似同时运行，这就是所谓的虚拟化CPU。**当然要停止它们，或告诉操作系统运行哪些程序，需要调用相关接口。

### 虚拟化内存

内存是一个字节数组，要读取就必须指定一个地址，要写入必须指定地址和写入值。程序在运行时，将所有数据结构保存在内存中，并通过各种指令来访问它们。

下面是一个访问内存的程序：

```c
#include <unistd.h>
#include <stdio.h>
#include <stdlib.h>
#include "common.h"

int
main(int argc, char *argv[])
{
    int *p = malloc(sizeof(int));              // 分配一些内存
    assert(p != NULL);
    printf("(%d) memory address of p: %08x\n",
           getpid(), (unsigned) p);            // 打印出内存地址
    *p = 0;                                    // 将数字0放入新分配的内存的第一个空位中
    while (1) {
        Spin(1);
        *p = *p + 1;
         printf("(%d) p: %d\n", getpid(), *p); // 循环程序，延迟1秒并递增p中保存的地址值
    }
    return 0;
}
```

执行并输出如下：

```bash
prompt> ./mem
(2134) memory address of p: 00200000
(2134) p: 1
(2134) p: 2
(2134) p: 3
(2134) p: 4
(2134) p: 5
ˆC
```

上面输出是意料之中的，试试运行同一个程序的多个实例：

```bash
prompt> ./mem &; ./mem & 
[1] 24113
[2] 24114
(24113) memory address of p: 00200000
(24114) memory address of p: 00200000
(24113) p: 1
(24114) p: 1
(24114) p: 2
(24113) p: 2
(24113) p: 3
(24114) p: 3
(24113) p: 4
(24114) p: 4
...
```

实际上，这才是操作系统虚拟化内存时发生的情况，**每个进程访问自己的私有虚拟地址空间**，操作系统以某种方式映射到机器的物理内存上。**一个正在运行的程序中的内存引用不会影响其他进程（或操作系统本身）的地址空间，对于正在运行的程序，它完全拥有自己的物理内存。**

### 并发

如上面所示，并发可以存在于操作系统本身的，但并不局限于此，现代多线程程序也存在相同问题。

```c
#include <stdio.h>
#include <stdlib.h>
#include "common.h"

volatile int counter = 0;
int loops;

void *worker(void *arg) {
    int i;
    for (i = 0; i < loops; i++) {
        counter++;
    }
    return NULL;
}

int
main(int argc, char *argv[])
{ 
    if (argc != 2) {
        fprintf(stderr, "usage: threads <value>\n");
        exit(1);
    }
    loops = atoi(argv[1]);
    pthread_t p1, p2;
    printf("Initial value : %d\n", counter);
    // 主程序利用Pthread_create()创建两个线程，每个线程运行在workder()中
    Pthread_create(&p1, NULL, worker, NULL);
    Pthread_create(&p2, NULL, worker, NULL);
    Pthread_join(p1, NULL);
    Pthread_join(p2, NULL);
    printf("Final value    : %d\n", counter);
    return 0;
}
```

上面程序作用是主程序利用 Pthread_create() 创建两个线程，每个线程运行在 worker() 函数中。loops的值由终端输入。

尝试运行下：

```bash
prompt> gcc -o thread threads.c -Wall -pthread
prompt> ./thread 100000 
Initial value : 0
Final value   : 143012
prompt> ./thread 100000
Initial value : 0
Final value  : 137298
```

发现有问题啊，预设100000，按期望讲最终值应该是200000啊？但再次运行，不仅不是200000，而且和上面值还不一样。

上面程序关键部分是增加共享计数器的地方，它需要3条指令：

1. 计数器的值从内存加载到寄存器
2. 将其递增
3. 将其保存回内存

因为这3条指令并不是以原子方式执行的，所以会发生奇怪的事情。

### 持久性

在系统内存中数据容易丢失（DRAM方式存储），如果断电或系统崩溃，内存中所有数据都会丢失，因此需要软硬件来持久地存储数据。

在现代系统中，硬盘驱动器是存储长期保存信息的通用存储库，**操作系统中管理磁盘的软件通常称为文件系统**。

## 二、进程

一个系统中可能会有上百个进程同时运行，但物理CPU是有限的，因此面临的挑战是：虽然只有少量的物理CPU可用，但是操作系统如何提供几乎有无数个CPU可用的假象？

时分共享机制：操作系统共享资源所使用的最基本的技术之一，通过允许资源由一个实体使用一小段时间，然后由另一个实体再使用一小段时间，如此资源就能被许多人共享了。

空分共享机制：有些资源在空间上被划分给希望使用它的人，例如磁盘空间是一个空分共享资源，因此一旦将块分给文件，在用户删除文件前，不可能将它分配给其他文件。

操作系统会有一些智能策略算法决定运行哪个程序。

### 进程概念

**操作系统为正在运行的程序提供的抽象，就是所谓的进程。**

进程的机器形态：

1. 指令存在内存中，运行的程序读写数据也在内存中
2. 许多指令明确读取或更新寄存器

### 进程创建

操作系统运行程序依次做：

1. 将代码和所有静态数据加载到内存中，加载到进程的地址空间中。
2. 执行一些初始化操作
   1. 必须为程序的运行时栈分配一些内存，并提供给进程。
   2. 可能为程序的堆分配一些内存，并提供给进程。
   3. 可能执行 I/O 设置相关任务。
3. 启动程序，在入口运行，跳转到 `main()` 进程，操作系统将 CPU 控制权转移到新创建的进程中，从而程序开始执行。

![程序加载到进程](./images/程序加载到进程.png)

### 进程状态

- 运行：进程正在处理器上运行，意味着正在执行指令。
- 就绪：进程已准备好运行，但由于某些原因，操作系统选择不在此时运行。
- 阻塞：进程执行某种操作，直到发生其他事情才会准备运行。比如进程向磁盘发起 I/O 请求时就会阻塞，这时候其他进程可以使用处理器。

![进程状态转换](./images/进程状态转换.png)

比如有2个进程，进程 Process0 会发起 I/O 请求，那么运行就是这样的：

Process0 发起 I/O 并被阻塞，操作系统发现它不使用 CPU 了，就开始运行 Process1，当 Process0 的 I/O 完成了，那么 Process0 移会就绪状态，最后 Process1 结束，运行 Process0，然后完成。

![CPU和IO](./images/CPU和IO.png)

:::tip

当 I/O 完成后，系统决定不切换回 Process0 ，这是一个好的决策吗？

不一定，看情况，这是后面要考虑的。

:::

### 进程信息的数据结构（PCB）

我们**将存储关于进程信息的个体结构称为进程控制块**（Process Control Block, PCB）。

比如下面就是 `xv6` 内核中每个进程的信息类型，真正操作系统存在类似的进程结构。

```c
// the registers xv6 will save and restore
// to stop and subsequently restart a process
struct context {
  int eip;
  int esp;
  int ebx;
  int ecx;
  int edx;
  int esi;
  int edi;
  int ebp;
};

// the different states a process can be in
enum proc_state { UNUSED, EMBRYO, SLEEPING,
                  RUNNABLE, RUNNING, ZOMBIE };

// the information xv6 tracks about each process
// including its register context and state
struct proc {
  char *mem;                   // Start of process memory
  uint sz;                     // Size of process memory
  char *kstack;                // Bottom of kernel stack
                               // for this process
  enum proc_state state;       // Process state
  int pid;                     // Process ID
  struct proc *parent;         // Parent process
  void *chan;                  // If non-zero, sleeping on chan
  int killed;                  // If non-zero, have been killed
  struct file *ofile[NOFILE];  // Open files
  struct inode *cwd;           // Current directory
  struct context context;      // Switch here to run process
  struct trapframe *tf;        // Trap frame for the
                               // current interrupt
};
```

### 进程API

