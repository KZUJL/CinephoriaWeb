import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import TrailerModal from './../../../../components/modal/TrailerModal.vue';

describe('TrailerModal', () => {
  it('renders correctly', () => {
    const wrapper = mount(TrailerModal);
    expect(wrapper.exists()).toBe(true);
  });
});
