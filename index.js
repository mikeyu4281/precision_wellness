import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import express from "express";
import cors from "cors";

import bodyParser from 'body-parser';
import { exec } from 'child_process';
import mysql from 'mysql2/promise';
let router = express.Router();
import http from 'node:http';

import mongoose from 'mongoose';
//var multer = require('multer');
import { fileURLToPath } from "url";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
//var fs = require('fs');
import { expressjwt } from 'express-jwt';
import moment from 'moment';
//const moment = require('moment');
import * as crypto from 'crypto';
//const path = require("path");

// routes/auth.js
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = new User({ email, passwordHash, name });
    await user.save();

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });

    return res.status(201).json({
      message: 'User created',
      user: { id: user._id, email: user.email, name: user.name },
      token
    });
  } catch (err) {
    console.error('Register error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h'
    });

    return res.json({
      message: 'Logged in',
      user: { id: user._id, email: user.email, name: user.name },
      token
    });
  } catch (err) {
    console.error('Login error', err);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;


app.post("/wellnessMeasure",  async (req, res) => {
  try {
	  
	
    const { sleepMeasure, emotionMeasure, physicalMeasure, datetime } = req.body;
	console.log(imageUrl);

	
    const newMeasureData = new Measure({ sleepMeasure, emotionMeasure, physicalMeasure, datetime });
    await newMeasureData.save();
    res.status(201).json(newProduct);
  } catch (error) newMeasureData
    res.status(500).json({ error: "Failed to add measure" });
  }
});


