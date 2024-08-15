<script lang="ts">
    export let dropdownyposition: "above" | "below" | undefined = undefined;
    export let style = undefined;
    export let buttonWrapperStyle = undefined;
    export let dropdownWrapperStyle = undefined;
    let isOpen = false;

    const toggle = () => (isOpen = !isOpen);
    const close = () => (isOpen = false);
</script>

<div class="container" {style}>
    <div
        class="close-layer {isOpen ? 'close-layer-open' : ''}"
        on:click={close}
        on:keypress={close}
    />
    <div
        class="button-wrapper"
        on:click={toggle}
        on:keypress={toggle}
        style={buttonWrapperStyle}
    >
        <slot name="button" />
    </div>
    <div
        class="dropdown {isOpen ? 'dropdown-open' : ''} 
        {dropdownyposition === 'above' ? 'dropdown-above' : 'dropdown-below'}"
        style={dropdownWrapperStyle}
        on:click={close}
        on:keypress={close}
    >
        <slot name="dropdown" />
    </div>
</div>

<style>
    .container {
        position: relative;
    }

    .dropdown-below {
        transform: translate(0, -16px);
    }

    .dropdown-above {
        bottom: 100%;
        transform: translate(0, 16px);
    }

    .dropdown {
        position: absolute;
        left: 0;

        z-index: 1;

        opacity: 0;
        pointer-events: none;

        transition: all ease 0.3s;
    }

    .dropdown-open {
        opacity: 1;
        pointer-events: all;
        transform: translate(0, 0px);
    }

    .close-layer {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
    }
    .close-layer-open {
        display: block;
    }

    .button-wrapper {
        width: fit-content;
    }
</style>
