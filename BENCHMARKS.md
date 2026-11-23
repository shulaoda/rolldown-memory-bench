# Benchmarks

`just bench` writes this file after every run, and `just report <results.json> ...` writes it again from saved runs.

- Machine: darwin arm64 (27.0.0), Apple M4 Pro, 14 cores, 48 GB, Node v26.0.0
- Run 2026-11-19 23:28 UTC: `just bench all --bin base=commit:872275c --bin pr-11655=../rolldown-memory-reclaim`
- Run 2026-11-20 00:50 UTC: `just bench rebuild-gaps --bin base=commit:872275c --bin pr-11655=../rolldown-memory-reclaim`
- Run 2026-11-20 08:32 UTC: `just bench lobehub:build-sourcemap --bin base=commit:872275c --bin pr-11655=../rolldown-memory-reclaim --rounds 9`
- Run 2026-11-23 04:47 UTC: `just bench lobehub:dev rolldown-9330-repro:dev --bin base=commit:872275c --bin pr-11655=../rolldown-memory-reclaim --rounds 2`
- Memory: `phys_footprint`, peak: the highest `phys_footprint` of the process. Numbers compare only on the same machine.

| Bin | rolldown | From | Commit |
| --- | --- | --- | --- |
| base | 1.3.3 | pkg.pr.new `commit:872275c` | 872275c |
| pr-11655 | 1.3.3 | repo `../rolldown-memory-reclaim` | 727aecdc83 |

Every number is the median over the rounds, with the range in parentheses. A change is from `base`. A change marked noise is not a clear difference: its ranges overlap, or a side has fewer than 3 rounds.

## Summary

| Case | Peak | CPU time | Time | Memory at the last mark |
| --- | ---: | ---: | ---: | ---: |
| held-outputs:sourcemap | -1.4% (-28.6 MB, noise) | +0.5% | all builds: -1.1% | idle 2s: -97.6% (-1869 MB) |
| held-outputs:plain | -1.3% (-15.8 MB, noise) | +0.1% (noise) | all builds: -1.4% (noise) | idle 2s: -96.1% (-1086 MB) |
| issue-10985-tight-loop:close | +3.1% (+24.3 MB, noise) | +1.6% | all builds: +0.8% (noise) | idle 5s: -95.4% (-754 MB) |
| issue-10985-tight-loop:generate | +1.4% (+10.6 MB, noise) | +0.3% (noise) | all builds: +0.3% (noise) | idle 5s: -95.4% (-748 MB) |
| issue-11143-api-idle:6-builds | +5.2% (+86.4 MB, noise) | +2.4% | all builds: -0.6% (noise) | idle 12s: -90.3% (-1464 MB) |
| issue-11143-api-idle:1-build | +0.6% (+4.9 MB, noise) | +4.3% | all builds: -1.6% (noise) | idle 12s: -81.1% (-609 MB) |
| issue-11233-optimizer-threads:default-threads | +4.5% (+16.8 MB, noise) | +2.0% (noise) | build: -0.3% (noise) | idle 10s: -90.3% (-325 MB) |
| issue-11233-optimizer-threads:4-threads | +0.6% (+2.1 MB, noise) | +1.6% | build: -0.1% (noise) | idle 10s: -90.2% (-263 MB) |
| many-chunks:plain | -1.4% (-7.4 MB, noise) | +4.5% | build: +0.2% (noise) | idle 2s: -86.0% (-454 MB) |
| many-chunks:sourcemap | +0.2% (+1.3 MB, noise) | +3.9% | build: +0.7% (noise) | idle 2s: -86.4% (-555 MB) |
| rebuild-gaps:gap-0 | -25.0% (-480 MB) | +0.1% (noise) | later builds (median): -2.6% (noise) | before build 10: -28.1% (-492 MB) |
| rebuild-gaps:gap-300ms | -28.6% (-543 MB) | -0.3% (noise) | later builds (median): -1.5% (noise) | before build 10: -34.9% (-585 MB) |
| rebuild-gaps:gap-1s | -29.2% (-550 MB) | +7.3% | later builds (median): +2.2% (noise) | before build 10: -85.6% (-1441 MB) |
| rebuild-gaps:gap-3s | -29.1% (-547 MB) | +9.4% | later builds (median): +4.1% (noise) | before build 10: -86.1% (-1455 MB) |
| three10x:plain | +0.6% (+3.0 MB, noise) | +3.4% | build: -0.1% (noise) | idle 2s: -91.9% (-435 MB) |
| three10x:sourcemap | +1.0% (+6.3 MB, noise) | +4.0% | build: +0.4% (noise) | idle 2s: -93.4% (-562 MB) |
| three10x:sourcemap-minify | -0.8% (-5.8 MB, noise) | +4.3% | build: +0.4% (noise) | idle 2s: -93.7% (-583 MB) |
| issue-11189:bundled | -40.1% (-196 MB) | +17.8% | ready: 0.0% (noise) | edit 20: -68.6% (-335 MB) |
| issue-11189:unbundled | 0.0% (0.0 MB, noise) | -1.2% (noise) | ready: -0.2% | edit 20: -6.8% (-12.1 MB, noise) |
| issue-11189:bundled-gc | -45.1% (-178 MB) | +16.6% | ready: -1.0% (noise) | edit 20: -68.3% (-266 MB) |
| issue-11189:bundled-tailwind-leaf | -4.2% (-6.9 MB) | +0.2% (noise) | ready: -1.0% | edit 20: -20.0% (-27.1 MB) |
| lobehub:build | -0.2% (-11.5 MB, noise) | +1.1% (noise) | process wall time: +0.2% (noise) | - |
| lobehub:build-sourcemap | +4.9% (+306 MB, noise) | +0.6% (noise) | process wall time: -0.1% (noise) | - |
| lobehub:dev | +8.9% (+265 MB, noise) | +0.3% (noise) | ready: -9.7% (noise) | idle 360s: -33.5% (-578 MB, noise) |
| rolldown-9330-repro:dev | +0.4% (+9.5 MB, noise) | -5.5% (noise) | ready: 0.0% (noise) | idle 360s: -78.7% (-1198 MB, noise) |
| vinext:build | +1.0% (+6.5 MB, noise) | +0.1% (noise) | process wall time: 0.0% (noise) | - |
| vinext:playground-build | -2.5% (-33.3 MB) | +0.2% (noise) | process wall time: +0.2% (noise) | - |
| vue-vben-admin:build | -1.2% (-20.4 MB) | +1.5% (noise) | process wall time: -1.5% (noise) | - |

## held-outputs

three.js x10, 10 back-to-back builds that keep their outputs (dashboard shape).

### held-outputs:sourcemap

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1975 (1896-1983) | 1947 (1908-1957) | -1.4% (-28.6 MB, noise) |
| process cpu time | 8.28s (8.25s-8.28s) | 8.33s (8.31s-8.41s) | +0.5% |
| all builds | 2.35s (2.35s-2.53s) | 2.32s (2.32s-2.34s) | -1.1% |
| phys_footprint @ 10 outputs held (MB) | 1914 (1814-1921) | 1866 (1864-1880) | -2.5% (-47.7 MB, noise) |
| phys_footprint @ after gc (MB) | 1915 (1815-1922) | 1867 (1864-1880) | -2.5% (-48.1 MB, noise) |
| phys_footprint @ idle 2s (MB) | 1915 (1815-1922) | 45.5 (45.3-48.2) | -97.6% (-1869 MB) |

### held-outputs:plain

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1171 (1140-1173) | 1155 (1136-1165) | -1.3% (-15.8 MB, noise) |
| process cpu time | 7.51s (7.49s-7.62s) | 7.52s (7.50s-7.56s) | +0.1% (noise) |
| all builds | 1.91s (1.89s-2.03s) | 1.89s (1.88s-1.90s) | -1.4% (noise) |
| phys_footprint @ 10 outputs held (MB) | 1129 (1099-1132) | 1113 (1095-1123) | -1.4% (-15.8 MB, noise) |
| phys_footprint @ after gc (MB) | 1130 (1099-1132) | 1113 (1095-1123) | -1.4% (-16.2 MB, noise) |
| phys_footprint @ idle 2s (MB) | 1130 (1099-1132) | 44.0 (43.6-47.3) | -96.1% (-1086 MB) |

## issue-10985-tight-loop

Memory across 150 builds in a tight loop, then idle. Issues: [#10985](https://github.com/rolldown/rolldown/issues/10985), [#10984](https://github.com/rolldown/rolldown/issues/10984).

### issue-10985-tight-loop:close

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 791 (780-817) | 815 (799-830) | +3.1% (+24.3 MB, noise) |
| process cpu time | 11.96s (11.92s-12.00s) | 12.15s (12.02s-12.26s) | +1.6% |
| all builds | 3.08s (3.08s-3.10s) | 3.11s (3.07s-3.13s) | +0.8% (noise) |
| phys_footprint @ build 25 (MB) | 534 (512-550) | 574 (537-586) | +7.5% (+40.1 MB, noise) |
| phys_footprint @ build 50 (MB) | 640 (613-657) | 708 (648-712) | +10.6% (+68.1 MB, noise) |
| phys_footprint @ build 75 (MB) | 700 (688-728) | 731 (695-751) | +4.5% (+31.2 MB, noise) |
| phys_footprint @ build 100 (MB) | 746 (727-769) | 776 (767-796) | +4.0% (+30.2 MB, noise) |
| phys_footprint @ build 125 (MB) | 777 (770-799) | 810 (787-815) | +4.2% (+32.9 MB, noise) |
| phys_footprint @ build 150 (MB) | 791 (780-817) | 815 (799-830) | +3.1% (+24.5 MB, noise) |
| phys_footprint @ idle 5s (MB) | 791 (780-817) | 36.7 (36.6-37.1) | -95.4% (-754 MB) |

### issue-10985-tight-loop:generate

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 784 (756-803) | 795 (715-797) | +1.4% (+10.6 MB, noise) |
| process cpu time | 12.01s (12.00s-12.02s) | 12.04s (11.94s-12.10s) | +0.3% (noise) |
| all builds | 3.07s (3.06s-3.10s) | 3.08s (3.07s-3.10s) | +0.3% (noise) |
| phys_footprint @ build 25 (MB) | 528 (523-575) | 546 (517-553) | +3.5% (+18.7 MB, noise) |
| phys_footprint @ build 50 (MB) | 690 (657-694) | 686 (626-686) | -0.6% (-3.8 MB, noise) |
| phys_footprint @ build 75 (MB) | 711 (691-725) | 720 (646-723) | +1.3% (+9.3 MB, noise) |
| phys_footprint @ build 100 (MB) | 750 (724-750) | 752 (679-756) | +0.3% (+2.1 MB, noise) |
| phys_footprint @ build 125 (MB) | 774 (748-782) | 779 (708-782) | +0.7% (+5.5 MB, noise) |
| phys_footprint @ build 150 (MB) | 784 (756-803) | 795 (715-797) | +1.4% (+10.6 MB, noise) |
| phys_footprint @ idle 5s (MB) | 784 (756-803) | 36.2 (36.1-37.2) | -95.4% (-748 MB) |

## issue-11143-api-idle

API builds with in-memory files and maps, then outputs dropped and idle. Issues: [#11143](https://github.com/rolldown/rolldown/issues/11143).

### issue-11143-api-idle:6-builds

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1677 (1657-1757) | 1763 (1748-1779) | +5.2% (+86.4 MB, noise) |
| process cpu time | 4.84s (4.83s-4.89s) | 4.96s (4.93s-4.96s) | +2.4% |
| all builds | 1.72s (1.71s-1.72s) | 1.71s (1.70s-1.72s) | -0.6% (noise) |
| phys_footprint @ before builds (MB) | 80.9 (80.9-81.8) | 81.1 (81.0-81.2) | +0.2% (+0.2 MB, noise) |
| phys_footprint @ outputs held (MB) | 1620 (1591-1696) | 1693 (1656-1724) | +4.5% (+72.8 MB, noise) |
| phys_footprint @ idle 1.5s (MB) | 1622 (1593-1697) | 158 (152-158) | -90.3% (-1464 MB) |
| phys_footprint @ idle 4s (MB) | 1622 (1593-1698) | 158 (152-158) | -90.3% (-1464 MB) |
| phys_footprint @ idle 12s (MB) | 1622 (1593-1698) | 158 (152-158) | -90.3% (-1464 MB) |

### issue-11143-api-idle:1-build

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 789 (788-798) | 794 (793-801) | +0.6% (+4.9 MB, noise) |
| process cpu time | 1.06s (1.05s-1.07s) | 1.11s (1.08s-1.12s) | +4.3% |
| all builds | 296ms (296ms-299ms) | 292ms (291ms-301ms) | -1.6% (noise) |
| phys_footprint @ before builds (MB) | 81.8 (81.0-82.7) | 81.3 (81.1-81.3) | -0.6% (-0.5 MB, noise) |
| phys_footprint @ outputs held (MB) | 748 (747-756) | 739 (730-762) | -1.2% (-9.3 MB, noise) |
| phys_footprint @ idle 1.5s (MB) | 750 (749-758) | 142 (141-142) | -81.1% (-608 MB) |
| phys_footprint @ idle 4s (MB) | 750 (749-758) | 142 (142-142) | -81.1% (-608 MB) |
| phys_footprint @ idle 12s (MB) | 750 (749-759) | 142 (142-142) | -81.1% (-609 MB) |

## issue-11233-optimizer-threads

One optimizer-like pass over typescript, codemirror and vue, then idle. Issues: [#11233](https://github.com/rolldown/rolldown/issues/11233).

### issue-11233-optimizer-threads:default-threads

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 372 (363-395) | 389 (367-397) | +4.5% (+16.8 MB, noise) |
| process cpu time | 489ms (485ms-499ms) | 499ms (490ms-507ms) | +2.0% (noise) |
| build | 264ms (261ms-280ms) | 263ms (262ms-267ms) | -0.3% (noise) |
| phys_footprint @ output held (MB) | 359 (348-382) | 377 (354-384) | +4.9% (+17.6 MB, noise) |
| phys_footprint @ idle 2s (MB) | 359 (349-382) | 34.7 (33.3-35.5) | -90.3% (-325 MB) |
| phys_footprint @ idle 10s (MB) | 360 (349-382) | 34.9 (33.4-35.7) | -90.3% (-325 MB) |

### issue-11233-optimizer-threads:4-threads

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 325 (321-337) | 327 (320-341) | +0.6% (+2.1 MB, noise) |
| process cpu time | 429ms (427ms-434ms) | 436ms (436ms-442ms) | +1.6% |
| build | 260ms (258ms-266ms) | 259ms (258ms-263ms) | -0.1% (noise) |
| phys_footprint @ output held (MB) | 291 (280-307) | 304 (291-328) | +4.4% (+12.8 MB, noise) |
| phys_footprint @ idle 2s (MB) | 292 (280-307) | 28.6 (27.8-28.8) | -90.2% (-263 MB) |
| phys_footprint @ idle 10s (MB) | 292 (280-307) | 28.6 (27.8-28.8) | -90.2% (-263 MB) |

## many-chunks

three.js x10 with one dynamic import per file (about 3,700 chunks), one build.

### many-chunks:plain

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 528 (521-530) | 520 (518-525) | -1.4% (-7.4 MB, noise) |
| process cpu time | 1.20s (1.19s-1.21s) | 1.25s (1.22s-1.25s) | +4.5% |
| build | 179ms (177ms-192ms) | 179ms (177ms-180ms) | +0.2% (noise) |
| chunks | 3692 (3692-3692) | 3692 (3692-3692) | 0.0% (noise) |
| phys_footprint @ output held (MB) | 523 (516-525) | 519 (514-523) | -0.9% (-4.5 MB, noise) |
| phys_footprint @ after gc (MB) | 528 (521-530) | 520 (518-525) | -1.4% (-7.4 MB, noise) |
| phys_footprint @ idle 2s (MB) | 528 (521-530) | 74.0 (73.7-74.9) | -86.0% (-454 MB) |

### many-chunks:sourcemap

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 643 (640-650) | 644 (638-647) | +0.2% (+1.3 MB, noise) |
| process cpu time | 1.33s (1.31s-1.34s) | 1.39s (1.38s-1.41s) | +3.9% |
| build | 210ms (203ms-228ms) | 212ms (209ms-231ms) | +0.7% (noise) |
| chunks | 3692 (3692-3692) | 3692 (3692-3692) | 0.0% (noise) |
| phys_footprint @ output held (MB) | 637 (635-643) | 641 (635-644) | +0.7% (+4.3 MB, noise) |
| phys_footprint @ after gc (MB) | 643 (640-650) | 644 (638-647) | +0.2% (+1.4 MB, noise) |
| phys_footprint @ idle 2s (MB) | 643 (640-650) | 87.5 (86.8-88.6) | -86.4% (-555 MB) |

## rebuild-gaps

three.js x10 with sourcemap, 10 builds with a pause between them.

### rebuild-gaps:gap-0

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1923 (1900-1980) | 1443 (1351-1502) | -25.0% (-480 MB) |
| process cpu time | 8.23s (8.17s-8.31s) | 8.23s (8.17s-8.28s) | +0.1% (noise) |
| later builds (median) | 234ms (229ms-240ms) | 228ms (226ms-232ms) | -2.6% (noise) |
| first build | 251ms (248ms-308ms) | 264ms (244ms-267ms) | +5.2% (noise) |
| later builds (max) | 244ms (238ms-265ms) | 237ms (236ms-259ms) | -3.0% (noise) |
| phys_footprint @ before build 2 (MB) | 598 (554-603) | 618 (573-636) | +3.4% (+20.1 MB, noise) |
| phys_footprint @ before build 5 (MB) | 1155 (1122-1257) | 1066 (1047-1104) | -7.7% (-88.4 MB) |
| phys_footprint @ before build 10 (MB) | 1753 (1737-1787) | 1261 (1211-1346) | -28.1% (-492 MB) |

### rebuild-gaps:gap-300ms

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1896 (1866-1908) | 1353 (1274-1403) | -28.6% (-543 MB) |
| process cpu time | 9.27s (9.18s-9.75s) | 9.25s (9.07s-9.37s) | -0.3% (noise) |
| later builds (median) | 242ms (239ms-258ms) | 239ms (238ms-247ms) | -1.5% (noise) |
| first build | 254ms (246ms-260ms) | 246ms (244ms-283ms) | -3.0% (noise) |
| later builds (max) | 253ms (252ms-279ms) | 251ms (245ms-263ms) | -1.0% (noise) |
| phys_footprint @ before build 2 (MB) | 599 (546-626) | 600 (569-607) | +0.1% (+0.8 MB, noise) |
| phys_footprint @ before build 5 (MB) | 1183 (1147-1222) | 1047 (1036-1107) | -11.4% (-135 MB) |
| phys_footprint @ before build 10 (MB) | 1678 (1671-1716) | 1093 (1060-1129) | -34.9% (-585 MB) |

### rebuild-gaps:gap-1s

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1883 (1860-1955) | 1333 (1326-1364) | -29.2% (-550 MB) |
| process cpu time | 9.49s (9.02s-9.89s) | 10.19s (9.95s-10.28s) | +7.3% |
| later builds (median) | 250ms (240ms-258ms) | 255ms (245ms-256ms) | +2.2% (noise) |
| first build | 251ms (249ms-266ms) | 268ms (251ms-280ms) | +6.6% (noise) |
| later builds (max) | 258ms (252ms-292ms) | 264ms (258ms-274ms) | +2.4% (noise) |
| phys_footprint @ before build 2 (MB) | 603 (553-609) | 174 (172-175) | -71.1% (-428 MB) |
| phys_footprint @ before build 5 (MB) | 1170 (1135-1204) | 226 (216-230) | -80.7% (-944 MB) |
| phys_footprint @ before build 10 (MB) | 1683 (1611-1736) | 242 (233-242) | -85.6% (-1441 MB) |

### rebuild-gaps:gap-3s

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1881 (1875-1950) | 1335 (1319-1368) | -29.1% (-547 MB) |
| process cpu time | 9.30s (9.20s-9.49s) | 10.17s (9.93s-10.32s) | +9.4% |
| later builds (median) | 235ms (232ms-245ms) | 244ms (239ms-250ms) | +4.1% (noise) |
| first build | 245ms (240ms-256ms) | 243ms (241ms-267ms) | -0.4% (noise) |
| later builds (max) | 246ms (243ms-261ms) | 255ms (252ms-260ms) | +3.6% (noise) |
| phys_footprint @ before build 2 (MB) | 598 (547-628) | 173 (170-174) | -71.1% (-426 MB) |
| phys_footprint @ before build 5 (MB) | 1173 (1124-1203) | 223 (216-224) | -81.0% (-950 MB) |
| phys_footprint @ before build 10 (MB) | 1690 (1655-1707) | 235 (232-242) | -86.1% (-1455 MB) |

## three10x

three.js x10, one build: peak, output held, after GC, idle.

### three10x:plain

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 515 (514-521) | 518 (514-523) | +0.6% (+3.0 MB, noise) |
| process cpu time | 920ms (915ms-925ms) | 951ms (935ms-957ms) | +3.4% |
| build | 197ms (197ms-198ms) | 197ms (195ms-211ms) | -0.1% (noise) |
| phys_footprint @ output held (MB) | 473 (472-480) | 476 (472-482) | +0.6% (+3.0 MB, noise) |
| phys_footprint @ after gc (MB) | 473 (472-480) | 476 (472-482) | +0.6% (+2.8 MB, noise) |
| phys_footprint @ idle 2s (MB) | 474 (472-480) | 38.3 (38.0-38.7) | -91.9% (-435 MB) |

### three10x:sourcemap

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 652 (650-660) | 658 (648-662) | +1.0% (+6.3 MB, noise) |
| process cpu time | 1.00s (978ms-1.00s) | 1.04s (1.02s-1.06s) | +4.0% |
| build | 240ms (240ms-243ms) | 241ms (240ms-255ms) | +0.4% (noise) |
| phys_footprint @ output held (MB) | 601 (565-624) | 592 (564-621) | -1.5% (-8.8 MB, noise) |
| phys_footprint @ after gc (MB) | 601 (565-624) | 592 (564-621) | -1.5% (-9.0 MB, noise) |
| phys_footprint @ idle 2s (MB) | 601 (565-624) | 39.7 (39.1-40.6) | -93.4% (-562 MB) |

### three10x:sourcemap-minify

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 706 (688-726) | 700 (690-711) | -0.8% (-5.8 MB, noise) |
| process cpu time | 1.06s (1.05s-1.08s) | 1.11s (1.09s-1.13s) | +4.3% |
| build | 310ms (308ms-326ms) | 312ms (307ms-329ms) | +0.4% (noise) |
| phys_footprint @ output held (MB) | 622 (589-674) | 598 (575-633) | -3.8% (-23.5 MB, noise) |
| phys_footprint @ after gc (MB) | 622 (589-674) | 598 (575-633) | -3.8% (-23.5 MB, noise) |
| phys_footprint @ idle 2s (MB) | 622 (589-674) | 39.1 (39.0-40.0) | -93.7% (-583 MB) |

## issue-11189

Bundled dev rebuilds (synthetic React app, 1,500 modules). Issues: [#11189](https://github.com/rolldown/rolldown/issues/11189).

### issue-11189:bundled

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 489 (488-510) | 293 (217-308) | -40.1% (-196 MB) |
| process cpu time | 2.44s (2.40s-2.48s) | 2.88s (2.83s-2.96s) | +17.8% |
| ready | 513ms (512ms-514ms) | 513ms (508ms-514ms) | 0.0% (noise) |
| phys_footprint @ after load (MB) | 154 (151-154) | 128 (124-131) | -16.7% (-25.7 MB) |
| phys_footprint @ edit 5 (MB) | 268 (267-270) | 155 (132-156) | -42.1% (-113 MB) |
| phys_footprint @ edit 10 (MB) | 377 (361-377) | 240 (135-244) | -36.3% (-137 MB) |
| phys_footprint @ edit 15 (MB) | 433 (428-446) | 153 (133-155) | -64.6% (-280 MB) |
| phys_footprint @ edit 20 (MB) | 489 (488-510) | 154 (136-157) | -68.6% (-335 MB) |

### issue-11189:unbundled

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 190 (188-192) | 190 (190-194) | 0.0% (0.0 MB, noise) |
| process cpu time | 2.93s (2.83s-2.94s) | 2.89s (2.81s-2.94s) | -1.2% (noise) |
| ready | 527ms (527ms-527ms) | 526ms (516ms-526ms) | -0.2% |
| phys_footprint @ after load (MB) | 182 (181-183) | 178 (178-181) | -1.9% (-3.5 MB, noise) |
| phys_footprint @ edit 5 (MB) | 182 (175-186) | 175 (170-183) | -3.9% (-7.2 MB, noise) |
| phys_footprint @ edit 10 (MB) | 181 (176-186) | 170 (166-175) | -6.1% (-11.0 MB) |
| phys_footprint @ edit 15 (MB) | 178 (163-181) | 168 (152-169) | -6.0% (-10.7 MB, noise) |
| phys_footprint @ edit 20 (MB) | 178 (141-179) | 166 (160-171) | -6.8% (-12.1 MB, noise) |

### issue-11189:bundled-gc

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 394 (359-395) | 217 (204-218) | -45.1% (-178 MB) |
| process cpu time | 2.74s (2.74s-2.79s) | 3.20s (3.15s-3.22s) | +16.6% |
| ready | 514ms (509ms-515ms) | 509ms (506ms-513ms) | -1.0% (noise) |
| phys_footprint @ after load (MB) | 151 (145-154) | 122 (120-124) | -19.0% (-28.6 MB) |
| phys_footprint @ edit 5 (MB) | 242 (235-249) | 118 (117-123) | -51.3% (-124 MB) |
| phys_footprint @ edit 10 (MB) | 293 (281-301) | 121 (120-124) | -58.8% (-172 MB) |
| phys_footprint @ edit 15 (MB) | 335 (312-360) | 121 (121-125) | -63.7% (-213 MB) |
| phys_footprint @ edit 20 (MB) | 389 (359-394) | 123 (122-126) | -68.3% (-266 MB) |

### issue-11189:bundled-tailwind-leaf

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 165 (164-166) | 159 (156-160) | -4.2% (-6.9 MB) |
| process cpu time | 881ms (854ms-883ms) | 883ms (850ms-901ms) | +0.2% (noise) |
| ready | 515ms (514ms-515ms) | 510ms (509ms-512ms) | -1.0% |
| phys_footprint @ after load (MB) | 157 (153-159) | 130 (129-133) | -16.9% (-26.5 MB) |
| phys_footprint @ edit 5 (MB) | 164 (163-165) | 137 (136-141) | -16.7% (-27.3 MB) |
| phys_footprint @ edit 10 (MB) | 136 (136-138) | 110 (109-114) | -19.4% (-26.5 MB) |
| phys_footprint @ edit 15 (MB) | 136 (136-137) | 108 (107-113) | -20.1% (-27.2 MB) |
| phys_footprint @ edit 20 (MB) | 136 (136-137) | 109 (108-112) | -20.0% (-27.1 MB) |

## lobehub

lobehub SPA. Issues: [#9330](https://github.com/rolldown/rolldown/issues/9330).

### lobehub:build

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 5458 (5339-5470) | 5446 (5141-5494) | -0.2% (-11.5 MB, noise) |
| process wall time | 21.52s (21.49s-21.79s) | 21.56s (21.53s-21.73s) | +0.2% (noise) |
| process cpu time | 43.80s (43.71s-44.60s) | 44.27s (43.91s-44.49s) | +1.1% (noise) |

### lobehub:build-sourcemap

9 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 6261 (6222-6928) | 6567 (6063-7246) | +4.9% (+306 MB, noise) |
| process wall time | 23.41s (22.82s-24.08s) | 23.38s (22.89s-23.77s) | -0.1% (noise) |
| process cpu time | 46.94s (46.24s-48.34s) | 47.22s (46.81s-47.68s) | +0.6% (noise) |

### lobehub:dev

2 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 2983 (2931-3034) | 3248 (3243-3252) | +8.9% (+265 MB, noise) |
| process cpu time | 61.26s (61.08s-61.43s) | 61.41s (61.29s-61.54s) | +0.3% (noise) |
| ready | 1.55s (1.51s-1.58s) | 1.40s (1.24s-1.56s) | -9.7% (noise) |
| phys_footprint @ ready (MB) | 858 (834-881) | 700 (526-875) | -18.4% (-157 MB, noise) |
| phys_footprint @ page closed (MB) | 2666 (2519-2813) | 1933 (1781-2085) | -27.5% (-733 MB, noise) |
| phys_footprint @ idle 90s (MB) | 2584 (2519-2648) | 1933 (1781-2085) | -25.2% (-651 MB, noise) |
| phys_footprint @ idle 180s (MB) | 1870 (1859-1882) | 1295 (1267-1322) | -30.8% (-576 MB, noise) |
| phys_footprint @ idle 270s (MB) | 1719 (1625-1813) | 1147 (1070-1224) | -33.3% (-572 MB, noise) |
| phys_footprint @ idle 360s (MB) | 1725 (1625-1825) | 1147 (1071-1224) | -33.5% (-578 MB, noise) |

## rolldown-9330-repro

Small #9330 repro, vite dev with @lobehub/ui. Issues: [#9330](https://github.com/rolldown/rolldown/issues/9330).

### rolldown-9330-repro:dev

2 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 2191 (2178-2205) | 2201 (2196-2206) | +0.4% (+9.5 MB, noise) |
| process cpu time | 4.70s (4.49s-4.90s) | 4.44s (4.38s-4.50s) | -5.5% (noise) |
| ready | 517ms (516ms-518ms) | 517ms (516ms-518ms) | 0.0% (noise) |
| phys_footprint @ ready (MB) | 767 (733-801) | 814 (797-831) | +6.1% (+46.9 MB, noise) |
| phys_footprint @ page closed (MB) | 2191 (2178-2205) | 945 (918-972) | -56.9% (-1246 MB, noise) |
| phys_footprint @ idle 90s (MB) | 1598 (1548-1648) | 351 (342-361) | -78.0% (-1247 MB, noise) |
| phys_footprint @ idle 180s (MB) | 1549 (1548-1549) | 351 (342-361) | -77.3% (-1198 MB, noise) |
| phys_footprint @ idle 270s (MB) | 1522 (1521-1522) | 324 (316-331) | -78.7% (-1198 MB, noise) |
| phys_footprint @ idle 360s (MB) | 1522 (1521-1522) | 324 (317-332) | -78.7% (-1198 MB, noise) |

## vinext

vinext, Next.js on Vite.

### vinext:build

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 640 (639-670) | 646 (638-653) | +1.0% (+6.5 MB, noise) |
| process wall time | 1.22s (1.21s-1.51s) | 1.22s (1.21s-1.23s) | 0.0% (noise) |
| process cpu time | 2.53s (2.51s-2.56s) | 2.53s (2.50s-2.54s) | +0.1% (noise) |

### vinext:playground-build

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1347 (1340-1365) | 1314 (1309-1319) | -2.5% (-33.3 MB) |
| process wall time | 3.61s (3.60s-3.98s) | 3.62s (3.58s-3.65s) | +0.2% (noise) |
| process cpu time | 7.25s (7.23s-7.32s) | 7.26s (7.24s-7.28s) | +0.2% (noise) |

## vue-vben-admin

vue-vben-admin, the web-antd app.

### vue-vben-admin:build

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1728 (1715-1742) | 1708 (1697-1712) | -1.2% (-20.4 MB) |
| process wall time | 2.78s (2.73s-3.94s) | 2.74s (2.73s-2.75s) | -1.5% (noise) |
| process cpu time | 6.82s (6.64s-6.82s) | 6.92s (6.82s-6.97s) | +1.5% (noise) |
