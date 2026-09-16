const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/campaigns`;

const getCampaigns = async () => {
  const res = await fetch(BASE_URL, {
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

const getCampaignById = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
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

const completeCampaign = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}/complete`, {
    method: 'PUT',
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

export {
  getCampaigns,
  getCampaignById,
  completeCampaign,
};
