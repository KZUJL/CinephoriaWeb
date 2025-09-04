<template>
    <div ref="modalRef" class="modal fade" id="createAccountModal" tabindex="-1"
        aria-labelledby="createAccountModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="createAccountModalLabel">Inscription réussie</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
                </div>
                <div class="modal-body">
                    Inscription réussie. Un mail de confirmation vous a été envoyé.
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                        OK
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const modalRef = ref<HTMLElement | null>(null)

const handleModalClosed = () => {
    if (router.currentRoute.value.path !== '/admin') {
        router.push('/')
    }
}

onMounted(() => {
    if (modalRef.value) {
        modalRef.value.addEventListener('hidden.bs.modal', handleModalClosed)
    }
})

onBeforeUnmount(() => {
    if (modalRef.value) {
        modalRef.value.removeEventListener('hidden.bs.modal', handleModalClosed)
    }
})
</script>
