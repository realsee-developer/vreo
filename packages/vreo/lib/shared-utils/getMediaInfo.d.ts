export default function getMediaInfo(fileUrl: string): Promise<{
    duration?: number | undefined;
    type?: 'video' | 'audio' | 'image' | 'unknown' | undefined;
    error?: string | undefined;
}>;
export declare function getMediaType(url?: string): "video" | "audio" | "image" | "unknown";
export declare function getMediaTypeByExpandedName(fileExpandedName?: string | null): "video" | "audio" | "image" | "unknown";
export declare function getMediaTypeByUrl(fileUrl?: string | null): "video" | "audio" | "image" | "unknown" | undefined;
export declare function getFileName(fileUrl?: string): string;
