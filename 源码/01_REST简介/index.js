const express = require("express")

const app = express()

let STU_ARR = [
    {
        id: 1,
        name: "佛兰克",
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

//显示功能
app.get("/students", (req, res) => {
    console.log("服务器正在处理get请求")
    res.send({
        status: "ok",
        data: STU_ARR
    })
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