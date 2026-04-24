import { Document } from '../models/index.js';

export const getDocuments = async (req, res) => {
  try {
    const data = await Document.find({ projectId: req.params.projectId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createDocument = async (req, res) => {
  try {
    const data = new Document({ ...req.body, projectId: req.params.projectId });
    await data.save();
    
    // Emit socket event if it's LiveUpdate or Milestone change
    const io = req.app.get('io');
    if ('Document' === 'LiveUpdate') {
      io.emit('new_update', data);
    }
    
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateDocument = async (req, res) => {
  try {
    const data = await Document.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
