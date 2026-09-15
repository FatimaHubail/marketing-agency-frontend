import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { createCampaignRequest } from '../../services/campaignRequestService';
import { CAMPAIGN_TYPES, GOALS_BY_TYPE, PREFERRED_CHANNELS } from '../../constants/campaignTaxonomy';

export default function NewCampaignRequest() {
    const navigate = useNavigate();
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        campaignType: '',
        goal: '',
        notes: '',
        budget: '',
        preferredChannels: [],
    });

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
            await createCampaignRequest({ ...formData, budget: Number(formData.budget) });
            navigate('/requests');
        } catch (err) {
            setError(err.message);
        }
    };


    return (
        <main>
            <h1>New Campaign Request</h1>
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

                <button type="submit">Submit</button>
            </form>
        </main>
    );

};
