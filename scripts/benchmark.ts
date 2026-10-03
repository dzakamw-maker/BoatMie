import { seedInitialData } from '../src/lib/firestore';

async function runBenchmark() {
  console.log('Starting benchmark for seedInitialData...');

  const ITERATIONS = 1;

  const times = [];

  for (let i = 0; i < ITERATIONS; i++) {
    console.log(`Iteration ${i + 1}/${ITERATIONS}`);
    const start = process.hrtime.bigint();

    try {
      const result = await seedInitialData();
      if (!result.success) {
        console.error('Seed failed:', result.message);
      }
    } catch (e) {
      console.error('Seed error:', e);
    }

    const end = process.hrtime.bigint();
    const durationMs = Number(end - start) / 1_000_000;
    times.push(durationMs);
    console.log(`Time taken: ${durationMs.toFixed(2)} ms`);
  }

  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  console.log(`\nAverage time: ${avg.toFixed(2)} ms`);
  console.log(`Min time: ${Math.min(...times).toFixed(2)} ms`);
  console.log(`Max time: ${Math.max(...times).toFixed(2)} ms`);
}

runBenchmark().catch(err => {
  console.error(err);
  process.exit(1);
});
