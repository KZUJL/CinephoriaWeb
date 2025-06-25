import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import CreateAccountComponent from './../../../components/CreateAccountComponent.vue';

describe('CreateAccountComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(CreateAccountComponent);
    expect(wrapper.exists()).toBe(true);
  });
});
