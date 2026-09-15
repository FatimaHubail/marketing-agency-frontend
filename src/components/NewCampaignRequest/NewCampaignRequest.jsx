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

};
