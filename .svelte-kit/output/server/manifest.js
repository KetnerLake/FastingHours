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
		client: {start:"_app/immutable/entry/start.Cqh1yW6i.js",app:"_app/immutable/entry/app.zJXnh3QU.js",imports:["_app/immutable/entry/start.Cqh1yW6i.js","_app/immutable/chunks/Ce9VwVdk.js","_app/immutable/chunks/fpJi1qvQ.js","_app/immutable/chunks/CgBZ2jj9.js","_app/immutable/entry/app.zJXnh3QU.js","_app/immutable/chunks/CgBZ2jj9.js","_app/immutable/chunks/fpJi1qvQ.js","_app/immutable/chunks/CWj6FrbW.js","_app/immutable/chunks/DmV43-3_.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
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
