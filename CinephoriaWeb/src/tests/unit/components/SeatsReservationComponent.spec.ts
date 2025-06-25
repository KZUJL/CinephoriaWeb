import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import SeatsReservationComponent from './../../../components/SeatsReservationComponent.vue';

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

describe('SeatsReservationComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(SeatsReservationComponent);
    expect(wrapper.exists()).toBe(true);
  });
});
