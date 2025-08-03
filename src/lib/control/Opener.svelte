<script>
  import Icon from "@iconify/svelte";

  let {ontoggle, open = false} = $props();
</script>

<button type="button">
  <Icon height="20" icon="material-symbols:question-mark-rounded" width="20" />
</button>

<style>
  button {
    align-items: center;
    appearance: none;
    background: none;
    border: solid 1px #00000040;
    border-radius: 40px;
    box-sizing: border-box;
    color: #161616;
    cursor: pointer;
    display: flex;
    height: 40px;
    justify-content: center;
    justify-self: end;
    margin: 0;
    outline: none;
    padding: 0;
    width: 40px;
    -webkit-tap-highlight-color: transparent;
  }
</style>
