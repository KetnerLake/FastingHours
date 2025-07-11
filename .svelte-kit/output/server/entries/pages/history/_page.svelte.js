import "clsx";
import { y as ensure_array_like, z as attr_style, x as escape_html, A as attr, v as pop, t as push, F as stringify, G as attr_class, J as bind_props } from "../../../chunks/index.js";
import { I as Icon, D as Database } from "../../../chunks/Icon.js";
function Chart($$payload, $$props) {
  push();
  let { value = [] } = $$props;
  let size = 0;
  let range = (() => {
    const tempResult = {};
    const now = /* @__PURE__ */ new Date();
    const todayKey = formatLocalDate(now);
    const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (!Array.isArray(value) || value.length === 0) {
      return { [todayKey]: Array(24).fill(0) };
    }
    let minStartDate = null;
    for (const period of value) {
      const start = period.start;
      const end = period.end ? new Date(period.end) : /* @__PURE__ */ new Date();
      if (!minStartDate || start < minStartDate) {
        minStartDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      }
      const startTime = new Date(start.getTime());
      startTime.setSeconds(0, 0);
      const endTime = new Date(end.getTime());
      endTime.setSeconds(0, 0);
      let current = new Date(startTime);
      while (current < endTime) {
        const dateKey = formatLocalDate(current);
        const hour = current.getHours();
        if (!tempResult[dateKey]) {
          tempResult[dateKey] = Array(24).fill(0);
        }
        const nextHour = new Date(current);
        nextHour.setMinutes(60, 0, 0);
        const segmentEnd = endTime < nextHour ? endTime : nextHour;
        const minutesCovered = Math.max(0, (segmentEnd - current) / 6e4);
        const fraction = minutesCovered / 60;
        tempResult[dateKey][hour] += fraction;
        tempResult[dateKey][hour] = Math.min(tempResult[dateKey][hour], 1);
        current = new Date(segmentEnd);
      }
    }
    const fillDate = new Date(minStartDate);
    while (fillDate <= endDate) {
      const dateKey = formatLocalDate(fillDate);
      if (!tempResult[dateKey]) {
        tempResult[dateKey] = Array(24).fill(0);
      }
      fillDate.setDate(fillDate.getDate() + 1);
    }
    const sortedKeys = Object.keys(tempResult).sort((a, b) => b.localeCompare(a));
    const result = {};
    for (const key of sortedKeys) {
      result[key] = tempResult[key];
    }
    return result;
  })();
  function formatLabel(value2) {
    value2 = /* @__PURE__ */ new Date(value2 + "T00:00:00");
    const formatter = new Intl.DateTimeFormat(navigator.language, { month: "short", day: "numeric" });
    return formatter.format(value2);
  }
  function formatLocalDate(date) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  }
  function offset(hour, status) {
    if (hour === 0 || status[hour - 1] === 0) {
      return 65 + size * hour + hour * 2 + size * (1 - status[hour]);
    }
    return 65 + size * hour + hour * 2;
  }
  const each_array = ensure_array_like(Object.keys(range));
  $$payload.out += `<article><ul class="svelte-sgysjh"><li class="svelte-sgysjh"${attr_style("", {
    "grid-template-columns": `65px ${stringify(size)}px 1fr 24px`
  })}><p class="svelte-sgysjh">Date</p> <p class="svelte-sgysjh">0</p> <p class="svelte-sgysjh">12</p> <p class="svelte-sgysjh">24</p></li> <!--[-->`;
  for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
    let day = each_array[$$index_1];
    const status = range[day];
    const each_array_1 = ensure_array_like({ length: 24 });
    $$payload.out += `<li class="svelte-sgysjh"><svg class="svelte-sgysjh"><text x="0" y="12" class="svelte-sgysjh">${escape_html(formatLabel(day))}</text><!--[-->`;
    for (let hour = 0, $$length2 = each_array_1.length; hour < $$length2; hour++) {
      $$payload.out += `<rect fill="#00000010"${attr("x", 65 + size * hour + hour * 2)}${attr("y", (24 - size) / 2)}${attr("width", size)}${attr("height", size)}></rect>`;
      if (status[hour] !== 0) {
        $$payload.out += "<!--[-->";
        $$payload.out += `<rect fill="#161616"${attr("x", offset(hour, status))}${attr("y", (24 - size) / 2)}${attr("width", size * status[hour])}${attr("height", size)}></rect>`;
      } else {
        $$payload.out += "<!--[!-->";
      }
      $$payload.out += `<!--]-->`;
    }
    $$payload.out += `<!--]--></svg></li>`;
  }
  $$payload.out += `<!--]--></ul> <legend class="svelte-sgysjh"><div class="svelte-sgysjh"${attr_style("", {
    height: `${stringify(size)}px`,
    width: `${stringify(size)}px`
  })}></div> <p class="svelte-sgysjh">Fasting</p></legend></article>`;
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
      if (calendar.getUTCFullYear() === display.getUTCFullYear() && calendar.getUTCMonth() === display.getUTCMonth()) {
        item.outside = false;
      }
      if (calendar.getTime() > Date.now()) {
        item.after = true;
      }
      if (calendar.getUTCFullYear() === today.getUTCFullYear() && calendar.getUTCMonth() === today.getUTCMonth() && calendar.getUTCDate() === today.getUTCDate()) {
        item.today = true;
      }
      if (calendar.getUTCFullYear() === value.getUTCFullYear() && calendar.getUTCMonth() === value.getUTCMonth() && calendar.getUTCDate() === value.getUTCDate()) {
        item.selected = true;
      }
      calendar.setDate(calendar.getDate() + 1);
      dates.push(item);
    }
    return dates;
  })();
  const each_array = ensure_array_like(days);
  $$payload.out += `<section><header class="svelte-1ovr2ln"><h3 class="svelte-1ovr2ln">${escape_html(month)}</h3> <button type="button" class="svelte-1ovr2ln">`;
  Icon($$payload, {
    height: "24",
    icon: "material-symbols:navigate-before",
    width: "24"
  });
  $$payload.out += `<!----></button> <button type="button" class="svelte-1ovr2ln">`;
  Icon($$payload, {
    height: "24",
    icon: "material-symbols:navigate-next",
    width: "24"
  });
  $$payload.out += `<!----></button></header> <article class="svelte-1ovr2ln"><p class="svelte-1ovr2ln">Sun</p> <p class="svelte-1ovr2ln">Mon</p> <p class="svelte-1ovr2ln">Tue</p> <p class="svelte-1ovr2ln">Wed</p> <p class="svelte-1ovr2ln">Thu</p> <p class="svelte-1ovr2ln">Fri</p> <p class="svelte-1ovr2ln">Sat</p></article> <article class="svelte-1ovr2ln"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let day = each_array[$$index];
    $$payload.out += `<button${attr("data-year", day.year)}${attr("data-month", day.month)}${attr("data-date", day.date)}${attr("disabled", day.after, true)} type="button"${attr_class("svelte-1ovr2ln", void 0, {
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
  let open = false;
  let date = (() => {
    const formatter = new Intl.DateTimeFormat(navigator.language, { month: "short", day: "numeric" });
    return formatter.format(value);
  })();
  let time = (() => {
    const formatter = new Intl.DateTimeFormat(navigator.language, { hour: "numeric", minute: "2-digit" });
    return formatter.format(value);
  })();
  $$payload.out += `<details${attr("open", open, true)} class="svelte-1ml79ji"><summary class="svelte-1ml79ji"><p class="svelte-1ml79ji">${escape_html(label)}</p> <button type="button" class="svelte-1ml79ji">${escape_html(date)}</button> <button type="button" class="svelte-1ml79ji">${escape_html(time)}</button></summary> `;
  {
    $$payload.out += "<!--[-->";
    Calendar($$payload, { value });
  }
  $$payload.out += `<!--]--></details>`;
  pop();
}
function Editor($$payload, $$props) {
  push();
  let {
    end = /* @__PURE__ */ new Date(),
    notes = null,
    oncancel,
    onsave,
    start = /* @__PURE__ */ new Date()
  } = $$props;
  let dialog = void 0;
  function onEndChange(selected) {
    end = new Date(selected.getTime());
  }
  function onStartChange(selected) {
    start = new Date(selected.getTime());
  }
  function hide() {
    dialog.close();
  }
  function show() {
    dialog.showModal();
  }
  $$payload.out += `<dialog class="svelte-xaz8rx"><header class="svelte-xaz8rx"><button type="button" class="svelte-xaz8rx">Cancel</button> <h3 class="svelte-xaz8rx">Edit Fast</h3> <button type="button" class="svelte-xaz8rx">Done</button></header> `;
  DateTimePicker($$payload, { label: "Start", onchange: onStartChange, value: start });
  $$payload.out += `<!----> `;
  DateTimePicker($$payload, { label: "End", onchange: onEndChange, value: end });
  $$payload.out += `<!----> <textarea placeholder="Notes" class="svelte-xaz8rx">`;
  const $$body = escape_html(notes);
  if ($$body) {
    $$payload.out += `${$$body}`;
  }
  $$payload.out += `</textarea></dialog>`;
  bind_props($$props, { hide, show });
  pop();
}
function Table($$payload, $$props) {
  push();
  let { value = [] } = $$props;
  let data = (() => {
    const copy = [...value];
    return copy.sort((a, b) => {
      if (a.start.getTime() > b.start.getTime()) return -1;
      if (a.start.getTime() < b.start.getTime()) return 1;
      return 0;
    });
  })();
  function formatLabel(date) {
    const formatter = new Intl.DateTimeFormat(navigator.language, {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit"
    });
    return formatter.format(date);
  }
  const each_array = ensure_array_like(data);
  $$payload.out += `<article class="svelte-1k3q732"><header class="svelte-1k3q732"><p class="svelte-1k3q732">Start time</p> <p class="svelte-1k3q732">End time</p></header> <ul class="svelte-1k3q732"><!--[-->`;
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    let item = each_array[$$index];
    $$payload.out += `<li class="svelte-1k3q732">`;
    if (item.end) {
      $$payload.out += "<!--[-->";
      $$payload.out += `<button${attr("data-id", item.id)} type="button" class="svelte-1k3q732"><p class="svelte-1k3q732">${escape_html(formatLabel(item.start))}</p> <p class="svelte-1k3q732">${escape_html(item.end === null ? "-" : formatLabel(item.end))}</p></button>`;
    } else {
      $$payload.out += "<!--[!-->";
      $$payload.out += `<p class="svelte-1k3q732">${escape_html(formatLabel(item.start))}</p> <p class="svelte-1k3q732">${escape_html(item.end === null ? "-" : formatLabel(item.end))}</p>`;
    }
    $$payload.out += `<!--]--></li>`;
  }
  $$payload.out += `<!--]--></ul></article>`;
  pop();
}
function _page($$payload, $$props) {
  push();
  const db = new Database();
  let id = null;
  let start = /* @__PURE__ */ new Date();
  let end = /* @__PURE__ */ new Date();
  let notes = null;
  let history = [];
  function onEditorSave(value) {
    value.id = id;
    if (value.notes !== null) {
      value.notes = value.notes.trim().length === 0 ? null : value.notes;
    }
    db.edit(value).then(() => db.browse()).then((data) => history = [...data]);
  }
  $$payload.out += `<section class="svelte-1pz1g8r"><header class="svelte-1pz1g8r"><h1 class="svelte-1pz1g8r">Fasting Hours</h1> <a href="/" class="svelte-1pz1g8r">`;
  Icon($$payload, {
    height: "20",
    icon: "material-symbols:timer-outline-rounded",
    width: "20"
  });
  $$payload.out += `<!----> <span>Timer</span></a></header> `;
  if (history.length > 0) {
    $$payload.out += "<!--[-->";
    Chart($$payload, { value: history });
    $$payload.out += `<!----> `;
    Table($$payload, { value: history });
    $$payload.out += `<!---->`;
  } else {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<article class="svelte-1pz1g8r"><p class="svelte-1pz1g8r">Your fasting history<br/>will be displayed here.</p></article>`;
  }
  $$payload.out += `<!--]--></section> `;
  Editor($$payload, { end, notes, onsave: onEditorSave, start });
  $$payload.out += `<!---->`;
  pop();
}
export {
  _page as default
};
