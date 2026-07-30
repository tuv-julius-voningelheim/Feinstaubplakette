import Color from 'colorjs.io';

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));
const pad2 = (n: number) => n.toString(16).padStart(2, '0');

function hsvToRgb(h: number, s: number, v: number) {
    s /= 100;
    v /= 100;
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r: number, g: number, b: number;
    const i = Math.floor(h / 60) % 6;
    if (i === 0) {
        r = c;
        g = x;
        b = 0;
    } else if (i === 1) {
        r = x;
        g = c;
        b = 0;
    } else if (i === 2) {
        r = 0;
        g = c;
        b = x;
    } else if (i === 3) {
        r = 0;
        g = x;
        b = c;
    } else if (i === 4) {
        r = x;
        g = 0;
        b = c;
    } else {
        r = c;
        g = 0;
        b = x;
    }
    return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

function rgbToHsv(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        d = max - min;
    let h = 0;
    if (d !== 0) {
        switch (max) {
            case r:
                h = ((g - b) / d) % 6;
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
    }
    h = Math.round((h < 0 ? h + 6 : h) * 60);
    const s = max === 0 ? 0 : d / max,
        v = max;
    return { h, s: Math.round(s * 100), v: Math.round(v * 100) };
}

function rgbToHsl(r: number, g: number, b: number) {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b),
        min = Math.min(r, g, b),
        l = (max + min) / 2,
        d = max - min;
    let h = 0,
        s = 0;
    if (d !== 0) {
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h *= 60;
    }
    return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hexaFromRgb(r: number, g: number, b: number, a: number) {
    const ai = Math.round(clamp01(a) * 255);
    return `#${pad2(r)}${pad2(g)}${pad2(b)}${pad2(ai)}`;
}

function hexFromRgb(r: number, g: number, b: number) {
    return `#${pad2(r)}${pad2(g)}${pad2(b)}`;
}

function parseHsva(input: string) {
    const m = input.trim().match(/^hsva?\(\s*([\d.]+)\s*,\s*([\d.]+)%\s*,\s*([\d.]+)%\s*(?:,\s*([\d.]+)\s*)?\)$/i);
    if (!m) return null;
    const h = Number(m[1]),
        s = Number(m[2]),
        v = Number(m[3]),
        a = m[4] !== undefined ? Number(m[4]) : 1;
    return { h, s, v, a };
}

export function parseColor(colorString: string, letterCase: (s: string) => string) {
    let a: number, r: number, g: number, b: number;
    let hsv: { h: number; s: number; v: number };
    const hsva = parseHsva(colorString);
    if (hsva) {
        const { h, s, v } = hsva;
        ({ r, g, b } = hsvToRgb(h, s, v));
        a = hsva.a;
        hsv = { h: isNaN(h) ? 0 : h, s: isNaN(s) ? 0 : s, v: isNaN(v) ? 0 : v };
    } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let c: any;
        try {
            c = new Color(colorString);
        } catch {
            c = null;
        }
        if (!c) return null;
        const srgb = c.to('srgb');
        const [R, G, B] = srgb.coords;
        r = Math.round(clamp01(R) * 255);
        g = Math.round(clamp01(G) * 255);
        b = Math.round(clamp01(B) * 255);
        a = clamp01(c.alpha);
        hsv = rgbToHsv(r, g, b);
    }
    const hsl = rgbToHsl(r, g, b);
    const hex = hexFromRgb(r, g, b);
    const hexa = hexaFromRgb(r, g, b, a);
    return {
        hsl: { h: hsl.h, s: hsl.s, l: hsl.l, string: letterCase(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`) },
        hsla: {
            h: hsl.h,
            s: hsl.s,
            l: hsl.l,
            a: a,
            string: letterCase(`hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a.toFixed(2)})`),
        },
        hsv: { h: hsv.h, s: hsv.s, v: hsv.v, string: letterCase(`hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`) },
        hsva: {
            h: hsv.h,
            s: hsv.s,
            v: hsv.v,
            a: a,
            string: letterCase(`hsva(${hsv.h}, ${hsv.s}%, ${hsv.v}%, ${a.toFixed(2)})`),
        },
        rgb: { r, g, b, string: letterCase(`rgb(${r}, ${g}, ${b})`) },
        rgba: { r, g, b, a, string: letterCase(`rgba(${r}, ${g}, ${b}, ${a.toFixed(2)})`) },
        hex: letterCase(hex),
        hexa: letterCase(hexa),
    };
}

export function getHexString(h: number, s: number, v: number, a = 100) {
    const { r, g, b } = hsvToRgb(h, s, v);
    return hexaFromRgb(r, g, b, a / 100);
}
