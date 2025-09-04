import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import EditShowTimesModal from './../../../../components/modal/EditShowTimesModal.vue';

describe('EditShowTimesModal', () => {
  it('renders correctly', () => {
    const wrapper = mount(EditShowTimesModal);
    expect(wrapper.exists()).toBe(true);
  });
});
