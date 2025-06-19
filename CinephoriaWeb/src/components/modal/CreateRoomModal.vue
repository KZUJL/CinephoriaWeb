<!-- components/modal/CreateRoomModal.vue -->
<template>
  <div class="modal fade" id="createRoomModal" tabindex="-1" aria-labelledby="createRoomModal" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Ajouter une salle</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fermer"></button>
        </div>
        <div class="modal-body scrollable-body">
          <form>
            <div class="mb-3">
              <label class="form-label">Cinéma</label>
              <select class="form-select" :value="room ? room.cinemaId : ''"
                @change="e => { if (room) room.cinemaId = Number((e.target as HTMLSelectElement).value) }">
                <option value="" disabled>Sélectionnez un cinéma</option>
                <option v-for="cinema in cinemas" :key="cinema.cinemaId" :value="cinema.cinemaId">
                  {{ cinema.name }}
                </option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Nom de la salle</label>
              <input type="text" class="form-control" :value="room ? room.name : ''"
                @input="e => { if (room) room.name = (e.target as HTMLInputElement).value }" />
            </div>
            <div class="mb-3">
              <label class="form-label">Qualité</label>
              <select class="form-select">
                <option value="Classique">Classique</option>
                <option value="IMAX">IMAX</option>
              </select>
            </div>
            <div class="mb-3">
              <label class="form-label">Nombre de sièges</label>
              <input type="text" class="form-control" v-model.number="seatCount" min="0" />
            </div>
            <div class="mb-3" v-if="room">
              <div style="overflow-x:auto;">
                <table class="table table-bordered align-middle" style="table-layout: auto;">
                  <thead>
                    <tr>
                      <th style="min-width: 100px;">Liste des sièges</th>
                      <th style="min-width: 140px;">Type</th>
                      <th style="width: 80px;">Ligne</th>
                      <th style="width: 80px;">Colonne</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(seat, index) in room.seats" :key="index">
                      <td>
                        <input type="text" class="form-control form-control-sm" v-model="seat.name" />
                      </td>
                      <td>
                        <select class="form-select form-select-sm" v-model="seat.type" style="min-width: 150px;">
                          <option value="Fauteuil Standard">Fauteuil Standard</option>
                          <option value="Emplacement PMR">Emplacement PMR</option>
                        </select>
                      </td>
                      <td>
                        <input type="text" class="form-control form-control-sm" v-model="seat.rowLocation"
                          style="width: 50px;" />
                      </td>
                      <td>
                        <input type="text" class="form-control form-control-sm" v-model="seat.columnLocation"
                          style="width: 60px;" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div class="modal-footer">
              <button class="btn btn-secondary" data-bs-dismiss="modal">Annuler</button>
              <button class="btn btn-primary" @click="onSave">Enregistrer</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { watch, defineProps, onMounted, ref } from 'vue'
import * as bootstrap from 'bootstrap'
import ApiCinephoria from '../../services/apiCinephoria';
import type { Cinema, Room, RoomDto, SeatDtoInput } from '../../models/types';

const api = new ApiCinephoria();
const room = ref<Room | null>(null);
const seatCount = ref<number>(0)

const cinemas = ref<Cinema[]>([]);

const fetchCinemas = async () => {
  try {
    const result = await api.getCinemas();
    if (Array.isArray(result)) {
      cinemas.value = result;
    } else {
      console.error("Erreur : la réponse de l'API cinémas n'est pas un tableau");
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des cinémas :', error);
  }
};

const props = defineProps<{
  modelValue: boolean,
}>()

// Mettre à jour les sièges quand seatCount change
watch(seatCount, (newCount) => {
  if (!room.value) return

  const currentSeats = room.value.seats


  function getSeatName(index: number) {
    const seatsPerRow = 15
    const row = String.fromCharCode(65 + Math.floor(index / seatsPerRow))
    const number = (index % seatsPerRow) + 1
    return `${row}${number}`
  }

  if (newCount > currentSeats.length) {
    // Ajouter les sièges manquants
    for (let i = currentSeats.length; i < newCount; i++) {
      const seatsPerRow = 15
      const rowIndex = Math.floor(i / seatsPerRow)
      const colIndex = i % seatsPerRow
      currentSeats.push({
        locationId: 0,
        roomId: room.value.roomId ?? 0,
        name: getSeatName(i),
        type: 'Fauteuil Standard',
        rowLocation: rowIndex + 1, // 1 pour A, 2 pour B, etc.
        columnLocation: colIndex + 1, // 1 pour A1, 2 pour A2, etc.
        room: room.value.name ?? ''
      })
    }
  } else if (newCount < currentSeats.length) {
    // Réduire le nombre de sièges
    room.value.seats = currentSeats.slice(0, newCount)
  }
})

watch(() => props.modelValue, (newVal) => {
  const modalEl = document.getElementById('createRoomModal')
  if (!modalEl) return

  let modal = bootstrap.Modal.getInstance(modalEl)
  if (newVal) {
    // Si pas encore d'instance, crée-la
    if (!modal) modal = new bootstrap.Modal(modalEl)
    modal.show()
  } else {
    if (modal) modal.hide()
  }
})

const emit = defineEmits<{
  (e: 'save', room: RoomDto & { seats: SeatDtoInput[] }): void
  (e: 'update:modelValue', value: boolean): void
}>()


function onSave(e: Event) {
  e.preventDefault();

  if (room.value) {
    room.value.seatsNumber = seatCount.value;

    // Validation des champs obligatoires
    if (!room.value.cinemaId || !room.value.name || !room.value.quality || !room.value.seatsNumber) {
      console.log('Données envoyées', room.value);
      alert("Veuillez remplir tous les champs obligatoires (cinéma, nom, qualité, nombre de sièges).");
      return;
    }

    // Prépare un DTO conforme à ce que l'API attend, sans roomId ni seats
    const roomDto = {
      cinemaId: room.value.cinemaId,
      name: room.value.name,
      quality: room.value.quality,
      seatsNumber: room.value.seatsNumber
    };

    const seatsDto: SeatDtoInput[] = room.value.seats.map(seat => ({
      name: seat.name,
      type: seat.type,
      rowLocation: seat.rowLocation,
      columnLocation: seat.columnLocation
    }));

    console.log("Objet Seat envoyé :", seatsDto);
    console.log("Objet Room envoyé :", roomDto);
    emit('save', {
      ...roomDto,
      seats: seatsDto
    });
    emit('update:modelValue', false);

  }
}

onMounted(async () => {
  await fetchCinemas();
  // Initialiser la salle si on est en mode création
  room.value = {
    roomId: 0,
    name: '',
    quality: 'Classique',
    cinemaId: 0,
    seatsNumber: 0,
    cinema: null,
    seats: []
  };
});
</script>
