import User from "../models/User.js";
import Cart from "../models/Cart.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserPreference from "../models/UserPreference.js";
import Preference from "../models/Preference.js";
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const config = require('../config/config.json');

const saltRounds = 10;

const validateEmail = (email) => {
  const regex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
  return regex.test(email);
};

export const register = async (req, res) => {
  try {
    const { email, password, user_name, preferences } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!password || password.trim().length === 0) {
      return res.status(400).json({ message: 'Password is required' });
    }

    if (!user_name || user_name.trim().length === 0) { 
      return res.status(400).json({ message: 'User name is required' });
    }
    
    const existingUser = await User.findOne({ where: { user_email: email } });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await User.create({
      user_email: email,
      user_password: hashedPassword,
      user_name: user_name,  
      user_activeStatus: false
    });

    await Cart.create({ user_id: user.user_id });

    if (preferences && preferences.length > 0) {
      for (const preferenceId of preferences) {
        if (!Number.isInteger(preferenceId)) {
          return res.status(400).json({ message: 'Invalid preference ID' });
        }
        await UserPreference.create({ user_id: user.user_id, preference_id: preferenceId });
      }
    }

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration' });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !validateEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (!password || password.trim().length === 0) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const user = await User.findOne({ where: { user_email: email } });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.user_password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    if (!user.user_activeStatus) {
      return res.status(401).json({ message: 'Account is inactive' });
    }

    const token = jwt.sign(
      { id: user.user_id, email: user.user_email },
      config.jwtSecret,
      { expiresIn: '1d' }
    );

    return res.json({
      message: 'Login successful',
      token,
      user: { id: user.user_id, email: user.user_email }
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login' });
  }
};

export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const userWithPreferences = await User.findByPk(userId, {
      include: [{
        model: Preference,
        as: 'preferences',
        through: { attributes: [] },
        attributes: ['preference_id', 'preference_name'],
      }]
    });

    const preferences = userWithPreferences.preferences 
      ? userWithPreferences.preferences.map(p => p.preference_name) 
      : [];

    return res.json({
      id: user.user_id,
      email: user.user_email,
      user_name: user.user_name,
      preferences: preferences
    });

  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateUserPreferences = async (req, res) => {
  try {
    const userId = req.user.id;
    const { preferences } = req.body;

    if (preferences && preferences.length > 0) {
      for (const preferenceId of preferences) {
        if (!Number.isInteger(preferenceId)) {
          return res.status(400).json({ message: 'Invalid preference ID' });
        }
        await UserPreference.create({ user_id: userId, preference_id: preferenceId });
      }
    } else {
      return res.status(400).json({ message: 'Preferences cannot be empty' });
    }

    return res.json({ message: 'Preferences updated successfully' });
  } catch (error) {
    console.error('Update preferences error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params; 
    const { user_name, user_email, preferences } = req.body;

    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.user_name = user_name;
    user.user_email = user_email;
    await user.save();

    if (preferences) {
      await UserPreference.destroy({  // if iuupdate ni admin preferences ni user, dedelete muna para hindi dumoble
        where: { user_id: id }
      });
      
      if (preferences.length > 0) {
        const preferencePromises = preferences.map(preferenceId => 
          UserPreference.create({ user_id: id, preference_id: preferenceId })
        );
        await Promise.all(preferencePromises);
      }
    }

    const updatedUser = await User.findByPk(id, {
      include: [{
        model: Preference,
        as: 'preferences',
        through: { attributes: [] },
        attributes: ['preference_id', 'preference_name'],
      }]
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: {
        user_activeStatus: true
      },
      order: [['user_id', 'ASC']],
      include: [{
        model: Preference,
        as: 'preferences',
        through: { attributes: [] },
        attributes: ['preference_id', 'preference_name'],
      }]
    }); 
    return res.status(200).json(users); 
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};

export const getAllUsersByAdmin = async (req, res) => {
  try {
    const users = await User.findAll({
      order: [['user_id', 'ASC']],
      include: [{
        model: Preference,
        as: 'preferences',
        through: { attributes: [] },
        attributes: ['preference_id', 'preference_name'],
      }]
    });     
    return res.status(200).json(users); 
  } catch (error) {
    console.error('Error fetching users:', error);
    return res.status(500).json({ message: 'Failed to fetch users' });
  }
};


export default { register, login, getUserProfile, updateUserPreferences, getAllUsers, getAllUsersByAdmin, updateUser };
