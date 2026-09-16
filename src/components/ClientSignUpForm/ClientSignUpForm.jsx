import { useState } from "react";
import { registerClient } from "../../services/authService";
import { useNavigate, Link } from "react-router";
import { useContext } from "react";
import { UserContext } from '../../contexts/UserContext';

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
        <>
            <Link to="/">← Back to Home</Link>
            <form onSubmit={handleSubmit}>
                {error && <p role="alert">{error}</p>}

                <fieldset>
                    <h2>Account</h2>

                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </fieldset>

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
                        value={formData.address.office}
                        onChange={handleAddressChange}
                    />

                    <label htmlFor="floor">Floor (optional)</label>
                    <input
                        type="text"
                        id="floor"
                        name="floor"
                        value={formData.address.floor}
                        onChange={handleAddressChange}
                    />

                    <label htmlFor="poBox">PO Box (optional)</label>
                    <input
                        type="text"
                        id="poBox"
                        name="poBox"
                        value={formData.address.poBox}
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
                    <h2>Company Social Media Platforms(optional)</h2>

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

                <button type="submit">Register</button>
            </form>
            
        </>
    );
};