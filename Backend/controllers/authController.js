import jwt from "jsonwebtoken";
import data from "../models/User.js";

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    const existingUser = await data.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const user = new data({ name, email, password });
    await user.save();
    res.status(201).json({ message: "User Successfully registered" });
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const user = await data.findOne({ email: req.body.email });

    if (!user || user.password !== req.body.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log(token);
    res.json({ token });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req, res, next) {
  try {
    const user = await data.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
}
