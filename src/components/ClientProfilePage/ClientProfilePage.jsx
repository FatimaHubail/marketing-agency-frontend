import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { getClientProfile, updateClientProfile } from '../../services/clientService';

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

    if (isLoading) return <main><p>Loading profile...</p></main>;
    if (error && !profile) return <main><p role="alert">{error}</p></main>;

    if (!isEditing) {
        return (
            <main>
                <h1>My Profile</h1>
                {error && <p role="alert">{error}</p>}

                <p><strong>Company Name:</strong> {profile.companyName}</p>
                <p><strong>Industry:</strong> {profile.industry}</p>
                <p><strong>Contact Person:</strong> {profile.contactPerson}</p>
                <p><strong>Contact Email:</strong> {profile.contactEmail}</p>
                <p><strong>Contact Phone:</strong> {profile.contactPhone}</p>
                <p><strong>Preferred Contact Method:</strong> {profile.preferredContactMethod}</p>
                <p><strong>Budget Tier:</strong> {profile.budgetTier}</p>
                <p><strong>Website:</strong> {profile.website}</p>
                <p><strong>Target Audience:</strong> {profile.targetAudience}</p>
                <p><strong>Guidelines URL:</strong> {profile.guideLinesUrl}</p>

                <p>
                    <strong>Address:</strong>{' '}
                    {[profile.address?.office, profile.address?.floor, profile.address?.building, profile.address?.road,
                        profile.address?.block, profile.address?.area, profile.address?.governorate, profile.address?.poBox]
                        .filter(Boolean).join(', ')}
                </p>

                <p>
                    <strong>Social Media:</strong>{' '}
                    {profile.socialMediaPlatforms?.length
                        ? profile.socialMediaPlatforms.map((p) => `${p.platform}: ${p.url}`).join(', ')
                        : 'None'}
                </p>

                <button onClick={startEditing}>Edit Profile</button>
            </main>
        );
    }

    return (
        <main>
            <h1>Edit Profile</h1>
            {error && <p role="alert">{error}</p>}

            <form onSubmit={handleSubmit}>
                <fieldset>
                    <h2>Company Information</h2>

                    <label htmlFor="companyName">Company Name</label>
                    <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        value={formData.companyName}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="industry">Industry</label>
                    <input
                        type="text"
                        id="industry"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="contactPerson">Contact Person</label>
                    <input
                        type="text"
                        id="contactPerson"
                        name="contactPerson"
                        value={formData.contactPerson}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="contactEmail">Contact Email</label>
                    <input
                        type="email"
                        id="contactEmail"
                        name="contactEmail"
                        value={formData.contactEmail}
                        onChange={handleChange}
                        required
                    />

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

                    <label htmlFor="preferredContactMethod">Preferred Contact Method</label>
                    <select
                        id="preferredContactMethod"
                        name="preferredContactMethod"
                        value={formData.preferredContactMethod}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select...</option>
                        <option value="email">Email</option>
                        <option value="phone">Phone</option>
                        <option value="whatsapp">WhatsApp</option>
                        <option value="all">All</option>
                    </select>

                    <label htmlFor="budgetTier">Budget Tier</label>
                    <select
                        id="budgetTier"
                        name="budgetTier"
                        value={formData.budgetTier}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select...</option>
                        <option value="small">Small</option>
                        <option value="medium">Medium</option>
                        <option value="enterprise">Enterprise</option>
                    </select>
                </fieldset>

                <fieldset>
                    <h2>Address</h2>

                    <label htmlFor="building">Building</label>
                    <input
                        type="text"
                        id="building"
                        name="building"
                        value={formData.address.building}
                        onChange={handleAddressChange}
                        required
                    />

                    <label htmlFor="road">Road</label>
                    <input
                        type="text"
                        id="road"
                        name="road"
                        value={formData.address.road}
                        onChange={handleAddressChange}
                        required
                    />

                    <label htmlFor="block">Block</label>
                    <input
                        type="text"
                        id="block"
                        name="block"
                        value={formData.address.block}
                        onChange={handleAddressChange}
                        required
                    />

                    <label htmlFor="area">Area</label>
                    <input
                        type="text"
                        id="area"
                        name="area"
                        value={formData.address.area}
                        onChange={handleAddressChange}
                        required
                    />

                    <label htmlFor="governorate">Governorate</label>
                    <select
                        id="governorate"
                        name="governorate"
                        value={formData.address.governorate}
                        onChange={handleAddressChange}
                        required
                    >
                        <option value="">Select...</option>
                        <option value="Capital">Capital</option>
                        <option value="Muharraq">Muharraq</option>
                        <option value="Northern">Northern</option>
                        <option value="Southern">Southern</option>
                    </select>

                    <label htmlFor="office">Office (optional)</label>
                    <input
                        type="text"
                        id="office"
                        name="office"
                        value={formData.address.office || ''}
                        onChange={handleAddressChange}
                    />

                    <label htmlFor="floor">Floor (optional)</label>
                    <input
                        type="text"
                        id="floor"
                        name="floor"
                        value={formData.address.floor || ''}
                        onChange={handleAddressChange}
                    />

                    <label htmlFor="poBox">PO Box (optional)</label>
                    <input
                        type="text"
                        id="poBox"
                        name="poBox"
                        value={formData.address.poBox || ''}
                        onChange={handleAddressChange}
                    />
                </fieldset>

                <fieldset>
                    <legend>Additional Info (optional)</legend>

                    <label htmlFor="website">Website</label>
                    <input
                        type="url"
                        id="website"
                        name="website"
                        value={formData.website}
                        onChange={handleChange}
                    />

                    <label htmlFor="targetAudience">Target Audience</label>
                    <input
                        type="text"
                        id="targetAudience"
                        name="targetAudience"
                        value={formData.targetAudience}
                        onChange={handleChange}
                    />

                    <label htmlFor="guideLinesUrl">Guidelines URL</label>
                    <input
                        type="url"
                        id="guideLinesUrl"
                        name="guideLinesUrl"
                        value={formData.guideLinesUrl}
                        onChange={handleChange}
                    />
                </fieldset>

                <fieldset>
                    <h2>Social Media Platforms (optional)</h2>

                    {formData.socialMediaPlatforms.map((entry, index) => (
                        <div key={index}>
                            <select
                                value={entry.platform}
                                onChange={(evt) => handleSocialPlatformChange(index, 'platform', evt.target.value)}
                            >
                                <option value="">Select platform...</option>
                                <option value="instagram">Instagram</option>
                                <option value="tiktok">TikTok</option>
                                <option value="snapchat">Snapchat</option>
                                <option value="twitter">Twitter</option>
                                <option value="linkedin">LinkedIn</option>
                            </select>

                            <input
                                type="url"
                                placeholder="URL"
                                value={entry.url}
                                onChange={(evt) => handleSocialPlatformChange(index, 'url', evt.target.value)}
                            />

                            <button type="button" onClick={() => handleRemoveSocialPlatform(index)}>Remove</button>
                        </div>
                    ))}

                    <button type="button" onClick={handleAddSocialPlatform}>+ Add social platform</button>
                </fieldset>

                <button type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={cancelEditing} disabled={isSaving}>
                    Cancel
                </button>
            </form>
        </main>
    );
};

export default ClientProfilePage;
