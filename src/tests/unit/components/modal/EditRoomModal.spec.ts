import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import EditRoomModal from './../../../../components/modal/EditRoomModal.vue';

describe('EditRoomModal', () => {
  it('renders correctly', () => {
    const wrapper = mount(EditRoomModal);
    expect(wrapper.exists()).toBe(true);
  });
});
