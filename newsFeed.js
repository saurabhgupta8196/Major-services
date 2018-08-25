var http = require('http');
var express = require('express');
var parser = require('body-parser');
var exp = express();
var fs = require('fs');
var cors = require('cors')
var MongoClient = require('mongodb').MongoClient;
var appendData = [];



exp.get("/rest/api/load", cors(), async (req, res) => {
    console.log('Load Invoked');

    var client = await MongoClient.connect('mongodb://localhost:27017/demo');
    // var coll = client.db('demo');
    // var result = await coll.collection('demo1').aggregate([{ $match: { "userName": "sayali913" } }, { $project: { allValues: { $setUnion: ["$followings", "$followingCompany"] }, _id: 0 } }]).toArray()
    var result=dao.aggregate("demo1",([{ $match: { "userName": "sayali913" } }, { $project: { allValues: { $setUnion: ["$followings", "$followingCompany"] }, _id: 0 } }]))    
    var abc;
    var array=[]
    result=result[0].allValues;
    console.log(result);
    for(var i of result){
        abc=dao.aggregate([{$match:{"userName":i}},{$project:{"posts":1,_id:0}}])
                console.log(abc)
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

                
               
        


    //}
    
// abc[0].posts.sort((a,b)=>{
//                     return a.timestamp-b.timestamp;
//                 }) 
console.log(array);
    console.log("Data fetching");
    client.close();
});
exp.listen(3001, () => console.log("Running"));
