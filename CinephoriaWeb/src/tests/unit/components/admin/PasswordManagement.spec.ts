import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import PasswordManagement from './../../../../components/admin/PasswordManagement.vue';

describe('PasswordManagement', () => {
  it('renders correctly', () => {
    const wrapper = mount(PasswordManagement);
    expect(wrapper.exists()).toBe(true);
  });
});
