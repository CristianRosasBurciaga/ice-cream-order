//Import import express from 'express';
import express from 'express';

// Import mysql
import mysql2 from 'mysql2';

// Import .env
import dotenv from 'dotenv';
dotenv.config();


// Create a connection pool
const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
}).promise();


// Create an instance of an Express application
const app = express();

// Define the port number where our server will listen
const PORT = 3010;

//Enable static file serving
app.use(express.static('public'));

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));

const orders = [];

// Create a route to test the database

app.get('/db-test', async(req, res) => {
    try {
        const [orders] = await 
            pool.query('SELECT * FROM orders');
        res.send(orders);
    } catch(err) {
        console.error('Database error: ', err);
        res.status(500).send('Database error occurred.');
    }
});



// Define a default "route" ('/')
// req: contains information about the incoming request
// res: allows us to send back a response to the client
app.get('/', (req, res) => {
res.render(`home`)
// res.send('hello');

//Add a route for the form submission
app.post('/confirm', (req, res) => {

    //Create a JSON object to store the order data
    const order = req.body;
    order.timestamp = new Date();

    console.log(order);


    //add the order object to our orders array
    orders.push(order);
    console.log(orders);

    //Display the confirmation page
    res.render(`confirm`, {order});

    });


});

    //Add an admin route
    app.get('/admin', (req, res) => {
        res.render('admin', {orders});
    });

// Start the server and listen on the specified port 
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
}); 
