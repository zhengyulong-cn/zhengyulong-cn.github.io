# Nestjs入门——基本使用

## 起步

```bash
npm i -g @nestjs/cli
nest new project-name
npm run start   # 打开浏览器访问http://localhost:3000
```

会得到样板文件目录：

```bash
src
 ├── app.controller.spec.ts   # 对于基本控制器的单元测试样例
 ├── app.controller.ts        # 带有单个路由的基本控制器示例
 ├── app.module.ts            # 应用程序的根模块
 ├── app.service.ts           # 带有单个方法的基本服务
 └── main.ts                  # 应用程序入口文件。它使用NestFactory用来创建Nest应用实例。
```

入口文件main.ts：

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // 使用NestFactory核心类创建Nest应用实例，create方法返回一个实现INestApplication接口的对象
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
```

## Controller

控制器（Controller）负责**处理传入的请求和向客户端返回响应**。

:::tip

要使用CLI创建控制器，只需执行`nest g controller cats`命令。

:::

给定例子，之后的分析将围绕着这个例子：

```ts
@Controller('api')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('docs')
  @Redirect('https://docs.nestjs.com', 302)
  getDocs(@Query('version') version) {
    if (version && version === '5') {
      return { url: 'https://docs.nestjs.com/v5/' };
    }
  }

  @Get('ip*')
  getHello(@Ip() ipAddress: string): string {
    return this.appService.getHello();
  }

  @Get('data:id')
  findOne(@Param('id') id): string {
    return `This action returns a #${id} data`;
  }

  @Post()
  @HttpCode(204)
  create(@Body() createDataDto: CreateDataDto) {
    return 'This action adds a new data';
  }
}
```

### 路由

路由路径由`@Controller()`和`@Get()`组合而成。例子中得到的路径就是`/api/hello`，而且**路由是支持模式匹配**的。

:::tip

常用路由匹配符号：

| 匹配符号 | 作用 | 例子 |
| --- | --- | --- |
| `*` | 匹配任意字符 | `/ab*cd`匹配`/abcd`、`/abecd` |
| `:` | 将路径中的一部分作为参数匹配 | `/user:id`匹配`user/123`，其中`:id`被视为参数名，值为123 |
| `?` | 匹配前面的字符开始的路径段，可以出现一次或零次 | `/blog/:year?/:month?/:day?`匹配`/blog/2020/10/10`、`/blog/2020/10` |
| `+` | 匹配前面的字符至少出现一次 | `/about+`匹配`/about`、`/aboutus`、`/about-me` |
| `{}` | 允许在路径中使用多个参数名 | `/post/{year}/{month}/{day}`匹配`/post/2010/10/10`，并将year设置为2020，month设置为10，day设置为10 |
| `()` | 用于创建组 | `/(foo\|bar)`匹配`/foo`或`/bar` |
| `[]` | 允许匹配特定的字符集 | `/[abc]`匹配`/a`、`/b`、`/c` |

:::

### 响应

- 标准响应
  - 当返回JavaScript基本类型时，不会序列化。
  - 当返回JavaScript对象或数组时，**自动序列化为JSON**。
- 类库特有响应
  - 在签名出通过`@Res()`注入类库特定对象（例如Express），这样就能使用该响应对象暴露的原生响应处理函数。比如使用Express就能使用`response.status(200).send()`构建响应。

:::danger

注意：在一个处理函数上如果同时使用了这两种方法，那么此处就会自动禁止此路由。如果需要在某个处理函数上同时使用这两种方法，必须在装饰器`@Res({ passthrough: true }) 中将 passthrough`选项设为true。

:::

### 请求

| 装饰器 | 代表的底层平台特定对象 | 类型定义 |
| --- | --- | --- |
| `@Request()`或`@Req()` | `req` | `import { Request } from 'express';` |
| `@Response()`或`@Res()` | `res` |  |
| `@Next()` | `next` |  |
| `@Session()` | `req.session` |  |
| `@Param(key?: string)` | `req.params/req.params[key]` |  |
| `@Body(key?: string)` | `req.body/req.body[key]` |  |
| `@Query(key?: string)` | `req.query/req.query[key]` |  |
| `@Headers(name?: string)` | `req.headers/req.headers[name]` |  |
| `@Ip()` | `req.ip` | `string` |
| `@HostParam()` | `req.hosts` |  |

Nest.js提供的`@Response()`装饰器暴露底层平台的response对象接口，这时必须通过调用response对象发出响应，否则HTTP服务器会挂起。

### 资源

Nest.js为所有标准的HTTP方法提供了相应的装饰器：`@Get()`、`@Post()`、`@Put()`、`@Delete()`、`@Patch()`、`@Options()`、以及`@Head()`。此外，`@All()`则用于定义一个用于处理所有 HTTP 请求方法的处理程序。

### 状态码

默认情况下状态码总是200，可以通过处理函数外添加`@HttpCode(code)`来修改。

### Headers

可以通过`@Header()`或类库特有响应对象指定自定义响应头。

### 重定向

可以使用`@Redirect()`或类库特有响应对象重定向到指定URL。

`@Redirect()`装饰器有两个可选参数，url和statusCode。如果省略，则statusCode默认为302。

### 路由参数

`@Param()`用于修饰一个方法的参数，并在该方法内将路由参数作为被修饰的方法参数的属性。还可以将特定的参数标记传递给装饰器，然后在方法主体中按参数名称直接引用路由参数。

```ts
@Get('data:id')
findOne(@Param() params): string {
  return `This action returns a #${params.id} data`;
}
@Get('data:id')
findOne(@Param('id') id): string {
  return `This action returns a #${id} data`;
}
```

### 子域路由

让`@Controller`接收host选项，以要求传入的HTTP主机匹配某个特定值。

下面代码中`:account`指定子域名部分占位符，当请求到达服务端后，如果请求域名为`example.com`，那么`:account`的占位符会被替换成实际的子域名；如果请求的域名为`foo.example.com`，则`account`的值为foo。在getInfo方法中，使用`@HostParam`装饰器获取到了子域名的实际值account，并将其作为方法的返回值。

```ts
@Controller({ host: ':account.example.com' })
export class AccountController {
  @Get()
  getInfo(@HostParam('account') account: string) {
    return account;
  }
}
```

### 请求负载

对于`POST`路由处理，需要添加`@Body()`来解决请求参数问题。在Nest.js中，使用的是DTO模式，DOT是一个对象，定义如何通过网络发送数据，推荐使用类来定义，因为类不仅定义了类型，还保留了实体。

创建DOT实体：

```ts
export class CreateDataDto {
  readonly name: string;
  readonly age: number;
  readonly breed: string;
}
```

在Controller中使用：

```ts
@Post()
create(@Body() createDataDto: CreateDataDto) {
  return 'This action adds a new data';
}
```

### 将Controller加入到Module中

```ts
@Module({
  controllers: [AppController],
})
export class AppModule {}
```

## Providers

许多级别的Nest类可能被视为Provider，如Service、Repository、Factory、Helper等等，它们都可以通过constructor**注入**依赖关系。Provider只是一个用`@Injectable()`装饰的类。

:::tip

要使用CLI创建控制器，只需执行`nest g service cats`命令。

:::

### 依赖注入

Nest.js依赖于强大的设计模式，借助TypeScript功能，按类型进行解析。注入有两种方式：

基于构造函数注入：

```ts
constructor(private readonly catsService: CatsService) {}
```

基于属性注入：

```ts
// 使用@Inject()装饰器将CatsService注入到了MyService中的catsService属性中
@Injectable()
export class MyService {
  @Inject(CatsService)
  private readonly catsService!: CatsService;
  async serviceMethod() {
    await this.catsService.doSomething();
  }
}
```

### 可选Provider

要指示Provider可选，在construnctor参数中使用`@Optional()`。

```ts
@Injectable()
export class MyService {
  constructor(
    @Optional() private readonly logger: Logger,
  ) {}
}
```

### 将Provider加入到Module中

```ts
@Module({
  providers: [MyService],
})
export class AppModule {}
```

## Module

模块是具有`@Module()`装饰器的类。`@Module()`装饰器提供了元数据，Nest用它来组织应用程序结构。

`@module()`装饰器接受一个描述模块属性的对象：

| 模块属性 | 作用 |
| --- | --- |
| providers	| 由Nest注入器实例化的提供者，并且可以至少在整个模块中共享 |
| controllers	| 必须创建的一组控制器 |
| imports	| 导入模块的列表，这些模块导出了此模块中所需提供者 |
| exports	| 由本模块提供并应在其他模块中可用的提供者的子集 |

### 共享模块

```ts
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  // 把要共享的模块放入到exports数组中
  exports: [CatsService]
})
```

每个导入`CatsModule`模块都可以访问`CatsService`，并且共享相同的CatsService实例。

### 依赖注入

Module中也能注入依赖，和在Provider中类似：

```ts
@Module({
  controllers: [CatsController],
  providers: [CatsService],
})
export class CatsModule {
  constructor(private readonly catsService: CatsService) {}
}
```

:::danger

由于循环依赖性，Module不能注入到Provider中！

:::

### 全局模块

一旦定义，到处可用，使用`@Global`装饰器使模块成为全局作用域。全局模块应该只注册溢出，最好是根模块或核心模块注册。

CatsService是全局模块，想使用CatsService不需要再imports数组中导入CatsModule。

```ts
@Global()
@Module({
  controllers: [CatsController],
  providers: [CatsService],
  exports: [CatsService],
})
export class CatsModule {}
```

## 中间件

中间件是在路由处理程序**之前**调用的函数。中间件函数可用访问请求和响应对象，已经请求响应周期的`next()`中间件函数。

中间件函数可用做啥？可用干这些：

- 对请求和响应对象进行修改
- 结束请求响应周期
- 调用堆栈中的下一个中间件函数
- 如果当前中间件函数没有结束请求响应周期，必须调用`next()`将控制传递给下一个中间件函数，否则请求将被挂起

### 依赖注入

中间件完全支持依赖注入，和Provider和Controller一样。

如下定义了LoggerMiddleware中间件，实现NestMiddleware接口，用`@Injectable()`装饰。

```ts
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('请求中...');
    // 放行
    next();
  }
}
```

### 使用中间件

中间件不能在`@Module()`列出，必须使用模块类的`configure()`方法来设置它们。**包含中间件的模块必须实现NestModule接口**。

还可以在配置中间件时将包含路由路径的对象和请求方法传递给`forRoutes()`方法，`forRoutes()`可接受一个字符串、多个字符串、对象、一个控制器类甚至多个控制器类。

```ts
@Module({
  imports: [CatsModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // 作用于/cats路由
    consumer.apply(LoggerMiddleware).forRoutes('cats');
    // 作用于/cats路由的GET请求
    consumer.apply(LoggerMiddleware).forRoutes({ path: 'cats', method: RequestMethod.GET });
    // 作用于CatsController控制器，可用通过exclude()方法排除某些路由
    consumer.apply(LoggerMiddleware).exclude({ path: 'cats', method: RequestMethod.POST }, 'cats/(.*)').forRoutes(CatsController);
  }
}
```

:::warning

`apply()`方法可以使用单个中间件，也可以使用多个参数来指定**多个中间件**。

:::

### 函数中间件

中间件不一定非要写成类，如果没有成员、没有额外方法、没有依赖关系，还可以写成函数形式：

```ts
export function logger(req, res, next) {
  console.log('请求中...');
  next();
};
```

### 多个中间件

多个中间件需要注意绑定顺序，可以在`apply()`方法中用逗号隔开。

```ts
consumer.apply(cors(), helmet(), logger).forRoutes(CatsController);
```

### 全局中间件

可以使用由INestApplication实例提供的`use()`方法：

```ts
const app = await NestFactory.create(AppModule);
app.use(logger);
await app.listen(3000);
```

## 异常过滤器

异常层负责处理整个应用程序中的所有抛出的异常，当捕获到未处理的异常时，最终用户将收到友好的响应。

### HttpException

HttpException构造函数由两个必要参数来决定响应：

- response：定义JSON响应体，可以是string或object
  - statusCode：默认为status参数中提供的HTTP状态代码
  - message:基于状态的HTTP错误的简短描述
- status：定义HTTP状态代码

```ts
@Get()
async findAll(): Promise<Array<ICat>> {
  throw new HttpException({
    status: HttpStatus.FORBIDDEN,
    error: '错误信息，禁止访问',
  }, HttpStatus.FORBIDDEN);
}
```

### 继承HttpException

可以继承HttpException类实现自定义异常。

```ts
export class ForbiddenException extends HttpException {
  constructor() {
    super('Forbidden', HttpStatus.FORBIDDEN);
  }
}
```

为了减少样本代码，Nest.js提供一系列来自核心异常的可用异常。

- `BadRequestException`
- `UnauthorizedException`
- `NotFoundException`
- `ForbiddenException`
- `NotAcceptableException`
- `RequestTimeoutException`
- `ConflictException`
- `GoneException`
- `PayloadTooLargeException`
- `UnsupportedMediaTypeException`
- `UnprocessableException`
- `InternalServerErrorException`
- `NotImplementedException`
- `BadGatewayException`
- `ServiceUnavailableException`
- `GatewayTimeoutException`

### ExceptionFilter

#### 定义异常过滤器

它能让你精确控制流和将响应内容发送给客户端。

```ts
// 捕获HttpException类实例的异常
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    // 使用ArgumentsHost来获取Request和Response对象
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const status = exception.getStatus();
    res.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.url,
    });
  }
}
```

:::danger

所有的异常过滤器都应实现通用的`ExceptionFilter<T>`接口，它需要实现`catch(exception: T, host: ArgumentsHost)`方法，`T`表示异常类型。

:::

`ArgumentsHost`是一个功能强大的实用程序对象，将在应用上下文章节中进一步研究。

#### 异常过滤器使用范围

定义异常过滤器后，就能使用了，有三种使用维度：

1.单个路由处理程序

```ts
@Post()
@UseFilters(HttpExceptionFilter)
async create(@Body() createCatDto: CreateCatDto) {
  throw new ForbiddenException();
}
```

2.Controller

```ts
@Controller('cats')
@UseFilters(HttpExceptionFilter)
export class CatsController { }
```

:::warning

尽可能使用类而不是实例。由于Nest.js可以轻松地在整个模块中重复使用同一类的实例，因此可以**减少内存使用**。

:::

3.全局范围

```ts
const app = await NestFactory.create(AppModule);
app.useGlobalFilters(new HttpExceptionFilter());
await app.listen(3000);
```

:::danger

全局范围使用的`useGlobalFilters()`方法不会为网关和混合应用程序设置过滤器。

:::

全局过滤器用于整个应用程序、每个控制器和每个路由处理程序。就依赖注入而言，从任何模块外部注册的全局过滤器（使用上面示例中的`useGlobalFilters()`）不能注入依赖，因为它们不属于任何模块。为了解决这个问题，你可以注册一个全局范围的过滤器直接为任何模块设置过滤器：

```ts
import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
```

你可以根据需要添加任意数量的过滤器，只需将每个组件添加到providers（提供者）数组。

## 管道

管道是具有`@Injectable()`装饰器的类，管道应实现PipeTransform接口。

管道有两大应用场景：

- 管道将输入的数据转换后输出
- 管道对输入的数据进行验证，成功则继续传递，失败则抛出异常

### 内置管道

Nest.js自带9个开箱即用的管道：

- `ValidationPipe`
- `ParseIntPipe`
- `ParseFloatPipe`
- `ParseBoolPipe`
- `ParseArrayPipe`
- `ParseUUIDPipe`
- `ParseEnumPipe`
- `DefaultValuePipe`
- `ParseFilePipe`

### 使用管道

方法参数级绑定管道：

```ts
@Get(':id')
async findOne(@Param('id', ParseIntPipe) id: number) {
  return this.catsService.findOne(id);
}
```

确保在`findOne()`方法中接收的参数是一个数字，或在路由处理程序被调用前抛出异常。

:::tip

推荐传递类而不是实例，如果想通过传递选项来自定义管道行为，可以传递实例。

:::

### 自定义管道

实现PipeTransform接口的`transform()`方法。

- value：当前处理的方法参数
- metadata：当前处理方法参数的元数据
  - type：`'body' | 'query' | 'param' | 'custom'`。
  - metatype：参数元类型，如`String`。
  - data：传递给装饰器的字符串，如`@Body('string')`。

```ts
@Injectable()
export class ValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    return value;
  }
}
```

### 对象结构验证

安装joi依赖：

```bash
npm install --save joi
```

编写JoiValidationPipe逻辑：

```ts
import { ObjectSchema } from 'joi';
@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}
  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value);
    if (error) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}
```

:::tip

验证管道，要么返回值不变，要么抛出异常！

:::

使用JoiValidationPipe，通过`@UsePipes()`装饰器绑定到方法上：

```ts
@Post()
@UsePipes(new JoiValidationPipe(createCatSchema))
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

其中`createCatSchema`定义为：

```ts
import { ObjectSchema } from 'joi';
export const createCatSchema = Joi.object({
  name: Joi.string().required(),
  age: Joi.number().required(),
  breed: Joi.string().required(),
});
```

### 类验证器

类验证器是另一种实现方式，该技术需要TypeScript。

安装`class-validator`和`class-transformer`依赖：

```bash
npm i --save class-validator class-transformer
```

安装完成后就能给CreateCatDto添加装饰器了：

```ts
import { IsString, IsInt } from 'class-validator';
export class CreateCatDto {
  @IsString()
  readonly name: string;
  @IsInt()
  readonly age: number;
  @IsString()
  readonly breed: string;
}
```

创建一个ValidationPipe类：

```ts
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class ValidationPipe implements PipeTransform {
  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
  async transform(value: any, { metatype }: ArgumentMetadata) {
    // 如果metatype不为空或不在验证列表中，返回原始数据
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }
}
```

:::danger

`plainToInstance()`方法将普通JavaScript参数对象转换为可验证的类型对象。必须这样做的原因是**传入的Post body对象从网络请求反序列化时不携带任何类型信息**。`Class-validator`需要使用我们之前为DTO定义的验证装饰器，因此我们需要执行此转换，将传入的主体转换为有装饰器的对象，而不仅仅是普通的对象。

:::

最后绑定到方法上：

```ts
@Post()
@UsePipes(ValidationPipe)
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

### 全局管道

管道的范围：

- 参数范围
- 方法范围
- Controller范围
- 全局范围

和过滤器类似，有两种写法：

1.使用`useGlobalPipes()`

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
```

2.由于方法1不属于任何模块，因此无法注入依赖。为了解决这个问题，可以通过`APP_PIPE`：

```ts
import { Module } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
@Module({
  providers: [
    {
      provide: APP_PIPE,
      useClass: ValidationPipe
    }
  ]
})
export class AppModule {}
```

### 转换

管道不仅能用于验证，还能用于转换。

```ts
// 负责将字符串转换为整数
@Injectable()
export class ParseIntPipe implements PipeTransform<string, number> {
  transform(value: string, metadata: ArgumentMetadata): number {
    const val = parseInt(value, 10);
    if (isNaN(val)) {
      throw new BadRequestException('Validation failed');
    }
    return val;
  }
}
```

### 默认值

`Parse*`管道期望值是定义的，当接收到null或undefined时会抛出异常，如果想处理修饰查看字符串参数值，就必须在`Parse*`管道操作前注入默认值，这时候就可以使用`DefaultValuePipe`了。

```ts
@Get()
async findAll(@Query('activeOnly', new DefaultValuePipe(false), ParseBoolPipe) activeOnly: boolean) {
  return this.catsService.findAll({ activeOnly, page });
}
```

## 守卫

守卫是一个使用`@Injectable()`装饰器的类，守卫应该实现CanActivate接口。

守卫在每个中间件之后执行，但在任何拦截器或管道之前执行。

### 定义及使用

```ts
import { Observable } from 'rxjs';
// 提取和验证token，并使用提取的信息来确定请求是否可以继续
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}
```

每个守卫必须实现一个`canActivate()`函数，该函数返回boolean，用于指示是否允许当前请求，可以同步或异步的返回响应。

- true：将处理用户调用
- false：Nest.js将忽略当前的处理请求

`canActivate()`函数接收单个参数ExecutionContext实例，ExecutionContext继承自ArgumentsHost，扩展了更多功能。

与管道和异常过滤器一样，守卫是可以控制范围的，下面给出绑定在Controller上的例子：

```ts
@Controller('cats')
@UseGuards(RolesGuard)
export class CatsController {}
```

### 全局守卫

1.使用`useGlobalGuards()`

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalGuards(new RolesGuard());
  await app.listen(3000);
}
bootstrap();
```

2.由于方法1不属于任何模块，因此无法注入依赖。为了解决这个问题，可以通过`APP_GUARD`：

```ts
import { APP_GUARD } from '@nestjs/core';
@Module({
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
```

### 设置角色

Nest.js提供了通过`@SetMetadata()`装饰器将定制元数据附加到路由处理程序的能力。这些元数据提供所缺少的角色数据，而守卫需要这些数据来做出决策。

```ts
@Post()
@SetMetadata('roles', ['admin'])
async create(@Body() createCatDto: CreateCatDto) {
  this.catsService.create(createCatDto);
}
```

可以使用`Reflect.getMetadata()`方法来获取元数据：

```ts
import { Reflector } from '@nestjs/core';
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    // 获取操作中设置的roles元数据
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return roles.some(role => user.roles.includes(role));
  }
}
```

## 拦截器

拦截器是使用`@Injectable()`装饰器注解的类，拦截器应该实现NestInterceptor接口。

### 定义和使用

```ts
import { Observable, tap } from 'rxjs';
@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    return next.handle().pipe(tap(() => console.log(`After... ${Date.now() - now}ms`)));
  }
}
```

:::danger

`NestInterceptor<T，R>`是一个通用接口，其中`T`表示已处理的`Observable<T>`的类型（在流后面），而`R`表示包含在返回的`Observable<R>`中的值的返回类型。

:::

`next.handle()`返回一个RxJS的`Observable`，因此有多种操作符来操作数据流，上面例子中使用了`tag()`运算符，该运算符可观察序列的正常或异常终止时调用函数。

定义完成后，就可以绑定到Controller上了：

```ts
@UseInterceptors(LoggingInterceptor)
export class CatsController {}
```

### 全局拦截器

1.`useGlobalInterceptors()`

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new LoggingInterceptor());
  await app.listen(3000);
}
bootstrap();
```

2.由于方法1不属于任何模块，因此无法注入依赖。为了解决这个问题，可以通过`APP_INTERCEPTOR`：

```ts
import { APP_INTERCEPTOR } from '@nestjs/core';
@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
```

### 拦截器的使用例子

#### 响应映射

`handle()`返回Observable，此流包含从路由处理程序返回的值，因此可以用`map()`运算符轻易将其改变。

```ts
import { Observable, map } from 'rxjs';
@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
    return next.handle().pipe(map(data => ({ data })));
  }
}
```

之后，当有人调用GET`/cats`端点时，请求将如下：

```json
{
  "data": []
}
```

#### 异常映射

利用`catchError()`操作符来覆盖抛出的异常：

```ts
@Injectable()
export class ErrorsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(catchError(err => throwError(new BadGatewayException())));
  }
}
```

#### Stream重写

有时候希望完全阻止调用处理程序并返回不同的值，比如缓存拦截器，它将使用一些TTL存储缓存的响应。当然这个功能完整版很复杂，下面给出简要的例子：

```ts
import { Observable, of } from 'rxjs';
@Injectable()
export class CacheInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const isCached = true;
    if (isCached) {
      return of([]);
    }
    return next.handle();
  }
}
```

这是一个CacheInterceptor，带有硬编码的`isCached`变量和硬编码的响应`[]`。我们在这里通过`of`运算符创建并返回了一个新的流, 因此路由处理程序根本不会被调用。当有人调用使用 CacheInterceptor的端点时，响应 (一个硬编码的空数组) 将立即返回。

## 自定义装饰器

通过`createParamDecorator`定义装饰器：

```ts
export const User = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return request.user;
});
```

使用：

```ts
// 最终firstName字符串会被User装饰器的data读取
@Get('findOne')
async findOne(@User('firstName') firstName: string) {
  // 这里是读取的findOne函数参数，不是User装饰器内的firstName字符串
  return `Hello ${firstName}`;
}
```

如果有多个装饰器，在Nest.js中可以使用`applyDecorators`聚合：

```ts
export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(AuthGuard, RolesGuard),
    ApiBearerAuth(),
    ApiUnauthorizedResponse({ description: 'Unauthorized"' })
  );
}
```