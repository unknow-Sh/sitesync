import { Expense } from '../models/index.js';

export const getExpenses = async (req, res) => {
  try {
    const data = await Expense.find({ projectId: req.params.projectId });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    const data = new Expense({ ...req.body, projectId: req.params.projectId });
    await data.save();
    
    // Emit socket event if it's LiveUpdate or Milestone change
    const io = req.app.get('io');
    if ('Expense' === 'LiveUpdate') {
      io.emit('new_update', data);
    }
    
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const data = await Expense.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
