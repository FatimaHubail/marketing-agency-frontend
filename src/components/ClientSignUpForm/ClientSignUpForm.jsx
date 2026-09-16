import { useState } from "react";
import { registerClient } from "../../services/authService";
import { useNavigate, Link } from "react-router";
import { useContext } from "react";
import { UserContext } from '../../contexts/UserContext';
import Select from '../common/Select/Select';
import '../../styles/CampaignRequestForm.css';
import '../../styles/AuthForm.css';

const CONTACT_METHODS = [
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'whatsapp', label: 'WhatsApp' },
    { value: 'all', label: 'All' },
];

const BUDGET_TIERS = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'enterprise', label: 'Enterprise' },
];

const GOVERNORATES = ['Capital', 'Muharraq', 'Northern', 'Southern'];

const PLATFORMS = [
    { value: 'instagram', label: 'Instagram' },
    { value: 'tiktok', label: 'TikTok' },
    { value: 'snapchat', label: 'Snapchat' },
    { value: 'twitter', label: 'Twitter' },
    { value: 'linkedin', label: 'LinkedIn' },
];

export default function ClientSignUpForm() {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        // user accnont fields
        username: '',
        email: '',
        password: '',

        // required client fields
        companyName: '',
        industry: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        preferredContactMethod: '',
        budgetTier: '',

        // optional client fields
        website: '',
        targetAudience: '',
        guideLinesUrl: '',

        // required address sub-object fields
        address: {
            building: '',
            road: '',
            block: '',
            area: '',
            governorate: '',
            office: '',
            floor: '',
            poBox: '',
        },

        // optional platform field
        socialMediaPlatforms: [],
    });

    const handleChange = (evt) => {
        setFormData({...formData, [evt.target.name]: evt.target.value});
    };

    const handleAddressChange = (evt) => {
        setFormData({...formData, address: {...formData.address, [evt.target.name]: evt.target.value}});
    };

    const handleSocialPlatformChange = (index, field, value) => {
        const updated = [...formData.socialMediaPlatforms];
        updated[index] = { ...updated[index], [field]: value };
        setFormData({ ...formData, socialMediaPlatforms: updated });
    };

    const handleAddSocialPlatform = () => {
        setFormData({
            ...formData,
            socialMediaPlatforms: [...formData.socialMediaPlatforms, { platform: '', url: '' }],
        });
    };

    const handleRemoveSocialPlatform = (index) => {
        setFormData({
            ...formData,
            socialMediaPlatforms: formData.socialMediaPlatforms.filter((_, i) => i !== index)
        })
    };

    const validateForm = () => {
        // vlaidate required fields
        const requiredClientFields = {
            companyName: formData.companyName,
            industry: formData.industry,
            contactPerson: formData.contactPerson,
            contactEmail: formData.contactEmail,
            contactPhone: formData.contactPhone,
            preferredContactMethod: formData.preferredContactMethod,
            budgetTier: formData.budgetTier,
        };

        for (const [key, value] of Object.entries(requiredClientFields)) {
            if (!value) {
                return `${key} is required`;
            }
        }

        // validate address
        const { building, road, block, area, governorate } = formData.address;
        if (!building || !road || !block || !area || !governorate) {
            return 'Complete address is required';
        }

        // validate phone number (8 digits)
        if (!/^\d{8}$/.test(formData.contactPhone)) {
            return 'Contact phone must be 8 digits';
        }

        // validating user fields
        if (!formData.username || !formData.email || !formData.password) {
            return 'Username, email, and password are required';
        }

        return '';
    };

    const navigate = useNavigate();
    const { setUser } = useContext(UserContext);

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setError('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const data = await registerClient(formData);
            setUser(data);
            navigate('/');
        } catch (error) {
            setError(error.message);
        }
    };


    return (
        <main className="auth-page">
            <div className="auth-card auth-card-wide">
                <Link to="/" className="auth-back-link">← Back to Home</Link>
                <h1 className="auth-title">Create Your Account</h1>
                <p className="auth-subtitle">Tell us about your business and we'll get you set up.</p>

                {error && <p role="alert">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <fieldset className="auth-fieldset">
                        <h2>Account</h2>

                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="username">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="auth-fieldset">
                        <h2>Company Information</h2>

                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="companyName">Company Name</label>
                                <input
                                    type="text"
                                    id="companyName"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="industry">Industry</label>
                                <input
                                    type="text"
                                    id="industry"
                                    name="industry"
                                    value={formData.industry}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="contactPerson">Contact Person</label>
                                <input
                                    type="text"
                                    id="contactPerson"
                                    name="contactPerson"
                                    value={formData.contactPerson}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="contactEmail">Contact Email</label>
                                <input
                                    type="email"
                                    id="contactEmail"
                                    name="contactEmail"
                                    value={formData.contactEmail}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="contactPhone">Contact Phone</label>
                                <input
                                    type="text"
                                    id="contactPhone"
                                    name="contactPhone"
                                    value={formData.contactPhone}
                                    onChange={handleChange}
                                    placeholder="3XXXXXXX"
                                    pattern="^\d{8}$"
                                    title="Enter an 8-digit Bahrain phone number"
                                    maxLength={8}
                                    required
                                />
                            </div>

                            <Select
                                id="preferredContactMethod"
                                label="Preferred Contact Method"
                                value={formData.preferredContactMethod}
                                onChange={(value) => setFormData({ ...formData, preferredContactMethod: value })}
                                options={CONTACT_METHODS}
                            />
                        </div>

                        <div className="form-row">
                            <Select
                                id="budgetTier"
                                label="Budget Tier"
                                value={formData.budgetTier}
                                onChange={(value) => setFormData({ ...formData, budgetTier: value })}
                                options={BUDGET_TIERS}
                            />
                        </div>
                    </fieldset>

                    <fieldset className="auth-fieldset">
                        <h2>Address</h2>

                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="building">Building</label>
                                <input
                                    type="text"
                                    id="building"
                                    name="building"
                                    value={formData.address.building}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="road">Road</label>
                                <input
                                    type="text"
                                    id="road"
                                    name="road"
                                    value={formData.address.road}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="block">Block</label>
                                <input
                                    type="text"
                                    id="block"
                                    name="block"
                                    value={formData.address.block}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="area">Area</label>
                                <input
                                    type="text"
                                    id="area"
                                    name="area"
                                    value={formData.address.area}
                                    onChange={handleAddressChange}
                                    required
                                />
                            </div>

                            <Select
                                id="governorate"
                                label="Governorate"
                                value={formData.address.governorate}
                                onChange={(value) => setFormData({ ...formData, address: { ...formData.address, governorate: value } })}
                                options={GOVERNORATES}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="office">Office (optional)</label>
                                <input
                                    type="text"
                                    id="office"
                                    name="office"
                                    value={formData.address.office}
                                    onChange={handleAddressChange}
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="floor">Floor (optional)</label>
                                <input
                                    type="text"
                                    id="floor"
                                    name="floor"
                                    value={formData.address.floor}
                                    onChange={handleAddressChange}
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="poBox">PO Box (optional)</label>
                                <input
                                    type="text"
                                    id="poBox"
                                    name="poBox"
                                    value={formData.address.poBox}
                                    onChange={handleAddressChange}
                                />
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="auth-fieldset">
                        <legend>Additional Info (optional)</legend>

                        <div className="form-row">
                            <div className="form-field">
                                <label htmlFor="website">Website</label>
                                <input
                                    type="url"
                                    id="website"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="targetAudience">Target Audience</label>
                                <input
                                    type="text"
                                    id="targetAudience"
                                    name="targetAudience"
                                    value={formData.targetAudience}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className="form-field">
                                <label htmlFor="guideLinesUrl">Guidelines URL</label>
                                <input
                                    type="url"
                                    id="guideLinesUrl"
                                    name="guideLinesUrl"
                                    value={formData.guideLinesUrl}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </fieldset>

                    <fieldset className="auth-fieldset">
                        <h2>Company Social Media Platforms (optional)</h2>

                        {formData.socialMediaPlatforms.map((entry, index) => (
                            <div key={index} className="auth-social-row">
                                <Select
                                    value={entry.platform}
                                    onChange={(value) => handleSocialPlatformChange(index, 'platform', value)}
                                    options={PLATFORMS}
                                    placeholder="Select platform..."
                                />

                                <div className="form-field">
                                    <input
                                        type="url"
                                        placeholder="URL"
                                        value={entry.url}
                                        onChange={(evt) => handleSocialPlatformChange(index, 'url', evt.target.value)}
                                    />
                                </div>

                                <button type="button" className="auth-social-remove" onClick={() => handleRemoveSocialPlatform(index)} aria-label="Remove platform">
                                    ×
                                </button>
                            </div>
                        ))}

                        <button type="button" className="auth-social-add" onClick={handleAddSocialPlatform}>+ Add social platform</button>
                    </fieldset>

                    <div className="auth-actions">
                        <button type="submit" className="btn-primary-action">Register</button>
                    </div>
                </form>

                <p className="auth-footer-note">Already have an account? <Link to="/sign-in">Sign In</Link></p>
            </div>
        </main>
    );
};
