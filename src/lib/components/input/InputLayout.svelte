<script>
  import './style.scss'
  export let id;
  export let label;
</script>

<div class="input-component grid gap-2">
  <label class="label" for={id}>{label}</label>
  <div class="input-wrapper flex gap-2 rounded-3">
    <slot name="input"/>
    <slot name="buttons"/>
  </div>
</div>

