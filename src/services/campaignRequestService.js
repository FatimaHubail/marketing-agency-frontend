const SERVER_URL = import.meta.env.VITE_BACK_END_SERVER_URL;
const REQUESTS_URL = `${SERVER_URL}/requests`;
const CAMPAIGN_REQUESTS_URL = `${SERVER_URL}/campaign-requests`;

// client
const createCampaignRequest = async (formData) => {
  const res = await fetch(REQUESTS_URL, {
    method: 'POST',
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

const getMyCampaignRequests = async () => {
  const res = await fetch(REQUESTS_URL, {
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

const getCampaignRequestById = async (id) => {
  const res = await fetch(`${REQUESTS_URL}/${id}`, {
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

// staff
const getCampaignRequests = async () => {
  const res = await fetch(CAMPAIGN_REQUESTS_URL, {
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

const updateCampaignRequest = async (id, formData) => {
  const res = await fetch(`${CAMPAIGN_REQUESTS_URL}/${id}`, {
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

const acceptCampaignRequest = async (id, formData) => {
  const res = await fetch(`${CAMPAIGN_REQUESTS_URL}/${id}/assign`, {
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

const rejectCampaignRequest = async (id, rejectedReason) => {
  const res = await fetch(`${CAMPAIGN_REQUESTS_URL}/${id}/reject`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    body: JSON.stringify({ rejectedReason }),
  });

  const data = await res.json();

  if (data.err) {
    throw new Error(data.err);
  }

  return data;
};

const getUsersByRole = async (role) => {
  const res = await fetch(`${SERVER_URL}/admin/users?role=${role}`, {
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
  createCampaignRequest,
  getMyCampaignRequests,
  getCampaignRequestById,
  getCampaignRequests,
  updateCampaignRequest,
  acceptCampaignRequest,
  rejectCampaignRequest,
  getUsersByRole,
};
