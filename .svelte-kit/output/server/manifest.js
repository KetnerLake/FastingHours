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
		client: {start:"_app/immutable/entry/start.CDS52JkO.js",app:"_app/immutable/entry/app.Oo73vmZV.js",imports:["_app/immutable/entry/start.CDS52JkO.js","_app/immutable/chunks/DWHX3qmY.js","_app/immutable/chunks/BABE4o77.js","_app/immutable/chunks/DmV08jv2.js","_app/immutable/entry/app.Oo73vmZV.js","_app/immutable/chunks/DmV08jv2.js","_app/immutable/chunks/BABE4o77.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/Dwp_Tzt4.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
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
