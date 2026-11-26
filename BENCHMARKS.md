# Benchmarks

`just bench` writes this file after every run, and `just report <results.json> ...` writes it again from saved runs.

- Machine: darwin arm64 (27.0.0), Apple M4 Pro, 14 cores, 48 GB, Node v26.0.0
- Run 2026-11-26 10:00 UTC: `just bench quick --bin base=../rolldown-wt-base --bin pr=../rolldown-memory-reclaim`
- Memory: `phys_footprint`, peak: the highest `phys_footprint` of the process. Numbers compare only on the same machine.
- Load average (1 min) when a run started: 3.7 to 13.4, on 14 cores

| Bin | rolldown | From | Commit |
| --- | --- | --- | --- |
| base | 1.3.3 | repo `../rolldown-wt-base` | e641a934ec |
| pr | 1.3.3 | repo `../rolldown-memory-reclaim` | ce99614c34 |

Every number is the median over the rounds, with the range in parentheses. A change is from `base`. A change marked noise is not a clear difference: its ranges overlap, or a side has fewer than 3 rounds.

## Summary

| Case | Peak | CPU time | Time | Memory at the last mark |
| --- | ---: | ---: | ---: | ---: |
| held-outputs:sourcemap | -13.6% (-251 MB) | +0.6% | all builds: -0.1% (noise) | idle 2s: -97.3% (-1744 MB) |
| issue-10985-tight-loop:close | -47.8% (-372 MB) | +1.3% (noise) | all builds: -0.3% (noise) | idle 5s: -95.5% (-742 MB) |
| issue-11143-api-idle:6-builds | -13.7% (-226 MB) | +1.9% | all builds: +1.3% (noise) | idle 12s: -90.8% (-1447 MB) |
| issue-11233-optimizer-threads:default-threads | -16.4% (-63.7 MB) | +2.1% | build: +0.3% (noise) | idle 10s: -91.7% (-344 MB) |
| many-chunks:sourcemap | -10.5% (-61.6 MB) | +3.6% | build: +1.4% (noise) | idle 2s: -85.3% (-502 MB) |
| rebuild-gaps:gap-0 | -43.4% (-802 MB) | -0.5% (noise) | later builds (median): -2.6% (noise) | before build 10: -44.4% (-738 MB) |
| rebuild-gaps:gap-300ms | -45.0% (-820 MB) | +0.1% (noise) | later builds (median): -1.4% | before build 10: -49.8% (-804 MB) |
| rebuild-gaps:gap-1s | -51.4% (-920 MB) | +5.8% | later builds (median): 0.0% (noise) | before build 10: -86.7% (-1396 MB) |
| rebuild-gaps:gap-3s | -52.2% (-955 MB) | +5.8% | later builds (median): +0.9% (noise) | before build 10: -86.9% (-1402 MB) |
| three10x:sourcemap | -3.6% (-21.3 MB) | +4.2% | build: -0.8% (noise) | idle 2s: -93.0% (-523 MB) |
| issue-11189:bundled | -42.3% (-209 MB) | +14.0% | ready: -0.2% (noise) | edit 20: -75.8% (-373 MB) |
| lobehub:build | -10.2% (-491 MB) | -1.1% (noise) | process wall time: -1.2% | - |
| lobehub:build-sourcemap | -6.4% (-368 MB, noise) | +0.5% (noise) | process wall time: +0.5% (noise) | - |
| lobehub:dev | -11.4% (-319 MB) | -0.1% (noise) | ready: -0.2% (noise) | idle 270s: -44.9% (-787 MB) |
| rolldown-9330-repro:dev | -4.8% (-96.9 MB) | +1.6% (noise) | ready: -0.2% (noise) | idle 90s: -84.7% (-1195 MB) |
| vinext:build | -4.7% (-30.0 MB) | -0.2% (noise) | process wall time: +0.7% (noise) | - |
| vue-vben-admin:build | -2.5% (-40.2 MB) | -1.3% (noise) | process wall time: -0.3% (noise) | - |

## held-outputs

three.js x10, 10 back-to-back builds that keep their outputs (dashboard shape).

### held-outputs:sourcemap

3 rounds, load 6.6 to 8.2.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1844 (1832-1919) | 1592 (1572-1595) | -13.6% (-251 MB) |
| process cpu time | 8.23s (8.19s-8.27s) | 8.29s (8.28s-8.30s) | +0.6% |
| all builds | 2.39s (2.36s-2.42s) | 2.38s (2.35s-2.41s) | -0.1% (noise) |
| phys_footprint @ 10 outputs held (MB) | 1791 (1771-1843) | 1513 (1508-1531) | -15.5% (-277 MB) |
| phys_footprint @ after gc (MB) | 1791 (1771-1844) | 1514 (1508-1531) | -15.5% (-278 MB) |
| phys_footprint @ idle 2s (MB) | 1791 (1771-1844) | 47.5 (46.5-47.6) | -97.3% (-1744 MB) |
| mimalloc @ 10 outputs held (MB) | 1764 (1744-1816) | 1487 (1481-1504) | -15.7% (-278 MB) |
| mimalloc @ after gc (MB) | 1764 (1744-1816) | 1487 (1481-1504) | -15.7% (-278 MB) |
| mimalloc @ idle 2s (MB) | 1764 (1744-1816) | 20.5 (19.5-20.7) | -98.8% (-1744 MB) |

## issue-10985-tight-loop

Memory across 150 builds in a tight loop, then idle. Issues: [#10985](https://github.com/rolldown/rolldown/issues/10985), [#10984](https://github.com/rolldown/rolldown/issues/10984).

### issue-10985-tight-loop:close

3 rounds, load 6.2 to 7.4.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 777 (733-794) | 405 (387-444) | -47.8% (-372 MB) |
| process cpu time | 11.80s (11.77s-11.84s) | 11.96s (11.82s-12.02s) | +1.3% (noise) |
| all builds | 2.99s (2.99s-3.00s) | 2.98s (2.98s-2.99s) | -0.3% (noise) |
| phys_footprint @ build 25 (MB) | 499 (496-507) | 366 (358-374) | -26.8% (-134 MB) |
| phys_footprint @ build 50 (MB) | 635 (625-644) | 381 (374-412) | -40.0% (-254 MB) |
| phys_footprint @ build 75 (MB) | 689 (657-706) | 384 (375-427) | -44.4% (-306 MB) |
| phys_footprint @ build 100 (MB) | 725 (698-744) | 386 (378-438) | -46.7% (-339 MB) |
| phys_footprint @ build 125 (MB) | 758 (720-778) | 387 (379-444) | -48.9% (-371 MB) |
| phys_footprint @ build 150 (MB) | 777 (732-794) | 405 (387-444) | -47.9% (-372 MB) |
| phys_footprint @ idle 5s (MB) | 777 (733-794) | 35.3 (34.9-35.4) | -95.5% (-742 MB) |
| mimalloc @ idle 5s (MB) | 751 (706-768) | 9.1 (8.9-9.2) | -98.8% (-742 MB) |

## issue-11143-api-idle

API builds with in-memory files and maps, then outputs dropped and idle. Issues: [#11143](https://github.com/rolldown/rolldown/issues/11143).

### issue-11143-api-idle:6-builds

3 rounds, load 5.9 to 10.4.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1644 (1619-1656) | 1418 (1417-1439) | -13.7% (-226 MB) |
| process cpu time | 4.89s (4.83s-4.89s) | 4.98s (4.92s-4.99s) | +1.9% |
| all builds | 1.73s (1.72s-1.74s) | 1.75s (1.72s-1.79s) | +1.3% (noise) |
| phys_footprint @ before builds (MB) | 81.0 (81.0-81.4) | 81.6 (80.7-82.6) | +0.7% (+0.6 MB, noise) |
| phys_footprint @ outputs held (MB) | 1592 (1535-1616) | 1349 (1334-1358) | -15.3% (-243 MB) |
| phys_footprint @ idle 1.5s (MB) | 1592 (1536-1617) | 146 (145-147) | -90.8% (-1446 MB) |
| phys_footprint @ idle 4s (MB) | 1593 (1537-1617) | 146 (145-147) | -90.8% (-1447 MB) |
| phys_footprint @ idle 12s (MB) | 1593 (1537-1618) | 146 (145-147) | -90.8% (-1447 MB) |
| mimalloc @ before builds (MB) | 2.0 (2.0-2.0) | 1.7 (1.7-1.7) | -15.0% (-0.3 MB) |
| mimalloc @ outputs held (MB) | 1452 (1384-1466) | 1218 (1201-1227) | -16.1% (-234 MB) |
| mimalloc @ idle 1.5s (MB) | 1452 (1384-1466) | 14.3 (14.1-14.3) | -99.0% (-1437 MB) |
| mimalloc @ idle 4s (MB) | 1452 (1384-1466) | 14.3 (14.1-14.3) | -99.0% (-1437 MB) |
| mimalloc @ idle 12s (MB) | 1452 (1384-1466) | 14.3 (14.1-14.3) | -99.0% (-1437 MB) |

## issue-11233-optimizer-threads

One optimizer-like pass over typescript, codemirror and vue, then idle. Issues: [#11233](https://github.com/rolldown/rolldown/issues/11233).

### issue-11233-optimizer-threads:default-threads

3 rounds, load 5.6 to 9.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 388 (366-390) | 324 (322-326) | -16.4% (-63.7 MB) |
| process cpu time | 481ms (473ms-484ms) | 491ms (486ms-501ms) | +2.1% |
| build | 263ms (263ms-264ms) | 264ms (261ms-266ms) | +0.3% (noise) |
| phys_footprint @ output held (MB) | 375 (353-376) | 301 (294-306) | -19.6% (-73.3 MB) |
| phys_footprint @ idle 2s (MB) | 375 (353-377) | 31.2 (31.2-34.3) | -91.7% (-344 MB) |
| phys_footprint @ idle 10s (MB) | 375 (353-377) | 31.2 (31.1-34.3) | -91.7% (-344 MB) |
| mimalloc @ output held (MB) | 349 (327-351) | 276 (269-282) | -20.9% (-73.1 MB) |
| mimalloc @ idle 2s (MB) | 349 (327-351) | 5.9 (5.8-8.8) | -98.3% (-343 MB) |
| mimalloc @ idle 10s (MB) | 349 (327-351) | 5.9 (5.8-8.8) | -98.3% (-343 MB) |

## many-chunks

three.js x10 with one dynamic import per file (about 3,700 chunks), one build.

### many-chunks:sourcemap

3 rounds, load 4.6 to 4.9.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 588 (587-593) | 526 (510-535) | -10.5% (-61.6 MB) |
| process cpu time | 1.31s (1.30s-1.32s) | 1.35s (1.33s-1.35s) | +3.6% |
| build | 210ms (210ms-211ms) | 213ms (210ms-217ms) | +1.4% (noise) |
| chunks | 3692 (3692-3692) | 3692 (3692-3692) | 0.0% (noise) |
| phys_footprint @ output held (MB) | 582 (581-588) | 523 (507-532) | -10.1% (-58.7 MB) |
| phys_footprint @ after gc (MB) | 588 (587-593) | 526 (510-534) | -10.5% (-61.6 MB) |
| phys_footprint @ idle 2s (MB) | 588 (587-593) | 86.4 (86.3-86.6) | -85.3% (-502 MB) |
| mimalloc @ output held (MB) | 522 (522-523) | 457 (441-465) | -12.5% (-65.2 MB) |
| mimalloc @ after gc (MB) | 522 (522-523) | 457 (441-465) | -12.5% (-65.2 MB) |
| mimalloc @ idle 2s (MB) | 522 (522-523) | 17.5 (16.9-17.5) | -96.6% (-505 MB) |

## rebuild-gaps

three.js x10 with sourcemap, 10 builds with a pause between them.

### rebuild-gaps:gap-0

3 rounds, load 4.2 to 6.5.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1848 (1817-1911) | 1046 (1017-1076) | -43.4% (-802 MB) |
| process cpu time | 8.20s (8.11s-8.20s) | 8.16s (8.13s-8.22s) | -0.5% (noise) |
| later builds (median) | 236ms (231ms-238ms) | 230ms (228ms-234ms) | -2.6% (noise) |
| first build | 246ms (245ms-247ms) | 243ms (241ms-243ms) | -1.3% |
| later builds (max) | 246ms (243ms-261ms) | 238ms (237ms-247ms) | -3.2% (noise) |
| phys_footprint @ before build 2 (MB) | 568 (564-569) | 535 (533-536) | -5.7% (-32.6 MB) |
| phys_footprint @ before build 5 (MB) | 1070 (1043-1117) | 863 (817-896) | -19.3% (-206 MB) |
| phys_footprint @ before build 10 (MB) | 1661 (1654-1734) | 923 (923-956) | -44.4% (-738 MB) |

### rebuild-gaps:gap-300ms

3 rounds, load 6.2 to 7.1.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1821 (1796-1824) | 1001 (964-1032) | -45.0% (-820 MB) |
| process cpu time | 9.25s (9.07s-9.38s) | 9.26s (9.22s-9.30s) | +0.1% (noise) |
| later builds (median) | 242ms (242ms-249ms) | 239ms (236ms-239ms) | -1.4% |
| first build | 244ms (244ms-248ms) | 246ms (242ms-257ms) | +0.9% (noise) |
| later builds (max) | 261ms (256ms-268ms) | 250ms (250ms-253ms) | -4.3% |
| phys_footprint @ before build 2 (MB) | 568 (537-574) | 536 (533-549) | -5.6% (-31.7 MB, noise) |
| phys_footprint @ before build 5 (MB) | 1140 (1056-1148) | 867 (860-895) | -24.0% (-273 MB) |
| phys_footprint @ before build 10 (MB) | 1615 (1613-1628) | 811 (807-818) | -49.8% (-804 MB) |

### rebuild-gaps:gap-1s

3 rounds, load 4.4 to 6.1.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1790 (1786-1868) | 869 (867-874) | -51.4% (-920 MB) |
| process cpu time | 9.27s (9.26s-9.28s) | 9.81s (9.65s-9.84s) | +5.8% |
| later builds (median) | 245ms (245ms-247ms) | 245ms (243ms-245ms) | 0.0% (noise) |
| first build | 245ms (244ms-258ms) | 256ms (242ms-293ms) | +4.3% (noise) |
| later builds (max) | 258ms (252ms-258ms) | 256ms (249ms-261ms) | -0.8% (noise) |
| phys_footprint @ before build 2 (MB) | 566 (539-581) | 172 (171-172) | -69.7% (-394 MB) |
| phys_footprint @ before build 5 (MB) | 1065 (1045-1096) | 206 (204-209) | -80.7% (-859 MB) |
| phys_footprint @ before build 10 (MB) | 1609 (1552-1652) | 213 (212-214) | -86.7% (-1396 MB) |

### rebuild-gaps:gap-3s

3 rounds, load 3.7 to 6.1.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1832 (1752-1879) | 876 (863-883) | -52.2% (-955 MB) |
| process cpu time | 9.41s (9.36s-9.44s) | 9.95s (9.86s-10.01s) | +5.8% |
| later builds (median) | 242ms (242ms-246ms) | 244ms (241ms-248ms) | +0.9% (noise) |
| first build | 246ms (243ms-246ms) | 287ms (240ms-287ms) | +16.8% (noise) |
| later builds (max) | 258ms (248ms-258ms) | 266ms (254ms-275ms) | +3.1% (noise) |
| phys_footprint @ before build 2 (MB) | 548 (545-573) | 172 (170-172) | -68.7% (-376 MB) |
| phys_footprint @ before build 5 (MB) | 1078 (1076-1088) | 208 (203-209) | -80.7% (-870 MB) |
| phys_footprint @ before build 10 (MB) | 1612 (1575-1621) | 210 (210-212) | -86.9% (-1402 MB) |

## three10x

three.js x10, one build: peak, output held, after GC, idle.

### three10x:sourcemap

3 rounds, load 4.6 to 5.4.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 597 (594-607) | 576 (572-578) | -3.6% (-21.3 MB) |
| process cpu time | 975ms (971ms-975ms) | 1.02s (1.00s-1.03s) | +4.2% |
| build | 241ms (239ms-242ms) | 239ms (239ms-242ms) | -0.8% (noise) |
| phys_footprint @ output held (MB) | 562 (556-575) | 531 (484-535) | -5.6% (-31.4 MB) |
| phys_footprint @ after gc (MB) | 563 (556-575) | 531 (484-535) | -5.6% (-31.7 MB) |
| phys_footprint @ idle 2s (MB) | 563 (556-575) | 39.4 (39.1-39.7) | -93.0% (-523 MB) |
| mimalloc @ output held (MB) | 537 (530-550) | 505 (458-509) | -5.9% (-31.5 MB) |
| mimalloc @ after gc (MB) | 537 (530-550) | 505 (458-509) | -5.9% (-31.5 MB) |
| mimalloc @ idle 2s (MB) | 537 (530-550) | 13.4 (13.2-14.0) | -97.5% (-523 MB) |

## issue-11189

Bundled dev rebuilds (synthetic React app, 1,500 modules). Issues: [#11189](https://github.com/rolldown/rolldown/issues/11189).

### issue-11189:bundled

3 rounds, load 4.1 to 6.1.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 493 (475-504) | 284 (282-289) | -42.3% (-209 MB) |
| process cpu time | 2.44s (2.33s-2.52s) | 2.78s (2.77s-2.94s) | +14.0% |
| ready | 512ms (511ms-515ms) | 511ms (509ms-513ms) | -0.2% (noise) |
| crawled urls | 2 (2-2) | 2 (2-2) | 0.0% (noise) |
| phys_footprint @ after load (MB) | 147 (144-148) | 120 (120-122) | -18.1% (-26.5 MB) |
| phys_footprint @ edit 5 (MB) | 265 (251-269) | 150 (150-152) | -43.2% (-114 MB) |
| phys_footprint @ edit 10 (MB) | 371 (359-372) | 236 (235-236) | -36.5% (-135 MB) |
| phys_footprint @ edit 15 (MB) | 435 (428-446) | 144 (118-157) | -66.9% (-291 MB) |
| phys_footprint @ edit 20 (MB) | 493 (475-504) | 119 (118-147) | -75.8% (-373 MB) |
| mimalloc @ after load (MB) | 69.4 (67.1-69.8) | 43.1 (42.5-44.4) | -37.9% (-26.3 MB) |
| mimalloc @ edit 5 (MB) | 186 (172-190) | 71.5 (70.8-72.4) | -61.6% (-115 MB) |
| mimalloc @ edit 10 (MB) | 274 (262-278) | 140 (139-140) | -49.1% (-135 MB) |
| mimalloc @ edit 15 (MB) | 338 (329-348) | 63.1 (61.1-71.4) | -81.3% (-275 MB) |
| mimalloc @ edit 20 (MB) | 378 (363-390) | 60.7 (60.6-63.2) | -83.9% (-317 MB) |

## lobehub

lobehub SPA. Issues: [#9330](https://github.com/rolldown/rolldown/issues/9330).

### lobehub:build

3 rounds, load 6.2 to 9.3.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 4833 (4679-4869) | 4342 (4319-4627) | -10.2% (-491 MB) |
| process wall time | 22.88s (22.74s-23.25s) | 22.61s (22.47s-22.62s) | -1.2% |
| process cpu time | 46.76s (46.46s-47.50s) | 46.24s (46.19s-46.63s) | -1.1% (noise) |

### lobehub:build-sourcemap

3 rounds, load 7.9 to 13.4.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 5761 (5717-5967) | 5393 (5055-5859) | -6.4% (-368 MB, noise) |
| process wall time | 24.40s (24.37s-24.85s) | 24.51s (24.47s-24.66s) | +0.5% (noise) |
| process cpu time | 49.54s (49.13s-49.99s) | 49.77s (49.64s-50.33s) | +0.5% (noise) |

### lobehub:dev

3 rounds, load 3.7 to 9.3.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 2793 (2776-2843) | 2475 (2470-2491) | -11.4% (-319 MB) |
| process cpu time | 63.73s (62.92s-63.83s) | 63.65s (62.89s-63.77s) | -0.1% (noise) |
| ready | 1.43s (1.38s-1.44s) | 1.43s (1.41s-1.44s) | -0.2% (noise) |
| page load | 12.47s (12.31s-13.03s) | 12.78s (12.35s-12.84s) | +2.5% (noise) |
| page requests | 11324 (11234-11333) | 11325 (11243-11333) | +0.0% (noise) |
| failed requests | 6 (6-7) | 6 (6-6) | 0.0% (noise) |
| phys_footprint @ ready (MB) | 675 (619-717) | 697 (599-712) | +3.2% (+21.7 MB, noise) |
| phys_footprint @ page closed (MB) | 2581 (2488-2787) | 2018 (2011-2172) | -21.8% (-563 MB) |
| phys_footprint @ idle 90s (MB) | 2468 (2387-2656) | 2018 (2011-2068) | -18.3% (-451 MB) |
| phys_footprint @ idle 180s (MB) | 1886 (1842-1952) | 1134 (1028-1152) | -39.9% (-752 MB) |
| phys_footprint @ idle 270s (MB) | 1753 (1717-1818) | 966 (964-974) | -44.9% (-787 MB) |
| mimalloc @ ready (MB) | 331 (295-357) | 350 (276-358) | +5.8% (+19.1 MB, noise) |
| mimalloc @ page closed (MB) | 887 (870-929) | 236 (227-246) | -73.4% (-651 MB) |
| mimalloc @ idle 90s (MB) | 887 (870-929) | 236 (227-246) | -73.4% (-651 MB) |
| mimalloc @ idle 180s (MB) | 887 (870-929) | 236 (227-246) | -73.4% (-651 MB) |
| mimalloc @ idle 270s (MB) | 887 (870-929) | 236 (227-246) | -73.4% (-651 MB) |

## rolldown-9330-repro

Small #9330 repro, vite dev with @lobehub/ui. Issues: [#9330](https://github.com/rolldown/rolldown/issues/9330).

### rolldown-9330-repro:dev

3 rounds, load 4.2 to 6.4.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 2040 (2025-2124) | 1943 (1919-1964) | -4.8% (-96.9 MB) |
| process cpu time | 4.67s (4.44s-4.80s) | 4.74s (4.41s-4.88s) | +1.6% (noise) |
| ready | 513ms (511ms-517ms) | 512ms (511ms-512ms) | -0.2% (noise) |
| page load | 1.25s (1.17s-1.54s) | 1.40s (1.28s-1.57s) | +12.3% (noise) |
| page requests | 7 (7-7) | 7 (7-7) | 0.0% (noise) |
| failed requests | 0 (0-0) | 0 (0-0) | - |
| phys_footprint @ ready (MB) | 734 (642-1011) | 740 (629-989) | +0.7% (+5.5 MB, noise) |
| phys_footprint @ page closed (MB) | 1967 (1953-2072) | 775 (774-853) | -60.6% (-1192 MB) |
| phys_footprint @ idle 90s (MB) | 1411 (1403-1540) | 216 (216-217) | -84.7% (-1195 MB) |
| mimalloc @ ready (MB) | 658 (603-886) | 655 (584-856) | -0.4% (-2.9 MB, noise) |
| mimalloc @ page closed (MB) | 1215 (1209-1314) | 23.1 (22.9-24.2) | -98.1% (-1192 MB) |
| mimalloc @ idle 90s (MB) | 1215 (1209-1314) | 23.1 (22.9-24.2) | -98.1% (-1192 MB) |

## vinext

vinext, Next.js on Vite.

### vinext:build

3 rounds, load 4.3 to 4.6.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 632 (630-642) | 602 (580-604) | -4.7% (-30.0 MB) |
| process wall time | 1.21s (1.21s-1.23s) | 1.22s (1.21s-1.23s) | +0.7% (noise) |
| process cpu time | 2.52s (2.51s-2.52s) | 2.51s (2.51s-2.54s) | -0.2% (noise) |

## vue-vben-admin

vue-vben-admin, the web-antd app.

### vue-vben-admin:build

3 rounds, load 4.5 to 4.7.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1595 (1584-1609) | 1555 (1554-1558) | -2.5% (-40.2 MB) |
| process wall time | 2.72s (2.71s-2.76s) | 2.71s (2.70s-2.71s) | -0.3% (noise) |
| process cpu time | 6.75s (6.65s-6.91s) | 6.66s (6.64s-6.81s) | -1.3% (noise) |
