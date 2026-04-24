import { MaterialConsumption } from '../models/index.js';

export const getMaterialConsumptions = async (req, res) => {
  try {
    const data = await MaterialConsumption.find({ projectId: req.params.projectId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMaterialConsumption = async (req, res) => {
  try {
    const data = new MaterialConsumption({ ...req.body, projectId: req.params.projectId });
    await data.save();
    
    // Emit socket event if it's LiveUpdate or Milestone change
    const io = req.app.get('io');
    if ('MaterialConsumption' === 'LiveUpdate') {
      io.emit('new_update', data);
    }
    
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateMaterialConsumption = async (req, res) => {
  try {
    const data = await MaterialConsumption.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteMaterialConsumption = async (req, res) => {
  try {
    await MaterialConsumption.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
