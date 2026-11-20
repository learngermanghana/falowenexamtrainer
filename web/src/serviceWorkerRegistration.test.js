/** @jest-environment node */
import { __private__ } from './serviceWorkerRegistration';

// A real browser Location.reload is read-only. Exercise the same handlers
// with an observable navigation target and isolated per-test storage.
beforeEach(() => {
  const storage = () => {
    const entries = new Map();
    return {
      getItem: key => entries.get(key) ?? null,
      setItem: (key, value) => entries.set(key, String(value)),
      clear: () => entries.clear(),
    };
  };
  global.window = {
    location: { pathname: '/', reload: jest.fn() },
    sessionStorage: storage(),
    localStorage: storage(),
  };
});

afterEach(() => { delete global.window; });

describe('serviceWorkerRegistration update handling', () => {
  let originalServiceWorker;
  let controllerChangeHandler;
  let reloadSpy;

  beforeEach(() => {
    originalServiceWorker = navigator.serviceWorker;
    controllerChangeHandler = null;
    reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {});

    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: {
        controller: { id: 'active' },
        addEventListener: jest.fn((event, handler) => {
          if (event === 'controllerchange') {
            controllerChangeHandler = handler;
          }
        }),
      },
    });
  });

  afterEach(() => {
    Object.defineProperty(navigator, 'serviceWorker', {
      configurable: true,
      value: originalServiceWorker,
    });
    reloadSpy.mockRestore();
    jest.restoreAllMocks();
  });

  it('reloads only once on controllerchange', () => {
    const waiting = { postMessage: jest.fn() };
    const installingWorker = {
      state: 'installed',
      addEventListener: jest.fn((event, handler) => {
        if (event === 'statechange') {
          handler();
        }
      }),
    };

    const registration = {
      waiting,
      installing: installingWorker,
      addEventListener: jest.fn((event, handler) => {
        if (event === 'updatefound') {
          handler();
        }
      }),
    };

    __private__.setupUpdateHandlers(registration);

    expect(waiting.postMessage).toHaveBeenCalledWith({ type: 'SKIP_WAITING' });

    controllerChangeHandler();
    controllerChangeHandler();

    expect(window.location.reload).toHaveBeenCalledTimes(1);
  });

  it('keeps the A1 Day 1 lecture open when a new worker takes control', () => {
    window.location.pathname = '/campus/course/lesson/A1/1';
    __private__.setupUpdateHandlers({ addEventListener: jest.fn() });
    controllerChangeHandler();
    expect(reloadSpy).not.toHaveBeenCalled();
  });

  it('does not reload on controllerchange without a controller', () => {
    const registration = {
      waiting: null,
      installing: null,
      addEventListener: jest.fn(),
    };

    __private__.setupUpdateHandlers(registration);

    navigator.serviceWorker.controller = null;
    controllerChangeHandler();

    expect(window.location.reload).not.toHaveBeenCalled();
  });
});

describe('forcePeriodicRefresh', () => {
  let reloadSpy;

  beforeEach(() => {
    window.localStorage.clear();
    reloadSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {});
  });

  afterEach(() => {
    reloadSpy.mockRestore();
    jest.restoreAllMocks();
  });

  it('gates periodic refresh by stored timestamp', async () => {
    const now = 2_000_000;
    jest.spyOn(Date, 'now').mockReturnValue(now);

    const registration = {
      update: jest.fn().mockResolvedValue(undefined),
    };

    await __private__.forcePeriodicRefresh(registration);
    expect(registration.update).toHaveBeenCalledTimes(1);
    expect(window.location.reload).toHaveBeenCalledTimes(1);

    await __private__.forcePeriodicRefresh(registration);
    expect(registration.update).toHaveBeenCalledTimes(1);
    expect(window.location.reload).toHaveBeenCalledTimes(1);

    expect(window.localStorage.getItem('app-last-force-refresh-at')).toBe(String(now));
  });

  it('does not reload repeatedly when storage cannot persist the refresh marker', async () => {
    jest.spyOn(Date, 'now').mockReturnValue(3_000_000);
    const setItemSpy = jest.spyOn(window.localStorage, 'setItem').mockImplementation(() => {
      throw new Error('Storage disabled');
    });
    const registration = {
      update: jest.fn().mockResolvedValue(undefined),
    };

    await __private__.forcePeriodicRefresh(registration);

    expect(registration.update).not.toHaveBeenCalled();
    expect(window.location.reload).not.toHaveBeenCalled();

    setItemSpy.mockRestore();
  });

});

describe('lesson update deferral', () => {
  it.each(['/campus/course/a1-day-1-greetings-workbook', '/swahili/day-1'])(
    'keeps a new revision pending on %s until a later check outside the lesson',
    async pathname => {
      const manifest = jest.spyOn(global, 'fetch').mockResolvedValue({
        ok: true, json: async () => ({ revision: 'next' }),
      });
      try {
        __private__.setLoadedBuildRevision('previous');
        window.location.pathname = pathname;
        await __private__.checkForNewBuild();
        expect(window.location.reload).not.toHaveBeenCalled();
        expect(__private__.getLoadedBuildRevision()).toBe('previous');
        window.location.pathname = '/';
        await __private__.checkForNewBuild();
        expect(window.location.reload).toHaveBeenCalledTimes(1);
        expect(__private__.getLoadedBuildRevision()).toBe('next');
      } finally {
        manifest.mockRestore();
      }
    }
  );

  it('skips a due daily refresh in Campus, even if navigation happens during the update', async () => {
    window.location.pathname = '/campus/course';
    const registration = { update: jest.fn(async () => {
      window.location.pathname = '/campus/course/lesson/A1/1';
    }) };
    await __private__.forcePeriodicRefresh(registration);
    expect(registration.update).not.toHaveBeenCalled();
    window.location.pathname = '/';
    await __private__.forcePeriodicRefresh(registration);
    expect(registration.update).toHaveBeenCalledTimes(1);
    expect(window.location.reload).not.toHaveBeenCalled();
  });
});
