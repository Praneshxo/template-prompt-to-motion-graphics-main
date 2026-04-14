import { AbsoluteFill, Sequence } from 'remotion';
import { TitleCardTemplate } from '../../reftemplate/TitleCardTemplate';
import { BulletedListTemplate } from '../../reftemplate/BulletedListTemplate';
import { StatisticTemplate } from '../../reftemplate/StatisticTemplate';
import { InfographicTemplate } from '../../reftemplate/InfographicTemplate';
import { ComparisonTemplate } from '../../reftemplate/ComparisonTemplate';

export const MyAnimation = () => {
    return (
        <AbsoluteFill style={{ backgroundColor: '#ffffff' }}>
            {/* Scene 1: Title Card - 90 frames */}
            <Sequence from={0} durationInFrames={90}>
                <div style={{ backgroundColor: '#ffffff' }}>
                    <TitleCardTemplate
                        title="World War 1"
                        subtitle="The Great War (1914-1918)"
                    />
                </div>
            </Sequence>

            {/* Scene 2: Key Causes - 180 frames */}
            <Sequence from={90} durationInFrames={180}>
                <div style={{ backgroundColor: '#ffffff' }}>
                    <BulletedListTemplate
                        heading="Key Causes of WW1"
                        items={[
                            { text: 'Militarism and arms race' },
                            { text: 'Alliance systems across Europe' },
                            { text: 'Imperialism and colonial rivalries' },
                            { text: 'Nationalism and ethnic tensions' },
                            { text: 'Assassination of Archduke Franz Ferdinand' }
                        ]}
                    />
                </div>
            </Sequence>

            {/* Scene 3: Devastating Statistics - 120 frames */}
            <Sequence from={270} durationInFrames={120}>
                <div style={{ backgroundColor: '#ffffff' }}>
                    <StatisticTemplate
                        statNumber="17M+"
                        statLabel="Total Deaths"
                        description="Over 17 million military and civilian casualties during the war"
                    />
                </div>
            </Sequence>

            {/* Scene 4: Major Battles - 180 frames */}
            <Sequence from={390} durationInFrames={180}>
                <div style={{ backgroundColor: '#ffffff' }}>
                    <InfographicTemplate
                        title="Major Battles"
                        infographicItems={[
                            { title: 'Battle of the Somme', description: '1916' },
                            { title: 'Battle of Verdun', description: '1916' },
                            { title: 'Battle of Gallipoli', description: '1915' }
                        ]}
                    />
                </div>
            </Sequence>

            {/* Scene 5: Before vs After - 180 frames */}
            <Sequence from={570} durationInFrames={180}>
                <div style={{ backgroundColor: '#ffffff' }}>
                    <ComparisonTemplate
                        heading="Impact of World War 1"
                        comparisons={[
                            {
                                challenge: '4 major empires ruled Europe',
                                solution: 'Empires collapsed, new nations emerged'
                            },
                            {
                                challenge: 'Traditional warfare tactics',
                                solution: 'Modern mechanized warfare'
                            },
                            {
                                challenge: 'European dominance',
                                solution: 'Rise of USA as superpower'
                            }
                        ]}
                    />
                </div>
            </Sequence>
        </AbsoluteFill>
    );
};
