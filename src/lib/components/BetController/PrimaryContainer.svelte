<div class="input-wrapper">
  <div class="input-view-wrapper"><slot /></div>
</div>

<style lang="scss">
  .input-wrapper {
    height: calc(100% - 12px);
    padding: 6px;
    border-radius: 6px;
    border: 1px solid #6f767e;
    background: #f2f2f2;
    box-shadow: 0px 4.417391777038574px 4.417391777038574px 0px rgba(0, 0, 0, 0.25);
    transition-duration: 0.4s;
    -webkit-transition-duration: 0.4s;
    position: relative;
    color: black;

    .input-view-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 100%;
      height:100%;
    }
  }

  @media (min-width: 375px) {
    .input-wrapper {
      padding: 8px;
      height: calc(100% - 16px);
    }
  }
  @media (min-width: 1440px) {
    .input-wrapper {
      padding: 12px;
      height: calc(100% - 24px);
    }
  }

  :global([data-theme='dark']) {
    .input-wrapper {
      border-color: #364358;
      background: #1b1b23;
      color: #d4d4d4;
    }
  }

</style>
