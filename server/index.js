const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, 'data.json');

app.use(cors());
app.use(express.json());

// Helper function to read data
const readData = () => {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading data file:', error);
    return { entitas: [], dokumen: [], aksi: [] };
  }
};

// Helper function to write data
const writeData = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('Error writing data file:', error);
  }
};

// --- CRUD Endpoints ---

// Get all data for a specific model
app.get('/api/:model', (req, res) => {
  const { model } = req.params;
  const data = readData();
  if (data[model]) {
    res.json(data[model]);
  } else {
    res.status(404).json({ message: 'Model not found' });
  }
});

// Create new item for a model
app.post('/api/:model', (req, res) => {
  const { model } = req.params;
  const data = readData();
  
  if (!data[model]) {
    return res.status(404).json({ message: 'Model not found' });
  }

  const newItem = {
    id: Date.now().toString(),
    ...req.body
  };

  data[model].push(newItem);
  writeData(data);
  res.status(201).json(newItem);
});

// Update an item for a model
app.put('/api/:model/:id', (req, res) => {
  const { model, id } = req.params;
  const data = readData();

  if (!data[model]) {
    return res.status(404).json({ message: 'Model not found' });
  }

  const index = data[model].findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  const updatedItem = { ...data[model][index], ...req.body, id };
  data[model][index] = updatedItem;
  writeData(data);
  res.json(updatedItem);
});

// Delete an item for a model
app.delete('/api/:model/:id', (req, res) => {
  const { model, id } = req.params;
  const data = readData();

  if (!data[model]) {
    return res.status(404).json({ message: 'Model not found' });
  }

  const index = data[model].findIndex(item => item.id === id);
  if (index === -1) {
    return res.status(404).json({ message: 'Item not found' });
  }

  data[model].splice(index, 1);
  writeData(data);
  res.json({ message: 'Deleted successfully' });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
