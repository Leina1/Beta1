// API Route cho Users
// URL: /api/users

import { getDb } from '@/lib/mongodb'
import bcrypt from 'bcryptjs'
import { ObjectId } from 'mongodb'

export default function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      handleGetUsers(req, res);
      break;

    case 'POST':
      handleCreateUser(req, res);
      break;

    case 'PUT':
      handleUpdateUser(req, res);
      break;

    case 'DELETE':
      handleDeleteUser(req, res);
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

// GET /api/users - Lấy danh sách users từ MongoDB
async function handleGetUsers(req, res) {
  try {
    const { page = 1, limit = 10, search } = req.query;

    const db = await getDb();
    const usersCollection = db.collection('User');

    // Build search query
    let query = {};
    if (search) {
      query = {
        $or: [
          { fullname: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ]
      };
    }

    // Get total count
    const totalCount = await usersCollection.countDocuments(query);

    // Get paginated users (excluding passwordHash)
    const users = await usersCollection
      .find(query, { projection: { passwordHash: 0 } })
      .skip((page - 1) * parseInt(limit))
      .limit(parseInt(limit))
      .toArray();

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        current: parseInt(page),
        total: Math.ceil(totalCount / limit),
        count: totalCount
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
}

// POST /api/users - Tạo user mới trong MongoDB
async function handleCreateUser(req, res) {
  try {
    const { fullname, email, password, phone, role = 'user' } = req.body;

    // Validation
    if (!fullname || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Thiếu thông tin bắt buộc'
      });
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Email không hợp lệ'
      });
    }

    // Password length check
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Mật khẩu phải có ít nhất 6 ký tự'
      });
    }

    const db = await getDb();
    const usersCollection = db.collection('User');

    // Check if email exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email đã được sử dụng'
      });
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user document
    const newUser = {
      fullname,
      email,
      phone: phone || '',
      passwordHash,
      role,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await usersCollection.insertOne(newUser);

    res.status(201).json({
      success: true,
      message: 'Tạo user thành công',
      data: {
        id: result.insertedId,
        fullname,
        email,
        phone,
        role
      }
    });

  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
}

// PUT /api/users - Cập nhật user trong MongoDB
async function handleUpdateUser(req, res) {
  try {
    const { id, fullname, email, phone, role } = req.body;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID user là bắt buộc'
      });
    }

    const db = await getDb();
    const usersCollection = db.collection('User');

    // Build update object
    const updateDoc = {
      $set: {
        updatedAt: new Date()
      }
    };

    if (fullname) updateDoc.$set.fullname = fullname;
    if (email) updateDoc.$set.email = email;
    if (phone) updateDoc.$set.phone = phone;
    if (role) updateDoc.$set.role = role;

    const result = await usersCollection.updateOne(
      { _id: new ObjectId(id) },
      updateDoc
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Cập nhật user thành công'
    });

  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
}

// DELETE /api/users - Xóa user từ MongoDB
async function handleDeleteUser(req, res) {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'ID user là bắt buộc'
      });
    }

    const db = await getDb();
    const usersCollection = db.collection('User');

    const result = await usersCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({
        success: false,
        message: 'Không tìm thấy user'
      });
    }

    res.status(200).json({
      success: true,
      message: `Đã xóa user ID: ${id}`
    });

  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Lỗi server'
    });
  }
}
