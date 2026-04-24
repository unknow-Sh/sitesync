import { MaterialDelivery } from '../models/index.js';

export const getMaterialDeliverys = async (req, res) => {
  try {
    const data = await MaterialDelivery.find({ projectId: req.params.projectId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMaterialDelivery = async (req, res) => {
  try {
    const data = new MaterialDelivery({ ...req.body, projectId: req.params.projectId });
    await data.save();
    
    // Emit socket event if it's LiveUpdate or Milestone change
    const io = req.app.get('io');
    if ('MaterialDelivery' === 'LiveUpdate') {
      io.emit('new_update', data);
    }
    
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMaterialDelivery = async (req, res) => {
  try {
    const data = await MaterialDelivery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMaterialDelivery = async (req, res) => {
  try {
    await MaterialDelivery.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
