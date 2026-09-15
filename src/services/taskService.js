const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/tasks`;

const getTasks = async () => {
  const res = await fetch(BASE_URL, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const data = await res.json();

  if (data.err) throw new Error(data.err);

  return data;
};

const createTask = async (formData) => {
  const res = await fetch(BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (data.err) throw new Error(data.err);

  return data;
};

const updateTask = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (data.err) throw new Error(data.err);

  return data;
};

const deleteTask = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const data = await res.json();

  if (data.err) throw new Error(data.err);

  return data;
};

export {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};