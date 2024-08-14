<script>
  export let href = undefined;
</script>

<a {href}>
  <img alt="avatar" src="/images/user/avatar.jpg" />
</a>

<style>
  a {
    cursor: pointer
  }
  img {
    border-radius: 50%;
    width: 40px;
    height: 40px;
  }
</style>
