import { useState } from 'react';
import { useNavigate } from 'react-router';
import { createCampaignRequest } from '../../services/campaignRequestService';
import { CAMPAIGN_TYPES, GOALS_BY_TYPE, PREFERRED_CHANNELS } from '../../constants/campaignTaxonomy';
import Select from '../common/Select/Select';
import '../../styles/CampaignRequestForm.css';

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

    const handleCampaignTypeChange = (value) => {
        setFormData({ ...formData, campaignType: value, goal: '' });
    };

    const handleGoalChange = (value) => {
        setFormData({ ...formData, goal: value });
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
        <main className="request-form-page">
            <div className="request-form-main">
                <h1>New Campaign Request</h1>
                <p className="request-form-subtitle">Tell us what you need and we'll get it moving.</p>

                {error && <p role="alert">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="form-field">
                        <label htmlFor="title">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-field">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-row">
                        <Select
                            id="campaignType"
                            label="Campaign Type"
                            value={formData.campaignType}
                            onChange={handleCampaignTypeChange}
                            options={CAMPAIGN_TYPES}
                        />

                        <Select
                            id="goal"
                            label="Goal"
                            value={formData.goal}
                            onChange={handleGoalChange}
                            options={GOALS_BY_TYPE[formData.campaignType] || []}
                            disabled={!formData.campaignType}
                        />

                        <div className="form-field">
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
                        </div>
                    </div>

                    <div className="form-field">
                        <span className="form-field-label">Preferred Channels</span>
                        <div className="channel-pills">
                            {PREFERRED_CHANNELS.map((channel) => (
                                <label key={channel} htmlFor={`channel-${channel}`} className="channel-pill">
                                    <input
                                        type="checkbox"
                                        id={`channel-${channel}`}
                                        checked={formData.preferredChannels.includes(channel)}
                                        onChange={() => handleChannelToggle(channel)}
                                    />
                                    {channel.replace(/_/g, ' ')}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="form-field">
                        <label htmlFor="notes">Notes</label>
                        <textarea
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary-action">Submit</button>
                    </div>
                </form>
            </div>
        </main>
    );

};
