<template>
    <div class="modal fade" id="trailerModal" tabindex="-1" aria-labelledby="trailerModalLabel" aria-hidden="true"
        ref="modalEl">
        <div class="modal-dialog modal-lg modal-dialog-centered">
            <div class="modal-content bg-dark text-white">
                <div class="modal-header">
                    <h5 class="modal-title">{{ title }}</h5>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"
                        aria-label="Fermer"></button>
                </div>
                <div class="modal-body p-0">
                    <div class="ratio ratio-16x9">
                        <template v-if="isYoutube(embedUrl)">
                            <iframe :src="embedUrl" title="Bande annonce"
                                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowfullscreen></iframe>
                        </template>
                        <template v-else>
                            <video controls style="width: 100%; height: 100%;" ref="videoPlayer">
                                <source :src="embedUrl" type="video/mp4" />
                                Votre navigateur ne supporte pas la lecture de vidéos.
                            </video>
                        </template>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';

// Déclaration des props avec defineProps
const props = defineProps<{
    trailerUrl: string;
    title?: string;
}>();

const modalEl = ref<HTMLElement | null>(null);
const embedUrl = ref<string>('');
const videoPlayer = ref<HTMLVideoElement | null>(null);

// Fonction utilitaire
const isYoutube = (url: string) => url.includes("youtube.com/embed");

// Watch sur trailerUrl pour générer embedUrl
watch(
    () => props.trailerUrl,
    (newUrl) => {
        if (newUrl.includes("youtube.com/watch?v=")) {
            const videoId = newUrl.split("v=")[1];
            embedUrl.value = `https://www.youtube.com/embed/${videoId}`;
        } else {
            embedUrl.value = newUrl;
        }
    },
    { immediate: true }
);

// Gestion des événements bootstrap modal
onMounted(() => {
    if (!modalEl.value) return;

    modalEl.value.addEventListener('shown.bs.modal', () => {
        if (props.trailerUrl.includes("youtube.com/watch?v=")) {
            const videoId = props.trailerUrl.split("v=")[1];
            embedUrl.value = `https://www.youtube.com/embed/${videoId}`;
        } else {
            embedUrl.value = props.trailerUrl;
        }
    });

    modalEl.value.addEventListener('hidden.bs.modal', () => {
        embedUrl.value = '';
        if (videoPlayer.value) {
            videoPlayer.value.pause();
            videoPlayer.value.currentTime = 0;
        }
    });
});
</script>