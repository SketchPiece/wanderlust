import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { ClassValue } from 'clsx';

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function avatarUrl(userId: string) {
	return `https://api.dicebear.com/6.x/notionists-neutral/svg?seed=${userId}&flip=true&backgroundColor=ffdfbf,ffd5dc,d1d4f9,c0aede,b6e3f4`;
}
