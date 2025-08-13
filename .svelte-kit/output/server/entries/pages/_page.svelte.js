import { y as current_component, v as pop, t as push, z as attr_class, A as ensure_array_like, x as escape_html, F as attr_style, G as attr, J as bind_props } from "../../chunks/index.js";
import "clsx";
import Dexie from "dexie";
import daylight from "suncalc";
function onDestroy(fn) {
  var context = (
    /** @type {Component} */
    current_component
  );
  (context.d ??= []).push(fn);
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
function DurationGroup($$payload, $$props) {
  push();
  let { value = 0 } = $$props;
  $$payload.out += `<div class="svelte-ziixid"><button type="button"${attr_class("svelte-ziixid", void 0, { "selected": value === 0 ? true : false })}>`;
  Icon($$payload, { height: "20", icon: "stash:infinity-duotone", width: "20" });
  $$payload.out += `<!----></button> <button type="button"${attr_class("svelte-ziixid", void 0, { "selected": value === 14 ? true : false })}>14h</button> <button type="button"${attr_class("svelte-ziixid", void 0, { "selected": value === 16 ? true : false })}>16h</button> <button type="button"${attr_class("svelte-ziixid", void 0, { "selected": value === 23 ? true : false })}>23h</button> <button type="button"${attr_class("svelte-ziixid", void 0, { "selected": value === 40 ? true : false })}>40h</button></div>`;
  pop();
}
function ActivityGraph($$payload, $$props) {
  push();
  let { average = [], daily = null } = $$props;
  function formatLabel(value) {
    value = /* @__PURE__ */ new Date(value + "T00:00:00");
    const formatter = new Intl.DateTimeFormat(navigator.language, { month: "short", day: "numeric" });
    return formatter.format(value);
  }
  function offset(hour, status) {
    if (hour === 0 || status[hour - 1] === 0) {
      return (1 - status[hour]) * 100 + "%";
    }
    return 0;
  }
  const each_array_2 = ensure_array_like({ length: 24 });
  $$payload.out += `<figure class="svelte-z94qzf"><div class="labels svelte-z94qzf"><p class="date svelte-z94qzf">Date</p> <p class="hour svelte-z94qzf">0</p> <p class="hour svelte-z94qzf">12</p> <p class="hour svelte-z94qzf">24</p></div> <div class="grid svelte-z94qzf">`;
  if (daily !== null) {
    $$payload.out += "<!--[-->";
    const each_array = ensure_array_like(Object.keys(daily));
    $$payload.out += `<!--[-->`;
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let day = each_array[$$index_1];
      const status = daily[day];
      const each_array_1 = ensure_array_like({ length: 24 });
      $$payload.out += `<p class="day svelte-z94qzf">${escape_html(formatLabel(day))}</p> <!--[-->`;
      for (let hour = 0, $$length2 = each_array_1.length; hour < $$length2; hour++) {
        $$payload.out += `<div class="day svelte-z94qzf">`;
        if (status[hour] !== 0) {
          $$payload.out += "<!--[-->";
          $$payload.out += `<div class="hour svelte-z94qzf"${attr_style("", {
            "margin-left": offset(hour, status),
            width: 100 * status[hour] + "%"
          })}></div>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--></div>`;
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]-->`;
  } else {
    $$payload.out += "<!--[!-->";
  }
  $$payload.out += `<!--]--></div> <div class="average grid svelte-z94qzf"><p class="day svelte-z94qzf">Avg</p> <!--[-->`;
  for (let hour = 0, $$length = each_array_2.length; hour < $$length; hour++) {
    $$payload.out += `<div class="day svelte-z94qzf"><div class="hour svelte-z94qzf"${attr_style("", { opacity: average[hour], width: "100%" })}></div></div>`;
  }
  $$payload.out += `<!--]--></div></figure>`;
  pop();
}
function GraphSelect($$payload, $$props) {
  push();
  let { items = [], value = 0 } = $$props;
  let open = false;
  let icon = items.length > 0 ? items[value].icon : "";
  let label = items.length > 0 ? items[value].label : "";
  const each_array = ensure_array_like(items);
  $$payload.out += `<label class="svelte-dpktq5"><button type="button" class="svelte-dpktq5">`;
  Icon($$payload, { height: "20", icon, width: "20" });
  $$payload.out += `<!----> <span class="svelte-dpktq5">${escape_html(label)}</span> `;
  Icon($$payload, {
    height: "20",
    icon: "material-symbols:keyboard-arrow-down-rounded",
    width: "20"
  });
  $$payload.out += `<!----></button> <ul${attr_class("svelte-dpktq5", void 0, { "open": open })}><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let item = each_array[$$index];
    $$payload.out += `<li${attr_class("svelte-dpktq5", void 0, { "selected": value === item.value ? true : false })}><button type="button" class="svelte-dpktq5">`;
    Icon($$payload, { height: "20", icon: item.icon, width: "20" });
    $$payload.out += `<!----> <span class="svelte-dpktq5">${escape_html(item.label)}</span> `;
    if (item.value === value) {
      $$payload.out += "<!--[-->";
      Icon($$payload, {
        height: "20",
        icon: "material-symbols:check-rounded",
        width: "20"
      });
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></button></li>`;
  }
  $$payload.out += `<!--]--></ul></label>`;
  pop();
}
function GraphSection($$payload, $$props) {
  push();
  let { activity = null, days = 10, onsun, sun, water = null } = $$props;
  const options = [
    {
      icon: "material-symbols:local-fire-department-outline-rounded",
      label: "Fasting",
      value: 0
    },
    {
      icon: "material-symbols:water-drop-outline-rounded",
      label: "Water",
      value: 1
    }
  ];
  function formatTime(value) {
    const formatter = new Intl.DateTimeFormat(navigator.language, { hour: "numeric", minute: "2-digit" });
    return formatter.format(value);
  }
  $$payload.out += `<section class="svelte-wl8176">`;
  {
    $$payload.out += "<!--[-->";
    ActivityGraph($$payload, {
      average: activity && activity.average ? activity.average : [],
      daily: activity && activity.daily ? activity.daily : []
    });
  }
  $$payload.out += `<!--]--> <footer class="svelte-wl8176"><div class="daynight svelte-wl8176">`;
  if (sun === null) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<button class="sun svelte-wl8176" type="button">Sunrise/sunset</button>`;
  } else {
    $$payload.out += "<!--[!-->";
    Icon($$payload, {
      height: "16",
      icon: sun && sun.icon ? sun.icon : null,
      width: "16"
    });
    $$payload.out += `<!----> <p class="svelte-wl8176">${escape_html(sun && sun.timing ? formatTime(sun.timing) : "")}</p>`;
  }
  $$payload.out += `<!--]--></div> `;
  GraphSelect($$payload, {
    items: options
  });
  $$payload.out += `<!----></footer></section>`;
  pop();
}
function HungerButton($$payload, $$props) {
  push();
  let { items = [], value = 5 } = $$props;
  let open = false;
  let label = (() => {
    const match = items.find((current) => current.value === value ? true : false);
    return match.label;
  })();
  const each_array = ensure_array_like(items);
  $$payload.out += `<label class="svelte-a6ycms"><button type="button" class="svelte-a6ycms">`;
  Icon($$payload, {
    height: "20",
    icon: "material-symbols:fork-spoon-rounded",
    width: "20"
  });
  $$payload.out += `<!----> <span class="svelte-a6ycms">${escape_html(label)}</span> `;
  Icon($$payload, {
    height: "20",
    icon: "material-symbols:keyboard-arrow-down-rounded",
    width: "20"
  });
  $$payload.out += `<!----></button> <ul${attr_class("svelte-a6ycms", void 0, { "open": open })}><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let item = each_array[$$index];
    $$payload.out += `<li class="svelte-a6ycms"><button type="button" class="svelte-a6ycms"><span class="svelte-a6ycms">${escape_html(item.label)}</span></button></li>`;
  }
  $$payload.out += `<!--]--></ul></label>`;
  pop();
}
function Timer($$payload, $$props) {
  push();
  let { duration = 0, now = null, started = null } = $$props;
  let difference = (() => {
    let distance = Math.floor((now - started.getTime()) / 1e3);
    if (duration !== 0) {
      const future = new Date(started.getTime() + duration * 36e5);
      distance = Math.floor((future.getTime() - now) / 1e3);
    }
    return distance;
  })();
  let tick = (() => {
    if (started === null) {
      return { hours: 0, minutes: "00", seconds: "00" };
    }
    return {
      hours: Math.floor(difference / 3600).toString(10).padStart(2, "0"),
      minutes: Math.floor(difference % 3600 / 60).toString(10).padStart(2, "0"),
      seconds: (difference % 60).toString(10).padStart(2, "0")
    };
  })();
  $$payload.out += `<article${attr_class("svelte-1yn3hhw", void 0, { "complete": difference < 0 ? true : false })}><p class="svelte-1yn3hhw"><span class="svelte-1yn3hhw">${escape_html(tick.hours)}</span> <span class="units svelte-1yn3hhw">hrs</span></p> <p class="colon svelte-1yn3hhw">:</p> <p class="svelte-1yn3hhw"><span class="svelte-1yn3hhw">${escape_html(tick.minutes)}</span> <span class="units svelte-1yn3hhw">min</span></p> <p class="colon svelte-1yn3hhw">:</p> <p class="svelte-1yn3hhw"><span class="svelte-1yn3hhw">${escape_html(tick.seconds)}</span> <span class="units svelte-1yn3hhw">sec</span></p></article>`;
  pop();
}
function WaterButton($$payload, $$props) {
  push();
  let { items = [], units = "oz", value = 0 } = $$props;
  let open = false;
  const each_array = ensure_array_like(items);
  $$payload.out += `<label class="svelte-1yteqtn"><button type="button" class="svelte-1yteqtn">`;
  Icon($$payload, {
    height: "20",
    icon: "material-symbols:water-drop-outline-rounded",
    width: "20"
  });
  $$payload.out += `<!----> <span class="svelte-1yteqtn">${escape_html(value)} ${escape_html(units)}</span> `;
  Icon($$payload, {
    height: "20",
    icon: "material-symbols:keyboard-arrow-down-rounded",
    width: "20"
  });
  $$payload.out += `<!----></button> <ul${attr_class("svelte-1yteqtn", void 0, { "open": open })}><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let item = each_array[$$index];
    $$payload.out += `<li class="svelte-1yteqtn"><button type="button" class="svelte-1yteqtn"><span class="svelte-1yteqtn">${escape_html(item.label)}</span> <span class="svelte-1yteqtn">${escape_html(item.value)} ${escape_html(units)}</span></button></li>`;
  }
  $$payload.out += `<!--]--></ul></label>`;
  pop();
}
function FastingView($$payload, $$props) {
  push();
  let {
    activity = null,
    duration = 0,
    hunger = 5,
    levels = [],
    now = null,
    onsun,
    started = null,
    sun = null,
    volume = null,
    water = 0
  } = $$props;
  const water_options = [
    { value: 8, label: "Cup" },
    { value: 12, label: "Can" },
    { value: 16, label: "Bottle" },
    { value: 20, label: "Medium" },
    { value: 30, label: "Gatorade" },
    { value: 32, label: "Big Q" },
    { value: 44, label: "QT Large" },
    { value: 52, label: "Extra Large" }
  ];
  function formatStarted(value) {
    if (value === null) return null;
    const formatter = new Intl.DateTimeFormat(navigator.language, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
    return formatter.format(value);
  }
  $$payload.out += `<section class="svelte-1wi0ic3"><header class="svelte-1wi0ic3"><h3 class="svelte-1wi0ic3">Fasting</h3> <button type="button" class="svelte-1wi0ic3">`;
  Icon($$payload, {
    height: "20",
    icon: "material-symbols:person-outline-rounded",
    width: "20"
  });
  $$payload.out += `<!----></button></header> <article class="svelte-1wi0ic3">`;
  if (started === null) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<p class="svelte-1wi0ic3">You are not fasting.</p>`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<p class="svelte-1wi0ic3">You are fasting.</p> `;
    Timer($$payload, { duration, now, started });
    $$payload.out += `<!----> `;
    DurationGroup($$payload, { value: duration });
    $$payload.out += `<!----> <p class="started svelte-1wi0ic3">Started ${escape_html(formatStarted(started))}</p>`;
  }
  $$payload.out += `<!--]--> <button class="primary svelte-1wi0ic3" type="button">${escape_html(started === null ? "Start" : "Stop")} fasting</button></article> <div class="graph svelte-1wi0ic3">`;
  GraphSection($$payload, { activity, days: 7, onsun, sun, water: volume });
  $$payload.out += `<!----></div> <footer class="svelte-1wi0ic3">`;
  HungerButton($$payload, { items: levels, value: hunger });
  $$payload.out += `<!----> `;
  WaterButton($$payload, { items: water_options, value: water });
  $$payload.out += `<!----></footer></section>`;
  pop();
}
function Calendar($$payload, $$props) {
  push();
  let { display = /* @__PURE__ */ new Date(), value = /* @__PURE__ */ new Date() } = $$props;
  let month = (() => {
    const formatter = new Intl.DateTimeFormat(navigator.language, { month: "long", year: "numeric" });
    return formatter.format(display);
  })();
  let days = (() => {
    const dates = [];
    const today = /* @__PURE__ */ new Date();
    const calendar = new Date(display.getFullYear(), display.getMonth(), 1);
    calendar.setDate(calendar.getDate() - calendar.getDay());
    for (let d = 0; d < 42; d++) {
      const item = {
        date: calendar.getDate(),
        month: calendar.getMonth(),
        year: calendar.getFullYear(),
        outside: true,
        today: false,
        selected: false,
        after: false
      };
      if (calendar.getFullYear() === display.getFullYear() && calendar.getMonth() === display.getMonth()) {
        item.outside = false;
      }
      if (calendar.getTime() > Date.now()) {
        item.after = true;
      }
      if (calendar.getFullYear() === today.getFullYear() && calendar.getMonth() === today.getMonth() && calendar.getDate() === today.getDate()) {
        item.today = true;
      }
      if (calendar.getFullYear() === value.getFullYear() && calendar.getMonth() === value.getMonth() && calendar.getDate() === value.getDate()) {
        item.selected = true;
      }
      calendar.setDate(calendar.getDate() + 1);
      dates.push(item);
    }
    return dates;
  })();
  const each_array = ensure_array_like(days);
  $$payload.out += `<section><header class="svelte-1ll096s"><h3 class="svelte-1ll096s">${escape_html(month)}</h3> <button type="button" class="svelte-1ll096s">`;
  Icon($$payload, {
    height: "24",
    icon: "material-symbols:navigate-before",
    width: "24"
  });
  $$payload.out += `<!----></button> <button type="button" class="svelte-1ll096s">`;
  Icon($$payload, {
    height: "24",
    icon: "material-symbols:navigate-next",
    width: "24"
  });
  $$payload.out += `<!----></button></header> <article class="svelte-1ll096s"><p class="svelte-1ll096s">Sun</p> <p class="svelte-1ll096s">Mon</p> <p class="svelte-1ll096s">Tue</p> <p class="svelte-1ll096s">Wed</p> <p class="svelte-1ll096s">Thu</p> <p class="svelte-1ll096s">Fri</p> <p class="svelte-1ll096s">Sat</p></article> <article class="svelte-1ll096s"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let day = each_array[$$index];
    $$payload.out += `<button${attr("data-year", day.year)}${attr("data-month", day.month)}${attr("data-date", day.date)}${attr("disabled", day.after, true)} type="button"${attr_class("svelte-1ll096s", void 0, {
      "outside": day.outside,
      "today": day.today,
      "selected": day.selected
    })}>${escape_html(day.date)}</button>`;
  }
  $$payload.out += `<!--]--></article></section>`;
  pop();
}
function DateTimePicker($$payload, $$props) {
  push();
  let { label, onchange, value = /* @__PURE__ */ new Date() } = $$props;
  function formatDate(value2) {
    const formatter = new Intl.DateTimeFormat(navigator.language, { month: "short", day: "numeric" });
    return formatter.format(value2);
  }
  function formatTime(value2) {
    const formatter = new Intl.DateTimeFormat(navigator.language, { hour: "numeric", minute: "2-digit" });
    return formatter.format(value2);
  }
  $$payload.out += `<article class="svelte-8yzu2w"><header class="svelte-8yzu2w"><button type="button"${attr_class("svelte-8yzu2w", void 0, { "selected": true })}><p class="svelte-8yzu2w">${escape_html(label)}</p> <p class="svelte-8yzu2w">${escape_html(formatDate(value))}</p></button> <button type="button"${attr_class("svelte-8yzu2w", void 0, { "selected": false })}><p class="svelte-8yzu2w">${escape_html(formatTime(value))}</p></button></header> `;
  {
    $$payload.out += "<!--[-->";
    Calendar($$payload, { value });
  }
  $$payload.out += `<!--]--></article>`;
  pop();
}
function HistoryEditor($$payload, $$props) {
  push();
  let {
    field = "started",
    item = null,
    label = "Started",
    oncancel,
    ondelete,
    onsave,
    title = "Edit Fast Start"
  } = $$props;
  let dialog = void 0;
  function onCalendarChange(selected) {
    const change = { ...item };
    change[field] = new Date(selected.getTime());
    item = { ...change };
  }
  function close() {
    dialog.close();
  }
  function showModal() {
    dialog.showModal();
  }
  $$payload.out += `<dialog class="svelte-13glclx"><h3 class="svelte-13glclx">${escape_html(title)}</h3> `;
  DateTimePicker($$payload, {
    label,
    onchange: onCalendarChange,
    value: item && item.id && item.id !== null ? item[field] : /* @__PURE__ */ new Date()
  });
  $$payload.out += `<!----> <textarea placeholder="Notes" class="svelte-13glclx">`;
  const $$body = escape_html(item && item.id && item.id !== null ? item.notes : "");
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea> <footer class="svelte-13glclx"><button class="delete svelte-13glclx" type="button">Delete</button> <button class="cancel svelte-13glclx" type="button">Cancel</button> <button type="button" class="svelte-13glclx">Save</button></footer></dialog>`;
  bind_props($$props, { close, showModal });
  pop();
}
function HistoryList($$payload, $$props) {
  push();
  let { items = [] } = $$props;
  function formatDate(value) {
    const formatter = new Intl.DateTimeFormat(navigator.language, { month: "short", day: "numeric", year: "numeric" });
    return formatter.format(value);
  }
  function formatDuration(start, end) {
    const difference = end.getTime() - start.getTime();
    const seconds = Math.floor(difference / 1e3);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor(seconds % 3600 / 60);
    const formatter = new Intl.DurationFormat(navigator.language, { style: "short", units: ["hour", "minute"] });
    return formatter.format({ hours, minutes });
  }
  function formatHeader(value) {
    const formatter = new Intl.DateTimeFormat(navigator.language, { weekday: "long", month: "short", day: "numeric" });
    return formatter.format(value);
  }
  function formatTime(value) {
    const formatter = new Intl.DateTimeFormat(navigator.language, { hour: "numeric", minute: "2-digit" });
    return formatter.format(value);
  }
  if (items.length === 0) {
    $$payload.out += "<!--[-->";
    $$payload.out += `<article class="svelte-1vxkmhw"><p class="svelte-1vxkmhw">Your fasting history<br/>will be displayed here.</p></article>`;
  } else {
    $$payload.out += "<!--[!-->";
    const each_array = ensure_array_like(items);
    $$payload.out += `<ul class="svelte-1vxkmhw"><!--[-->`;
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let item = each_array[$$index];
      if (item.type === "header") {
        $$payload.out += "<!--[-->";
        $$payload.out += `<li class="header svelte-1vxkmhw"><p class="svelte-1vxkmhw">${escape_html(formatHeader(item.timed))}</p></li>`;
      } else {
        $$payload.out += "<!--[!-->";
        $$payload.out += `<li class="svelte-1vxkmhw"><button type="button" class="svelte-1vxkmhw">`;
        if (item.type === "start") {
          $$payload.out += "<!--[-->";
          $$payload.out += `<p class="svelte-1vxkmhw">Started Fast</p> <p class="svelte-1vxkmhw"></p> <p class="svelte-1vxkmhw">${escape_html(formatDate(item.timed))}</p> <p class="svelte-1vxkmhw">${escape_html(formatTime(item.timed))}</p>`;
        } else if (item.type === "water") {
          $$payload.out += "<!--[1-->";
          $$payload.out += `<p class="svelte-1vxkmhw">Water</p> <p class="svelte-1vxkmhw">${escape_html(item.volume)} oz</p> <p class="svelte-1vxkmhw">${escape_html(formatDate(item.timed))}</p> <p class="svelte-1vxkmhw">${escape_html(formatTime(item.timed))}</p>`;
        } else if (item.type === "hunger") {
          $$payload.out += "<!--[2-->";
          $$payload.out += `<p class="svelte-1vxkmhw">${escape_html(item.level)}</p> <p class="svelte-1vxkmhw"></p> <p class="svelte-1vxkmhw">${escape_html(formatDate(item.timed))}</p> <p class="svelte-1vxkmhw">${escape_html(formatTime(item.timed))}</p>`;
        } else if (item.type === "end") {
          $$payload.out += "<!--[3-->";
          $$payload.out += `<p class="svelte-1vxkmhw">Ended Fast</p> <p class="svelte-1vxkmhw">${escape_html(formatDuration(item.started, item.ended))}</p> <p class="svelte-1vxkmhw">${escape_html(formatDate(item.timed))}</p> <p class="svelte-1vxkmhw">${escape_html(formatTime(item.timed))}</p>`;
        } else {
          $$payload.out += "<!--[!-->";
        }
        $$payload.out += `<!--]--></button></li>`;
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]--></ul>`;
  }
  $$payload.out += `<!--]-->`;
  pop();
}
function HoursView($$payload, $$props) {
  let {
    activity = null,
    history = [],
    onsun,
    sun = null,
    volume
  } = $$props;
  $$payload.out += `<section class="svelte-1moll0f"><header class="svelte-1moll0f"><h3 class="svelte-1moll0f">Hours</h3></header> <div class="svelte-1moll0f">`;
  GraphSection($$payload, { activity, days: 7, onsun, sun, water: volume });
  $$payload.out += `<!----></div> <article class="svelte-1moll0f">`;
  HistoryList($$payload, { items: history });
  $$payload.out += `<!----></article></section>`;
}
function HungerSelect($$payload, $$props) {
  push();
  let { items = [], value = 0 } = $$props;
  let open = false;
  let label = (() => {
    if (items.length === 0) return "";
    const match = items.find((current) => current.value === value ? true : false);
    return match.label;
  })();
  const each_array = ensure_array_like(items);
  $$payload.out += `<label class="svelte-148k8wo"><button tabindex="-1" type="button" class="svelte-148k8wo"><span class="svelte-148k8wo">${escape_html(label)}</span> `;
  Icon($$payload, {
    height: "20",
    icon: "material-symbols:keyboard-arrow-down-rounded",
    width: "20"
  });
  $$payload.out += `<!----></button> <ul${attr_class("svelte-148k8wo", void 0, { "open": open })}><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let item = each_array[$$index];
    $$payload.out += `<li${attr_class("svelte-148k8wo", void 0, { "selected": value === item.value ? true : false })}><button type="button" class="svelte-148k8wo"><span class="svelte-148k8wo">${escape_html(item.label)}</span> `;
    if (item.value === value) {
      $$payload.out += "<!--[-->";
      Icon($$payload, {
        height: "20",
        icon: "material-symbols:check-rounded",
        width: "20"
      });
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></button></li>`;
  }
  $$payload.out += `<!--]--></ul></label>`;
  pop();
}
function HungerEditor($$payload, $$props) {
  push();
  let { item = null, levels = [], oncancel, ondelete, onsave } = $$props;
  let dialog = void 0;
  let current = item && item.level && item.level !== null ? item.level : 5;
  function onDateChange(value) {
    const created = new Date(value.getTime());
    item = { ...item, created };
  }
  function close() {
    dialog.close();
    item = null;
  }
  function showModal() {
    dialog.showModal();
  }
  $$payload.out += `<dialog class="svelte-1hqchgg"><h3 class="svelte-1hqchgg">Edit Hunger</h3> `;
  HungerSelect($$payload, { items: levels, value: current });
  $$payload.out += `<!----> `;
  DateTimePicker($$payload, {
    label: "Checked",
    onchange: onDateChange,
    value: item && item.created ? item.created : /* @__PURE__ */ new Date()
  });
  $$payload.out += `<!----> <footer class="svelte-1hqchgg"><button class="delete svelte-1hqchgg" type="button">Delete</button> <button class="cancel svelte-1hqchgg" type="button">Cancel</button> <button type="button" class="svelte-1hqchgg">Save</button></footer></dialog>`;
  bind_props($$props, { close, showModal });
  pop();
}
function ScreenGroup($$payload, $$props) {
  push();
  let { value = 0 } = $$props;
  $$payload.out += `<ul class="svelte-tu3q0a"><li><button${attr_class("fasting svelte-tu3q0a", void 0, { "selected": value === 0 ? true : false })} type="button">Fasting</button></li> <li><button${attr_class("hours svelte-tu3q0a", void 0, { "selected": value === 1 ? true : false })} type="button">Hours</button></li></ul>`;
  pop();
}
function Settings($$payload, $$props) {
  let dialog = void 0;
  function close() {
    dialog.close();
  }
  function showModal() {
    dialog.showModal();
  }
  $$payload.out += `<dialog class="svelte-msa23r"><h3 class="svelte-msa23r">Settings</h3> <article class="svelte-msa23r"><p class="svelte-msa23r">Settings.</p></article> <footer class="svelte-msa23r"><button type="button" class="svelte-msa23r">Done</button></footer></dialog>`;
  bind_props($$props, { close, showModal });
}
function WaterSelect($$payload, $$props) {
  push();
  let { items = [], units = "oz", value = 0 } = $$props;
  let open = false;
  let label = (() => {
    if (items.length === 0) return "";
    const match = items.find((current) => current.value === value ? true : false);
    return match.label;
  })();
  const each_array = ensure_array_like(items);
  $$payload.out += `<label class="svelte-148k8wo"><button tabindex="-1" type="button" class="svelte-148k8wo"><span class="svelte-148k8wo">${escape_html(label)}</span> <span class="svelte-148k8wo">${escape_html(value)} ${escape_html(units)}</span> `;
  Icon($$payload, {
    height: "20",
    icon: "material-symbols:keyboard-arrow-down-rounded",
    width: "20"
  });
  $$payload.out += `<!----></button> <ul${attr_class("svelte-148k8wo", void 0, { "open": open })}><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let item = each_array[$$index];
    $$payload.out += `<li${attr_class("svelte-148k8wo", void 0, { "selected": value === item.value ? true : false })}><button type="button" class="svelte-148k8wo"><span class="svelte-148k8wo">${escape_html(item.label)}</span> <span class="svelte-148k8wo">${escape_html(item.value)} oz</span> `;
    if (item.value === value) {
      $$payload.out += "<!--[-->";
      Icon($$payload, {
        height: "20",
        icon: "material-symbols:check-rounded",
        width: "20"
      });
    } else {
      $$payload.out += "<!--[!-->";
    }
    $$payload.out += `<!--]--></button></li>`;
  }
  $$payload.out += `<!--]--></ul></label>`;
  pop();
}
function WaterEditor($$payload, $$props) {
  push();
  let { item = null, oncancel, ondelete, onsave, units = "oz" } = $$props;
  let dialog = void 0;
  let options = [
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
  function onDateChange(value) {
    const created = new Date(value.getTime());
    item = { ...item, created };
  }
  function close() {
    dialog.close();
    item = null;
  }
  function showModal() {
    dialog.showModal();
  }
  $$payload.out += `<dialog class="svelte-1kewhwu"><h3 class="svelte-1kewhwu">Edit Water</h3> `;
  WaterSelect($$payload, { items: options, units, value: volume });
  $$payload.out += `<!----> `;
  DateTimePicker($$payload, {
    label: "Finished",
    onchange: onDateChange,
    value: item && item.created ? item.created : /* @__PURE__ */ new Date()
  });
  $$payload.out += `<!----> <footer class="svelte-1kewhwu"><button class="delete svelte-1kewhwu" type="button">Delete</button> <button class="cancel svelte-1kewhwu" type="button">Cancel</button> <button type="button" class="svelte-1kewhwu">Save</button></footer></dialog>`;
  bind_props($$props, { close, showModal });
  pop();
}
function _page($$payload, $$props) {
  push();
  const db = new Database();
  const SunCalc = daylight;
  let activity = null;
  let duration = 0;
  let history = [];
  let history_editor = void 0;
  let history_field = "started";
  let history_item = null;
  let history_label = "Started";
  let history_title = "Edit Fast Started";
  let hunger_editor = void 0;
  let hunger_item = null;
  let hunger = 5;
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
  let now = null;
  let screen = 0;
  let started = null;
  let sun = null;
  let volume = null;
  let water = 0;
  let water_editor = void 0;
  let water_item = null;
  function formatLocalDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  function loadActivity(days = 7) {
    db.browseHistory().then((data) => {
      const tempResult = {};
      const now_date = /* @__PURE__ */ new Date();
      const endDate = new Date(now_date.getFullYear(), now_date.getMonth(), now_date.getDate());
      const startLimitDate = new Date(endDate);
      startLimitDate.setDate(endDate.getDate() - (days - 1));
      if (!Array.isArray(data) || data.length === 0) {
        const date = new Date(startLimitDate);
        while (date <= endDate) {
          const key = formatLocalDate(date);
          tempResult[key] = Array(24).fill(0);
          date.setDate(date.getDate() + 1);
        }
      } else {
        for (const action of data) {
          const start = new Date(action.started);
          const end = action.ended ? new Date(action.ended) : /* @__PURE__ */ new Date();
          const startTime = new Date(start.getTime());
          startTime.setSeconds(0, 0);
          const endTime = new Date(end.getTime());
          endTime.setSeconds(0, 0);
          let current = new Date(startTime);
          while (current < endTime) {
            const dateKey = formatLocalDate(current);
            const dateOnly = new Date(current.getFullYear(), current.getMonth(), current.getDate());
            if (dateOnly >= startLimitDate && dateOnly <= endDate) {
              const hour = current.getHours();
              if (!tempResult[dateKey]) {
                tempResult[dateKey] = Array(24).fill(0);
              }
              tempResult[dateKey][hour] += 1;
            }
            current.setMinutes(current.getMinutes() + 1);
          }
        }
        for (const date in tempResult) {
          tempResult[date] = tempResult[date].map((mins) => +(Math.min(mins, 60) / 60).toFixed(6));
        }
        const fillDate = new Date(startLimitDate);
        while (fillDate <= endDate) {
          const key = formatLocalDate(fillDate);
          if (!tempResult[key]) {
            tempResult[key] = Array(24).fill(0);
          }
          fillDate.setDate(fillDate.getDate() + 1);
        }
      }
      const sortedKeys = Object.keys(tempResult).sort((a, b) => b.localeCompare(a));
      const dailyActivity = {};
      for (const key of sortedKeys) {
        dailyActivity[key] = tempResult[key];
      }
      const hourTotals = Array(24).fill(0);
      for (const hour of Array(24).keys()) {
        for (const date of sortedKeys) {
          hourTotals[hour] += dailyActivity[date][hour];
        }
      }
      const averageHourlyActivity = hourTotals.map((total) => +(total / days).toFixed(6));
      activity = { daily: dailyActivity, average: averageHourlyActivity };
    });
  }
  function loadHistory() {
    db.browseHistory().then((data) => {
      let chronos = null;
      let start = structuredClone(data);
      start.forEach((value) => {
        value.type = "start";
        value.timed = new Date(value.started.getTime());
      });
      let end = structuredClone(data);
      end = end.filter((value) => value.ended === null ? false : true);
      end.forEach((value) => {
        value.type = "end";
        value.timed = new Date(value.ended.getTime());
      });
      start = start.concat(end);
      chronos = [...start];
      db.browseHunger().then((data2) => {
        data2 = data2.map((value) => {
          const hunger2 = levels.find((current) => current.value === value.level);
          value.level = hunger2.label;
          value.timed = new Date(value.created.getTime());
          return value;
        });
        chronos = chronos.concat(data2);
        return db.browseWater();
      }).then((data2) => {
        data2 = data2.map((value) => {
          value.timed = new Date(value.created.getTime());
          return value;
        });
        chronos = chronos.concat(data2);
        chronos.sort((a, b) => {
          if (a.timed.getTime() < b.timed.getTime()) return 1;
          if (a.timed.getTime() > b.timed.getTime()) return -1;
          return 0;
        });
        const dates = [];
        for (let c = 0; c < chronos.length; c++) {
          const zeroed = new Date(chronos[c].timed.getTime());
          zeroed.setHours(23);
          zeroed.setMinutes(59);
          zeroed.setSeconds(59);
          zeroed.setMilliseconds(999);
          if (dates.length === 0) {
            dates.push({ type: "header", timed: zeroed });
          } else {
            if (dates[dates.length - 1].timed.getDate() !== chronos[c].timed.getDate() || dates[dates.length - 1].timed.getMonth() !== chronos[c].timed.getMonth() || dates[dates.length - 1].timed.getFullYear() !== chronos[c].timed.getFullYear()) {
              dates.push({ type: "header", timed: zeroed });
            }
          }
        }
        chronos = chronos.concat(dates);
        chronos.sort((a, b) => {
          if (a.timed.getTime() < b.timed.getTime()) return 1;
          if (a.timed.getTime() > b.timed.getTime()) return -1;
          return 0;
        });
        history = [...chronos];
      });
    });
  }
  function loadHunger() {
    db.browseHunger(true).then((item) => {
      if (item === null) {
        hunger = 5;
      } else {
        const today = /* @__PURE__ */ new Date();
        const created = new Date(item.created);
        if (today.getFullYear() === created.getFullYear() && today.getMonth() === created.getMonth() && today.getDate() === created.getDate()) {
          hunger = item.level;
        } else {
          hunger = 5;
        }
      }
    });
  }
  function loadStart() {
    db.browseHistory().then((data) => {
      if (data.length === 0) {
        started = null;
        now = null;
      }
      data.sort((a, b) => {
        if (a.started.getTime() > b.started.getTime()) return -1;
        if (a.started.getTime() < b.started.getTime()) return 1;
        return 0;
      });
      if (data[0].ended === null) {
        started = new Date(data[0].started.getTime());
        now = Date.now();
      }
    });
  }
  function loadSun() {
    const latitude = parseFloat(window.localStorage.getItem("fh_latitude"));
    const longitude = parseFloat(window.localStorage.getItem("fh_longitude"));
    const today = /* @__PURE__ */ new Date();
    let icon = null;
    let times = SunCalc.getTimes(today, latitude, longitude);
    let timing = null;
    if (Date.now() < times.sunrise.getTime()) {
      timing = new Date(times.sunrise.getTime());
      icon = "material-symbols:wb-sunny-outline-rounded";
    } else if (Date.now() > times.sunrise.getTime() && Date.now() < times.sunset.getTime()) {
      timing = new Date(times.sunset.getTime());
      icon = "material-symbols:moon-stars-outline-rounded";
    } else {
      const tomorrow = /* @__PURE__ */ new Date();
      tomorrow.setDate(today.getDate() + 1);
      times = SunCalc.getTimes(tomorrow, latitude, longitude);
      timing = new Date(times.sunrise.getTime());
      icon = "material-symbols:wb-sunny-outline-rounded";
    }
    sun = { icon, timing };
  }
  function loadWater() {
    db.browseWater(true).then((data) => {
      const total = data.reduce(
        (previous, current) => {
          return previous + current.volume;
        },
        0
      );
      water = total;
      return db.browseWater();
    }).then((data) => {
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      const volumeByDate = {};
      for (const { created, volume: volume2 } of data) {
        const key = toLocalDateKey(created);
        volumeByDate[key] = (volumeByDate[key] || 0) + volume2;
      }
      const result = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date(today.getTime());
        date.setDate(today.getDate() - i);
        const key = toLocalDateKey(date);
        result.push({
          created: new Date(date.getTime()),
          volume: volumeByDate[key] || 0
        });
      }
      const totalVolume = result.reduce((sum, { volume: volume2 }) => sum + volume2, 0);
      const averageVolume = totalVolume / result.length;
      volume = { average: averageVolume, daily: [...result] };
    });
  }
  function toLocalDateKey(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  function onHistoryDelete(id) {
    if (started !== null) {
      if (history_item.started.getTime() === started.getTime()) {
        started = null;
        now = null;
      }
    }
    db.deleteHistory(id).then(() => {
      history_editor.close();
      history_item = null;
      loadStart();
      loadActivity();
      loadHistory();
    });
  }
  function onHistorySave(item) {
    db.editHistory(item).then(() => {
      history_editor.close();
      history_item = null;
      loadStart();
      loadActivity();
      loadHistory();
    });
  }
  function onHungerDelete(id) {
    db.deleteHunger(id).then(() => {
      hunger_editor.close();
      hunger_item = null;
      loadHunger();
      loadHistory();
    });
  }
  function onHungerSave(value) {
    db.editHunger(value).then((data) => {
      hunger_editor.close();
      hunger_item = null;
      loadHunger();
      loadHistory();
    });
  }
  function onSunEnable() {
    const response = confirm("Sunrise/set (important for religious observations) needs to know your location? Enable location detection?");
    if (response) {
      navigator.geolocation.getCurrentPosition((position) => {
        window.localStorage.setItem("fh_latitude", position.coords.latitude);
        window.localStorage.setItem("fh_longitude", position.coords.longitude);
        loadSun();
      });
    } else {
      window.localStorage.setItem("fh_latitude", "DENIED");
    }
  }
  function onWaterDelete(id) {
    db.deleteWater(id).then(() => {
      water_editor.close();
      water_item = null;
      loadWater();
      loadHistory();
    });
  }
  function onWaterSave(value) {
    db.editWater(value).then((data) => {
      water_editor.close();
      water_item = null;
      loadWater();
      loadHistory();
    });
  }
  $$payload.out += `<main class="svelte-odvko0"><header class="svelte-odvko0"><span></span> `;
  ScreenGroup($$payload, { value: screen });
  $$payload.out += `<!----> <button type="button" class="svelte-odvko0">`;
  Icon($$payload, {
    height: "20",
    icon: "material-symbols:person-outline-rounded",
    width: "20"
  });
  $$payload.out += `<!----></button></header> <section${attr("data-screen", "fasting")} class="svelte-odvko0"><article class="svelte-odvko0">`;
  FastingView($$payload, {
    activity,
    duration,
    hunger,
    levels,
    now,
    onsun: onSunEnable,
    started,
    sun,
    volume,
    water
  });
  $$payload.out += `<!----></article> <article class="svelte-odvko0">`;
  HoursView($$payload, {
    activity,
    history,
    onsun: onSunEnable,
    sun,
    volume
  });
  $$payload.out += `<!----></article></section></main> `;
  HistoryEditor($$payload, {
    field: history_field,
    item: history_item,
    label: history_label,
    ondelete: onHistoryDelete,
    onsave: onHistorySave,
    title: history_title
  });
  $$payload.out += `<!----> `;
  HungerEditor($$payload, {
    item: hunger_item,
    levels,
    ondelete: onHungerDelete,
    onsave: onHungerSave
  });
  $$payload.out += `<!----> `;
  WaterEditor($$payload, {
    item: water_item,
    ondelete: onWaterDelete,
    onsave: onWaterSave
  });
  $$payload.out += `<!----> `;
  Settings($$payload, {});
  $$payload.out += `<!---->`;
  pop();
}
export {
  _page as default
};
