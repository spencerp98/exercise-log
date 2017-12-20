var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit : 10,
    host            : 'classmysql.engr.oregonstate.edu',
    user            : 'cs340_spencerp',
    password        : 'xxxx',
    database        : 'cs340_spencerp'
});

module.exports.pool = pool;
