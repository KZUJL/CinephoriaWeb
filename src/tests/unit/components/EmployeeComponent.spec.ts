import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import EmployeeComponent from './../../../components/EmployeeComponent.vue';

describe('EmployeeComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(EmployeeComponent);
    expect(wrapper.exists()).toBe(true);
  });
});
