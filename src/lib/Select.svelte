<script>
  import Icon from "@iconify/svelte";

  let {children, icon, label, onchange, value = 0} = $props();

  function onSelectChange( evt ) {
    value = parseInt( evt.currentTarget.value );
    label = evt.currentTarget.options[evt.currentTarget.selectedIndex].textContent;
    icon = evt.currentTarget.options[evt.currentTarget.selectedIndex].getAttribute( 'data-icon' );    

    if( onchange ) onchange( value );
  }
</script>

<div>
  <Icon color="#161616" height="20" icon={icon} width="20" />
  <p>{label}</p>
  <Icon color="#161616" height="20" icon="material-symbols:keyboard-arrow-down-rounded" width="20" />
  <select {value} onchange={onSelectChange}>
    {@render children?.()}
  </select>
</div>

<style>
  div {
    align-items: center;
    border: solid 1px #00000040;
    border-radius: 4px;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    gap: 8px;
    height: 40px;
    padding: 0 12px 0 12px;
    position: relative;
  }

  p {
    color: #161616;
    cursor: pointer;
    font-family: 'Roboto Variable', sans-serif;
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0.10px;
    line-height: 20px;
    margin: 0;
    padding: 0;
  }

  select {
    cursor: pointer;
    height: 40px;
    left: 0;
    margin: 0;
    opacity: 0;
    padding: 0;
    position: absolute;
    top: 0;
    width: 100%;
    -webkit-tap-highlight-color: transparent;
  }
</style>