import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import ContactComponent from './../../../components/ContactComponent.vue';

describe('ContactComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(ContactComponent);
    expect(wrapper.exists()).toBe(true);
  });
});
