import { PixabayImageHit } from './pixabay-image-hit';

export interface PixabayImageSearchResponse {
    hits: PixabayImageHit[];
    total: number;
    totalHits: number;
}
