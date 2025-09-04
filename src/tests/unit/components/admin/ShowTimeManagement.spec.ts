import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ShowTimeManagement from './../../../../components/admin/ShowTimeManagement.vue';

describe('ShowTimeManagement', () => {
  it('renders correctly', () => {
    const wrapper = mount(ShowTimeManagement);
    expect(wrapper.exists()).toBe(true);
  });
});
