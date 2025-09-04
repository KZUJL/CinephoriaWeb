import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import CreateUserReviews from './../../../../components/modal/CreateUserReviews.vue';

describe('CreateUserReviews', () => {
  it('renders correctly', () => {
    const wrapper = mount(CreateUserReviews);
    expect(wrapper.exists()).toBe(true);
  });
});
