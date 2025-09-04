import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import CreateRoomModal from './../../../../components/modal/CreateRoomModal.vue';

describe('CreateRoomModal', () => {
  it('renders correctly', () => {
    const wrapper = mount(CreateRoomModal);
    expect(wrapper.exists()).toBe(true);
  });
});
