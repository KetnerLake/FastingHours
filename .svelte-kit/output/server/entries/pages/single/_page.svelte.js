import { a as attr } from "../../../chunks/attributes.js";
function _page($$payload) {
  let screen = "fasting";
  $$payload.out += `<main class="svelte-1w81g8n"><header class="svelte-1w81g8n"><button data-view="fasting">Fasting</button> <button data-view="hours">Hours</button></header> <section${attr("data-screen", screen)} class="svelte-1w81g8n"><article id="fasting" class="svelte-1w81g8n">Fasting</article> <article id="hours" class="svelte-1w81g8n">Hours</article></section></main>`;
}
export {
  _page as default
};
