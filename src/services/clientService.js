const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/clients`;

const getClientProfile = async (clientId) => {
  const res = await fetch(`${BASE_URL}/${clientId}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const data = await res.json();

  if (data.err) {
    throw new Error(data.err);
  }

  return data;
};

const updateClientProfile = async (clientId, formData) => {
  const res = await fetch(`${BASE_URL}/${clientId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify(formData),
  });

  const data = await res.json();

  if (data.err) {
    throw new Error(data.err);
  }

  return data;
};

export {
  getClientProfile,
  updateClientProfile,
};
