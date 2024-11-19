const express = require("express")

const app = express()

let STU_ARR = [
    {
        id: 1,
        name: "弗兰克",
        gender: "男",
        age: "10"
    },
    {
        id: 2,
        name: "菲欧娜",
        gender: "女",
        age: "20"
    },
    {
        id: 3,
        name: "里普",
        gender: "男",
        age: "30"
    },
]

app.listen(3000, () => {
    console.log("服务器已启动..")
})
//解析JSON文件的中间件
app.use(express.json())
//允许跨域请求
app.use((req,res,next)=>{
	res.setHeader("Access-Control-Allow-Origin", "*") // * 允许的路径
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,PUT") // 允许的方式
	res.setHeader("Access-Control-Allow-Headers", "Content-type,Authorization") // 允许的请求体
    next()

})
//引入token
const jwt = require("jsonwebtoken")
//登录验证功能
app.post("/login",(req,res)=>{
    //获取用户输入的账户名和密码
    const {username,password} = req.body
    if(username === "admin"&& password ==="123123"){
        const token = jwt.sign(
            {id:"12345",username:"admin",password:"123123", nickname :"超级管理员"},
            "mima",
            {expiresIn:"1h"} //有效时间
        )
        res.send({
            status:"ok",
            data:{token,
            nickname:"超级管理员"}
        })
    }else{
        res.status(403).send({
            status:"error",
            data:"用户名或密码错误"
        })
    }
})
//显示功能
app.get("/students", (req, res) => {
    console.log("服务器正在处理get请求")
    //读取请求头
    const token = req.get("authorization").split(" ")[1] //去掉Bearer格式
    try{
        jwt.verify(token,"mima") //验证
        res.send({
            status: "ok",
            data: STU_ARR
        })
    }catch(err){
        res.status(403).send({
            status:"error",
            data:"token无效"
        })
    }
    
})
//查询功能
app.get("/students/:id", (req, res) => {
    console.log("服务器正在处理get请求")
    const id = req.params.id
    const stu = STU_ARR.find((student) => student.id === +id)
    res.send({
        status: "ok",
        data: stu
    })
})
//添加功能
app.post("/students", (req, res) => {
    console.log("服务器正在处理post请求")
    const { name, gender, age } = req.body
    STU_ARR.push({
        id: STU_ARR.at(-1).id + 1,
        name,
        gender,
        age: +age
    })
    res.send({
        status: "ok",
        data: STU_ARR
    })
})
//删除功能
app.delete("/students/:id", (req, res) => {
    let id = req.params.id
    for (let i = 0; i < STU_ARR.length; i++) {
        if (STU_ARR[i].id === +id) {
            const delstu = STU_ARR[i]
            STU_ARR.splice(i, 1) //从i开始删除1个元素
            res.send({
                status: "ok",
                data: delstu
            })
            return
        }
    }
    res.status(403).send({
        status: "error",
        data: "学生id不存在"
    })

})
//修改功能
app.patch("/students", (req, res) => {
    console.log("正在处理patch请求")
    const { id, name, gender, age } = req.body

    let student = STU_ARR.find((student) => student.id == id)

    //改对象 对象的总地址不变 对象属性的内容发送改变
    if(student){
        student.name = name
        student.gender = gender
        student.age = +age
        res.send({
            status: "ok",
            data: student
        })
    }else{
        res.status(403).send({
            status:"error",
            data:"学生id不存在"
        })
    }
    
})