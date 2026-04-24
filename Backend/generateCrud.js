import fs from 'fs';
import path from 'path';

const modules = [
  { name: 'Worker', route: 'workers' },
  { name: 'MaterialDelivery', route: 'material/deliveries' },
  { name: 'MaterialConsumption', route: 'material/consumption' },
  { name: 'Milestone', route: 'milestones' },
  { name: 'BudgetItem', route: 'budget-items' },
  { name: 'Expense', route: 'expenses' },
  { name: 'LiveUpdate', route: 'updates' },
  { name: 'Equipment', route: 'equipment' },
  { name: 'Document', route: 'documents' },
  { name: 'Subcontractor', route: 'subcontractors' },
  { name: 'Claim', route: 'claims' }
];

const genController = (modelName) => "import { " + modelName + " } from '../models/index.js';\n\nexport const get" + modelName + "s = async (req, res) => {\n  try {\n    const data = await " + modelName + ".find({ projectId: req.params.projectId });\n    res.json(data);\n  } catch (err) {\n    res.status(500).json({ error: err.message });\n  }\n};\n\nexport const create" + modelName + " = async (req, res) => {\n  try {\n    const data = new " + modelName + "({ ...req.body, projectId: req.params.projectId });\n    await data.save();\n    \n    // Emit socket event if it's LiveUpdate or Milestone change\n    const io = req.app.get('io');\n    if ('" + modelName + "' === 'LiveUpdate') {\n      io.emit('new_update', data);\n    }\n    \n    res.status(201).json(data);\n  } catch (err) {\n    res.status(500).json({ error: err.message });\n  }\n};\n\nexport const update" + modelName + " = async (req, res) => {\n  try {\n    const data = await " + modelName + ".findByIdAndUpdate(req.params.id, req.body, { new: true });\n    res.json(data);\n  } catch (err) {\n    res.status(500).json({ error: err.message });\n  }\n};\n\nexport const delete" + modelName + " = async (req, res) => {\n  try {\n    await " + modelName + ".findByIdAndDelete(req.params.id);\n    res.json({ message: 'Deleted successfully' });\n  } catch (err) {\n    res.status(500).json({ error: err.message });\n  }\n};\n";

const genRoute = (modelName, routePath) => "import express from 'express';\nimport { get" + modelName + "s, create" + modelName + ", update" + modelName + ", delete" + modelName + " } from '../controllers/" + modelName.toLowerCase() + "Controller.js';\n\nconst router = express.Router({ mergeParams: true });\n\nrouter.route('/')\n  .get(get" + modelName + "s)\n  .post(create" + modelName + ");\n\nrouter.route('/:id')\n  .put(update" + modelName + ")\n  .delete(delete" + modelName + ");\n\nexport default router;\n";

if (!fs.existsSync('controllers')) fs.mkdirSync('controllers');
if (!fs.existsSync('routes')) fs.mkdirSync('routes');

let mainRoutes = "import express from 'express';\n";

modules.forEach(m => {
  const cPath = path.join('controllers', m.name.toLowerCase() + 'Controller.js');
  const rPath = path.join('routes', m.name.toLowerCase() + 'Routes.js');
  
  fs.writeFileSync(cPath, genController(m.name));
  fs.writeFileSync(rPath, genRoute(m.name, m.route));
  
  mainRoutes += "import " + m.name.toLowerCase() + "Routes from './" + m.name.toLowerCase() + "Routes.js';\n";
});

mainRoutes += "\nconst router = express.Router({ mergeParams: true });\n\n";

modules.forEach(m => {
  mainRoutes += "router.use('/:projectId/" + m.route + "', " + m.name.toLowerCase() + "Routes);\n";
});

mainRoutes += "\nexport default router;\n";
fs.writeFileSync(path.join('routes', 'projectSubRoutes.js'), mainRoutes);

console.log('CRUD controllers and routes generated successfully.');
