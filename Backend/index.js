import { db } from "./database.js";
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import bcrypt from 'bcrypt';
import session from "express-session";

const app = express();
const store = new session.MemoryStore();


const saltRounds = 10; 
app.use(session(
    {
        secret: "secret",
        cookie: {maxAge:60 * 60 * 1000}, // one hour log in session
        saveUninitialized: false,
        store: store
    }
));
app.use(cors({
  origin: 'http://localhost:5173',  // Frontend origin
  credentials: true,                // Allow cookies (session cookies)
}));
app.use(bodyParser.json());

// app.post("/testlogin", (req, res) => {
//     const {username, password} = req.body; 
//     // console.log(req.body);
//     if (username && password) {
//         if(req.session.authenticated) {
//             res.json(req.session);
//         }
//         else{
//             if(password === '1'){
//                 req.session.authenticated = true;
//                 req.session.user = {username, password};
//                 res.json(req.session);
//                 console.log(store);
//                 console.log(req.sessionID);
//             }
//             else{
//                 res.status(403).json({msg: "Invalid password"});
//             }
//         }
//     }
//     else{
//         res.status(400).json({msg: "Invalid username or password"});
//     }
// });

// app.post('/signin', async (req, res) => {
//     let userFound = false, emailExist = false;
//     const { email, password } = req.body;

//     try {
//         const emailCheckQuery = 'SELECT * FROM user_info WHERE email = $1';
//         const emailResult = await db.query(emailCheckQuery, [email]);

//         if (emailResult.rows.length > 0) {
//             emailExist = true;
//             const user = emailResult.rows[0]; 
//             const hashedPassword = user.password; 
//             bcrypt.compare(password, hashedPassword, (err, result) => {
//                 if (err) {
//                     console.error('Error comparing passwords:', err);
//                     res.status(500).send('Error processing request');
//                 } else if (result) {
//                     userFound = true; 
//                     res.json({ emailExist, userFound });
//                 } else {
//                     res.json({ emailExist, userFound }); 
//                 }
//             });
//         } else {
//             res.json({ emailExist, userFound }); 
//         }
//     } catch (err) {
//         console.error('Error executing query:', err);
//         res.status(500).send('Error processing request');
//     }
// });

app.get('/testing_backend', (req, res) => {
    res.json({ message: 'Backend is working!' });
})

app.post('/signin', async (req, res) => {
    let userFound = false, emailExist = false;
    const { email, password } = req.body;

    try {
        const emailCheckQuery = 'SELECT * FROM user_info WHERE email = $1';
        const emailResult = await db.query(emailCheckQuery, [email]);

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
        } else {
            res.json({ emailExist, userFound });
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
