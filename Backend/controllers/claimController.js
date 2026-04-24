import { Claim } from '../models/index.js';

export const getClaims = async (req, res) => {
  try {
    const data = await Claim.find({ projectId: req.params.projectId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createClaim = async (req, res) => {
  try {
    const data = new Claim({ ...req.body, projectId: req.params.projectId });
    await data.save();
    
    // Emit socket event if it's LiveUpdate or Milestone change
    const io = req.app.get('io');
    if ('Claim' === 'LiveUpdate') {
      io.emit('new_update', data);
    }
    
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateClaim = async (req, res) => {
  try {
    const data = await Claim.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteClaim = async (req, res) => {
  try {
    await Claim.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
