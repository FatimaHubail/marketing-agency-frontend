import { useContext, useEffect, useState } from 'react';
import { UserContext } from '../../contexts/UserContext';
import { getOutsourceProfile, updateOutsourceProfile } from '../../services/outsourceService';
import { getOutsourceTasks } from '../../services/outsourceTaskService';
import Select from '../common/Select/Select';
import '../../styles/CampaignRequestForm.css';
import './OutsourceProfile.css';

const ALL_SERVICE_TYPES = [
    'display',
    'influencer',
    'email_marketing',
    'ooh',
    'broadcast',
    'direct_mail',
    'instore_activation',
    'product_launch',
];

const STATUS_OPTIONS = [
    { value: 'available', label: 'Available' },
    { value: 'unavailable', label: 'Unavailable' },
];

const formatServiceName = (type = '') => {
    if (!type) return '';
    if (type.toLowerCase() === 'ooh') return 'OOH (Out of Home)';
    if (type.toLowerCase() === 'sem') return 'SEM';
    if (type.toLowerCase() === 'seo') return 'SEO';
    if (type.toLowerCase() === 'pr') return 'PR';
    return type
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
};

const OutsourceProfile = () => {
    const { user } = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                setError('');
                let data = null;

                const outsourceId = user?.outsourceId || localStorage.getItem('outsourceId') || user?._id;

                if (outsourceId) {
                    try {
                        data = await getOutsourceProfile(outsourceId);
                    } catch (fetchErr) {
                        console.log('Direct profile fetch attempt failed:', fetchErr.message);
                    }
                }

                // Fallback: fetch assigned tasks which populate outsourceId
                if (!data) {
                    try {
                        const tasks = await getOutsourceTasks();
                        const taskWithOutsource = tasks?.find(
                            (t) => t.outsourceId && typeof t.outsourceId === 'object'
                        );
                        if (taskWithOutsource) {
                            data = taskWithOutsource.outsourceId;
                        }
                    } catch (tasksErr) {
                        console.log('Task fallback fetch failed:', tasksErr.message);
                    }
                }

                // Fallback: construct from authenticated user object
                if (!data && user) {
                    data = {
                        _id: user.outsourceId || user._id,
                        name: user.name || user.username,
                        contactPerson: user.contactPerson || user.username,
                        phone: user.phone || '',
                        serviceTypes: user.serviceTypes || [],
                        status: user.status || 'available',
                        userId: {
                            _id: user._id,
                            username: user.username,
                            email: user.email,
                            role: user.role,
                        },
                    };
                }

                if (data) {
                    setProfile(data);
                    if (data._id) {
                        localStorage.setItem('outsourceId', data._id);
                    }
                } else {
                    setError('Unable to load outsource agency profile.');
                }
            } catch (err) {
                setError(err.message || 'Failed to load profile.');
            } finally {
                setIsLoading(false);
            }
        };

        if (user) {
            fetchProfile();
        }
    }, [user]);

    const startEditing = () => {
        setFormData({
            name: profile.name || '',
            contactPerson: profile.contactPerson || '',
            phone: profile.phone || '',
            email: profile.userId?.email || profile.email || '',
            status: profile.status || 'available',
            serviceTypes: profile.serviceTypes ? [...profile.serviceTypes] : [],
        });
        setError('');
        setSuccessMessage('');
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

    const handleServiceToggle = (service) => {
        const exists = formData.serviceTypes.includes(service);
        let updated;
        if (exists) {
            updated = formData.serviceTypes.filter((s) => s !== service);
        } else {
            updated = [...formData.serviceTypes, service];
        }
        setFormData({ ...formData, serviceTypes: updated });
    };

    const validateForm = () => {
        if (!formData.name?.trim()) return 'Agency name is required';
        if (!formData.contactPerson?.trim()) return 'Contact person is required';
        if (!formData.phone?.trim()) return 'Phone number is required';
        if (!formData.email?.trim()) return 'Email is required';
        if (!formData.serviceTypes || formData.serviceTypes.length === 0) {
            return 'Please select at least one service type';
        }
        return '';
    };

    const handleSubmit = async (evt) => {
        evt.preventDefault();
        setError('');
        setSuccessMessage('');

        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setIsSaving(true);
        try {
            const idToUpdate = profile._id || user.outsourceId || user._id;
            const updated = await updateOutsourceProfile(idToUpdate, formData);
            setProfile(updated);
            if (updated._id) {
                localStorage.setItem('outsourceId', updated._id);
            }
            setIsEditing(false);
            setSuccessMessage('Profile updated successfully!');
        } catch (err) {
            setError(err.message || 'Failed to update profile');
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <main className="profile-page outsource-profile-page">
                <div className="profile-main">
                    <p>Loading outsource profile...</p>
                </div>
            </main>
        );
    }

    if (error && !profile) {
        return (
            <main className="profile-page outsource-profile-page">
                <div className="profile-main">
                    <p role="alert">{error}</p>
                </div>
            </main>
        );
    }

    if (!isEditing) {
        return (
            <main className="profile-page outsource-profile-page">
                <div className="profile-main">
                    <div className="profile-header">
                        <div className="profile-title-group">
                            <h1>{profile.name || 'Outsource Agency'}</h1>
                            <span className={`profile-status-pill status-${profile.status || 'available'}`}>
                                {profile.status || 'available'}
                            </span>
                        </div>
                        <button
                            id="edit-profile-btn"
                            className="btn-primary-action"
                            onClick={startEditing}
                        >
                            Edit Profile
                        </button>
                    </div>

                    <p className="profile-subtitle">
                        Your outsource agency profile, as seen by MarkAura.
                    </p>

                    {error && <p role="alert">{error}</p>}
                    {successMessage && <p className="profile-success-alert">{successMessage}</p>}

                    <div className="profile-view-grid">
                        <div className="profile-view-item">
                            <span className="profile-view-label">Agency Name</span>
                            <span className="profile-view-value">{profile.name || '—'}</span>
                        </div>
                        <div className="profile-view-item">
                            <span className="profile-view-label">Contact Person</span>
                            <span className="profile-view-value">{profile.contactPerson || '—'}</span>
                        </div>
                        <div className="profile-view-item">
                            <span className="profile-view-label">Phone</span>
                            <span className="profile-view-value">{profile.phone || '—'}</span>
                        </div>
                        <div className="profile-view-item">
                            <span className="profile-view-label">Email</span>
                            <span className="profile-view-value">
                                {profile.userId?.email || profile.email || '—'}
                            </span>
                        </div>
                        <div className="profile-view-item">
                            <span className="profile-view-label">Username</span>
                            <span className="profile-view-value">
                                {profile.userId?.username || profile.username || '—'}
                            </span>
                        </div>
                        <div className="profile-view-item">
                            <span className="profile-view-label">Availability</span>
                            <span className="profile-view-value">
                                {profile.status || 'available'}
                            </span>
                        </div>
                    </div>

                    <div className="profile-section-title">Specialized Services</div>
                    {profile.serviceTypes?.length ? (
                        <div className="profile-services-list">
                            {profile.serviceTypes.map((service, idx) => (
                                <span key={idx} className="profile-service-pill">
                                    {formatServiceName(service)}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <p className="profile-empty-note">No service types assigned yet.</p>
                    )}
                </div>
            </main>
        );
    }

    return (
        <main className="profile-page outsource-profile-page">
            <div className="profile-main">
                <h1>Edit Profile</h1>
                <p className="profile-subtitle">Update your outsource agency information below.</p>

                {error && <p role="alert">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <div className="profile-section-title">Agency Information</div>

                    <div className="form-field">
                        <label htmlFor="name">Agency Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-row">
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

                        <div className="form-field">
                            <label htmlFor="phone">Phone</label>
                            <input
                                type="text"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row">
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

                        <Select
                            id="status"
                            label="Availability Status"
                            value={formData.status}
                            onChange={(value) => setFormData({ ...formData, status: value })}
                            options={STATUS_OPTIONS}
                        />
                    </div>

                    <div className="profile-section-title">Services Offered</div>
                    <p className="service-toggle-hint">Select the services your agency provides:</p>
                    <div className="service-toggle-grid">
                        {ALL_SERVICE_TYPES.map((service) => {
                            const isSelected = formData.serviceTypes.includes(service);
                            return (
                                <button
                                    type="button"
                                    key={service}
                                    className={`service-toggle-btn ${isSelected ? 'active' : ''}`}
                                    onClick={() => handleServiceToggle(service)}
                                >
                                    <span className="toggle-check">{isSelected ? '✓' : '+'}</span>
                                    {formatServiceName(service)}
                                </button>
                            );
                        })}
                    </div>

                    <div className="form-actions">
                        <button type="submit" className="btn-primary-action" disabled={isSaving}>
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                        <button
                            type="button"
                            className="btn-secondary-action"
                            onClick={cancelEditing}
                            disabled={isSaving}
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default OutsourceProfile;
