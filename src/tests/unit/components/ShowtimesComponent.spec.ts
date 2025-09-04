import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import ShowtimesComponent from './../../../components/ShowtimesComponent.vue';

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

describe('ShowtimesComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(ShowtimesComponent);
    expect(wrapper.exists()).toBe(true);
  });
});
