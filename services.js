var http = require('http');
var express = require('express');
var parser = require('body-parser');
var exp = express();
var cors = require('cors')
var MongoClient = require('mongodb').MongoClient;

exp.get("/rest/api/load", cors(), async (req, res) => {
    console.log('Load Invoked');
    var client = await MongoClient.connect('mongodb://localhost:27017/demo')
    var coll = client.db('demo');
    var result = await coll.collection('demo1').aggregate([{ $match: { "userName": "pawan" } }, { $project: { allValues: { $setUnion: ["$followings", "$followingCompany"] }, _id: 0 } }]).toArray()
    var abc;
    var array = []
    result = result[0].allValues;
    //console.log(result);
    for (var i of result) {
         abc = await coll.collection('demo1').
            aggregate([{ $match: { "userName": i } }, { $project: { "posts":1, _id: 0 } }]).
            toArray()
        array.push(abc.map(temp => {
            return temp.posts.map(t => {
                return t.timestamp;
            });
        }).join());
        console.log(array);
        array = array.map(t => {
            return t;
        })
        //console.log(array);
        array = array.filter(t => {
            if (t != NaN)
                return t
        })
        array = array.sort((a, b) => {
            return a - b;
        })
    }
    console.log(array);
    //console.log("Data fetching");
    client.close();
});
exp.listen(3001, () => console.log("Running"));
