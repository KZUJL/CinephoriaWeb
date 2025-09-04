import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ReviewManagement from './../../../../components/employee/ReviewManagement.vue';

describe('ReviewManagement', () => {
  it('renders correctly', () => {
    const wrapper = mount(ReviewManagement);
    expect(wrapper.exists()).toBe(true);
  });
});
