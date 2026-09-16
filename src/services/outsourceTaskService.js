const SERVER_URL = import.meta.env.VITE_BACK_END_SERVER_URL;
const OUTSOURCE_TASKS_URL = `${SERVER_URL}/outsource-tasks`;
const OUTSOURCE_ONE_TASK_URL = `${SERVER_URL}/outsource-tasks/`;



const getOutsourceTasks = async () => {
    const res = await fetch(OUTSOURCE_TASKS_URL, {
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

const getOutsourceTaskById = async (id) => {
    const res = await fetch(`${OUTSOURCE_ONE_TASK_URL}${id}`, {
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

const updateOutsourceTask = async (id, formData) => {
    const res = await fetch(`${OUTSOURCE_ONE_TASK_URL}${id}`, {
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
    getOutsourceTasks,
    getOutsourceTaskById,
    updateOutsourceTask,
};
