import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router';
import { UserContext } from '../../contexts/UserContext';
import { getClientProfile } from '../../services/clientService';
import { getCampaigns } from '../../services/campaignService';
import { getMyCampaignRequests } from '../../services/campaignRequestService';
import './ClientDashboard.css';

// Mongo ObjectIds embed their creation time in the first 4 bytes - used here
// to get a real timestamp for campaigns, which have no timestamps field.
const objectIdToDate = (id) => new Date(parseInt(id.substring(0, 8), 16) * 1000);

const STATUS_COLORS = {
    planning: '#457b9d',
    in_progress: '#2a9d8f',
    client_review: '#ea4c89',
    live: '#2a9d8f',
    completed: '#457b9d',
};

const TYPE_COLORS = ['#e8845f', '#2a9d8f', '#457b9d', '#f4a623', '#ea4c89', '#e63946'];

const ClientDashboard = () => {
    const { user } = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [profileData, campaignsData, requestsData] = await Promise.all([
                    getClientProfile(user.clientId),
                    getCampaigns(),
                    getMyCampaignRequests(),
                ]);
                setProfile(profileData);
                setCampaigns(campaignsData);
                setRequests(requestsData);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [user.clientId]);

    if (isLoading) return <main className="client-dashboard"><p>Loading dashboard...</p></main>;
    if (error) return <main className="client-dashboard"><p role="alert">{error}</p></main>;

    const currentYear = new Date().getFullYear();
    const activeCampaigns = campaigns.filter((c) => c.status !== 'completed');
    const pendingRequests = requests.filter((r) => r.status === 'submitted');
    const totalBudgetSpent = campaigns.reduce((sum, c) => sum + c.budgetSpent, 0);
    const completedThisYear = campaigns.filter(
        (c) => c.status === 'completed' && new Date(c.endDate).getFullYear() === currentYear
    );

    const rejectedRequests = requests.filter((r) => r.status === 'rejected');

    const totalRequestedBudget = campaigns.reduce((sum, c) => sum + (c.requestId?.budget || 0), 0);
    const budgetUtilizationPct = totalRequestedBudget > 0
        ? Math.round((totalBudgetSpent / totalRequestedBudget) * 100)
        : 0;

    const CAMPAIGN_STATUSES = ['planning', 'in_progress', 'client_review', 'live', 'completed'];
    const campaignsByStatus = CAMPAIGN_STATUSES.map((status) => ({
        status,
        count: campaigns.filter((c) => c.status === status).length,
    }));

    const campaignsByType = Object.entries(
        campaigns.reduce((counts, c) => {
            const type = c.requestId?.campaignType;
            if (type) counts[type] = (counts[type] || 0) + 1;
            return counts;
        }, {})
    ).sort((a, b) => b[1] - a[1]);

    const upcomingDeadlines = [...activeCampaigns]
        .sort((a, b) => new Date(a.endDate) - new Date(b.endDate))
        .slice(0, 5);

    const recentActivity = [
        ...requests.map((r) => ({
            text: `Campaign request "${r.title}" is ${r.status}`,
            date: new Date(r.updatedAt),
        })),
        ...campaigns.map((c) => ({
            text: `Campaign "${c.requestId?.title}" is ${c.status.replace(/_/g, ' ')}`,
            date: objectIdToDate(c._id),
        })),
    ]
        .sort((a, b) => b.date - a.date)
        .slice(0, 5);

    const initials = (user.username || '')
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const trimmedQuery = searchQuery.trim().toLowerCase();
    const matchedCampaigns = trimmedQuery
        ? campaigns.filter((c) => c.requestId?.title?.toLowerCase().includes(trimmedQuery))
        : [];
    const matchedRequests = trimmedQuery
        ? requests.filter((r) => r.title?.toLowerCase().includes(trimmedQuery))
        : [];
    const hasSearchResults = matchedCampaigns.length > 0 || matchedRequests.length > 0;

    return (
        <main className="client-dashboard">
            <div className="dashboard-main">
                <div className="dashboard-topbar">
                    <div className="dashboard-search">
                        <input
                            type="text"
                            placeholder="Search campaigns or requests..."
                            value={searchQuery}
                            onChange={(evt) => setSearchQuery(evt.target.value)}
                        />
                        {trimmedQuery && (
                            <div className="search-results">
                                {!hasSearchResults ? (
                                    <p className="search-no-results">No matches found.</p>
                                ) : (
                                    <>
                                        {matchedCampaigns.map((c) => (
                                            <Link
                                                key={c._id}
                                                to={`/campaigns/${c._id}`}
                                                className="search-result"
                                                onClick={() => setSearchQuery('')}
                                            >
                                                <span>{c.requestId?.title}</span>
                                                <small>Campaign · {c.status.replace(/_/g, ' ')}</small>
                                            </Link>
                                        ))}
                                        {matchedRequests.map((r) => (
                                            <Link
                                                key={r._id}
                                                to={`/requests/${r._id}`}
                                                className="search-result"
                                                onClick={() => setSearchQuery('')}
                                            >
                                                <span>{r.title}</span>
                                                <small>Request · {r.status}</small>
                                            </Link>
                                        ))}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <Link to="/profile" className="dashboard-account">
                        <span className="dashboard-avatar">{initials}</span>
                        <div>
                            <div>{user.username}</div>
                            <small>Client account</small>
                        </div>
                    </Link>
                </div>

                <h1>Welcome back, {user.username}!</h1>
                <p>Here's what's happening with your campaigns and requests.</p>

                <div className="dashboard-stats">
                    <div className="stat-item">
                        <div className="stat-label">
                            <span className="stat-dot stat-dot-teal" />
                            Active Campaigns
                        </div>
                        <p className="stat-value">{activeCampaigns.length}</p>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">
                            <span className="stat-dot stat-dot-red" />
                            Pending Requests
                        </div>
                        <p className="stat-value">{pendingRequests.length}</p>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">
                            <span className="stat-dot stat-dot-blue" />
                            Completed This Year
                        </div>
                        <p className="stat-value">{completedThisYear.length}</p>
                    </div>
                    <div className="stat-item">
                        <div className="stat-label">
                            <span className="stat-dot stat-dot-yellow" />
                            Total Budget Spent
                        </div>
                        <p className="stat-value">{totalBudgetSpent} <span className="stat-unit">BHD</span></p>
                    </div>
                </div>

                <div className="dashboard-panels">
                    <div className="dashboard-panel">
                        <h3>Recent Activity</h3>
                        {recentActivity.length === 0 ? (
                            <p>No recent activity.</p>
                        ) : (
                            <ul className="activity-list">
                                {recentActivity.map((item, i) => (
                                    <li key={i}>
                                        <span className="activity-dot" />
                                        <div>
                                            <div>{item.text}</div>
                                            <small>{item.date.toLocaleDateString()}</small>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="dashboard-panel">
                    <div className="panel-header">
                        <h3>Upcoming Deadlines</h3>
                        <Link to="/campaigns">View All</Link>
                    </div>
                    {upcomingDeadlines.length === 0 ? (
                        <p>No upcoming deadlines.</p>
                    ) : (
                        <table>
                            <thead>
                                <tr>
                                    <th>Campaign</th>
                                    <th>Type</th>
                                    <th>Due Date</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {upcomingDeadlines.map((c) => (
                                    <tr key={c._id}>
                                        <td>{c.requestId?.title}</td>
                                        <td>{c.requestId?.campaignType?.replace(/_/g, ' ')}</td>
                                        <td>{new Date(c.endDate).toLocaleDateString()}</td>
                                        <td><span className={`status-badge status-${c.status}`}>{c.status.replace(/_/g, ' ')}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>

                <div className="dashboard-panel">
                    <h3>Budget Utilization</h3>
                    <div className="budget-bar">
                        <div className="budget-bar-fill" style={{ width: `${Math.min(budgetUtilizationPct, 100)}%` }} />
                    </div>
                    <p>{totalBudgetSpent} BHD spent of {totalRequestedBudget} BHD requested ({budgetUtilizationPct}%)</p>
                </div>

                <div className="dashboard-panel">
                    <h3>Campaigns by Status</h3>
                    {campaigns.length === 0 ? (
                        <p>No campaigns yet.</p>
                    ) : (
                        <div className="chip-grid">
                            {campaignsByStatus.map(({ status, count }) => (
                                <div className="chip-card" key={status}>
                                    <p className="chip-label" style={{ color: STATUS_COLORS[status] }}>
                                        {status.replace(/_/g, ' ')}
                                    </p>
                                    <p className="chip-count">{count}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="dashboard-panel">
                    <h3>Campaign Types</h3>
                    {campaignsByType.length === 0 ? (
                        <p>No campaigns yet.</p>
                    ) : (
                        <div className="chip-grid">
                            {campaignsByType.map(([type, count], i) => (
                                <div className="chip-card" key={type}>
                                    <p className="chip-label" style={{ color: TYPE_COLORS[i % TYPE_COLORS.length] }}>
                                        {type.replace(/_/g, ' ')}
                                    </p>
                                    <p className="chip-count">{count}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="dashboard-panel">
                    <h3>Rejected Requests</h3>
                    {rejectedRequests.length === 0 ? (
                        <p>No rejected requests.</p>
                    ) : (
                        <ul className="breakdown-list">
                            {rejectedRequests.map((r) => (
                                <li key={r._id}>
                                    <div>
                                        <div>{r.title}</div>
                                        <small>{r.rejectedReason}</small>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </main>
    );
};

export default ClientDashboard;
