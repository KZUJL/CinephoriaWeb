import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import MovieDetailComponent from './../../../components/MovieDetailComponent.vue';


vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      movieId: '123',
      cinemaId: '456',
    },
    path: '/',
  }),
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe('MovieDetailComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(MovieDetailComponent);
    expect(wrapper.exists()).toBe(true);
  });
});
