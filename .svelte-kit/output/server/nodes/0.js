

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.tseZQuh7.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/CuFKNimY.js"];
export const stylesheets = [];
export const fonts = [];
