import pg from 'pg';
import express from 'express';

const db = new pg.Client({
    user: "postgres", 
    host: "localhost",
    database: "SAT_TUTOR",
    password: "654QIAyuh-",
    port: 5432
});

console.log("Attempting to connect to the database...");

db.connect((err) => {
    if (err) {
        console.error('Connection error', err.stack);
    } else {
        console.log('Connected to the database');
    }
});

export {db};