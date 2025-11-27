import { setAuthTokenProvider } from "../services/apiClient.js";

const STORAGE_KEY = "gms_session";

const state = {
  user: null,
  token: null,
  cart: {
    items: [],
    subtotal: 0,
  },
};

const subscribers = new Set();

setAuthTokenProvider(() => state.token);
hydrateFromStorage();

export function getState() {
  return {
    user: state.user,
    token: state.token,
    cart: {
      items: [...state.cart.items],
      subtotal: state.cart.subtotal,
    },
  };
}

export function subscribe(listener) {
  subscribers.add(listener);
  listener(getState());
  return () => subscribers.delete(listener);
}

export const appActions = {
  setSession({ user, token }) {
    state.user = user;
    state.token = token;
    persist();
    notify();
  },
  clearSession() {
    state.user = null;
    state.token = null;
    state.cart = { items: [], subtotal: 0 };
    persist();
    notify();
  },
  setCart(cart) {
    state.cart = {
      items: cart.items ?? [],
      subtotal: cart.subtotal ?? 0,
    };
    notify();
  },
};

function notify() {
  const snapshot = getState();
  subscribers.forEach((listener) => listener(snapshot));
}

function persist() {
  if (typeof localStorage === "undefined") return;
  if (!state.token) {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      user: state.user,
      token: state.token,
    })
  );
}

function hydrateFromStorage() {
  if (typeof localStorage === "undefined") return;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    state.user = parsed.user ?? null;
    state.token = parsed.token ?? null;
  } catch {
    // ignore invalid storage
  }
}

