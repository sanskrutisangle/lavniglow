require('dotenv').config();

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const path = require('path');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

// MySQL Connection Setup
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.message);
        return;
    }

    console.log('Connected to MySQL database.');
});

// User Registration Route
app.post('/api/register', async(req, res) => {
    const { name, email, password, gender, mobile } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
INSERT INTO users
    (name, email, password, gender, mobile)
VALUES( ? , ? , ? , ? , ? )
`;

        db.query(
            query, [name, email, hashedPassword, gender, mobile],
            (err, result) => {

                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({
                            success: false,
                            message: 'Email already registered!'
                        });
                    }

                    console.error(err);

                    return res.status(500).json({
                        success: false,
                        message: 'Database error.'
                    });
                }

                res.json({
                    success: true,
                    message: 'Registration successful!'
                });
            }
        );

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: 'Server error.'
        });
    }
});

// User Login Route
app.post('/api/login', (req, res) => {

    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';

    db.query(query, [email], async(err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: 'Database error.'
            });
        }

        if (results.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'User not found!'
            });
        }

        const user = results[0];

        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Invalid credentials!'
            });
        }

        res.json({
            success: true,
            message: 'Login successful!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                mobile: user.mobile
            }
        });
    });
});

// Place Order Route
app.post('/api/place-order', (req, res) => {

    const {
        userName,
        mobile,
        address,
        city,
        pincode,
        products,
        totalAmount
    } = req.body;

    const query = `
INSERT INTO orders
    (user_name, mobile, address, city, pincode, products, total_amount)
VALUES( ? , ? , ? , ? , ? , ? , ? )
`;

    db.query(
        query, [
            userName,
            mobile,
            address,
            city,
            pincode,
            JSON.stringify(products),
            totalAmount
        ],
        (err, result) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: 'Failed to place order.'
                });
            }

            console.log(
                ` [COMPANY NOTIFICATION] New order received from $ { userName }($ { mobile }) amounting to₹ $ { totalAmount }
`
            );

            res.json({
                success: true,
                orderId: result.insertId,
                message: 'Order placed successfully!'
            });
        }
    );
});

// Start Server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`
LavniGlow server running on http: //localhost:${PORT}`);
});