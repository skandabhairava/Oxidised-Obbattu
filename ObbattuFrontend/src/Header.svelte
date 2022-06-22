<script>
    import HelpModal from "./Popups/HelpPopup/HelpModalManager.svelte"
    import StatPopup from "./Popups/StatPopup/StatModalManager.svelte"

    import Modal from "svelte-simple-modal";
</script>

<div class="flexx">
    <Modal classContent="modal">
        <HelpModal />
    </Modal>
    <div class="title">
        <h1>ಒಬ್ಬಟ್ಟು</h1>
    </div>
    <Modal classContent="modal">
        <StatPopup />
    </Modal>
</div>

<style>
    
    .title {
        /* display: flex;
        flex-direction: column;
        align-items: center;
        margin-top: 0;
        margin-bottom: 0; */
        font-size: larger;
        font-weight: 500;
        letter-spacing: 5px;
    }
    
    
    .title>* {
        margin-top: 10px;
        margin-bottom: 10px;
    }
</style>