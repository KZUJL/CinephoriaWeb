import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import MovieManagement from './../../../../components/admin/MovieManagement.vue';

describe('MovieManagement', () => {
  it('renders correctly', () => {
    const wrapper = mount(MovieManagement);
    expect(wrapper.exists()).toBe(true);
  });
});
