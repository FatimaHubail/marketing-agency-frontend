import { useState, useContext } from 'react';
import { useNavigate } from 'react-router';
import { createCampaignRequest } from '../../services/campaignRequestService';
import { CAMPAIGN_TYPES, GOALS_BY_TYPE } from '../../constants/campaignTaxonomy';

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

    const handleChannelsChange = (evt) => {
        const options = Array.from(evt.target.selectedOptions, (opt) => opt.value);
        setFormData({ ...formData, preferredChannels: options });
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

                <label htmlFor="preferredChannels">Preferred Channels</label>
                <select
                    id="preferredChannels"
                    name="preferredChannels"
                    multiple
                    value={formData.preferredChannels}
                    onChange={handleChannelsChange}
                >
                    <option value="instagram">Instagram</option>
                    <option value="tiktok">TikTok</option>
                    <option value="snapchat">Snapchat</option>
                    <option value="email">Email</option>
                    <option value="sms">SMS</option>
                    <option value="google_ads">Google Ads</option>
                </select>

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
