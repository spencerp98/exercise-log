var express = require("express");
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);


function getExercises(res, mysql, context, complete){
    mysql.pool.query("SELECT id, name, reps, weight, DATE_FORMAT(date, '%m-%d-%Y') AS date, unit FROM exercises", function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.exercise = results;
        complete();
    });
}

function getExercise(res, mysql, context, id, complete){
    var sql = "SELECT id, name, reps, weight, DATE_FORMAT(date, '%Y-%m-%d') AS date, unit FROM exercises WHERE id = ?";
    var inserts = [id];
    mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }
        context.exercise = results[0];
        complete();
    });
}

//gets all exercises and displays them in a table
app.get('/', function(req, res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["deleteExercise.js"];
    var mysql = req.app.get('mysql');
    getExercises(res, mysql, context, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 1){
            res.render('home', context);
        }
    }
});

//adds a new exercise to the table
app.post('/', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "INSERT INTO exercises (name, reps, weight, date, unit) VALUES (?,?,?,?,?)";
    var inserts = [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.unit];
    sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.redirect('/');
        }
    });
});

//deletes a row from the table
app.delete('/:id', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "DELETE FROM exercises WHERE id = ?";
    var inserts = [req.params.id];
    sql = mysql.pool.query(sql, inserts, function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.status(400);
            res.end();
        }else{
            res.status(202).end();
        }
    })
})

app.get('/:id', function(req, res){
    var callbackCount = 0;
    var context = {};
    context.jsscripts = ["updateExercise.js"];
    var mysql = req.app.get('mysql');
    getExercise(res, mysql, context, req.params.id, complete);
    function complete(){
        callbackCount++;
        if(callbackCount >= 1){
            res.render('update-exercise', context);
        }
    }
});

app.put('/:id', function(req, res){
    var mysql = req.app.get('mysql');
    var sql = "UPDATE exercises SET name=?, reps=?, weight=?, date=?, unit=? WHERE id=?";
    var inserts = [req.body.name, req.body.reps, req.body.weight, req.body.date, req.body.unit, req.params.id];
	sql = mysql.pool.query(sql,inserts,function(error, results, fields){
        if(error){
            res.write(JSON.stringify(error));
            res.end();
        }else{
            res.status(200);
            res.end();
        }
    });
});

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip1.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});
