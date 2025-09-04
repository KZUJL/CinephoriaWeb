import { mount } from '@vue/test-utils';
import { describe, it, expect } from 'vitest';
import DashBoardComponent from './../../../components/DashBoardComponent.vue';

describe('DashBoardComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(DashBoardComponent);
    expect(wrapper.exists()).toBe(true);
  });
});
