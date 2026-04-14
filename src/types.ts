// Type definitions for reftemplate components

export interface BulletPoint {
    text: string;
    visuals?: {
        image?: string;
    };
}

export interface BulletedListTemplateProps {
    heading: string;
    items: BulletPoint[];
}

export interface StatisticTemplateProps {
    statNumber: string;
    statLabel: string;
    description: string;
}

export interface InfographicItem {
    title: string;
    description: string;
}

export interface InfographicTemplateProps {
    title: string;
    infographicItems: InfographicItem[];
}

export interface ComparisonItem {
    challenge: string;
    solution: string;
}

export interface ComparisonTemplateProps {
    heading: string;
    comparisons: ComparisonItem[];
}

export interface BehindTheScenesTemplateProps {
    title: string;
    description: string;
}

export interface FeatureHighlightTemplateProps {
    title: string;
    features: string[];
}
