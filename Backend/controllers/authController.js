import { User } from '../models/index.js';

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) { // simple text match for mock
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const { password: _, ...userSafe } = user.toObject();
    res.json(userSafe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const register = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    const { password: _, ...userSafe } = user.toObject();
    res.status(201).json(userSafe);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
