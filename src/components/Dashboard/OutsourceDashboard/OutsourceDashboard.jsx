import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./OutsourceDashboard.css";
import { getOutsourceTasks } from "../../../services/outsourceTaskService";
import { UserContext } from "../../../contexts/UserContext";

const OutsourceDashboard = () => {
    const { user } = useContext(UserContext);
    const navigate = useNavigate();

    const [outsourceTasks, setOutsourceTasks] = useState([]);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const outsourceTasksData = await getOutsourceTasks();
                setOutsourceTasks(outsourceTasksData);
            } catch (error) {
                console.log(error);
            }
        };
        loadDashboard();
    }, []);

    // Pending outsource tasks
    const pendingOutsourceTasks = outsourceTasks
        .filter((task) => task.status === "pending")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // In-progress outsource tasks
    const inProgressOutsourceTasks = outsourceTasks
        .filter((task) => task.status === "in_progress")
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    // Completed outsource tasks
    const completedOutsourceTasks = outsourceTasks.filter(
        (task) => task.status === "completed"
    );

    return (
        <div>
            <h1>Outsource Dashboard</h1>
            <p>Welcome, {user?.username}!</p>
            <p>Pending Tasks: {pendingOutsourceTasks.length}</p>
            <p>In Progress Tasks: {inProgressOutsourceTasks.length}</p>
            <p>Completed Tasks: {completedOutsourceTasks.length}</p>
        </div>
    );
};

export default OutsourceDashboard;
