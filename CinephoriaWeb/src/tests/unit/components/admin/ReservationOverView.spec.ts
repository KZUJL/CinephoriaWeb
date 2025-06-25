import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ReservationOverView from './../../../../components/admin/ReservationOverView.vue';

describe('ReservationOverView', () => {
  it('renders correctly', () => {
    const wrapper = mount(ReservationOverView);
    expect(wrapper.exists()).toBe(true);
  });
});
