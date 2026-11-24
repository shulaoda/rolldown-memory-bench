// Runs in a child with the probe, like a case. It allocates 512 MiB that the reader must see, frees
// it and waits until the process gives it back. `bench.mjs selftest` checks the marks.
import { mark } from './probe.mjs';
import { readProcess } from './memory.mjs';
import { sleep } from './util.mjs';

const MiB = 2 ** 20;
const start = mark('start');
// Arrays of doubles live in the JS heap. V8 maps each large one on its own and unmaps it after the
// GC. Large Buffers would test malloc instead: macOS malloc keeps freed large blocks in its cache,
// where they still count in the footprint.
let arrays = Array.from({ length: 4 }, () => new Array(16 * MiB).fill(1.5));
// `fill` leaves the first backing store of each array behind. A GC frees it before the mark.
globalThis.gc();
mark('512 MiB allocated');
arrays = null;
const end = Date.now() + 30_000;
while (Date.now() < end) {
  globalThis.gc();
  await sleep(500);
  if (readProcess(process.pid).mem < start.mem + 64) break;
}
mark('freed');
process.exit(0);
