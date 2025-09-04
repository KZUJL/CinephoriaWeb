import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ChangePasswordComponent from './../../../components/ChangePasswordComponent.vue';

describe('ChangePasswordComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(ChangePasswordComponent);
    expect(wrapper.exists()).toBe(true);
  });
});
