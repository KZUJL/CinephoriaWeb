import { mount, flushPromises } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import LoginComponent from '../../../components/LoginComponent.vue';
import { useRouter } from 'vue-router';

// Mock du router
vi.mock('vue-router', () => ({
  useRouter: vi.fn(),
}));

// Mock de l'API Cinephoria
const mockLoginResponse = {
  userId: 1,
  email: 'test@example.com',
  mustChangePassword: false,
};

vi.mock('../../../services/apiCinephoria', () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      postLogin: vi.fn(() => Promise.resolve(mockLoginResponse)),
      postSendResetPassword: vi.fn(() => Promise.resolve()),
    })),
  };
});

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem(key: string) {
      return store[key] || null;
    },
    setItem(key: string, value: string) {
      store[key] = value;
    },
    clear() {
      store = {};
    },
    removeItem(key: string) {
      delete store[key];
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('LoginComponent.vue', () => {
  let pushMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    pushMock = vi.fn(() => Promise.resolve());
    (useRouter as unknown as ReturnType<typeof vi.fn>).mockReturnValue({ push: pushMock });

    localStorage.clear();
  });

  it('affiche le formulaire de connexion', () => {
    const wrapper = mount(LoginComponent);
    expect(wrapper.find('form').exists()).toBe(true);
    expect(wrapper.find('input#email').exists()).toBe(true);
    expect(wrapper.find('input#password').exists()).toBe(true);
  });

  it('soumet le formulaire avec succès et redirige', async () => {
    const wrapper = mount(LoginComponent);
    await wrapper.find('#email').setValue('test@example.com');
    await wrapper.find('#password').setValue('password123');

    // Simuler un "previousRoute" stocké
    localStorage.setItem('previousRoute', '/');

    await wrapper.find('form').trigger('submit.prevent');
    await flushPromises();

    expect(localStorage.getItem('user')).toContain('test@example.com');
    expect(pushMock).toHaveBeenCalledWith('/');
  });

it('redirige vers la page de changement de mot de passe si mustChangePassword = true', async () => {
  const api = (await import('../../../services/apiCinephoria')).default;
  api.prototype.postLogin = vi.fn(() =>
    Promise.resolve({ ...mockLoginResponse, mustChangePassword: true })
  );

  const setItemMock = vi.spyOn(window.localStorage, 'setItem');  // placer avant le mount

  const wrapper = mount(LoginComponent);

  await wrapper.find('#email').setValue('reset@example.com');
  await wrapper.find('#password').setValue('azerty');
  await wrapper.vm.$nextTick();

  await wrapper.find('form').trigger('submit.prevent');
  await flushPromises();
  await wrapper.vm.$nextTick();

  console.log(setItemMock.mock.calls); // debug

  expect(setItemMock).toHaveBeenCalledWith('changePasswordEmail', 'reset@example.com');
  expect(pushMock).toHaveBeenCalledWith('/change-password');
});



 it('affiche une erreur si le login échoue', async () => {
  const api = (await import('../../../services/apiCinephoria')).default;
  api.prototype.postLogin = vi.fn(() => Promise.reject(new Error('login failed')));

  const wrapper = mount(LoginComponent);

  await wrapper.find('#email').setValue('wrong@example.com');
  await wrapper.find('#password').setValue('wrongpassword');

  await wrapper.find('form').trigger('submit.prevent');
  await flushPromises();  // attendre que la promesse rejetée soit prise en compte 

  await wrapper.vm.$nextTick(); // attendre un tick Vue si besoin

  expect(wrapper.text()).toContain('Identifiants incorrects ou erreur serveur.');
});

});
