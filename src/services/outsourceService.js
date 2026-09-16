const SERVER_URL = import.meta.env.VITE_BACK_END_SERVER_URL;
const OUTSOURCE_URL = `${SERVER_URL}/outsource`;

const getOutsourceProfile = async (outsourceId) => {
    const res = await fetch(`${OUTSOURCE_URL}/${outsourceId}`, {
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

const updateOutsourceProfile = async (idOrFormData, maybeFormData) => {
    let id, formData;
    if (maybeFormData !== undefined) {
        id = idOrFormData;
        formData = maybeFormData;
    } else {
        formData = idOrFormData;
        id = formData?._id || formData?.id;
    }
    const url = id ? `${OUTSOURCE_URL}/${id}` : OUTSOURCE_URL;

    const res = await fetch(url, {
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

const getOutsources = async (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    const url = queryString ? `${OUTSOURCE_URL}?${queryString}` : OUTSOURCE_URL;

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


export {
    getOutsourceProfile,
    updateOutsourceProfile,
    getOutsources,
};