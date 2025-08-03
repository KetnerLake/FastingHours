import "clsx";
import { y as current_component, v as pop, t as push, z as bind_props, A as ensure_array_like, x as escape_html, F as attr_class } from "../../chunks/index.js";
import Dexie from "dexie";
function onDestroy(fn) {
  var context = (
    /** @type {Component} */
    current_component
  );
  (context.d ??= []).push(fn);
}
const stringToIcon = (value, validate, allowSimpleName, provider = "") => {
  const colonSeparated = value.split(":");
  if (value.slice(0, 1) === "@") {
    if (colonSeparated.length < 2 || colonSeparated.length > 3) {
      return null;
    }
    provider = colonSeparated.shift().slice(1);
  }
  if (colonSeparated.length > 3 || !colonSeparated.length) {
    return null;
  }
  if (colonSeparated.length > 1) {
    const name2 = colonSeparated.pop();
    const prefix = colonSeparated.pop();
    const result = {
      // Allow provider without '@': "provider:prefix:name"
      provider: colonSeparated.length > 0 ? colonSeparated[0] : provider,
      prefix,
      name: name2
    };
    return !validateIconName(result) ? null : result;
  }
  const name = colonSeparated[0];
  const dashSeparated = name.split("-");
  if (dashSeparated.length > 1) {
    const result = {
      provider,
      prefix: dashSeparated.shift(),
      name: dashSeparated.join("-")
    };
    return !validateIconName(result) ? null : result;
  }
  if (allowSimpleName && provider === "") {
    const result = {
      provider,
      prefix: "",
      name
    };
    return !validateIconName(result, allowSimpleName) ? null : result;
  }
  return null;
};
const validateIconName = (icon, allowSimpleName) => {
  if (!icon) {
    return false;
  }
  return !!// Check prefix: cannot be empty, unless allowSimpleName is enabled
  // Check name: cannot be empty
  ((allowSimpleName && icon.prefix === "" || !!icon.prefix) && !!icon.name);
};
const defaultIconDimensions = Object.freeze(
  {
    left: 0,
    top: 0,
    width: 16,
    height: 16
  }
);
const defaultIconTransformations = Object.freeze({
  rotate: 0,
  vFlip: false,
  hFlip: false
});
const defaultIconProps = Object.freeze({
  ...defaultIconDimensions,
  ...defaultIconTransformations
});
const defaultExtendedIconProps = Object.freeze({
  ...defaultIconProps,
  body: "",
  hidden: false
});
function mergeIconTransformations(obj1, obj2) {
  const result = {};
  if (!obj1.hFlip !== !obj2.hFlip) {
    result.hFlip = true;
  }
  if (!obj1.vFlip !== !obj2.vFlip) {
    result.vFlip = true;
  }
  const rotate = ((obj1.rotate || 0) + (obj2.rotate || 0)) % 4;
  if (rotate) {
    result.rotate = rotate;
  }
  return result;
}
function mergeIconData(parent, child) {
  const result = mergeIconTransformations(parent, child);
  for (const key in defaultExtendedIconProps) {
    if (key in defaultIconTransformations) {
      if (key in parent && !(key in result)) {
        result[key] = defaultIconTransformations[key];
      }
    } else if (key in child) {
      result[key] = child[key];
    } else if (key in parent) {
      result[key] = parent[key];
    }
  }
  return result;
}
function getIconsTree(data, names) {
  const icons = data.icons;
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  const resolved = /* @__PURE__ */ Object.create(null);
  function resolve(name) {
    if (icons[name]) {
      return resolved[name] = [];
    }
    if (!(name in resolved)) {
      resolved[name] = null;
      const parent = aliases[name] && aliases[name].parent;
      const value = parent && resolve(parent);
      if (value) {
        resolved[name] = [parent].concat(value);
      }
    }
    return resolved[name];
  }
  Object.keys(icons).concat(Object.keys(aliases)).forEach(resolve);
  return resolved;
}
function internalGetIconData(data, name, tree) {
  const icons = data.icons;
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  let currentProps = {};
  function parse(name2) {
    currentProps = mergeIconData(
      icons[name2] || aliases[name2],
      currentProps
    );
  }
  parse(name);
  tree.forEach(parse);
  return mergeIconData(data, currentProps);
}
function parseIconSet(data, callback) {
  const names = [];
  if (typeof data !== "object" || typeof data.icons !== "object") {
    return names;
  }
  if (data.not_found instanceof Array) {
    data.not_found.forEach((name) => {
      callback(name, null);
      names.push(name);
    });
  }
  const tree = getIconsTree(data);
  for (const name in tree) {
    const item = tree[name];
    if (item) {
      callback(name, internalGetIconData(data, name, item));
      names.push(name);
    }
  }
  return names;
}
const optionalPropertyDefaults = {
  provider: "",
  aliases: {},
  not_found: {},
  ...defaultIconDimensions
};
function checkOptionalProps(item, defaults) {
  for (const prop in defaults) {
    if (prop in item && typeof item[prop] !== typeof defaults[prop]) {
      return false;
    }
  }
  return true;
}
function quicklyValidateIconSet(obj) {
  if (typeof obj !== "object" || obj === null) {
    return null;
  }
  const data = obj;
  if (typeof data.prefix !== "string" || !obj.icons || typeof obj.icons !== "object") {
    return null;
  }
  if (!checkOptionalProps(obj, optionalPropertyDefaults)) {
    return null;
  }
  const icons = data.icons;
  for (const name in icons) {
    const icon = icons[name];
    if (
      // Name cannot be empty
      !name || // Must have body
      typeof icon.body !== "string" || // Check other props
      !checkOptionalProps(
        icon,
        defaultExtendedIconProps
      )
    ) {
      return null;
    }
  }
  const aliases = data.aliases || /* @__PURE__ */ Object.create(null);
  for (const name in aliases) {
    const icon = aliases[name];
    const parent = icon.parent;
    if (
      // Name cannot be empty
      !name || // Parent must be set and point to existing icon
      typeof parent !== "string" || !icons[parent] && !aliases[parent] || // Check other props
      !checkOptionalProps(
        icon,
        defaultExtendedIconProps
      )
    ) {
      return null;
    }
  }
  return data;
}
const dataStorage = /* @__PURE__ */ Object.create(null);
function newStorage(provider, prefix) {
  return {
    provider,
    prefix,
    icons: /* @__PURE__ */ Object.create(null),
    missing: /* @__PURE__ */ new Set()
  };
}
function getStorage(provider, prefix) {
  const providerStorage = dataStorage[provider] || (dataStorage[provider] = /* @__PURE__ */ Object.create(null));
  return providerStorage[prefix] || (providerStorage[prefix] = newStorage(provider, prefix));
}
function addIconSet(storage2, data) {
  if (!quicklyValidateIconSet(data)) {
    return [];
  }
  return parseIconSet(data, (name, icon) => {
    if (icon) {
      storage2.icons[name] = icon;
    } else {
      storage2.missing.add(name);
    }
  });
}
function addIconToStorage(storage2, name, icon) {
  try {
    if (typeof icon.body === "string") {
      storage2.icons[name] = { ...icon };
      return true;
    }
  } catch (err) {
  }
  return false;
}
let simpleNames = false;
function allowSimpleNames(allow) {
  {
    simpleNames = allow;
  }
  return simpleNames;
}
function addIcon(name, data) {
  const icon = stringToIcon(name, true, simpleNames);
  if (!icon) {
    return false;
  }
  const storage2 = getStorage(icon.provider, icon.prefix);
  if (data) {
    return addIconToStorage(storage2, icon.name, data);
  } else {
    storage2.missing.add(icon.name);
    return true;
  }
}
function addCollection(data, provider) {
  if (typeof data !== "object") {
    return false;
  }
  if (typeof provider !== "string") {
    provider = data.provider || "";
  }
  if (simpleNames && !provider && !data.prefix) {
    let added = false;
    if (quicklyValidateIconSet(data)) {
      data.prefix = "";
      parseIconSet(data, (name, icon) => {
        if (addIcon(name, icon)) {
          added = true;
        }
      });
    }
    return added;
  }
  const prefix = data.prefix;
  if (!validateIconName({
    prefix,
    name: "a"
  })) {
    return false;
  }
  const storage2 = getStorage(provider, prefix);
  return !!addIconSet(storage2, data);
}
const defaultIconSizeCustomisations = Object.freeze({
  width: null,
  height: null
});
const defaultIconCustomisations = Object.freeze({
  // Dimensions
  ...defaultIconSizeCustomisations,
  // Transformations
  ...defaultIconTransformations
});
"IconifyId" + Date.now().toString(16) + (Math.random() * 16777216 | 0).toString(16);
const storage = /* @__PURE__ */ Object.create(null);
function setAPIModule(provider, item) {
  storage[provider] = item;
}
function createAPIConfig(source) {
  let resources;
  if (typeof source.resources === "string") {
    resources = [source.resources];
  } else {
    resources = source.resources;
    if (!(resources instanceof Array) || !resources.length) {
      return null;
    }
  }
  const result = {
    // API hosts
    resources,
    // Root path
    path: source.path || "/",
    // URL length limit
    maxURL: source.maxURL || 500,
    // Timeout before next host is used.
    rotate: source.rotate || 750,
    // Timeout before failing query.
    timeout: source.timeout || 5e3,
    // Randomise default API end point.
    random: source.random === true,
    // Start index
    index: source.index || 0,
    // Receive data after time out (used if time out kicks in first, then API module sends data anyway).
    dataAfterTimeout: source.dataAfterTimeout !== false
  };
  return result;
}
const configStorage = /* @__PURE__ */ Object.create(null);
const fallBackAPISources = [
  "https://api.simplesvg.com",
  "https://api.unisvg.com"
];
const fallBackAPI = [];
while (fallBackAPISources.length > 0) {
  if (fallBackAPISources.length === 1) {
    fallBackAPI.push(fallBackAPISources.shift());
  } else {
    if (Math.random() > 0.5) {
      fallBackAPI.push(fallBackAPISources.shift());
    } else {
      fallBackAPI.push(fallBackAPISources.pop());
    }
  }
}
configStorage[""] = createAPIConfig({
  resources: ["https://api.iconify.design"].concat(fallBackAPI)
});
function addAPIProvider(provider, customConfig) {
  const config = createAPIConfig(customConfig);
  if (config === null) {
    return false;
  }
  configStorage[provider] = config;
  return true;
}
function getAPIConfig(provider) {
  return configStorage[provider];
}
const detectFetch = () => {
  let callback;
  try {
    callback = fetch;
    if (typeof callback === "function") {
      return callback;
    }
  } catch (err) {
  }
};
let fetchModule = detectFetch();
function calculateMaxLength(provider, prefix) {
  const config = getAPIConfig(provider);
  if (!config) {
    return 0;
  }
  let result;
  if (!config.maxURL) {
    result = 0;
  } else {
    let maxHostLength = 0;
    config.resources.forEach((item) => {
      const host = item;
      maxHostLength = Math.max(maxHostLength, host.length);
    });
    const url = prefix + ".json?icons=";
    result = config.maxURL - maxHostLength - config.path.length - url.length;
  }
  return result;
}
function shouldAbort(status) {
  return status === 404;
}
const prepare = (provider, prefix, icons) => {
  const results = [];
  const maxLength = calculateMaxLength(provider, prefix);
  const type = "icons";
  let item = {
    type,
    provider,
    prefix,
    icons: []
  };
  let length = 0;
  icons.forEach((name, index) => {
    length += name.length + 1;
    if (length >= maxLength && index > 0) {
      results.push(item);
      item = {
        type,
        provider,
        prefix,
        icons: []
      };
      length = name.length;
    }
    item.icons.push(name);
  });
  results.push(item);
  return results;
};
function getPath(provider) {
  if (typeof provider === "string") {
    const config = getAPIConfig(provider);
    if (config) {
      return config.path;
    }
  }
  return "/";
}
const send = (host, params, callback) => {
  if (!fetchModule) {
    callback("abort", 424);
    return;
  }
  let path = getPath(params.provider);
  switch (params.type) {
    case "icons": {
      const prefix = params.prefix;
      const icons = params.icons;
      const iconsList = icons.join(",");
      const urlParams = new URLSearchParams({
        icons: iconsList
      });
      path += prefix + ".json?" + urlParams.toString();
      break;
    }
    case "custom": {
      const uri = params.uri;
      path += uri.slice(0, 1) === "/" ? uri.slice(1) : uri;
      break;
    }
    default:
      callback("abort", 400);
      return;
  }
  let defaultError = 503;
  fetchModule(host + path).then((response) => {
    const status = response.status;
    if (status !== 200) {
      setTimeout(() => {
        callback(shouldAbort(status) ? "abort" : "next", status);
      });
      return;
    }
    defaultError = 501;
    return response.json();
  }).then((data) => {
    if (typeof data !== "object" || data === null) {
      setTimeout(() => {
        if (data === 404) {
          callback("abort", data);
        } else {
          callback("next", defaultError);
        }
      });
      return;
    }
    setTimeout(() => {
      callback("success", data);
    });
  }).catch(() => {
    callback("next", defaultError);
  });
};
const fetchAPIModule = {
  prepare,
  send
};
({
  ...defaultIconCustomisations
});
const monotoneProps = {
  "background-color": "currentColor"
};
const coloredProps = {
  "background-color": "transparent"
};
const propsToAdd = {
  image: "var(--svg)",
  repeat: "no-repeat",
  size: "100% 100%"
};
const propsToAddTo = {
  "-webkit-mask": monotoneProps,
  "mask": monotoneProps,
  "background": coloredProps
};
for (const prefix in propsToAddTo) {
  const list = propsToAddTo[prefix];
  for (const prop in propsToAdd) {
    list[prefix + "-" + prop] = propsToAdd[prop];
  }
}
allowSimpleNames(true);
setAPIModule("", fetchAPIModule);
if (typeof document !== "undefined" && typeof window !== "undefined") {
  const _window = window;
  if (_window.IconifyPreload !== void 0) {
    const preload = _window.IconifyPreload;
    const err = "Invalid IconifyPreload syntax.";
    if (typeof preload === "object" && preload !== null) {
      (preload instanceof Array ? preload : [preload]).forEach((item) => {
        try {
          if (
            // Check if item is an object and not null/array
            typeof item !== "object" || item === null || item instanceof Array || // Check for 'icons' and 'prefix'
            typeof item.icons !== "object" || typeof item.prefix !== "string" || // Add icon set
            !addCollection(item)
          ) {
            console.error(err);
          }
        } catch (e) {
          console.error(err);
        }
      });
    }
  }
  if (_window.IconifyProviders !== void 0) {
    const providers = _window.IconifyProviders;
    if (typeof providers === "object" && providers !== null) {
      for (let key in providers) {
        const err = "IconifyProviders[" + key + "] is invalid.";
        try {
          const value = providers[key];
          if (typeof value !== "object" || !value || value.resources === void 0) {
            continue;
          }
          if (!addAPIProvider(key, value)) {
            console.error(err);
          }
        } catch (e) {
          console.error(err);
        }
      }
    }
  }
}
function Icon($$payload, $$props) {
  push();
  const { $$slots, $$events, ...props } = $$props;
  onDestroy(() => {
  });
  {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function About($$payload, $$props) {
  let dialog = void 0;
  function close() {
    dialog.close();
  }
  function showModal() {
    dialog.showModal();
  }
  $$payload.out += `<dialog class="svelte-1v1n4fd"><h3 class="svelte-1v1n4fd">About</h3> <article class="svelte-1v1n4fd"><p>About.</p></article> <footer class="svelte-1v1n4fd"><button type="button" class="svelte-1v1n4fd">Done</button></footer></dialog>`;
  bind_props($$props, { close, showModal });
}
class Database {
  constructor() {
    this._db = new Dexie("FastingHours");
    this._db.version(20).stores({
      history: "id, started",
      hunger: "id, created",
      water: "id, created"
    });
  }
  browseHistory() {
    return this._db.history.toArray();
  }
  browseHistoryByEnd() {
    return this._db.history.toArray().then((data) => {
      const empties = data.filter((value) => value.ended === null ? true : false);
      return empties[0];
    });
  }
  readHistory(id) {
    return this._db.history.get({ id });
  }
  editHistory(item) {
    const clone = item;
    clone.updated = /* @__PURE__ */ new Date();
    return this._db.history.put(clone).then(() => this._db.history.get({ id: item.id }));
  }
  addHistory() {
    const item = {
      id: crypto.randomUUID(),
      type: "history",
      created: /* @__PURE__ */ new Date(),
      updated: /* @__PURE__ */ new Date(),
      started: /* @__PURE__ */ new Date(),
      ended: null,
      notes: null
    };
    return this._db.history.add(item).then(() => this._db.history.get({ id: item.id }));
  }
  deleteHistory(id) {
    return this._db.history.delete(id);
  }
  browseHunger(recent = false) {
    return this._db.hunger.toArray().then((data) => {
      if (recent) {
        data.sort((a, b) => {
          if (a.created.getTime() < b.created.getTime()) return 1;
          if (a.created.getTime() > b.created.getTime()) return -1;
          return 0;
        });
        return data.length === 0 ? null : data[0];
      }
      return data;
    });
  }
  readHunger(id) {
    return this._db.hunger.get({ id });
  }
  editHunger(item) {
    const clone = item;
    clone.updated = /* @__PURE__ */ new Date();
    return this._db.hunger.put(clone).then(() => this._db.hunger.get({ id: item.id }));
  }
  addHunger(level = 5) {
    const item = {
      id: crypto.randomUUID(),
      type: "hunger",
      created: /* @__PURE__ */ new Date(),
      updated: /* @__PURE__ */ new Date(),
      level
    };
    return this._db.hunger.add(item).then(() => this._db.hunger.get({ id: item.id }));
  }
  deleteHunger(id) {
    return this._db.hunger.delete(id);
  }
  browseWater(filter = false) {
    return this._db.water.toArray().then((data) => {
      if (filter) {
        const start = /* @__PURE__ */ new Date();
        start.setHours(0);
        start.setMinutes(0);
        start.setSeconds(0);
        start.setMilliseconds(0);
        const end = new Date(start.getTime());
        end.setDate(end.getDate() + 1);
        return data.filter((value) => value.created.getTime() > start.getTime() && value.created.getTime() < end.getTime() ? true : false);
      } else {
        return data;
      }
    });
  }
  readWater(id) {
    return this._db.water.get({ id });
  }
  editWater(item) {
    const clone = item;
    clone.updated = /* @__PURE__ */ new Date();
    return this._db.water.put(clone).then(() => this._db.water.get({ id: item.id }));
  }
  addWater(volume) {
    const item = {
      id: crypto.randomUUID(),
      type: "water",
      created: /* @__PURE__ */ new Date(),
      updated: /* @__PURE__ */ new Date(),
      volume
    };
    crypto.randomUUID();
    return this._db.water.add(item).then(() => this._db.water.get({ id: item.id }));
  }
  deleteWater(id) {
    return this._db.water.delete(id);
  }
}
function HungerEditor($$payload, $$props) {
  push();
  let {
    item = null,
    levels = [],
    oncancel,
    ondelete,
    onsave,
    units = "oz"
  } = $$props;
  let dialog = void 0;
  let current = item && item.level && item.level !== null ? item.level : 5;
  function close() {
    dialog.close();
  }
  function showModal() {
    dialog.showModal();
  }
  const each_array = ensure_array_like(levels);
  $$payload.out += `<dialog class="svelte-1gyfgoj"><h3 class="svelte-1gyfgoj">${escape_html(item && item.id && item.id !== null ? "Edit" : "Add")} Hunger</h3> <ul class="svelte-1gyfgoj"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let level = each_array[$$index];
    const icon = level.value === current ? "material-symbols:radio-button-checked-outline" : "material-symbols:circle-outline";
    $$payload.out += `<li class="svelte-1gyfgoj"><button type="button" class="svelte-1gyfgoj"><p class="svelte-1gyfgoj">${escape_html(level.label)}</p> `;
    Icon($$payload, {
      color: level.value === current ? "#0284c7" : "#161616",
      height: "20",
      icon,
      width: "20"
    });
    $$payload.out += `<!----></button></li>`;
  }
  $$payload.out += `<!--]--></ul> <footer class="svelte-1gyfgoj">`;
  if (item && item.id && item.id !== null) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button class="delete svelte-1gyfgoj" type="button">Delete</button>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <button class="cancel svelte-1gyfgoj" type="button">Cancel</button> <button type="button" class="svelte-1gyfgoj">Save</button></footer></dialog>`;
  bind_props($$props, { close, showModal });
  pop();
}
function WaterEditor($$payload, $$props) {
  push();
  let { item = null, oncancel, ondelete, onsave, units = "oz" } = $$props;
  let dialog = void 0;
  let sizes = [
    { value: 8, label: "Cup" },
    { value: 12, label: "Can" },
    { value: 16, label: "Bottle" },
    { value: 20, label: "Medium" },
    { value: 30, label: "Gatorade" },
    { value: 32, label: "Big Q" },
    { value: 44, label: "QT Large" },
    { value: 52, label: "Extra Large" }
  ];
  let volume = item && item.volume && item.volume !== null ? item.volume : 8;
  function close() {
    dialog.close();
  }
  function showModal() {
    dialog.showModal();
  }
  const each_array = ensure_array_like(sizes);
  $$payload.out += `<dialog class="svelte-1sbih0z"><h3 class="svelte-1sbih0z">${escape_html(item && item.id && item.id !== null ? "Edit" : "Add")} Water</h3> <ul class="svelte-1sbih0z"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let size = each_array[$$index];
    const icon = size.value === volume ? "material-symbols:radio-button-checked-outline" : "material-symbols:circle-outline";
    $$payload.out += `<li class="svelte-1sbih0z"><button type="button" class="svelte-1sbih0z"><p class="svelte-1sbih0z">${escape_html(size.label)}</p> <p class="svelte-1sbih0z">${escape_html(size.value)} ${escape_html(units)}</p> `;
    Icon($$payload, {
      color: size.value === volume ? "#0284c7" : "#161616",
      height: "20",
      icon,
      width: "20"
    });
    $$payload.out += `<!----></button></li>`;
  }
  $$payload.out += `<!--]--></ul> <footer class="svelte-1sbih0z">`;
  if (item && item.id && item.id !== null) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button class="delete svelte-1sbih0z" type="button">Delete</button>`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--> <button class="cancel svelte-1sbih0z" type="button">Cancel</button> <button type="button" class="svelte-1sbih0z">Save</button></footer></dialog>`;
  bind_props($$props, { close, showModal });
  pop();
}
function Fasting($$payload, $$props) {
  push();
  let { levels = [] } = $$props;
  const db = new Database();
  let heditor = void 0;
  let level = 5;
  let water = 0;
  let weditor = void 0;
  let hunger = (() => {
    const item = levels.find((current) => current.value === level ? true : false);
    return item.label;
  })();
  function onHungerSave(value) {
    console.log(value);
    heditor.close();
    db.addHunger(value.level).then((item) => level = item.level);
  }
  function onWaterSave(value) {
    weditor.close();
    db.addWater(value.volume).then((item) => db.browseWater(true)).then((data) => {
      const total = data.reduce(
        (previous, current) => {
          return previous + current.volume;
        },
        0
      );
      water = total;
    });
  }
  $$payload.out += `<section class="svelte-motaez"><article class="svelte-motaez">`;
  {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p class="svelte-motaez">You are not fasting.</p>`;
  }
  $$payload.out += `<!--]--> <button class="primary svelte-motaez" type="button">${escape_html("Start")} fasting</button></article> <footer class="svelte-motaez"><button class="hunger secondary svelte-motaez" type="button">`;
  Icon($$payload, {
    height: "20",
    icon: "material-symbols:fork-spoon-rounded",
    width: "20"
  });
  $$payload.out += `<!----> <span>${escape_html(hunger)}</span></button> <button class="water secondary svelte-motaez" type="button">`;
  Icon($$payload, {
    height: "20",
    icon: "material-symbols:water-drop-outline-rounded",
    width: "20"
  });
  $$payload.out += `<!----> <span>${escape_html(water)} oz</span></button></footer> `;
  HungerEditor($$payload, { levels, level, onsave: onHungerSave });
  $$payload.out += `<!----> `;
  WaterEditor($$payload, { onsave: onWaterSave });
  $$payload.out += `<!----></section>`;
  pop();
}
function RadioGroup($$payload, $$props) {
  push();
  let { selected = 0 } = $$props;
  $$payload.out += `<ul class="svelte-tu3q0a"><li><button${attr_class("fasting svelte-tu3q0a", void 0, { "selected": selected === 0 ? true : false })} type="button">Fasting</button></li> <li><button${attr_class("hours svelte-tu3q0a", void 0, { "selected": selected === 1 ? true : false })} type="button">Hours</button></li></ul>`;
  pop();
}
function _page($$payload) {
  let levels = [
    { value: 1, label: "Starving" },
    { value: 2, label: "Very hungry" },
    { value: 3, label: "Pretty hungry" },
    { value: 4, label: "Snacky" },
    { value: 5, label: "Satisfied" },
    { value: 6, label: "Slightly full" },
    { value: 7, label: "Uncomfortable" },
    { value: 8, label: "Stuffed" },
    { value: 9, label: "Stomach aches" },
    { value: 10, label: "Sick" }
  ];
  let selected = 0;
  $$payload.out += `<main class="svelte-zgf5uf"><header class="svelte-zgf5uf"><span></span> `;
  RadioGroup($$payload, { selected });
  $$payload.out += `<!----> <button type="button" class="svelte-zgf5uf">`;
  Icon($$payload, {
    height: "20",
    icon: "material-symbols:question-mark-rounded",
    width: "20"
  });
  $$payload.out += `<!----></button></header> `;
  {
    $$payload.out += "<!--[-->";
    Fasting($$payload, { levels });
  }
  $$payload.out += `<!--]--></main> `;
  About($$payload, {});
  $$payload.out += `<!---->`;
}
export {
  _page as default
};
