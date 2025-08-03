<script>
  let {
    align = 'left',
    children, 
    color = '#161616',
    display = 'inline',
    grow = false,
    line = 24,
    margin = null,
    padding = null,
    size = 16,
    spacing = 0.10,
    weight = 400
  } = $props();
</script>

<p 
  style:color={color}
  style:display={display}
  style:flex-basis={grow ? '0' : ''}
  style:flex-grow={grow ? '1' : ''}  
  style:font-size={size + 'px'} 
  style:font-weight={weight}
  style:letter-spacing={spacing + 'px'}
  style:line-height={line + 'px'}
  style:margin={margin === null ? '0' : margin}
  style:padding={padding === null ? '0' : padding}
  style:text-align={align}>
  {@render children?.()}
</p>

<style>
  p {
    cursor: default;
    font-family: 'Roboto Variable', sans-serif;
  }
</style>
