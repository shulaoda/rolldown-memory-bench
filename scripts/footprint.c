// Prints the current and the lifetime peak phys_footprint of a process, in bytes.
// This is the number Activity Monitor shows as "Memory".
#include <libproc.h>
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char **argv) {
  if (argc != 2) return 2;
  struct rusage_info_v4 ri;
  if (proc_pid_rusage(atoi(argv[1]), RUSAGE_INFO_V4, (rusage_info_t *)&ri)) return 1;
  printf("%llu %llu\n", ri.ri_phys_footprint, ri.ri_lifetime_max_phys_footprint);
  return 0;
}
