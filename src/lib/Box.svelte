<script>
  let {
    background = null,
    centered = false, 
    children, 
    direction = 'row', 
    gap = 0, 
    grow = false, 
    height = null,
    justified = false,
    margin = null,
    opacity = 1.0,
    padding = null,
    width = null
  } = $props();
</script>

<div
  style:align-items={centered ? 'center' : ''}
  style:background={background === null ? '' : background}
  style:flex-basis={grow ? 0 : ''}
  style:flex-direction={direction} 
  style:flex-grow={grow ? 1 : ''}  
  style:gap={gap === 0 ? '' : gap + 'px'}
  style:height={height === null ? '' : height + 'px'}  
  style:justify-content={justified ? 'center' : ''}
  style:margin={margin === null ? '' : margin}
  style:opacity
  style:padding={padding === null ? '' : padding}
  style:width={width === null ? '' : width + 'px'}>
  {@render children?.()}
</div>

<style>
  div {
    bottom: var( --box-bottom );    
    box-sizing: border-box;
    display: flex;
    justify-self: var( --box-justify-self );
    left: var( --box-left );    
    overflow: var( --box-overflow );
    position: var( --box-position, relative );
    right: var( --box-right );
    top: var( --box-top );
    z-index: var( --box-z-index );
  }
</style>
