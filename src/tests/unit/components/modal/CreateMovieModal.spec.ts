import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import CreateMovieModal from './../../../../components/modal/CreateMovieModal.vue';

describe('CreateMovieModal', () => {
  it('renders correctly', () => {
    const wrapper = mount(CreateMovieModal);
    expect(wrapper.exists()).toBe(true);
  });
});
