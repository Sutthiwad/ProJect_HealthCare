var app = require('express')();
var users = require('./users');
var port = process.env.PORT || 7777;
var bodyParser = require('body-parser');
var mysql = require('./mysql');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/reccomend/:member',function(req,res){

    var member = req.params.member;
  
    

            mysql.query('SELECT favorite_food FROM member_db WHERE member_id = '+ member +'',function(err,result,field){
                if(err) throw err;
                //console.log(result)
              //  res.json(result[0].favorite_food);
              var food_type = [];
                var sum = result[0].favorite_food;
                var sql = "SELECT * FROM food_db WHERE  0";
                food_type = sum.split('"');
                food_type = food_type[0].split(',');

                for (var i in food_type) {
                   sql = sql.concat(' or type LIKE "%',food_type[i],'%"');
               
                }
               
                mysql.query(sql,function(err,result,field){
                    if(err) throw err;
                    
                    var j = {
                        data : []
                    };

                    for(var i in result){
                        j.data.push(result[i]);
                    }
                    res.json(j);
 
                })

            })
});

app.get('/register/:username/:password/:name/:email/:birth/:sex/:weight/:height/:favorite_food/:favorite_activity/:fitlevel',function(req,res){

    var member_id = req.params.member_id;
    var id = req.params.id;
    var username = req.params.username;
    var password = req.params.password;
    var name = req.params.name;
    var email = req.params.email;
    var birth = req.params.birth;
    var sex = req.params.sex;
    var weight = req.params.weight;
    var height = req.params.height;
    var favorite_food = req.params.favorite_food;
    var favorite_activity = req.params.favorite_activity;
    var fitlevel = req.params.fitlevel;
    mysql.query('INSERT INTO member_db (username,password,name,email,birth,sex,favorite_food,favorite_activity,fitlevel) VALUES ("'+ username +'","'+ password +'","'+ name +'","'+ email +'","'+ birth +'",'+ sex +','+favorite_food+','+favorite_activity+','+fitlevel+')'
    ,function(err,result,field){
    
            if(err1) throw err1;
            mysql.query('SELECT member_id FROM member_db WHERE username = "'+ username +'"' ,function(err1,result2,field){
    
                    if(err2) throw err2;
                    mysql.query('INSERT INTO fk_member (weight,height) VALUES ('+ weight +','+ height +')' ,function(err2,result1,field){
                        
                        if(err3) throw err3;
                        console.log(result1)
                        res.json(result1);
                        })
                    })
             })
    });

//ใช้เช็คซ้ำ Username INPUT = username OUTPUT = ผลลัพภ์True มีUsernameอยู่เเล้ว / Flase ยังไม่มี
app.get('/check/:id', function (req, res) {
    var id = req.params.id;
    mysql.query('SELECT * FROM  member_db WHERE username = "'+id+'" ', function(err,result,field){
                    if(err) throw err;
                    console.log(result)
                    //เเก้เลข T/F
                    if(result[1]){
                        var show = {
                            result : "true"
                        };
                    }
                    else{
                        var show = {
                            result : "false"
                        };
                    }
                    res.json(show);
                    
                    
        }
    )
});



app.get('/cal/:num1/:num2', function(req,res){
    var a = parseInt(req.params.num1) ;
    var b = parseInt(req.params.num2);
    var c = a + b;
    var d = a * b;
    var e = a / b;
    var Onum = {num1:c, num2:d, num3:e};
    res.json(Onum);
    
});
//#1 GET
app.get('/user/:id', function (req, res) {
    var id = req.params.id;
    mysql.query('SELECT * FROM  member_db WHERE member_id = '+id, function(err,result,field){
                    if(err) throw err;
                    console.log(result)
                    res.json(result);
        }
    )
});

app.get('/login/:username/:password',function(req,res){
    var username = req.params.username;
    var password = req.params.password;

    mysql.query('SELECT * FROM member_db WHERE username = "'+username+'" and password = "'+password+'"' ,function(err,result,fields){
            console.log(result[1]);

            res.json(result[0]);
        }
    )
});





//#2 POST
app.post('/user',function (req, res) {
    console.log(req.body.name)
    var name = req.body.name;
    var status = req.body.user;
    //how to use ? (VALUES)
    mysql.query('INSERT INTO member_db (name,status) VALUES ('+ status +',"'+ name +'")', function(err,result,field){
                    if(err) throw err;
                    console.log(result)
                    res.json({message : 'complete'});
        }   
    )
});


//#3 UPDATE
app.put('/user/:id',function (req, res) {
    console.log(req.body.name)
    var id = req.params.id;
    var name = req.body.name;
    var status = req.body.status;
    mysql.query('UPDATE member_db SET name = "' + name + '",status = '+status+' WHERE id = '+id,function(err,result,field){
                    if(err) throw err;
                    console.log(result)
                    res.json({message : 'success'});
        }
    )
});

//#4 Delete
app.delete('/user/:id',function (req, res) {
    console.log(req.body.id)
    var id = req.params.id;
    mysql.query('DELETE FROM member_db  WHERE id = '+id , function(err,result,field){
                    if(err) throw err;
                    console.log(result)
                    res.json({message : 'Victory'});
        }
    )
});

app.listen(port, function() {
    console.log('Starting node.js on port ' + port);
});
