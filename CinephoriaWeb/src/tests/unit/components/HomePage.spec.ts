import { mount, flushPromises } from '@vue/test-utils';
import HomePage from '../../../components/HomeComponent.vue';
import { describe, vi, it , expect } from 'vitest';
import { useRouter } from 'vue-router';

// Mock du router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
}));

// Mock des films
const nouveautesMock = [
  { movieId: 1, title: 'Film A', poster: 'posterA.jpg' },
  { movieId: 2, title: 'Film B', poster: 'posterB.jpg' },
];

const prochainesSortiesMock = [
  { movieId: 3, title: 'Film C', poster: 'posterC.jpg' },
];

// Mock de l’API
vi.mock('../../../services/apiCinephoria', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      getAvailableMovies: () => Promise.resolve(nouveautesMock),
      getSoonAvailableMovies: () => Promise.resolve(prochainesSortiesMock),
    })),
  };
});

describe('HomePage.vue', () => {
  it('appelle les fonctions fetchAvailableMovies et fetchSoonAvailableMovies au montage', async () => {
    const wrapper = mount(HomePage);
    await flushPromises();

    expect(wrapper.text()).toContain('Film A');
    expect(wrapper.text()).toContain('Film B');
    expect(wrapper.text()).toContain('Film C');
  });

  it('affiche les bons titres de films', async () => {
    const wrapper = mount(HomePage);
    await flushPromises();

    const cards = wrapper.findAll('.card');
    expect(cards).toHaveLength(3);
    expect(cards[0].text()).toContain('Film A');
    expect(cards[1].text()).toContain('Film B');
    expect(cards[2].text()).toContain('Film C');
  });

  it('navigue vers la page de détail au clic sur une carte film', async () => {
    const pushMock = vi.fn();
    // On mock useRouter pour retourner un objet avec push mocké
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      push: pushMock,
    });

    const wrapper = mount(HomePage);
    await flushPromises();

    await wrapper.findAll('.card')[0].trigger('click');
    expect(pushMock).toHaveBeenCalledWith('/movie/1');
  });
});
