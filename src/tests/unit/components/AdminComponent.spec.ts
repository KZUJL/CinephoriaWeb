import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import AdminComponent from './../../../components/AdminComponent.vue';

describe('AdminComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(AdminComponent);
    expect(wrapper.exists()).toBe(true);
  });
});
