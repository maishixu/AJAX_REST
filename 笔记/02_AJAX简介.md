## AJAX简介

> 在网页中异步的向服务器发送请求和加载数据；服务器和浏览器一般在不同的端口，目的将前后端分离。
>
> A：异步 / J：JavaScript / A：and / X：数据传输格式 早期xml 现在json

AJAX有三种可选的方案。

### 一、原生XHR

##### XHR基本使用

```javascript
//创建xhr对象，xhr表示请求信息
const xhr = new XMLHttpRequest()
//设置请求信息
xhr.open("GET", "http://localhost:3000/students/")
//发送请求
xhr.send()
//设置响应体的类型
xhr.responseType = "json"
//读取响应信息
 xhr.onload = () => { //加载完毕才读取
     console.log(xhr.response)
 }
```

##### CORS（跨域资源共享）

> 两个网站的完整域名不同。通过AJAX发送跨域请求，为了保护服务器，浏览器会阻止JS读取服务器的数据
>
> 协议/域名/端口号 只要有其一不同，就算跨域

##### 解决CORS

- 设置响应头：

   ```javascript
   app.use((req,res)=>{
   	res.setHeader("Accesss-Control-Allow-Origin", "*") // * 允许的路径
       //Accesss-Control-Allow-Methods 允许的请求方式
       //Accesss-Control-Allow-Headers 允许的请求头
   })
   ```

### 二、Fetch API

> 不是基于XHR封装，而是原生JS的一个方法。兼容性较差，要经过两次Promise封装，稍微麻烦。

##### 基本使用

```html
<script>
      fetch("http://localhost:3000/students/")
        .then((res) => {
            if (res.status === 200) {
                return res.json() //此时是一个promise，要在后边的then读取
            } else {
                throw new Error("加载失败"); //统一抛给后面的catch
            }
        })
        .then((res) => {
            //获取到数据res，接下来就是渲染页面
        })
        .catch((err) => {
            console.log("出错了！", err)
        })
</script>
```

##### 请求方式

> **`fetch("resourse",{option})`**第一个参数是路径，第二个参数是可选项

```javascript
fetch("http://localhost:3000/students/",{
	method:"post",
    headers:{
        "Content-type":"application/json"//定义请求头，告诉浏览器传送过去的数据类型
    }
    body:JSON.stringify({
        name:"",
    	age:"",
    	...
    })
})
```

##### 取消请求

1. 创建AbortController

   ```javascript
   controller = new AbortController()
   ```

2. 设置请求时长

   ```javascript
   setTimeout(()=>{
   	controller.abort()
   },3000)
   ```

3. 发送、终止请求

   ```javascript
   fetch("http://localhost:3000/students/",{
   	signal:controller.signal
   }).then( ... )
   ```

##### Await方式

```javascript
btn.onclick = async ()=>{
	try{
		const res = fetch("http://localhost:3000/students/") //获取服务器返回的数据
		const data = res.json() //将数据转化为json格式
	}catch(err) { //异常处理 ... }
}
```

### 三、Axios

##### 特性

- 从浏览器其中创建XMLHttpRequests，从Node.js中创建http请求（基于XHR封装的）
- 支持Promise API
- 自动转换JSON数据
- 客户端防御XSRF攻击

##### 基本使用

- 引入`<script src = "https://unpkg.com/axios/dist/axios.min.js"></script>`

- 发送请求

  ```javascript
  axios({
      //配置对象
       method:"post",
       url:"http://localhost:3000/students",
       data:{ //发送的数据会自动转化为json格式数据，不用向fetch那样手动转了
             key:"value"
       }
  })
  ```

- 读取响应

  > axios默认只在响应状态码为2xx时才会调用then，其他状态码直接抛给catch

  ```javascript
  .then(res=>{
      //因为axios返回的数据很多，要读取服务器真正返回的data要用res.data
      res.data //直接读取数据，不用转化json
  })
  .catch(err=>{
      conselo.log("出错了！"，err) 
  })
  ```
  
- Axios实例

  `const instance = axios.create()`

  `instance.defaults.baseURL = " xxx "`

  > 相当于axios的副本，axios的默认配置对实例依然生效，但我们可以单独修改实例的各种默认配置

##### 配置对象

- 请求头：`header:{"Content-Type":"Application/json", "Authorization":"token"}`

- 请求体：`data:{ key : value}` 自动转化为Application/json；**get请求不用data**

- baseURL：指定服务器的根目录

- 修改请求数据：在发送数据出去之前，可以做修改

  ```javascript
  transformRequest[
  	function(data,header){
  		//...修改数据
  		return data //返回数据到下一个function
  	},function(data,header){
  		return JSON，stringify(data) //最后一个function必须返回一个字符串，才能使数据有效
  	}
  ]
  ```

- 修改响应数据：在调用then/catch之前，可以做处理 transformResponse

- 指定查询字符串

  >params:{ id = 1, name = swk } 相当于 localhost:3000?id=1&name="swk"

- 过期时间：`timeout:2000`

##### Axios拦截器

> 可以对请求或响应进行拦截，在请求发送前或响应读取前处理数据

- 添加请求拦截器

  > 传进去的参数config是Axios的配置对象

  ```javascript
  axios.interceptors.request.use(
      function(config){
          //在请求发送之前做什么
          return config
      },
      function(error){
          //对请求错误做些什么
          return Promise.reject(error)
      }
  )
  ```

- 添加响应拦截器：和请求拦截类似

- 取消拦截器

  > axios.interceptors.request.clear()

##### 通用默认配置

- 例子：

  ```javascript
  axios.defaults.baseURL = " xxx "
  axios.defaults.header.common["Authorization"] = `Bear ${localStorage.getItem("token")}`
  ```

  
