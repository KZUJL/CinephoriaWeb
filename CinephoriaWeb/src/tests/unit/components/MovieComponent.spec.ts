import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Mock } from 'vitest';
import MovieComponent from './../../../components/MovieComponent.vue';
import { useRouter } from 'vue-router';

// Mock router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
}));

// Mock API
const mockMovies = [
  { movieId: 1, title: 'Film A', genre: 'Action', poster: '', minimumAge: '12+', averageReview: 4.2 },
  { movieId: 2, title: 'Film B', genre: 'Comédie', poster: '', minimumAge: 'All', averageReview: null },
];

const mockCinemas = [
  { cinemaId: 1, name: 'Cinéma A' },
];

const mockSeances = [
  { movieId: 1, cinemaId: 1, day: new Date(Date.now() + 86400000).toISOString() }, // demain
];

const mockReviews = {
  averageReview: 4.2,
};

// Mock de l'API Cinephoria
vi.mock('../../../services/apiCinephoria', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getMovies: () => Promise.resolve(mockMovies),
      getCinemas: () => Promise.resolve(mockCinemas),
      getMovieTimes: () => Promise.resolve(mockSeances),
      getReviewsAverage: () => Promise.resolve(mockReviews),
    })),
  };
});

describe('MovieComponent.vue', () => {
  let pushMock: Mock;


  beforeEach(() => {
    pushMock = vi.fn();
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ push: pushMock });
  });

  it('affiche les films après chargement', async () => {
    const wrapper = mount(MovieComponent);
    await flushPromises();

    const cards = wrapper.findAll('.card');
    expect(cards.length).toBe(1); // seul Film A a une séance valide
    expect(wrapper.text()).toContain('Film A');
  });

  it('navigue vers la page de détails si aucun cinéma sélectionné', async () => {
    const wrapper = mount(MovieComponent);
    await flushPromises();

    const cards = wrapper.findAll('.card');
    await cards[0].trigger('click');

    expect(pushMock).toHaveBeenCalledWith('/movie/1');
  });

  it('navigue vers la page de réservation si un cinéma est sélectionné', async () => {
    const wrapper = mount(MovieComponent);
    await flushPromises();

    await wrapper.find('#cinemaSelect').setValue('1');
    const cards = wrapper.findAll('.card');
    await cards[0].trigger('click');

    expect(pushMock).toHaveBeenCalledWith({
      name: 'movieReservation',
      params: { movieId: 1, cinemaId: 1 }
    });
  });

  it('filtre les films par genre', async () => {
    const wrapper = mount(MovieComponent);
    await flushPromises();

    await wrapper.find('#genreSelect').setValue('Comédie');
    const cards = wrapper.findAll('.card');

    expect(cards.length).toBe(0); // Film B n’a pas de séance valide
  });

  it('filtre les dates disponibles', async () => {
    const wrapper = mount(MovieComponent);
    await flushPromises();

    const options = wrapper.findAll('#dateSelect option');
    expect(options.length).toBeGreaterThan(1); // Il y a au moins la date de demain
  });
});
