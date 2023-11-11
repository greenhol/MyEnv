const CHARS = '0123456789abcdef';
const CHARS2 = 'abcdef';

export function getRandomColor(): string {
    const hexR = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    const hexG = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    const hexB = CHARS.charAt(Math.floor(Math.random() * CHARS.length));
    return `#${hexR}${hexG}${hexB}`;
}

export function getRandomGray(): string {
    const hex = CHARS.charAt(Math.floor(Math.random() * CHARS.length)) 
    return `#${hex}${hex}${hex}`;
}

export function getRandomRed(): string {
    const hex = CHARS2.charAt(Math.floor(Math.random() * CHARS2.length)) 
    return `#${hex}00`;
}
