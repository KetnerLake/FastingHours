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
		client: {start:"_app/immutable/entry/start.usCKmC2W.js",app:"_app/immutable/entry/app.BIoulmzw.js",imports:["_app/immutable/entry/start.usCKmC2W.js","_app/immutable/chunks/CszRBDtk.js","_app/immutable/chunks/CBHc2I-Z.js","_app/immutable/chunks/xpUVlYYH.js","_app/immutable/chunks/CKPaqtM9.js","_app/immutable/chunks/CkYfXZ1F.js","_app/immutable/entry/app.BIoulmzw.js","_app/immutable/chunks/xpUVlYYH.js","_app/immutable/chunks/CBHc2I-Z.js","_app/immutable/chunks/CKPaqtM9.js","_app/immutable/chunks/CkYfXZ1F.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/JuW1Ovd6.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
