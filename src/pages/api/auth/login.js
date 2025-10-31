// API Route cho Authentication
// URL: /api/auth/login

import { getDb } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'

export default function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end('Method Not Allowed');
  }

  handleLogin(req, res);
}

async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email và mật khẩu là bắt buộc'
      });
    }

    // Connect to MongoDB
    const db = await getDb();
    const users = db.collection('User');

    // Find user by email
    const user = await users.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email không tồn tại'
      });
    }

    // Check password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Mật khẩu không đúng'
      });
    }

    // Generate token (mock for now)
    const token = `token_${user._id}_${Date.now()}`;

    // Set httpOnly cookie
    const secureFlag = process.env.NODE_ENV === 'production' ? 'Secure; ' : '';
    res.setHeader('Set-Cookie', `token=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Lax; ${secureFlag}`);

    // Return user info (không trả về passwordHash)
    const { passwordHash, ...userInfo } = user;

    res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      data: {
        user: {
          ...userInfo,
          id: user._id
        },
        token,
        expiresIn: '24h'
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server',
      error: error.message
    });
  }
}
