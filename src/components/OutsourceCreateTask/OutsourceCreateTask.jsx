import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { getCampaignRequests } from '../../services/campaignRequestService';
import { getOutsources } from '../../services/outsourceService';
import { createOutsourceTask } from '../../services/outsourceTaskService';
import './OutsourceCreateTask.css';

const CAMPAIGN_TYPES = [
    'social_media',
    'sem',
    'display',
    'influencer',
    'content_marketing',
    'email_marketing',
    'brand_awareness',
    'print',
    'ooh',
    'event',
    'broadcast',
    'direct_mail',
    'instore_activation',
    'product_launch',
    'seo',
    'pr',
];

const formatLabel = (str = '') => {
    if (!str) return '';
    if (str.toLowerCase() === 'ooh') return 'OOH (Out of Home)';
    if (str.toLowerCase() === 'sem') return 'SEM';
    if (str.toLowerCase() === 'seo') return 'SEO';
    if (str.toLowerCase() === 'pr') return 'PR';
    return str
        .split('_')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
};

const OutsourceCreateTask = () => {
    const navigate = useNavigate();

    const [campaignRequests, setCampaignRequests] = useState([]);
    const [outsources, setOutsources] = useState([]);
    const [selectedRequestId, setSelectedRequestId] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        serviceType: '',
        paymentAmount: '',
        dueDate: '',
        outsourceId: '',
    });

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                setIsLoading(true);
                const [requestsData, outsourcesData] = await Promise.all([
                    getCampaignRequests().catch(() => []),
                    getOutsources().catch(() => []),
                ]);
                setCampaignRequests(requestsData || []);
                setOutsources(outsourcesData || []);
            } catch (err) {
                setError(err.message || 'Failed to load initial data');
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    const handleCampaignRequestChange = (evt) => {
        const reqId = evt.target.value;
        setSelectedRequestId(reqId);

        if (!reqId) {
            return;
        }

        const selectedReq = campaignRequests.find((r) => r._id === reqId);
        if (selectedReq) {
            setFormData((prev) => ({
                ...prev,
                title: selectedReq.title || prev.title,
                description: selectedReq.description || prev.description,
                serviceType: selectedReq.campaignType || prev.serviceType,
                paymentAmount: selectedReq.budget || prev.paymentAmount,
                outsourceId: '',
            }));
        }
    };

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        if (name === 'serviceType') {
            setFormData((prev) => ({
                ...prev,
                serviceType: value,
                outsourceId: '',
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const matchingOutsources = outsources.filter(
        (o) => o.serviceTypes && o.serviceTypes.includes(formData.serviceType)
    );

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.title.trim()) {
            setError('Task title is required');
            return;
        }

        if (!formData.serviceType) {
            setError('Service type is required');
            return;
        }

        if (!formData.outsourceId) {
            setError('Please select an outsource partner to assign this task to');
            return;
        }

        if (formData.paymentAmount === '' || Number(formData.paymentAmount) < 0) {
            setError('Please enter a valid payment amount');
            return;
        }

        if (!formData.dueDate) {
            setError('Due date is required');
            return;
        }

        const payload = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            serviceType: formData.serviceType,
            paymentAmount: Number(formData.paymentAmount),
            dueDate: formData.dueDate,
            outsourceId: formData.outsourceId,
            ...(selectedRequestId ? { campaignRequestId: selectedRequestId } : {}),
        };

        setIsSubmitting(true);
        try {
            await createOutsourceTask(payload);
            setSuccess('Outsource task created and assigned successfully!');
            setTimeout(() => {
                navigate('/staff/outsource-tasks');
            }, 1500);
        } catch (err) {
            setError(err.message || 'Failed to create outsource task');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <main className="outsource-create-task-page">
                <div className="outsource-create-task-container outsource-create-task-loading">
                    <p>Loading outsource task creation form...</p>
                </div>
            </main>
        );
    }

    return (
        <main className="outsource-create-task-page">
            <div className="outsource-create-task-container">
                <header className="outsource-create-task-header">
                    <h1>Assign Outsource Task</h1>
                    <p className="outsource-create-task-subtitle">
                        Create a task and assign it to a registered outsource agency with matching service capabilities.
                    </p>
                </header>

                {error && <p role="alert" className="outsource-create-task-alert alert-error">{error}</p>}
                {success && <p className="outsource-create-task-alert alert-success">{success}</p>}

                <form onSubmit={handleSubmit} className="outsource-create-task-form">
                    {/* 1. Campaign Request Selector */}
                    <div className="form-field">
                        <label htmlFor="campaignRequestId">Assign from Campaign Request:</label>
                        <select
                            id="campaignRequestId"
                            value={selectedRequestId}
                            onChange={handleCampaignRequestChange}
                        >
                            <option value="">-- Select a Campaign Request to Autofill --</option>
                            {campaignRequests.map((req) => (
                                <option key={req._id} value={req._id}>
                                    {req.title} ({formatLabel(req.campaignType)})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* 2 & 3. Row for Service Type and Outsource Partner */}
                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="serviceType">Service Type</label>
                            <select
                                id="serviceType"
                                name="serviceType"
                                value={formData.serviceType}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Select Service Type --</option>
                                {CAMPAIGN_TYPES.map((type) => (
                                    <option key={type} value={type}>
                                        {formatLabel(type)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-field">
                            <label htmlFor="outsourceId">Assign to Outsource Partner :</label>
                            <select
                                id="outsourceId"
                                name="outsourceId"
                                value={formData.outsourceId}
                                onChange={handleChange}
                                required
                                disabled={!formData.serviceType}
                            >
                                <option value="">
                                    {!formData.serviceType
                                        ? '-- Select a Service Type First --'
                                        : matchingOutsources.length === 0
                                            ? '-- No Outsource Provide This Service --'
                                            : '-- Select Outsource --'}
                                </option>
                                {matchingOutsources.map((o) => (
                                    <option key={o._id} value={o._id}>
                                        {o.name} (Contact: {o.contactPerson || 'N/A'}, Status: {o.status})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {formData.serviceType && matchingOutsources.length === 0 && (
                        <p className="outsource-warning-note">
                            Warning: No registered outsource agencies currently offer "{formatLabel(formData.serviceType)}" services.
                        </p>
                    )}

                    {/* 4. Task Title */}
                    <div className="form-field">
                        <label htmlFor="title">Task Title :</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="e.g. Influencer Campaign Video Production"
                            required
                        />
                    </div>

                    {/* 5. Description */}
                    <div className="form-field">
                        <label htmlFor="description">Task Description:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="What do you want the Outsource to do?"
                        />
                    </div>

                    {/* 6 & 7. Row for Payment Amount and Due Date */}
                    <div className="form-row">
                        <div className="form-field">
                            <label htmlFor="paymentAmount">Payment Amount (BHD) :</label>
                            <input
                                type="number"
                                id="paymentAmount"
                                name="paymentAmount"
                                value={formData.paymentAmount}
                                onChange={handleChange}
                                min="0"
                                step="any"
                                placeholder="e.g. 500"
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="dueDate">Due Date :</label>
                            <input
                                type="date"
                                id="dueDate"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="form-actions">
                        <button
                            type="submit"
                            className="btn-primary-action"
                            disabled={isSubmitting || !formData.outsourceId}
                        >
                            {isSubmitting ? 'Assigning...' : 'Assign Outsource Task'}
                        </button>
                        <button
                            type="button"
                            className="btn-secondary-action"
                            onClick={() => navigate(-1)}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default OutsourceCreateTask;
