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
		client: {start:"_app/immutable/entry/start.Wt_5WkrQ.js",app:"_app/immutable/entry/app.CCVbyWNp.js",imports:["_app/immutable/entry/start.Wt_5WkrQ.js","_app/immutable/chunks/OEiBBBpp.js","_app/immutable/chunks/BBZTakrf.js","_app/immutable/chunks/JrvXgJed.js","_app/immutable/entry/app.CCVbyWNp.js","_app/immutable/chunks/JrvXgJed.js","_app/immutable/chunks/BBZTakrf.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/BpwAfYwA.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
