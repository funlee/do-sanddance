/// <reference types="deck.gl" />
import { Color } from '@deck.gl/core/utils/color';
/**
 * Compares 2 colors to see if they are equal.
 * @param a Color to compare
 * @param b Color to compare
 * @returns True if colors are equal.
 */
export declare function colorIsEqual(a: Color, b: Color): boolean;
/**
 * Convert a CSS color string to a Deck.gl Color array - (The rgba color of each object, in r, g, b, [a]. Each component is in the 0-255 range.).
 * @param cssColorSpecifier A CSS Color Module Level 3 specifier string.
 */
export declare function colorFromString(cssColorSpecifier: string): Color;
/**
 * Convert a Deck.gl color to a CSS rgba() string.
 * @param color A Deck.gl Color array - (The rgba color of each object, in r, g, b, [a]. Each component is in the 0-255 range.)
 */
export declare function colorToString(color: Color): string;
export declare function desaturate(color: Color, value: number): Color;
export declare function isColor(cssColorSpecifier: string): boolean;
