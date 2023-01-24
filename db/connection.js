require('dotenv').config()

const express = require('express');
const { appendFile } = require('fs');
const mysql = require('mysql2');

const connection = mysql.createConnection(
    {
        host: "localhost",
        user: process.env.DB_USER,
        password: process.env.DB_PW,
        database: 'roster_db'
    },
    console.log(`Connected to correct database`)
)

connection.connect(function (err){
    if (err) console.log(err);
})

module.exports = connection;