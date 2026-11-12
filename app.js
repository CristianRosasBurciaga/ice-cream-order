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
});

// Confirmation route - handles form submission
app.post('/confirm', async (req, res) => {

    try {
        // Get form data from req.body
        const order = req.body;         

        // Log the order data (for debugging)
        console.log('New order submitted:', order);

	  // Convert toppings array to comma-separated string 
  order.toppings = Array.isArray(order.toppings) ?
    	  	order.toppings.join(", ") : "";  

        // SQL INSERT query with placeholders to prevent SQL injection
        const sql = `INSERT INTO orders(customer, email, flavor, cone, toppings, comment) VALUES (?, ?, ?, ?, ?, ?);`;


        // Parameters array must match the order of ? placeholders
	  // Make sure your property names match your order names
        const params = [
        order.customer,
        order.email,
		order.flavor,
		order.cone,
		order.toppings,
           order.comment
        ];


        // Execute the query and grab the primary key of the new row
	  // Array destructuring with [result] gives us the first element
        const [result] = await pool.execute(sql, params);

	  // Add the order ID to the order object
	  order.id = result.insertId;
	  console.log('Order saved with ID:', order.id);

        // Render confirmation page with the order data
        res.render('confirmation', { order });        

    } catch (err) {

        console.error('Error saving order:', err);
        res.status(500).send(`Sorry, there was an error processing 
your order. Please try again.`);
    }
});

// Display all orders
app.get('/admin', async (req, res) => {
    try {
        // Fetch all orders from database, most recent first
        const [orders] = await pool.query(`SELECT * FROM orders
                ORDER BY timestamp DESC`);  
        // Render the admin page
        res.render('admin', { orders });        
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send('Error loading orders: '
+ err.message);
    }
});

// Start the server and listen on the specified port 
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
}); 
