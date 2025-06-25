import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import EditMovieModal from './../../../../components/modal/EditMovieModal.vue';

describe('EditMovieModal', () => {
  it('renders correctly', () => {
    const wrapper = mount(EditMovieModal);
    expect(wrapper.exists()).toBe(true);
  });
});
