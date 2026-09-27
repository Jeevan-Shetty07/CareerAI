import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config/env';
import { getDb } from '../db/db';
import { AuthenticatedRequest } from '../middleware/auth';

const generateTokens = (user: { id: string; email: string; role: 'USER' | 'ADMIN' }) => {
  const payload = { id: user.id, email: user.email, role: user.role };
  const accessToken = jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' });
  const refreshToken = jwt.sign(payload, config.jwtRefreshSecret, { expiresIn: '30d' });
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, fullName, targetRole, degree, college, graduationYear } = req.body;

    if (!email || !password || !fullName) {
      res.status(400).json({ success: false, message: 'Email, password, and full name are required.' });
      return;
    }

    const { store, save } = getDb();
    const existing = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      res.status(400).json({ success: false, message: 'An account with this email address already exists.' });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = uuidv4();

    const newUser = {
      id: userId,
      email: email.toLowerCase(),
      passwordHash,
      role: 'USER' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newProfile = {
      id: uuidv4(),
      userId,
      fullName,
      email: email.toLowerCase(),
      avatarUrl: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(fullName)}`,
      degree: degree || 'Master of Computer Applications',
      college: college || 'National Institute of Technology',
      graduationYear: graduationYear || '2025',
      targetRole: targetRole || 'Full Stack Software Engineer',
      experienceLevel: 'Fresher / Entry-Level',
      preferredTechnologies: ['React', 'TypeScript', 'Node.js', 'PostgreSQL'],
      preferredLocation: 'Remote / Bengaluru, India',
      careerGoal: 'Secure a high-impact SDE role at a top-tier product company.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    store.users.push(newUser);
    store.profiles.push(newProfile);
    save();

    const tokens = generateTokens(newUser);

    res.status(201).json({
      success: true,
      message: 'Account created successfully.',
      data: {
        user: { id: newUser.id, email: newUser.email, role: newUser.role },
        profile: newProfile,
        ...tokens,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    const { store } = getDb();
    const user = store.users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    const profile = store.profiles.find(p => p.userId === user.id) || {
      fullName: 'CareerAI User',
      targetRole: 'Software Engineer',
      email: user.email,
    };

    const tokens = generateTokens(user);

    res.json({
      success: true,
      message: 'Login successful.',
      data: {
        user: { id: user.id, email: user.email, role: user.role },
        profile,
        ...tokens,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ success: false, message: 'Refresh token is required.' });
      return;
    }

    const decoded = jwt.verify(refreshToken, config.jwtRefreshSecret) as any;
    const { store } = getDb();
    const user = store.users.find(u => u.id === decoded.id);

    if (!user) {
      res.status(401).json({ success: false, message: 'User no longer exists.' });
      return;
    }

    const tokens = generateTokens(user);
    res.json({ success: true, data: tokens });
  } catch (err: any) {
    res.status(401).json({ success: false, message: 'Invalid refresh token.' });
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }

    const { store } = getDb();
    const user = store.users.find(u => u.id === req.user!.id);
    const profile = store.profiles.find(p => p.userId === req.user!.id);

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.json({
      success: true,
      data: {
        user: { id: user.id, email: user.email, role: user.role },
        profile: profile || null,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message });
  }
};
