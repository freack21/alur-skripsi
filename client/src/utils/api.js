const API_URL = 'http://localhost:3001/api';

export const fetchData = async (model) => {
  const res = await fetch(`${API_URL}/${model}`);
  return res.json();
};

export const createData = async (model, data) => {
  const res = await fetch(`${API_URL}/${model}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const updateData = async (model, id, data) => {
  const res = await fetch(`${API_URL}/${model}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
};

export const deleteData = async (model, id) => {
  const res = await fetch(`${API_URL}/${model}/${id}`, {
    method: 'DELETE',
  });
  return res.json();
};
