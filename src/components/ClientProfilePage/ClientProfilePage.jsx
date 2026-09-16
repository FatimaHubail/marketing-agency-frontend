import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { getClientProfile, updateClientProfile } from '../../services/clientService';
import Select from '../common/Select/Select';
import '../../styles/CampaignRequestForm.css';
import './ClientProfilePage.css';

const PREFERRED_CONTACT_METHODS = ['email', 'phone', 'whatsapp', 'all'];
const BUDGET_TIERS = ['small', 'medium', 'enterprise'];
const GOVERNORATES = ['Capital', 'Muharraq', 'Northern', 'Southern'];
const SOCIAL_PLATFORMS = ['instagram', 'tiktok', 'snapchat', 'twitter', 'linkedin'];

const ClientProfilePage = () => {
    const { user } = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await getClientProfile(user.clientId);
                setProfile(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [user.clientId]);

    const startEditing = () => {
        setFormData({
            companyName: profile.companyName,
            industry: profile.industry,
            contactPerson: profile.contactPerson,
            contactEmail: profile.contactEmail,
            contactPhone: profile.contactPhone,
            preferredContactMethod: profile.preferredContactMethod,
            budgetTier: profile.budgetTier,
            website: profile.website || '',
            targetAudience: profile.targetAudience || '',
            guideLinesUrl: profile.guideLinesUrl || '',
            address: { ...profile.address },
            socialMediaPlatforms: profile.socialMediaPlatforms ? [...profile.socialMediaPlatforms] : [],
        });
        setError('');
        setIsEditing(true);
    };

    const cancelEditing = () => {
        setFormData(null);
        setError('');
        setIsEditing(false);
    };

    const handleChange = (evt) => {
        setFormData({ ...formData, [evt.target.name]: evt.target.value });
    };

    const handleAddressChange = (evt) => {
        setFormData({ ...formData, address: { ...formData.address, [evt.target.name]: evt.target.value } });
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
            socialMediaPlatforms: formData.socialMediaPlatforms.filter((_, i) => i !== index),
        });
    };

    const validateForm = () => {
        const requiredFields = {
            companyName: formData.companyName,
            industry: formData.industry,
            contactPerson: formData.contactPerson,
            contactEmail: formData.contactEmail,
            contactPhone: formData.contactPhone,
            preferredContactMethod: formData.preferredContactMethod,
            budgetTier: formData.budgetTier,
        };

        for (const [key, value] of Object.entries(requiredFields)) {
            if (!value) {
                return `${key} is required`;
            }
        }

        const { building, road, block, area, governorate } = formData.address;
        if (!building || !road || !block || !area || !governorate) {
            return 'Complete address is required';
        }

        if (!/^\d{8}$/.test(formData.contactPhone)) {
            return 'Contact phone must be 8 digits';
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

        setIsSaving(true);
        try {
            const updated = await updateClientProfile(user.clientId, formData);
            setProfile(updated);
            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <main className="profile-page"><div className="profile-main"><p>Loading profile...</p></div></main>;
    if (error && !profile) return <main className="profile-page"><div className="profile-main"><p role="alert">{error}</p></div></main>;

    if (!isEditing) {
        const addressLine = [
            profile.address?.office, profile.address?.floor, profile.address?.building, profile.address?.road,
            profile.address?.block, profile.address?.area, profile.address?.governorate, profile.address?.poBox,
        ].filter(Boolean).join(', ');

        return (
            <main className="profile-page">
                <div className="profile-main">
                    <div className="profile-header">
                        <h1>{profile.companyName}</h1>
                        <button className="btn-primary-action" onClick={startEditing}>Edit Profile</button>
                    </div>
                    <p className="profile-subtitle">Your company profile, as seen by MarkAura.</p>

                    {error && <p role="alert">{error}</p>}

                    <div className="profile-view-grid">
                        <div className="profile-view-item">
                            <span className="profile-view-label">Industry</span>
                            <span className="profile-view-value">{profile.industry}</span>
                        </div>
                        <div className="profile-view-item">
                            <span className="profile-view-label">Contact Person</span>
                            <span className="profile-view-value">{profile.contactPerson}</span>
                        </div>
                        <div className="profile-view-item">
                            <span className="profile-view-label">Contact Email</span>
                            <span className="profile-view-value">{profile.contactEmail}</span>
                        </div>
                        <div className="profile-view-item">
                            <span className="profile-view-label">Contact Phone</span>
                            <span className="profile-view-value">{profile.contactPhone}</span>
                        </div>
                        <div className="profile-view-item">
                            <span className="profile-view-label">Preferred Contact Method</span>
                            <span className="profile-view-value">{profile.preferredContactMethod}</span>
                        </div>
                        <div className="profile-view-item">
                            <span className="profile-view-label">Budget Tier</span>
                            <span className="profile-view-value">{profile.budgetTier}</span>
                        </div>
                        <div className="profile-view-item">
                            <span className="profile-view-label">Website</span>
                            <span className="profile-view-value">{profile.website || '—'}</span>
                        </div>
                        <div className="profile-view-item">
                            <span className="profile-view-label">Target Audience</span>
                            <span className="profile-view-value">{profile.targetAudience || '—'}</span>
                        </div>
                        <div className="profile-view-item">
                            <span className="profile-view-label">Guidelines URL</span>
                            <span className="profile-view-value">{profile.guideLinesUrl || '—'}</span>
                        </div>
                        <div className="profile-view-item profile-view-item-wide">
                            <span className="profile-view-label">Address</span>
                            <span className="profile-view-value">{addressLine || '—'}</span>
                        </div>
                    </div>

                    <div className="profile-section-title">Social Media</div>
                    {profile.socialMediaPlatforms?.length ? (
                        <div className="profile-social-list">
                            {profile.socialMediaPlatforms.map((p, i) => (
                                <a key={i} href={p.url} target="_blank" rel="noreferrer" className="profile-social-pill">
                                    {p.platform}
                                </a>
                            ))}
                        </div>
                    ) : (
                        <p className="profile-empty-note">No social media links added yet.</p>
                    )}
                </div>
            </main>
        );
    }

    return (
        <main className="profile-page">
            <div className="profile-main">
                <h1>Edit Profile</h1>
                <p className="profile-subtitle">Update your company information below.</p>

                {error && <p role="alert">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="profile-section-title">Company Information</div>

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

                    <div className="form-row">
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
                    </div>

                    <div className="form-row">
                        <Select
                            id="preferredContactMethod"
                            label="Preferred Contact Method"
                            value={formData.preferredContactMethod}
                            onChange={(value) => setFormData({ ...formData, preferredContactMethod: value })}
                            options={PREFERRED_CONTACT_METHODS}
                        />

                        <Select
                            id="budgetTier"
                            label="Budget Tier"
                            value={formData.budgetTier}
                            onChange={(value) => setFormData({ ...formData, budgetTier: value })}
                            options={BUDGET_TIERS}
                        />
                    </div>

                    <div className="profile-section-title">Address</div>

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
                                value={formData.address.office || ''}
                                onChange={handleAddressChange}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="floor">Floor (optional)</label>
                            <input
                                type="text"
                                id="floor"
                                name="floor"
                                value={formData.address.floor || ''}
                                onChange={handleAddressChange}
                            />
                        </div>

                        <div className="form-field">
                            <label htmlFor="poBox">PO Box (optional)</label>
                            <input
                                type="text"
                                id="poBox"
                                name="poBox"
                                value={formData.address.poBox || ''}
                                onChange={handleAddressChange}
                            />
                        </div>
                    </div>

                    <div className="profile-section-title">Additional Info (optional)</div>

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

                    <div className="profile-section-title">Social Media Platforms (optional)</div>

                    {formData.socialMediaPlatforms.map((entry, index) => (
                        <div key={index} className="platform-row">
                            <Select
                                value={entry.platform}
                                onChange={(value) => handleSocialPlatformChange(index, 'platform', value)}
                                options={SOCIAL_PLATFORMS}
                                placeholder="Select platform..."
                            />

                            <input
                                type="url"
                                placeholder="URL"
                                value={entry.url}
                                onChange={(evt) => handleSocialPlatformChange(index, 'url', evt.target.value)}
                            />

                            <button type="button" className="remove-platform-btn" onClick={() => handleRemoveSocialPlatform(index)}>Remove</button>
                        </div>
                    ))}

                    <button type="button" className="add-platform-btn" onClick={handleAddSocialPlatform}>+ Add social platform</button>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary-action" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button type="button" className="btn-secondary-action" onClick={cancelEditing} disabled={isSaving}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default ClientProfilePage;
