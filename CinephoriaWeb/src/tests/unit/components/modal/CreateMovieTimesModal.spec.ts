import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import CreateMovieTimesModal from './../../../../components/modal/CreateMovieTimesModal.vue';

describe('CreateMovieTimesModal', () => {
  it('renders correctly', () => {
    const wrapper = mount(CreateMovieTimesModal);
    expect(wrapper.exists()).toBe(true);
  });
});
