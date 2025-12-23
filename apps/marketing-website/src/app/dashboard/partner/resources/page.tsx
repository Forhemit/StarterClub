import { getPartnerResources } from '@/app/actions/resources';
import { FileText, Download, ExternalLink, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default async function ResourcesPage({
  searchParams,
}: {
  searchParams: Promise<{ track?: string }>
}) {
    const params = await searchParams;
    const currentTrack = params.track || 'all';
    const resources = await getPartnerResources(currentTrack);

    const tracks = ['all', 'banks', 'insurance', 'hardware', 'saas', 'shared'];

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-foreground tracking-tight">Resource Library</h1>
                <p className="text-muted-foreground mt-1">Operational guides, templates, and mission-critical assets.</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-8">
                <div className="flex flex-wrap gap-2">
                    {tracks.map((t) => (
                        <Link 
                            key={t} 
                            href={`/dashboard/partner/resources?track=${t}`}
                            className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${
                                currentTrack === t 
                                    ? 'bg-primary text-primary-foreground border-primary shadow-sm' 
                                    : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                            }`}
                        >
                            {t}
                        </Link>
                    ))}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    <Filter className="h-3 w-3" />
                    <span>Filter By Track</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {resources && resources.length > 0 ? (
                    resources.map((resource) => (
                        <div key={resource.id} className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all flex flex-col group">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <Badge variant="outline" className="uppercase text-[10px] tracking-widest font-bold">
                                    {resource.type}
                                </Badge>
                            </div>
                            
                            <h3 className="font-bold text-foreground mb-2 line-clamp-2 leading-tight">{resource.title}</h3>
                            <p className="text-muted-foreground text-sm mb-6 line-clamp-3 flex-1 leading-relaxed">
                                {resource.description}
                            </p>

                            <div className="flex items-center gap-4 mt-auto">
                                <Button asChild variant="default" className="flex-1 gap-2 text-xs font-bold uppercase tracking-wider h-9">
                                    <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                                        {resource.type === 'link' ? <ExternalLink className="h-3.5 w-3.5" /> : <Download className="h-3.5 w-3.5" />}
                                        {resource.type === 'link' ? 'Open' : 'Download'}
                                    </a>
                                </Button>
                                {resource.file_size && (
                                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">
                                        {resource.file_size}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-24 text-center border-2 border-dashed border-border rounded-2xl bg-muted/30">
                        <div className="bg-background w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <FileText className="h-8 w-8 text-muted/30" />
                        </div>
                        <h3 className="text-lg font-bold text-foreground">No resources found</h3>
                        <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-1">
                            We couldn't find any assets in the "{currentTrack}" track. Try a different category.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
