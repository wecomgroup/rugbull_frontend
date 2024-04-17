<script>
  export let style = undefined;
</script>
<div class="container" style={style}>
  <div class="loader"></div>
</div>
<style>
  .container {
    font-size: 1px;
  }
  .loader {
    position: relative;
    width: 78em;
    height: 78em;
    border-radius: 50%;
    background: #fff;
    border: 8em solid #131a1d;
    overflow: hidden;
    box-sizing: border-box;
  }

  .loader::after {
    content: '';
    position: absolute;
    left: 0;
    top: -50%;
    width: 100%;
    height: 100%;
    background: #263238;
    z-index: 5;
    border-bottom: 8em solid #131a1d;
    box-sizing: border-box;
    animation: eyeShade 3s infinite;
  }

  .loader::before {
    content: '';
    position: absolute;
    left: 20em;
    bottom: 15em;
    width: 32em;
    z-index: 2;
    height: 32em;
    background: #111;
    border-radius: 50%;
    animation: eyeMove 3s infinite;
  }

  @keyframes eyeShade {
    0% {
      transform: translateY(0)
    }

    20% {
      transform: translateY(5em)
    }

    40% , 50% {
      transform: translateY(-5em)
    }

    60% {
      transform: translateY( -8em)
    }

    75% {
      transform: translateY( 5em)
    }

    100% {
      transform: translateY(10em)
    }
  }

  @keyframes eyeMove {
    0% {
      transform: translate(0 , 0)
    }

    20% {
      transform: translate(0em , 5em)
    }

    40% , 50% {
      transform: translate(0em , -5em)
    }

    60% {
      transform: translate(-10em , -5em)
    }

    75% {
      transform: translate(-20em , 5em)
    }

    100% {
      transform: translate(0 , 10em)
    }
  }
</style>