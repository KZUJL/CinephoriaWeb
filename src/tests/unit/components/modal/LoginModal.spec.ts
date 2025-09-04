import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import LoginModal from './../../../../components/modal/LoginModal.vue';

describe('LoginModal', () => {
  it('renders correctly', () => {
    const wrapper = mount(LoginModal);
    expect(wrapper.exists()).toBe(true);
  });
});
