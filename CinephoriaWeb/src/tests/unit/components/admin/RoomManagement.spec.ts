import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import RoomManagement from './../../../../components/admin/RoomManagement.vue';

describe('RoomManagement', () => {
  it('renders correctly', () => {
    const wrapper = mount(RoomManagement);
    expect(wrapper.exists()).toBe(true);
  });
});
