import { debounce } from './debounce';

// Tell Jest to use fake timers
jest.useFakeTimers();

describe('debounce', () => {
  let mockFunc;
  const delay = 500;

  beforeEach(() => {
    // Create a new mock function for each test
    mockFunc = jest.fn();
  });

  afterEach(() => {
    // Clear all timers after each test
    jest.clearAllTimers();
  });

  test('should not call the function immediately', () => {
    const debouncedFunc = debounce(mockFunc, delay);
    debouncedFunc();
    expect(mockFunc).not.toHaveBeenCalled();
  });

  test('should call the function after the specified delay', () => {
    const debouncedFunc = debounce(mockFunc, delay);
    debouncedFunc();

    // Fast-forward time by the delay
    jest.advanceTimersByTime(delay);
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  test('should call the function only once for multiple rapid calls (trailing edge)', () => {
    const debouncedFunc = debounce(mockFunc, delay);

    // Call the debounced function multiple times quickly
    debouncedFunc();
    jest.advanceTimersByTime(delay / 2); // Advance time by less than the delay
    debouncedFunc();
    jest.advanceTimersByTime(delay / 2);
    debouncedFunc();

    // Fast-forward time until the last call should have executed
    jest.advanceTimersByTime(delay);
    expect(mockFunc).toHaveBeenCalledTimes(1);
  });

  test('should call the original function with the correct arguments', () => {
    const debouncedFunc = debounce(mockFunc, delay);
    const arg1 = 'testArg1';
    const arg2 = { id: 123 };

    debouncedFunc(arg1, arg2);

    // Fast-forward time
    jest.advanceTimersByTime(delay);
    expect(mockFunc).toHaveBeenCalledWith(arg1, arg2);
  });

  test('should reset the timer if called again within the delay period', () => {
    const debouncedFunc = debounce(mockFunc, delay);

    debouncedFunc('call1'); // First call
    jest.advanceTimersByTime(delay - 100); // Advance time, but not enough to trigger
    expect(mockFunc).not.toHaveBeenCalled(); // Should not have been called yet

    debouncedFunc('call2'); // Second call, should reset the timer
    jest.advanceTimersByTime(100); // Advance time, this would have triggered 'call1' if not reset
    expect(mockFunc).not.toHaveBeenCalled(); // Still should not have been called

    jest.advanceTimersByTime(delay - 100); // Advance timer to complete the delay for 'call2'
    expect(mockFunc).toHaveBeenCalledTimes(1);
    expect(mockFunc).toHaveBeenCalledWith('call2'); // Should be called with args of the last call
  });
});
