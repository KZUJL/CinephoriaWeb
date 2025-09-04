import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ReservationComponent from './../../../components/ReservationComponent.vue';

describe('ReservationComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(ReservationComponent);
    expect(wrapper.exists()).toBe(true);
  });
});
