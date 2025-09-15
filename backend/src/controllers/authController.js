const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, password });

    if (!username || !password) {
      console.log('Missing username or password');
      return res.status(400).json({ message: 'Username and password required' });
    }

    // Kullanıcıyı veritabanından bul
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    console.log('Database query result:', result.rows.length);

    if (result.rows.length === 0) {
      console.log('User not found:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const user = result.rows[0];
    console.log('Found user:', { id: user.id, username: user.username, role: user.role });

    // Şifreyi kontrol et
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', passwordMatch);
    
    if (!passwordMatch) {
      console.log('Password mismatch for user:', username);
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // JWT token oluştur
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        restaurant_id: user.restaurant_id
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const register = async (req, res) => {
  try {
    const { username, email, password, role, restaurant_id } = req.body;

    if (!username || !email || !password || !role) {
      return res.status(400).json({ message: 'All fields required' });
    }

    // Kullanıcı var mı kontrol et
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE username = $1 OR email = $2',
      [username, email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ message: 'Username or email already exists' });
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 10);

    // Yeni kullanıcı oluştur
    const result = await pool.query(
      'INSERT INTO users (username, email, password, role, restaurant_id) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role, restaurant_id',
      [username, email, hashedPassword, role, restaurant_id || null]
    );

    const newUser = result.rows[0];

    res.status(201).json({
      message: 'User created successfully',
      user: newUser
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const me = async (req, res) => {
  try {
    res.json({
      user: {
        id: req.user.id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        restaurant_id: req.user.restaurant_id
      }
    });
  } catch (error) {
    console.error('Me error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  login,
  register,
  me
};