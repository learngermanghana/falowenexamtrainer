import { __private__ } from './serviceWorkerRegistration';

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
});
