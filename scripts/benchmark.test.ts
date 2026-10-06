import { seedInitialData } from '../src/lib/firestore';

jest.mock('../src/lib/firebase', () => {
    return {
        db: {
            // Mock Firestore db object
        },
        app: {},
        auth: {}
    };
});

// We want to test how long it takes, but firestore is mocked
// Actually we can't test firestore performance using a mock. We must use real firestore or just assume time complexity.
// Let's create a script instead, and use it with a test database or just mock the timer?

// Let's use jest to mock setDoc to record time
import * as firestore from 'firebase/firestore';

// Mock getDoc, getDocs, setDoc, doc, collection, addDoc, deleteDoc, serverTimestamp, query, orderBy
jest.mock('firebase/firestore', () => {
  const original = jest.requireActual('firebase/firestore');
  const mockBatch = {
    set: jest.fn(),
    commit: jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 5))), // simulate network overhead on commit
  };
  return {
    ...original,
    setDoc: jest.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 5))), // Simulate 5ms network call
    writeBatch: jest.fn(() => mockBatch),
    serverTimestamp: jest.fn().mockReturnValue('mocked_timestamp'),
    doc: jest.fn().mockReturnValue({ id: 'mocked_id' }),
  };
});

describe('Benchmark seedInitialData', () => {
  it('measures execution time', async () => {
    const start = process.hrtime.bigint();

    const result = await seedInitialData();
    expect(result.success).toBe(true);

    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;

    console.log(`Benchmark time: ${durationMs.toFixed(2)} ms`);
    console.log(`setDoc called ${jest.mocked(firestore.setDoc).mock.calls.length} times`);
    console.log(`writeBatch called ${jest.mocked(firestore.writeBatch).mock.calls.length} times`);
    const mockBatch = jest.mocked(firestore.writeBatch)({} as any);
    console.log(`batch.set called ${(mockBatch.set as jest.Mock).mock.calls.length} times`);
    console.log(`batch.commit called ${(mockBatch.commit as jest.Mock).mock.calls.length} times`);
  });
});
