

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.CLtgNf9_.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/xpUVlYYH.js","_app/immutable/chunks/CkYfXZ1F.js"];
export const stylesheets = [];
export const fonts = [];
