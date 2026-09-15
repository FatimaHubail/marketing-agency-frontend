import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getCampaignRequestById, updateMyCampaignRequest } from '../../services/campaignRequestService';
import { CAMPAIGN_TYPES, GOALS_BY_TYPE, PREFERRED_CHANNELS } from '../../constants/campaignTaxonomy';

export default function UpdateCampaignRequest() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState(null);
    const [status, setStatus] = useState('');

    useEffect(() => {
        const fetchRequest = async () => {
            try {
                const data = await getCampaignRequestById(id);
                setStatus(data.status);
                setFormData({
                    title: data.title,
                    description: data.description || '',
                    campaignType: data.campaignType,
                    goal: data.goal,
                    notes: data.notes || '',
                    budget: data.budget,
                    preferredChannels: data.preferredChannels || [],
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchRequest();
    }, [id]);

    const handleChange = (evt) => {
        const { name, value } = evt.target;
        if (name === 'campaignType') {
            setFormData({ ...formData, campaignType: value, goal: '' });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleChannelToggle = (channel) => {
        const isSelected = formData.preferredChannels.includes(channel);
        const updated = isSelected
            ? formData.preferredChannels.filter((c) => c !== channel)
            : [...formData.preferredChannels, channel];
        setFormData({ ...formData, preferredChannels: updated });
    };

    const validateForm = () => {
        const { title, campaignType, goal, budget } = formData;

        if (!title || !campaignType || !goal || budget === '') {
            return 'Title, campaign type, goal, and budget are required';
        }
        if (!CAMPAIGN_TYPES.includes(campaignType)) {
            return 'Invalid campaign type';
        }
        if (!GOALS_BY_TYPE[campaignType].includes(goal)) {
            return 'Invalid goal for the selected campaign type';
        }
        if (Number(budget) < 0) {
            return 'Budget must be a non-negative number';
        }
        return '';
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            await updateMyCampaignRequest(id, { ...formData, budget: Number(formData.budget) });
            navigate(`/requests/${id}`);
        } catch (err) {
            setError(err.message);
        }
    };

    if (isLoading) return <main><p>Loading...</p></main>;
    if (error && !formData) return <main><p role="alert">{error}</p></main>;

    if (status !== 'submitted') {
        return (
            <main>
                <p role="alert">
                    This request can no longer be edited because it has already been reviewed.
                </p>
                <button onClick={() => navigate(`/requests/${id}`)}>← Back to Request</button>
            </main>
        );
    }

    return (
        <main>
            <h1>Update Campaign Request</h1>
            {error && <p role="alert">{error}</p>}

            <form onSubmit={handleSubmit}>
                <label htmlFor="title">Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />

                <label htmlFor="campaignType">Campaign Type</label>
                <select
                    id="campaignType"
                    name="campaignType"
                    value={formData.campaignType}
                    onChange={handleChange}
                    required
                >
                    <option value="">Select...</option>
                    {CAMPAIGN_TYPES.map((type) => (
                        <option key={type} value={type}>{type.replace(/_/g, ' ')}</option>
                    ))}
                </select>

                <label htmlFor="goal">Goal</label>
                <select
                    id="goal"
                    name="goal"
                    value={formData.goal}
                    onChange={handleChange}
                    disabled={!formData.campaignType}
                    required
                >
                    <option value="">Select...</option>
                    {(GOALS_BY_TYPE[formData.campaignType] || []).map((goal) => (
                        <option key={goal} value={goal}>{goal.replace(/_/g, ' ')}</option>
                    ))}
                </select>

                <label htmlFor="budget">Budget (BHD)</label>
                <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                    min="0"
                    required
                />

                <fieldset>
                    <legend>Preferred Channels</legend>
                    {PREFERRED_CHANNELS.map((channel) => (
                        <label key={channel} htmlFor={`channel-${channel}`}>
                            <input
                                type="checkbox"
                                id={`channel-${channel}`}
                                checked={formData.preferredChannels.includes(channel)}
                                onChange={() => handleChannelToggle(channel)}
                            />
                            {channel.replace(/_/g, ' ')}
                        </label>
                    ))}
                </fieldset>

                <label htmlFor="notes">Notes</label>
                <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                />

                <button type="submit">Save Changes</button>
                <button type="button" onClick={() => navigate(`/requests/${id}`)}>Cancel</button>
            </form>
        </main>
    );
};
