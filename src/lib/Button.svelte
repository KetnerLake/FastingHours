<script>
  import Icon from "@iconify/svelte";

  let {
    children, 
    data = null,
    href = null, 
    icon = null, 
    kind = null, 
    margin = null, 
    padding = null, 
    popover = null,
    onclick
  } = $props();
</script>

{#if href === null}
  <button 
    class={kind}
    class:icon
    {onclick} 
    popovertarget={popover === null ? '' : popover}
    popovertargetaction="toggle"
    style:margin={margin === null ? '' : margin} 
    style:padding={padding === null ? '' : padding} 
    type="button">
    {#if icon !== null}
      <Icon height="20" {icon} width="20" />
    {/if}
    {@render children?.()}
  </button>
{:else}
  <a 
    {href} 
    style:margin={margin === null ? '' : margin} 
    style:padding={padding === null ? '' : padding}>
    {#if icon !== null}
      <Icon height="20" {icon} width="20" />
    {/if}    
    {@render children?.()}
  </a>
{/if}

<style>
  a {
    align-items: center;
    color: #0082ff;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    gap: 8px;
    letter-spacing: 0.50px;
    line-height: 20px;
    text-decoration: none;    
    -webkit-tap-highlight-color: transparent    
  }

  button {
    align-items: center;
    appearance: none;
    background: #161616;
    border: none;
    border-radius: 40px;
    color: #f4f4f4;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 500;
    gap: 8px;
    height: 40px;
    justify-self: var( --button-justify-self );
    line-height: 20px;
    letter-spacing: 0.10px;
    margin: 0;
    min-width: 0;
    outline: none;
    padding: 0 16px 0 16px;
    -webkit-tap-highlight-color: transparent
  }

  button.inline {
    background: none;
    color: #0082ff;
    display: inline-flex;
    font-size: 14px;
    font-weight: 500;
    gap: 4px;
    height: unset;
    letter-spacing: 0.50px;
    line-height: 20px;
    padding: 0;
    vertical-align: middle;    
  }

  button.link {
    background: none;
    color: #0082ff;
    letter-spacing: 0.50px;
    padding: 0;
  }

  button.secondary {
    background: none;
    border: solid 1px #161616;
    color: #161616;
    justify-content: center;
    letter-spacing: 0.50px;
    padding: 0 16px 0 16px;
  }  

  button.secondary.icon {
    padding: 0 16px 0 12px;
  }
</style>
