import jwt from "jsonwebtoken";
import data from "../models/User.js";
import argon2 from "argon2";

function generateToken(dataId) {
  return jwt.sign({ id: dataId }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
}

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existingdata = await data.findOne({ email });
    
    if (existingdata) {
      return res.status(400).json({ message: "Email already in use" });
    }

    const hashedPassword = await argon2.hash(password, {
      type: argon2.argon2i,
    });

    const newdata = new data({
      name,
      email,
      password: hashedPassword,
    });

    await newdata.save();

    res.status(201).json({ message: "data successfully registered" });
  } catch (err) {
    console.error("Register Error:", err.message);
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await data.findOne({ email });

    if (!user || !user.password || !user.password.startsWith("$argon2")) {
      return res.status(400).json({ message: "Invalid email or Password" });
    }

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid Password" });
    }

    const token = generateToken(user._id);

    res.json({ token });
  } catch (err) {
    console.error("Login Error:", err.message);
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await data.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "data not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("getMe Error:", err.message);
    next(err);
  }
}
