import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import EmployeeManagement from './../../../../components/admin/EmployeeManagement.vue';

describe('EmployeeManagement', () => {
  it('renders correctly', () => {
    const wrapper = mount(EmployeeManagement);
    expect(wrapper.exists()).toBe(true);
  });
});
