

export const index = 3;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/single/_page.svelte.js')).default;
export const imports = ["_app/immutable/nodes/3.BzKVYVu7.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DRc7Yoe1.js","_app/immutable/chunks/DsYsQ4cv.js","_app/immutable/chunks/bqaKyPmf.js"];
export const stylesheets = ["_app/immutable/assets/3.CH9iC10e.css"];
export const fonts = [];
