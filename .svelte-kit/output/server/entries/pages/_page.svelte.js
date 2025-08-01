import { x as escape_html, v as pop, t as push } from "../../chunks/index.js";
import "clsx";
import { D as Database, I as Icon } from "../../chunks/Icon.js";
function _page($$payload, $$props) {
  push();
  new Database();
  $$payload.out += `<section class="svelte-mbcf5c"><header class="svelte-mbcf5c"><h1 class="svelte-mbcf5c">Fasting Hours</h1> <a href="/history" class="svelte-mbcf5c">`;
  Icon($$payload, {
    height: "20",
    icon: "material-symbols:insert-chart-outline-rounded",
    width: "20"
  });
  $$payload.out += `<!----> <span>History</span></a></header> <article class="svelte-mbcf5c">`;
  {
    $$payload.out += "<!--[!-->";
    $$payload.out += `<h3 class="svelte-mbcf5c">You are not fasting.</h3>`;
  }
  $$payload.out += `<!--]--> <button type="button" class="svelte-mbcf5c">${escape_html("Start")} fasting</button></article> <footer class="svelte-mbcf5c"><p class="svelte-mbcf5c">Made with ❤️ by <a href="http://kevinhoyt.com" class="svelte-mbcf5c">Kevin Hoyt</a>.</p></footer></section> <section class="svelte-mbcf5c"><h1 class="svelte-mbcf5c">What is this?</h1> <p class="svelte-mbcf5c">It is a fasting timer, duh! 😜 Actually, that is about all it is.</p> <p class="svelte-mbcf5c">Fasting Hours was born out of my desire for a simple fasting timer. No application to install. No subscription fees for features I never wanted. No notifications about integrations and sales. No selling my email address into the spam void.</p> <p class="svelte-mbcf5c">If you click on that "Start fasting" button, I will never know it. You will not get charged any fees. I do not have your email. I do not want your email. Your fasting history, your data, stays on your device.</p> <p class="svelte-mbcf5c">But then maybe I am getting ahead of myself...</p> <h1 class="svelte-mbcf5c">Why is this?</h1> <p class="svelte-mbcf5c">Fasting is a dietary technique to lose and/or maintain body weight. There are myriad approaches, but the basics to fasting are simple: do not eat for a given period of time. You might go 40 hours (alternate day fasting) without eating. Or perhaps 16 hours is more your speed (16:8).</p> <p class="svelte-mbcf5c">It is that passage of time that makes timers a useful motivational tool.</p> <p class="svelte-mbcf5c">When hunger seems to be overwhelming, you can see how much time you have until you hit your desired target. Maybe you take a step back and drink some water. Maybe you take the moment to reflect on any emotions that might be driving your hunger. Seeing the time on the screen. Knowing where you are in the fight. Knowing that it is being tracked. Seeing consistency emerge to prove to yourself that you can do it.</p> <p class="svelte-mbcf5c">Having the timer helps me. I hope it helps you, too.</p> <h1 class="svelte-mbcf5c">Who are you?</h1> <p class="svelte-mbcf5c">My name is Kevin Hoyt. I have been a software developer for almost 30 years (remote for 25 years of that time). I like to build tools that solve my problems. For me, weight is and has been a problem. My wife and I live in the Denver, CO area. I tend to quote pop culture references far more than I should (based on the confused looks I often get in return). 😂</p> <p class="svelte-mbcf5c">I update Fasting Hours on a semi-regular basis. Whenever I have feature ideas that I want to explore. Or whenever one of you have feature ideas you want me to explore. If that is the case, feel free to reach out (I do not bite) on <a href="https://bsky.app/profile/krhoyt.bsky.social" class="svelte-mbcf5c">Bluesky</a>.</p></section>`;
  pop();
}
export {
  _page as default
};
