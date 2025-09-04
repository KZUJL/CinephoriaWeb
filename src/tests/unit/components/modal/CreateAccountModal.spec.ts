import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import CreateAccountModal from './../../../../components/modal/CreateAccountModal.vue';

describe('CreateAccountModal', () => {
  it('renders correctly', () => {
    const wrapper = mount(CreateAccountModal);
    expect(wrapper.exists()).toBe(true);
  });
});
