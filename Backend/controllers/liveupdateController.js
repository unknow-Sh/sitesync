import { LiveUpdate } from '../models/index.js';

export const getLiveUpdates = async (req, res) => {
  try {
    const data = await LiveUpdate.find({ projectId: req.params.projectId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createLiveUpdate = async (req, res) => {
  try {
    const data = new LiveUpdate({ ...req.body, projectId: req.params.projectId });
    await data.save();
    
    // Emit socket event if it's LiveUpdate or Milestone change
    const io = req.app.get('io');
    if ('LiveUpdate' === 'LiveUpdate') {
      io.emit('new_update', data);
    }
    
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateLiveUpdate = async (req, res) => {
  try {
    const data = await LiveUpdate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteLiveUpdate = async (req, res) => {
  try {
    await LiveUpdate.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
