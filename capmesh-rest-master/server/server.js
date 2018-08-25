const express = require('express')
const app = express()

const Dao = require('./modules/data-access/data-access')

const dao = new Dao()

app.get('/rest/api/users/get/', async (req, res) => {
    let result = await dao.find("users", {name:'kuldeep'})
    res.send(result)
})

app.post('/rest/api/users/add', async (req, res) => {
    obj = {
        userName: 'soumya145',
        name: 'soumya',
        email: 'soumyaN@hotmail.com',
        mobile: '9123876903',
        gender: 'F', dateOfBirth:
            new Date("1996-07-01"),
        isVerified: false,
        isDeleted: false
    }
    let result
    try {
        result = await dao.insert("users")
    }
    catch (err){
        result = {error:"err"}
    }
    res.send(result)
})

app.delete('/rest/api/users/delete/', async (req, res) => {
    let result = await dao.delete("users", { name: 'soumya' })
    res.send(result)
})

app.patch('/rest/api/users/update/', async (req, res) => {
    let result
    try {
        result = await dao.update("users",{ name: 'soumya' },{$set:{name:"Soumya"}})
    } 
    catch (err) {
        result = {err:err}
    }
    res.send(result)
})

/************************
 * 
 * POSTS MODULE
 * 
 */

app.get("/rest/api/load", async (req, res) => {
    console.log('Load Invoked');
    result=await dao.aggregate("demo1",[{ $match: { "userName": "pawan" } }, { $project: { allValues: { $setUnion: ["$followings", "$followingCompany"] }, _id: 0 } }])    
    var abc;
    
    var array=[]
    result=result[0].allValues;
    console.log(result);
    for(var i of result){
        abc=await dao.aggregate("demo1",[{$match:{"userName":i}},{$project:{"posts":1,_id:0}}])
                //console.log(abc)
        array.push(abc.map(temp=>{
            return temp.posts.map(t=>{
                return t.timestamp;
            });
        }).join());
        array=array.map(t=>{
            return t;
        })
        array=array.filter(t=>{
            if(t!=NaN)
                return t
        })
        array=array.sort((a,b)=>{
            return a-b;
        })
    }
    console.log(array)
}
)

app.listen('8080', () => console.log('Listening on port 8080'))