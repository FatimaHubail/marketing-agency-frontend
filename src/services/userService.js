// THIS IS A DEMO OF AN AUTHENTICATED FETCH REQUEST

const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/protected`;
const USERS_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/users`;

const getOutsourceUsers = async () => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    };

    const res = await fetch(`${USERS_URL}/outsource`, config);

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data;
  } catch (err) {
    console.log(err);
    throw new Error(err.message, { cause: err });
  }
};

const currentUser = async () => {
  try {
    const config = {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    }
    const res = await fetch(BASE_URL, config);

    const data = await res.json();

    if (data.err) {
      throw new Error(data.err);
    }

    return data
  } catch (err) {
    console.log(err);
    throw new Error(err.message, { cause: err });
  }
};


export {
  currentUser,
  getOutsourceUsers,
};