<script lang="ts">
  export let variant: 'sm' | 'md' | 'lg' = 'md';
</script>

<div class="loading-wrapper" data-variant={variant}>
  <div class="loading-grid">
    <div class="loading" />
  </div>
</div>

<style lang="scss">
  .loading-wrapper {
    --loading-color: #C5AC79;
    display: inline-block;
    width: var(--loading-width);
    height: var(--loading-height);
    border: 4px solid gray;
    border-radius: 50%;
    border-top-color: var(--loading-color);
    animation: spin 1s ease-in-out infinite;
    -webkit-animation: spin 1s ease-in-out infinite;
  }

  .loading-grid {
    display: grid;
    align-items: center;
    justify-content: center;
  }

  @keyframes spin {
    to {
      -webkit-transform: rotate(360deg);
    }
  }
  @-webkit-keyframes spin {
    to {
      -webkit-transform: rotate(360deg);
    }
  }

  .loading-wrapper[data-variant='md'] {
    --loading-width: 32px;
    --loading-height: 32px;
  }
  .loading-wrapper[data-variant='lg'] {
    --loading-width: 48px;
    --loading-height: 48px;
  }
  .loading-wrapper[data-variant='sm'] {
    --loading-width: 24px;
    --loading-height: 24px;
  }
</style>
