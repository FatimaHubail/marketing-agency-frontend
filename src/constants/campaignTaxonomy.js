const CAMPAIGN_TYPES = [
    'social_media', 'sem', 'display', 'influencer',
    'content_marketing', 'email_marketing', 'brand_awareness',
    'print', 'ooh', 'event', 'broadcast', 'direct_mail', 'instore_activation',
    'product_launch', 'seo', 'pr',
];

const GOALS_BY_TYPE = {
    social_media: ['brand_awareness', 'engagement', 'follower_growth', 'lead_generation'],
    sem: ['website_traffic', 'lead_generation', 'conversions'],
    display: ['brand_awareness', 'retargeting', 'reach'],
    influencer: ['brand_awareness', 'engagement', 'launch_buzz'],
    content_marketing: ['seo_traffic', 'thought_leadership', 'lead_nurturing'],
    email_marketing: ['retention', 'reactivation', 'promotions'],
    brand_awareness: ['reach', 'impressions', 'brand_recall'],
    print: ['local_reach', 'product_awareness', 'event_promotion'],
    ooh: ['local_reach', 'brand_visibility'],
    event: ['lead_generation', 'brand_experience', 'launch_buzz'],
    broadcast: ['mass_reach', 'brand_awareness'],
    direct_mail: ['local_reach', 'retention', 'reactivation'],
    instore_activation: ['product_trial', 'conversion'],
    product_launch: ['launch_buzz', 'pre_orders', 'awareness'],
    seo: ['organic_traffic', 'site_conversions'],
    pr: ['media_coverage', 'reputation', 'crisis_response'],
};

export { CAMPAIGN_TYPES, GOALS_BY_TYPE };
