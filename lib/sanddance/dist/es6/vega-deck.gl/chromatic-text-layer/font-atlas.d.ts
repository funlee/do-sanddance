/// <reference types="luma.gl" />
export interface FontSettings {
    fontFamily?: string;
    fontWeight?: number;
    characterSet?: string | string[];
    fontSize?: number;
    buffer?: number;
    sdf?: boolean;
    radius?: number;
    cutoff?: number;
}
export declare const DEFAULT_CHAR_SET: string[];
export declare const DEFAULT_FONT_FAMILY = "Monaco, monospace";
export declare const DEFAULT_FONT_WEIGHT = "normal";
export declare const DEFAULT_FONT_SETTINGS: FontSettings;
interface Mapping {
    x: number;
    y: number;
    width: number;
    height: number;
    mask: boolean;
}
export declare function makeFontAtlas(gl: WebGLRenderingContext, fontSettings: FontSettings): {
    scale: number;
    mapping: {
        [char: string]: Mapping;
    };
    texture: import("luma.gl/webgl/texture-2d").default;
};
export {};
