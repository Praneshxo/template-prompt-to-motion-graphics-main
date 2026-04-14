"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PageLayout } from "../../components/PageLayout";
import { examples } from "../../examples/code";
import { Player } from "@remotion/player";
import { Play, ArrowRight } from "lucide-react";

export default function TemplatesPage() {
    const router = useRouter();
    const [hoveredId, setHoveredId] = useState<string | null>(null);

    const handleTemplateClick = (example: typeof examples[0]) => {
        // Navigate to generation page with templateId
        // We can also pass a prompt based on the template description
        const params = new URLSearchParams({
            templateId: example.id,
            prompt: example.description, // Optional: pre-fill prompt
        });
        router.push(`/generate?${params.toString()}`);
    };

    return (
        <PageLayout showLogoAsLink>
            <div className="flex flex-col gap-8 px-12 py-8 max-w-7xl mx-auto w-full">
                <div>
                    <h1 className="text-3xl font-bold text-foreground mb-2">Templates</h1>
                    <p className="text-muted-foreground text-lg">
                        Choose a template to start with.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {examples.map((example) => {
                        const isHovered = hoveredId === example.id;
                        const hasComponent = !!example.component;

                        return (
                            <div
                                key={example.id}
                                className="group relative bg-background-elevated border border-border rounded-xl overflow-hidden cursor-pointer hover:border-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                                onMouseEnter={() => setHoveredId(example.id)}
                                onMouseLeave={() => setHoveredId(null)}
                                onClick={() => handleTemplateClick(example)}
                            >
                                {/* Thumbnail / Player Area */}
                                <div className="aspect-video w-full bg-black relative flex items-center justify-center overflow-hidden">
                                    {hasComponent ? (
                                        <div className="w-full h-full">
                                            {/* Only play when hovered to save resources, or show paused at frame 30 */}
                                            <Player
                                                component={example.component!}
                                                durationInFrames={example.durationInFrames}
                                                fps={example.fps}
                                                compositionWidth={640}
                                                compositionHeight={360}
                                                style={{
                                                    width: "100%",
                                                    height: "100%",
                                                }}
                                                controls={false}
                                                autoPlay={isHovered}
                                                loop
                                                initialFrame={30} // Show a non-empty frame
                                                className="pointer-events-none" // Pass clicks to parent
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                            <div className="w-16 h-16 rounded-full bg-secondary/20 flex items-center justify-center">
                                                <Play className="w-6 h-6 ml-1" />
                                            </div>
                                            <span className="text-sm">Preview Unavailable</span>
                                        </div>
                                    )}

                                    {/* Hover Overlay */}
                                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200`}>
                                        <div className="bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                            Use Template <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </div>

                                {/* Info Area */}
                                <div className="p-4">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className="font-semibold text-lg text-foreground">{example.name}</h3>
                                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
                                            {example.category}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {example.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </PageLayout>
    );
}
