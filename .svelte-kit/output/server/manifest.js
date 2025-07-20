export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.svg","fh.svg","icon512_maskable.png","icon512_rounded.png","manifest.json"]),
	mimeTypes: {".svg":"image/svg+xml",".png":"image/png",".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.48cl5xQh.js",app:"_app/immutable/entry/app.37S1_ivR.js",imports:["_app/immutable/entry/start.48cl5xQh.js","_app/immutable/chunks/CWYmiI4r.js","_app/immutable/chunks/oT2D85Fd.js","_app/immutable/chunks/CuFKNimY.js","_app/immutable/entry/app.37S1_ivR.js","_app/immutable/chunks/CuFKNimY.js","_app/immutable/chunks/oT2D85Fd.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/C7XsMuZO.js","_app/immutable/chunks/Dw0E50vo.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js')),
			__memo(() => import('./nodes/3.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			},
			{
				id: "/history",
				pattern: /^\/history\/?$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 3 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
