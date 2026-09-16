const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/admin`;

const getUsers = async (role) => {
  const url = role
    ? `${BASE_URL}/users?role=${role}`
    : `${BASE_URL}/users`;

  const res = await fetch(url, {
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


const createUser = async(formData)=>{
    const res = await fetch(`${BASE_URL}/users`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(formData),
    });

    const data = await res.json();

    if(data.err){
        throw new Error(data.err);
    }
    return data;
}

const deleteUser = async (id) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
    method: 'DELETE',
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

const updateUser = async (id, formData) => {
  const res = await fetch(`${BASE_URL}/users/${id}`, {
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
export {getUsers, createUser, deleteUser, updateUser};