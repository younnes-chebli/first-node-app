import * as dotenv from "dotenv";
dotenv.config();
const PG_PW = process.env.PG_PW;
import { users } from "./users.js";
// console.log(users);

import pg from "pg";

const client = new pg.Client({
    host: "localhost",
    user: "first_app_admin",
    port: 5432,
    password: `${PG_PW}`,
    database: "first_app"
});

try {
    client.connect();
    console.log(`Connected to ${client.database}`);
} catch(err) {
    console.log(err.message);
}

const createUsersTable = async () => {
    try {
        await client.query("CREATE TABLE IF NOT EXISTS users (id SERIAL PRIMARY KEY, firstname VARCHAR, lastname VARCHAR, email VARCHAR, ip varchar)");
        console.log("new table users created");
    } catch(err) {
        console.log(err.message);
    }
};

const populateUsersTable = async () => {
    for(const user of users) {
        const {firstName, lastName, email, ip} = user;
        try {
            await client.query("INSERT INTO users (firstname, lastname, email, ip) VALUES ($1, $2, $3, $4);", [firstName, lastName, email, ip]);
            console.log("user inserted into table users");
        } catch(err) {
            console.log(err.message);
        }
    }
};

const getUsers = async() => {
    try {
        const res = await client.query("SELECT * FROM users");
        console.log(res.rows);
    } catch(err) {
        console.log(err.message);
    }
}

createUsersTable();
populateUsersTable();
getUsers();