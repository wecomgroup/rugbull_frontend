<script>
  import './style.scss'
  export let id;
  export let checked = false;
  export let label = "Auto Cashout";
</script>

<div class="checkbox-container input-component">
  <input class="inp-cbx" {id} type="checkbox" bind:checked>
  <label class="cbx" for={id} style="display: flex; align-items: center">
    <span style="margin-right: 8px;"> </span>
    <span class="label">{label}</span>
  </label>
  <svg class="inline-svg">
    <symbol id="check-4" viewBox="0 0 12 10">
      <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
    </symbol>
  </svg>
</div>

<style>
  .checkbox-container {
    display: flex;
  }
  .checkbox-container * {
    box-sizing: border-box;
  }

  .checkbox-container .cbx {
    -webkit-user-select: none;
    user-select: none;
    cursor: pointer;
    border-radius: 6px;
    overflow: hidden;
    transition: all 0.2s ease;
    display: inline-block;

    padding: 4px 0;
  }

  .checkbox-container .cbx:hover {
    background: rgba(0,119,255,0.16);
  }

  .checkbox-container .cbx span:first-child {
    float: left;
    vertical-align: middle;
    transform: translate3d(0, 0, 0);
  }

  .checkbox-container .cbx span:first-child {
    position: relative;
    width: 18px;
    min-width: 18px;
    height: 18px;
    border-radius: 4px;
    transform: scale(1);
    border: 2px solid var(--label);
    transition: all 0.2s ease;
    box-shadow: 0 1px 1px rgba(0,16,75,0.05);
  }

  .checkbox-container .cbx span:first-child svg {
    position: absolute;
    top: 3px;
    left: 2px;
    fill: none;
    transition: all 0.3s ease;
    transition-delay: 0.1s;
    transform: translate3d(0, 0, 0);
  }

  .checkbox-container .cbx:hover span:first-child {
    border-color: var(--brand);
  }

  .checkbox-container .inp-cbx {
    position: absolute;
    visibility: hidden;
  }

  .checkbox-container .inp-cbx:checked + .cbx span:first-child {
    background: var(--brand);
    border-color: var(--brand);
    animation: wave-4 0.4s ease;
  }

  .checkbox-container .inp-cbx:checked + .cbx span:first-child svg {
    stroke-dashoffset: 0;
  }

  .checkbox-container .inline-svg {
    position: absolute;
    width: 0;
    height: 0;
    pointer-events: none;
    user-select: none;
  }

  @media screen and (max-width: 640px) {
    .checkbox-container .cbx {
      width: 100%;
      display: inline-block;
    }
  }
</style>
