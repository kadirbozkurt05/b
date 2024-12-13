import { Request, Response } from 'express';
import User from '../models/User';

export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}, '-password');
    res.status(200).json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const updateUserRole = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    // Validate role
    if (!['admin', 'teacher', 'user'].includes(role)) {
      res.status(400).json({ error: 'Invalid role' });
      return;
    }

    const user = await User.findByIdAndUpdate(
      id,
      { role },
      { new: true, select: '-password' }
    );

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if user exists
    const user = await User.findById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Prevent deletion of admin users
    if (user.role === 'admin') {
      res.status(403).json({ error: 'Admin users cannot be deleted' });
      return;
    }

    // Delete the user
    await User.findByIdAndDelete(id);

    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Server error' });
  }
};