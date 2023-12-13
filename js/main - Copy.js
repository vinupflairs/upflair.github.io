const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');

const app = express();
const port = 3000;

const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase';

// Remove EJS view engine configuration
// app.set('view engine', 'ejs');

// Serve static files from the "public" directory
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));

// Update the route to use form.html
app.get('/register', (req, res) => {
    res.sendFile(__dirname + '/form.html');
});

app.post('/register', async (req, res) => {
    const { name, lname, email, mobile, whatsapp, upflair, status, company, collage, course, jointime, ref } = req.body;

    const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

    try {
        await client.connect();
        console.log('Connected to the database');

        const db = client.db(dbName);

        const usersCollection = db.collection('users');
        await usersCollection.insertOne({ name, lname, email, mobile, whatsapp, upflair, status, company, collage, course, jointime, ref });

        console.log(`Name: ${name}, Email: ${email}, Mobile: ${mobile}`);
        res.send('<center><h1 style="margin-top:300px">Thank you for registering!</h1></center>');
    } catch (error) {
        console.error('Error during MongoDB operations:', error);
    } finally {
        await client.close();
        console.log('Connection closed');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
