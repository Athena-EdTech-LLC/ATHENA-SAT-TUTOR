// TODO: NEED TO CONVERT THESE FILES TO MVC FORMAT!!
import { db } from "./database.js";
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import session from "express-session";

const app = express();
const store = new session.MemoryStore();

// avoid CORS erros and allow cookies. NEED TO UPDATE THIS WHEN WE HAVE DOMAIN
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,                
}));
app.use(bodyParser.json());

// setting up cookies for the software. avoid logging in for extensive time periods.
const saltRounds = 10; 
app.use(session(
    {
        resave: false, 
        secret: "secret",
        cookie: {maxAge:60 * 60 * 1000}, // one hour log in session
        saveUninitialized: false,
        store: store
    }
));

// use this to test if the backend is connected
app.get('/testing_backend', (req, res) => {
    res.json({ message: 'Backend is working!' });
})

app.post('/signin', async (req, res) => {
    let isEmail = false, isUsername = false;
    let userFound = false, emailExist = false, usernameExist = false;
    const { email_user, password } = req.body;

    // check if the input is an email
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email_user)) {
        isUsername = true;
    }
    else {
        isEmail = true;
    }

    // check if user is in the database and log in validation using email login or username login
    try {
        if (isEmail == true) {
            const emailCheckQuery = 'SELECT * FROM user_info WHERE email = $1';
            const emailResult = await db.query(emailCheckQuery, [email_user]);

            if (emailResult.rows.length > 0) {
                emailExist = true;
                const user = emailResult.rows[0];
                const hashedPassword = user.password;
                console.log(hashedPassword); 
                console.log(password);
                bcrypt.compare(password, hashedPassword, (err, result) => {
                    console.log(`result: ${result}`);
                    if (err) {
                        console.error('Error comparing passwords:', err);
                        res.status(500).send('Error processing request');
                    } else if (result == true){
                        userFound = true;
                        req.session.user = {
                            id: user.id,       
                            username: user.username,
                            email: user.email,
                        };
                        res.json({ emailExist, userFound });
                    } 
                    else{
                        res.json({ emailExist, userFound });
                    }
                });
            } 
            
            else {
                res.json({ emailExist, userFound });
            }

        }else{
            console.log("username");
            const userCheckQuery = 'SELECT * FROM user_info WHERE username = $1';
            const userResult = await db.query(userCheckQuery, [email_user]);

            if (userResult.rows.length > 0) {
                usernameExist = true;
                const user = userResult.rows[0];
                const hashedPassword = user.password;
                console.log(hashedPassword); 
                console.log(password);
                bcrypt.compare(password, hashedPassword, (err, result) => {
                    console.log(`result: ${result}`);
                    if (err) {
                        console.error('Error comparing passwords:', err);
                        res.status(500).send('Error processing request');
                    } else if (result == true){
                        userFound = true;
                        req.session.user = {
                            id: user.id,       
                            username: user.username,
                            email: user.email,
                        };
                        res.json({ usernameExist, userFound });
                    } 
                    else{
                        res.json({ usernameExist, userFound });
                    }
                });
            } 
            
            else {
                res.json({ usernameExist, userFound });
            }

        } 
        
    } catch (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Error processing request');
    }
});

app.post('/register', async (req, res) => {
 const { username, email, password } = req.body;

    bcrypt.hash(password, saltRounds, async (err, hash) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).send('Error hashing password');
        }

        const query = 'INSERT INTO user_info (username, email, password) VALUES ($1, $2, $3)';
        const values = [username, email, hash]; // Use the hashed password here

        try {
            const result = await db.query(query, values);
            console.log(result);
            res.send('User registration successful');
        } catch (err) {
            console.error('Error executing query:', err.stack);
            res.status(500).send('Error registering user');
        }
    });
});

// homescreen
app.get("/home", (req, res) => {
    const signedIn=false;
    if (req.session.user) {
        res.json({signedIn : true});
    } 
    else {
        res.json({signedIn});
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
