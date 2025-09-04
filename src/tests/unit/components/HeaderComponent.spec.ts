import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import HeaderComponent from './../../../components/HeaderComponent.vue';



vi.mock('vue-router', async () => {
  const actual = await vi.importActual<typeof import('vue-router')>('vue-router');
  return {
    ...actual,
    useRoute: () => ({ path: '/' }),
    useRouter: () => ({
      push: vi.fn(), // si ton composant fait des redirections
    }),
  };
});

describe('HeaderComponent', () => {
  it('renders correctly', () => {
    const wrapper = mount(HeaderComponent);
    expect(wrapper.exists()).toBe(true);
  });
});
