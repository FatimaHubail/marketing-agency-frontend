const BASE_URL = `${import.meta.env.VITE_BACK_END_SERVER_URL}/requests`;

const createCampaignRequest = async (formData) => {
    try {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (data.err) {
            throw new Error(data.err);
        }

        return data;
    } catch (err) {
        console.log(err);
        throw new Error(err);
    }
};

export { createCampaignRequest };
