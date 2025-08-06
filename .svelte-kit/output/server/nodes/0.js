

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.ULSFbA5S.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DRc7Yoe1.js","_app/immutable/chunks/DwONyYkV.js"];
export const stylesheets = [];
export const fonts = [];
