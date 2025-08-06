export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["ads.txt","favicon.svg","fh.svg","icon512_maskable.png","icon512_rounded.png","manifest.json"]),
	mimeTypes: {".txt":"text/plain",".svg":"image/svg+xml",".png":"image/png",".json":"application/json"},
	_: {
		client: {start:"_app/immutable/entry/start.CamHtiN0.js",app:"_app/immutable/entry/app.BdyEZNml.js",imports:["_app/immutable/entry/start.CamHtiN0.js","_app/immutable/chunks/pt0Tx2s6.js","_app/immutable/chunks/Bw5SblC_.js","_app/immutable/chunks/DRc7Yoe1.js","_app/immutable/chunks/DsYsQ4cv.js","_app/immutable/chunks/DwONyYkV.js","_app/immutable/entry/app.BdyEZNml.js","_app/immutable/chunks/DRc7Yoe1.js","_app/immutable/chunks/Bw5SblC_.js","_app/immutable/chunks/DsYsQ4cv.js","_app/immutable/chunks/DwONyYkV.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/C0Ly_kSk.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
				id: "/single",
				pattern: /^\/single\/?$/,
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
