<script>
  export let id;
  export let label;
</script>

<div class="grid gap-2">
  <label class="label" for={id}>{label}</label>
  <slot/>
</div>

