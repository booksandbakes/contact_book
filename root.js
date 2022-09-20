var express = require("express");
const bodyParser = require('body-parser');
const mysql = require("mysql");
const query = require('./raw_query');
const bcrypt = require('bcryptjs');
const { initializeDB , db} = require('./lib/db');
const orderList=[];
let email="";

var app = express();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/register_user',async(req,res)=>{
  const name = req.body.name;
  const email = req.body.email;
  const pwd = req.body.pwd;
  console.log(name,email,pwd);

  try {
    salt = await bcrypt.genSalt(10);
    hash = await bcrypt.hash(pwd, salt);
    await initializeDB()
    try {
        const res = await db.sqlServerSequelizeConn.query(
            query.register, {
                type: db.sqlServerSequelizeConn.QueryTypes.INSERT,
                raw: true,
                replacements: {
                    name, email, hash
                },
            },                          
        );
    } 
    catch(err) {
        console.log("From query", err.message)
        res.send({
                    status: 'Failed',
                    data: 'Data already Available',
                });
        
    }
    } 
    catch(err) {
    console.log("From crypto lib", err.message)
    }

  res.status(200).json({
              status: 'success',
              data: 'Data Added',
            })
});

app.post('/add_contact',async(req,res)=>{
  const user_id = req.body.user_id;
  const name = req.body.name;
  const email = req.body.email;
  const phone_no = req.body.phno;
  console.log(user_id,name,email,phone_no);
  await initializeDB();
  pre_condition =  await db.sqlServerSequelizeConn.query(
    `SELECT name FROM contacts WHERE user_id = '${user_id}' and email = '${email}' `, {
    type: db.sqlServerSequelizeConn.QueryTypes.SELECT,
    raw: true,
    }
  );
  if(pre_condition.length==0)
  {  await initializeDB();
     result =  await db.sqlServerSequelizeConn.query(
        query.contact, {
        type: db.sqlServerSequelizeConn.QueryTypes.INSERT,
        raw: true,
        replacements: {
            user_id,name, email, phone_no
        },
        },
    );
    res.status(200).json({
            status: 'success',
            data: 'Contact Added',
        })
  }
  else{
    res.status(200).json({
        data: 'User with this email_id already available',
    })
  }
  
});

app.get('/all',async(req,res)=>{
  email = req.query.email;
  await initializeDB();
  result =  await db.sqlServerSequelizeConn.query(
        `SELECT * FROM contacts WHERE user_id = '${email}' `, {
        type: db.sqlServerSequelizeConn.QueryTypes.SELECT,
        raw: true,
        }
      );

  if(result.length>0)
  {
    res.send(result);
  }
  res.send({'status':'No data available'});
})

app.put('/add_contact',async(req,res)=>{
  const user_id = req.body.user_id;
  const name = req.body.name;
  const email = req.body.email;
  const phno = req.body.phno;
  console.log(user_id,name,email,phno);
  await initializeDB();
  result =  await db.sqlServerSequelizeConn.query(
    `UPDATE contacts SET name = '${name}', phone_no = ${phno} WHERE user_id = '${user_id}' and email = '${email}' `, {
    type: db.sqlServerSequelizeConn.QueryTypes.UPDATE,
    raw: true,
    }
  );
  res.send({"status":"update"});
})

app.delete('/add_contact',async(req,res)=>{
  const user_id = req.body.user_id;
  const phno = req.body.phno;
  console.log(user_id,phno);
  await initializeDB();
  try {
    result =  await db.sqlServerSequelizeConn.query(
      `DELETE FROM contacts WHERE phone_no = ${phno} and user_id= '${user_id}'`, {
      type: db.sqlServerSequelizeConn.QueryTypes.DELETE,
      raw: true,
      }
    );
    } catch (error) {
        res.send({"status":"No data available"});
    }
  res.send({"status":"delete"});
})

app.get('/search',async (req,res) =>{
  id = req.query.id;
  word = req.query.word;  
  console.log(id,word);  
  await initializeDB();
  result =  await db.sqlServerSequelizeConn.query(
    `SELECT * FROM contacts WHERE user_id = '${id}' and name LIKE '%${word}%' OR email LIKE '%${word}%'`, {
    type: db.sqlServerSequelizeConn.QueryTypes.SELECT,
    raw: true,
    }
  );
  if(result.length>0)
  {
    res.send(result);
  }
  res.send({'status':'No data available'});
})

app.post('/auth',async(req,res)=>{
    const email = req.body.email;
    await initializeDB();
    result =  await db.sqlServerSequelizeConn.query(
        `SELECT email FROM registered_user WHERE email = '${email}'`, {
        type: db.sqlServerSequelizeConn.QueryTypes.SELECT,
        raw: true,
        }
      );
    if(result.length!=0){
            res.send({'status':result})
    }
    res.send({'status':'not registered'})
    console.log(result);

})


app.listen(8010, () => console.log('Hello world app listening on port}!'))

