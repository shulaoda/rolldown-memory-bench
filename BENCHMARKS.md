# Benchmarks

`just bench` writes this file after every run, and `just report <results.json> ...` writes it again from saved runs.

- Machine: darwin arm64 (27.0.0), Apple M4 Pro, 14 cores, 48 GB, Node v26.0.0
- Run 2026-11-24 03:04 UTC: `just bench all --bin base=../rolldown-wt-base --bin pr=../rolldown-memory-reclaim`
- Run 2026-11-24 07:53 UTC: `just bench vue-vben-admin:build vinext:build vinext:playground-build --bin base=../rolldown-wt-base --bin pr=../rolldown-memory-reclaim --out /private/tmp/claude-501/-Users-shulaoda-workspace-voidzero-rolldown/0d96d600-5850-4860-a1fc-044942e0aa9f/scratchpad/newbench/mac-re3.md`
- Run 2026-11-24 07:54 UTC: `just bench lobehub:build-sourcemap --rounds 9 --bin base=../rolldown-wt-base --bin pr=../rolldown-memory-reclaim --out /private/tmp/claude-501/-Users-shulaoda-workspace-voidzero-rolldown/0d96d600-5850-4860-a1fc-044942e0aa9f/scratchpad/newbench/mac-re9.md`
- Memory: `phys_footprint`, peak: the highest `phys_footprint` of the process. Numbers compare only on the same machine.
- Load average (1 min) when a run started: 0.9 to 10.6, on 14 cores

| Bin | rolldown | From | Commit |
| --- | --- | --- | --- |
| base | 1.3.3 | repo `../rolldown-wt-base` | ab231fbad5 |
| pr | 1.3.3 | repo `../rolldown-memory-reclaim` | 12b8d0663a |

Every number is the median over the rounds, with the range in parentheses. A change is from `base`. A change marked noise is not a clear difference: its ranges overlap, or a side has fewer than 3 rounds.

## Summary

| Case | Peak | CPU time | Time | Memory at the last mark |
| --- | ---: | ---: | ---: | ---: |
| held-outputs:sourcemap | -13.0% (-241 MB) | +0.9% | all builds: -0.7% (noise) | idle 2s: -97.7% (-1753 MB) |
| held-outputs:plain | -14.0% (-157 MB) | +1.2% | all builds: +0.4% (noise) | idle 2s: -96.2% (-1041 MB) |
| issue-10985-tight-loop:close | -47.8% (-377 MB) | +0.9% (noise) | all builds: -1.3% | idle 5s: -95.7% (-755 MB) |
| issue-10985-tight-loop:generate | -45.6% (-356 MB) | +1.2% (noise) | all builds: -1.1% (noise) | idle 5s: -95.6% (-746 MB) |
| issue-11143-api-idle:6-builds | -15.2% (-257 MB) | +1.4% (noise) | all builds: -0.1% (noise) | idle 12s: -90.7% (-1460 MB) |
| issue-11143-api-idle:1-build | -2.4% (-18.0 MB, noise) | +3.6% (noise) | all builds: +1.0% (noise) | idle 12s: -80.2% (-573 MB) |
| issue-11233-optimizer-threads:default-threads | -17.8% (-67.5 MB) | +1.4% (noise) | build: -1.8% (noise) | idle 10s: -90.9% (-334 MB) |
| issue-11233-optimizer-threads:4-threads | -12.3% (-40.7 MB) | +2.1% (noise) | build: -0.2% (noise) | idle 10s: -90.1% (-256 MB) |
| many-chunks:plain | -6.3% (-30.7 MB) | +5.2% | build: +0.4% (noise) | idle 2s: -86.5% (-423 MB) |
| many-chunks:sourcemap | -9.1% (-55.0 MB) | +4.6% | build: +1.3% (noise) | idle 2s: -86.4% (-524 MB) |
| rebuild-gaps:gap-0 | -44.3% (-844 MB) | +0.6% (noise) | later builds (median): -1.6% (noise) | before build 10: -44.3% (-751 MB) |
| rebuild-gaps:gap-300ms | -44.7% (-834 MB) | -0.1% (noise) | later builds (median): -1.8% (noise) | before build 10: -50.1% (-821 MB) |
| rebuild-gaps:gap-1s | -50.3% (-935 MB) | +5.1% | later builds (median): +0.0% (noise) | before build 10: -87.2% (-1428 MB) |
| rebuild-gaps:gap-3s | -50.4% (-922 MB) | +6.3% | later builds (median): -1.1% (noise) | before build 10: -87.6% (-1443 MB) |
| three10x:plain | -1.2% (-5.7 MB) | +4.3% | build: +2.1% (noise) | idle 2s: -91.9% (-401 MB) |
| three10x:sourcemap | -4.1% (-25.3 MB) | +2.5% | build: -0.7% (noise) | idle 2s: -93.8% (-543 MB) |
| three10x:sourcemap-minify | -2.8% (-18.3 MB) | +3.2% | build: +0.6% (noise) | idle 2s: -93.3% (-502 MB) |
| issue-11189:bundled | -42.2% (-208 MB) | +20.5% | ready: 0.0% (noise) | edit 20: -71.6% (-354 MB) |
| issue-11189:unbundled | +2.5% (+5.0 MB, noise) | -0.1% (noise) | ready: 0.0% (noise) | edit 20: +7.5% (+13.0 MB, noise) |
| issue-11189:bundled-gc | -55.3% (-231 MB) | +19.6% | ready: +0.6% (noise) | edit 20: -71.4% (-299 MB) |
| issue-11189:bundled-tailwind-leaf | -8.5% (-14.5 MB) | +0.1% (noise) | ready: +0.2% (noise) | edit 20: -21.3% (-28.8 MB) |
| lobehub:build | -6.7% (-346 MB) | -0.0% (noise) | process wall time: -0.0% (noise) | - |
| lobehub:build-sourcemap | -7.8% (-475 MB, noise) | +0.4% (noise) | process wall time: -0.8% (noise) | - |
| lobehub:dev | -11.5% (-329 MB, noise) | +0.3% (noise) | ready: +6.1% | idle 270s: -36.2% (-671 MB) |
| lobehub:dev-warm | -5.2% (-103 MB, noise) | -0.3% (noise) | ready: -0.1% (noise) | idle 270s: -1.1% (-11.4 MB, noise) |
| rolldown-9330-repro:dev | -6.4% (-134 MB) | -4.3% (noise) | ready: -0.6% (noise) | idle 90s: -81.3% (-1242 MB) |
| vinext:build | -6.9% (-44.1 MB) | -0.2% (noise) | process wall time: -0.2% (noise) | - |
| vinext:playground-build | -7.0% (-94.7 MB) | -0.6% (noise) | process wall time: -0.3% (noise) | - |
| vue-vben-admin:build | -1.5% (-24.8 MB) | -0.7% (noise) | process wall time: +1.3% (noise) | - |

## held-outputs

three.js x10, 10 back-to-back builds that keep their outputs (dashboard shape).

### held-outputs:sourcemap

5 rounds, load 1.8 to 2.8.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1861 (1832-1898) | 1619 (1564-1641) | -13.0% (-241 MB) |
| process cpu time | 8.19s (8.18s-8.20s) | 8.26s (8.24s-8.35s) | +0.9% |
| all builds | 2.29s (2.28s-2.31s) | 2.28s (2.26s-2.29s) | -0.7% (noise) |
| phys_footprint @ 10 outputs held (MB) | 1795 (1790-1816) | 1522 (1499-1570) | -15.2% (-273 MB) |
| phys_footprint @ after gc (MB) | 1795 (1791-1817) | 1522 (1500-1571) | -15.2% (-274 MB) |
| phys_footprint @ idle 2s (MB) | 1795 (1791-1817) | 41.8 (41.3-42.3) | -97.7% (-1753 MB) |
| mimalloc @ 10 outputs held (MB) | 1768 (1763-1790) | 1495 (1473-1544) | -15.4% (-273 MB) |
| mimalloc @ after gc (MB) | 1768 (1763-1790) | 1495 (1473-1544) | -15.4% (-273 MB) |
| mimalloc @ idle 2s (MB) | 1768 (1763-1790) | 14.8 (14.7-15.6) | -99.2% (-1753 MB) |

### held-outputs:plain

5 rounds, load 2.6 to 3.2.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1123 (1094-1178) | 966 (943-993) | -14.0% (-157 MB) |
| process cpu time | 7.44s (7.39s-7.49s) | 7.53s (7.49s-7.66s) | +1.2% |
| all builds | 1.86s (1.85s-1.88s) | 1.87s (1.86s-1.90s) | +0.4% (noise) |
| phys_footprint @ 10 outputs held (MB) | 1081 (1052-1136) | 924 (901-951) | -14.5% (-157 MB) |
| phys_footprint @ after gc (MB) | 1082 (1053-1136) | 924 (901-951) | -14.6% (-158 MB) |
| phys_footprint @ idle 2s (MB) | 1082 (1053-1136) | 40.6 (40.1-40.7) | -96.2% (-1041 MB) |
| mimalloc @ 10 outputs held (MB) | 1055 (1026-1110) | 898 (875-925) | -14.9% (-157 MB) |
| mimalloc @ after gc (MB) | 1055 (1026-1110) | 898 (875-925) | -14.9% (-157 MB) |
| mimalloc @ idle 2s (MB) | 1055 (1026-1110) | 14.0 (14.0-14.3) | -98.7% (-1041 MB) |

## issue-10985-tight-loop

Memory across 150 builds in a tight loop, then idle. Issues: [#10985](https://github.com/rolldown/rolldown/issues/10985), [#10984](https://github.com/rolldown/rolldown/issues/10984).

### issue-10985-tight-loop:close

5 rounds, load 2.1 to 3.6.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 789 (752-807) | 412 (376-424) | -47.8% (-377 MB) |
| process cpu time | 11.77s (11.74s-11.84s) | 11.88s (11.80s-11.92s) | +0.9% (noise) |
| all builds | 2.97s (2.97s-2.98s) | 2.93s (2.93s-2.96s) | -1.3% |
| phys_footprint @ build 25 (MB) | 527 (505-572) | 372 (359-376) | -29.3% (-155 MB) |
| phys_footprint @ build 50 (MB) | 637 (602-698) | 385 (368-407) | -39.6% (-253 MB) |
| phys_footprint @ build 75 (MB) | 683 (648-725) | 387 (371-413) | -43.4% (-297 MB) |
| phys_footprint @ build 100 (MB) | 721 (698-775) | 390 (374-420) | -45.9% (-331 MB) |
| phys_footprint @ build 125 (MB) | 751 (740-794) | 400 (375-423) | -46.8% (-352 MB) |
| phys_footprint @ build 150 (MB) | 789 (752-807) | 412 (376-424) | -47.7% (-377 MB) |
| phys_footprint @ idle 5s (MB) | 789 (752-807) | 34.3 (33.5-34.8) | -95.7% (-755 MB) |
| mimalloc @ idle 5s (MB) | 762 (726-781) | 8.1 (7.7-8.5) | -98.9% (-754 MB) |

### issue-10985-tight-loop:generate

5 rounds, load 2.3 to 3.2.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 781 (771-796) | 425 (420-439) | -45.6% (-356 MB) |
| process cpu time | 11.71s (11.64s-11.95s) | 11.85s (11.73s-12.04s) | +1.2% (noise) |
| all builds | 2.98s (2.95s-3.02s) | 2.94s (2.93s-2.95s) | -1.1% (noise) |
| phys_footprint @ build 25 (MB) | 511 (506-528) | 368 (364-395) | -28.0% (-143 MB) |
| phys_footprint @ build 50 (MB) | 633 (588-679) | 414 (400-432) | -34.6% (-219 MB) |
| phys_footprint @ build 75 (MB) | 686 (638-707) | 419 (406-435) | -38.9% (-267 MB) |
| phys_footprint @ build 100 (MB) | 731 (675-754) | 424 (409-437) | -42.1% (-308 MB) |
| phys_footprint @ build 125 (MB) | 760 (696-779) | 424 (419-438) | -44.1% (-335 MB) |
| phys_footprint @ build 150 (MB) | 781 (771-796) | 425 (420-439) | -45.6% (-356 MB) |
| phys_footprint @ idle 5s (MB) | 781 (771-796) | 34.4 (34.1-34.6) | -95.6% (-746 MB) |
| mimalloc @ idle 5s (MB) | 755 (744-769) | 8.4 (8.1-8.4) | -98.9% (-746 MB) |

## issue-11143-api-idle

API builds with in-memory files and maps, then outputs dropped and idle. Issues: [#11143](https://github.com/rolldown/rolldown/issues/11143).

### issue-11143-api-idle:6-builds

5 rounds, load 1.8 to 4.2.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1691 (1624-1713) | 1435 (1421-1457) | -15.2% (-257 MB) |
| process cpu time | 4.86s (4.83s-5.16s) | 4.93s (4.93s-4.95s) | +1.4% (noise) |
| all builds | 1.71s (1.70s-1.87s) | 1.71s (1.70s-1.73s) | -0.1% (noise) |
| phys_footprint @ before builds (MB) | 81.1 (80.9-81.4) | 80.8 (80.6-81.0) | -0.4% (-0.3 MB, noise) |
| phys_footprint @ outputs held (MB) | 1607 (1548-1676) | 1359 (1325-1396) | -15.4% (-248 MB) |
| phys_footprint @ idle 1.5s (MB) | 1609 (1548-1678) | 149 (147-151) | -90.7% (-1460 MB) |
| phys_footprint @ idle 4s (MB) | 1609 (1548-1678) | 149 (147-151) | -90.7% (-1460 MB) |
| phys_footprint @ idle 12s (MB) | 1609 (1548-1678) | 149 (147-151) | -90.7% (-1460 MB) |
| mimalloc @ before builds (MB) | 2.0 (2.0-2.0) | 1.7 (1.7-1.7) | -15.0% (-0.3 MB) |
| mimalloc @ outputs held (MB) | 1456 (1402-1524) | 1225 (1192-1260) | -15.9% (-231 MB) |
| mimalloc @ idle 1.5s (MB) | 1456 (1402-1524) | 15.2 (14.4-16.0) | -99.0% (-1441 MB) |
| mimalloc @ idle 4s (MB) | 1456 (1402-1524) | 15.2 (14.4-16.0) | -99.0% (-1441 MB) |
| mimalloc @ idle 12s (MB) | 1456 (1402-1524) | 15.2 (14.4-16.0) | -99.0% (-1441 MB) |

### issue-11143-api-idle:1-build

5 rounds, load 1.4 to 2.4.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 754 (751-757) | 736 (730-757) | -2.4% (-18.0 MB, noise) |
| process cpu time | 1.06s (1.05s-1.09s) | 1.10s (1.09s-1.12s) | +3.6% (noise) |
| all builds | 293ms (291ms-319ms) | 296ms (290ms-306ms) | +1.0% (noise) |
| phys_footprint @ before builds (MB) | 81.4 (80.9-82.3) | 80.8 (80.6-82.4) | -0.7% (-0.6 MB, noise) |
| phys_footprint @ outputs held (MB) | 712 (709-716) | 659 (634-680) | -7.5% (-53.7 MB) |
| phys_footprint @ idle 1.5s (MB) | 715 (711-718) | 141 (126-143) | -80.2% (-574 MB) |
| phys_footprint @ idle 4s (MB) | 715 (711-718) | 141 (126-143) | -80.2% (-574 MB) |
| phys_footprint @ idle 12s (MB) | 715 (711-718) | 141 (126-143) | -80.2% (-573 MB) |
| mimalloc @ before builds (MB) | 2.0 (2.0-2.0) | 1.7 (1.7-1.7) | -15.0% (-0.3 MB) |
| mimalloc @ outputs held (MB) | 584 (574-589) | 531 (507-552) | -8.9% (-52.2 MB) |
| mimalloc @ idle 1.5s (MB) | 584 (574-589) | 11.5 (10.7-11.9) | -98.0% (-572 MB) |
| mimalloc @ idle 4s (MB) | 584 (574-589) | 11.5 (10.7-11.9) | -98.0% (-572 MB) |
| mimalloc @ idle 12s (MB) | 584 (574-589) | 11.5 (10.7-11.9) | -98.0% (-572 MB) |

## issue-11233-optimizer-threads

One optimizer-like pass over typescript, codemirror and vue, then idle. Issues: [#11233](https://github.com/rolldown/rolldown/issues/11233).

### issue-11233-optimizer-threads:default-threads

5 rounds, load 1.4 to 2.3.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 380 (359-391) | 312 (300-328) | -17.8% (-67.5 MB) |
| process cpu time | 487ms (484ms-564ms) | 494ms (490ms-502ms) | +1.4% (noise) |
| build | 265ms (261ms-326ms) | 260ms (258ms-263ms) | -1.8% (noise) |
| phys_footprint @ output held (MB) | 367 (346-378) | 304 (286-307) | -17.1% (-62.6 MB) |
| phys_footprint @ idle 2s (MB) | 367 (347-378) | 33.5 (30.6-33.9) | -90.9% (-334 MB) |
| phys_footprint @ idle 10s (MB) | 367 (347-378) | 33.6 (30.7-34.1) | -90.9% (-334 MB) |
| mimalloc @ output held (MB) | 341 (321-353) | 279 (261-282) | -18.3% (-62.4 MB) |
| mimalloc @ idle 2s (MB) | 341 (321-353) | 8.2 (5.3-8.4) | -97.6% (-333 MB) |
| mimalloc @ idle 10s (MB) | 341 (321-353) | 8.2 (5.3-8.4) | -97.6% (-333 MB) |

### issue-11233-optimizer-threads:4-threads

5 rounds, load 1.4 to 1.9.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 331 (319-346) | 290 (285-304) | -12.3% (-40.7 MB) |
| process cpu time | 421ms (418ms-431ms) | 430ms (425ms-446ms) | +2.1% (noise) |
| build | 256ms (255ms-263ms) | 256ms (254ms-263ms) | -0.2% (noise) |
| phys_footprint @ output held (MB) | 284 (274-333) | 277 (272-290) | -2.4% (-6.8 MB, noise) |
| phys_footprint @ idle 2s (MB) | 284 (275-334) | 27.9 (26.9-28.3) | -90.2% (-256 MB) |
| phys_footprint @ idle 10s (MB) | 284 (275-334) | 28.0 (27.1-28.3) | -90.1% (-256 MB) |
| mimalloc @ output held (MB) | 260 (251-309) | 253 (248-267) | -2.5% (-6.6 MB, noise) |
| mimalloc @ idle 2s (MB) | 260 (251-309) | 4.1 (3.2-4.3) | -98.4% (-256 MB) |
| mimalloc @ idle 10s (MB) | 260 (251-309) | 4.1 (3.2-4.3) | -98.4% (-256 MB) |

## many-chunks

three.js x10 with one dynamic import per file (about 3,700 chunks), one build.

### many-chunks:plain

5 rounds, load 1.2 to 1.4.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 489 (484-491) | 458 (450-467) | -6.3% (-30.7 MB) |
| process cpu time | 1.19s (1.18s-1.20s) | 1.25s (1.22s-1.26s) | +5.2% |
| build | 180ms (179ms-182ms) | 180ms (180ms-188ms) | +0.4% (noise) |
| chunks | 3692 (3692-3692) | 3692 (3692-3692) | 0.0% (noise) |
| phys_footprint @ output held (MB) | 484 (479-486) | 457 (447-465) | -5.6% (-27.0 MB) |
| phys_footprint @ after gc (MB) | 489 (484-491) | 458 (450-467) | -6.3% (-30.7 MB) |
| phys_footprint @ idle 2s (MB) | 489 (484-491) | 65.8 (65.5-66.8) | -86.5% (-423 MB) |
| mimalloc @ output held (MB) | 433 (428-434) | 406 (397-414) | -6.3% (-27.4 MB) |
| mimalloc @ after gc (MB) | 433 (428-434) | 406 (397-414) | -6.3% (-27.4 MB) |
| mimalloc @ idle 2s (MB) | 433 (428-434) | 12.9 (12.7-13.5) | -97.0% (-420 MB) |

### many-chunks:sourcemap

5 rounds, load 1.2 to 2.3.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 607 (600-624) | 552 (543-560) | -9.1% (-55.0 MB) |
| process cpu time | 1.30s (1.30s-1.32s) | 1.36s (1.35s-1.38s) | +4.6% |
| build | 207ms (206ms-213ms) | 210ms (207ms-212ms) | +1.3% (noise) |
| chunks | 3692 (3692-3692) | 3692 (3692-3692) | 0.0% (noise) |
| phys_footprint @ output held (MB) | 602 (594-620) | 549 (540-557) | -8.8% (-52.8 MB) |
| phys_footprint @ after gc (MB) | 607 (600-624) | 552 (543-560) | -9.0% (-54.8 MB) |
| phys_footprint @ idle 2s (MB) | 607 (600-624) | 82.3 (81.8-82.7) | -86.4% (-524 MB) |
| mimalloc @ output held (MB) | 536 (535-554) | 483 (475-492) | -9.9% (-53.3 MB) |
| mimalloc @ after gc (MB) | 536 (535-554) | 483 (475-492) | -9.9% (-53.3 MB) |
| mimalloc @ idle 2s (MB) | 536 (535-554) | 13.8 (13.6-14.0) | -97.4% (-523 MB) |

## rebuild-gaps

three.js x10 with sourcemap, 10 builds with a pause between them.

### rebuild-gaps:gap-0

5 rounds, load 1.9 to 2.1.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1903 (1850-1947) | 1059 (1023-1090) | -44.3% (-844 MB) |
| process cpu time | 8.11s (8.09s-8.21s) | 8.15s (8.11s-8.20s) | +0.6% (noise) |
| later builds (median) | 226ms (222ms-227ms) | 222ms (220ms-225ms) | -1.6% (noise) |
| first build | 245ms (242ms-248ms) | 245ms (240ms-253ms) | +0.1% (noise) |
| later builds (max) | 238ms (231ms-243ms) | 235ms (232ms-242ms) | -1.0% (noise) |
| phys_footprint @ before build 2 (MB) | 527 (524-556) | 520 (496-521) | -1.3% (-6.7 MB) |
| phys_footprint @ before build 5 (MB) | 1136 (1072-1178) | 878 (864-898) | -22.8% (-259 MB) |
| phys_footprint @ before build 10 (MB) | 1693 (1669-1755) | 942 (931-960) | -44.3% (-751 MB) |

### rebuild-gaps:gap-300ms

5 rounds, load 1.7 to 3.9.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1866 (1819-1891) | 1032 (1016-1041) | -44.7% (-834 MB) |
| process cpu time | 9.26s (9.16s-9.45s) | 9.24s (9.21s-9.30s) | -0.1% (noise) |
| later builds (median) | 242ms (235ms-242ms) | 237ms (235ms-239ms) | -1.8% (noise) |
| first build | 250ms (246ms-261ms) | 246ms (243ms-260ms) | -1.8% (noise) |
| later builds (max) | 250ms (246ms-259ms) | 246ms (241ms-253ms) | -1.9% (noise) |
| phys_footprint @ before build 2 (MB) | 576 (521-581) | 494 (492-523) | -14.1% (-81.2 MB, noise) |
| phys_footprint @ before build 5 (MB) | 1108 (1083-1136) | 903 (841-914) | -18.5% (-205 MB) |
| phys_footprint @ before build 10 (MB) | 1639 (1621-1648) | 818 (812-853) | -50.1% (-821 MB) |

### rebuild-gaps:gap-1s

5 rounds, load 2 to 3.1.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1860 (1826-1870) | 925 (904-932) | -50.3% (-935 MB) |
| process cpu time | 9.44s (9.09s-9.46s) | 9.92s (9.66s-10.07s) | +5.1% |
| later builds (median) | 241ms (237ms-244ms) | 241ms (236ms-244ms) | +0.0% (noise) |
| first build | 246ms (244ms-254ms) | 245ms (243ms-271ms) | -0.3% (noise) |
| later builds (max) | 251ms (242ms-275ms) | 259ms (248ms-279ms) | +3.2% (noise) |
| phys_footprint @ before build 2 (MB) | 576 (524-591) | 168 (168-169) | -70.9% (-408 MB) |
| phys_footprint @ before build 5 (MB) | 1083 (1053-1178) | 203 (202-205) | -81.2% (-880 MB) |
| phys_footprint @ before build 10 (MB) | 1638 (1609-1648) | 209 (206-212) | -87.2% (-1428 MB) |

### rebuild-gaps:gap-3s

5 rounds, load 1.4 to 2.9.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1828 (1751-1878) | 906 (903-923) | -50.4% (-922 MB) |
| process cpu time | 9.36s (9.17s-9.68s) | 9.95s (9.75s-10.13s) | +6.3% |
| later builds (median) | 240ms (238ms-241ms) | 237ms (236ms-240ms) | -1.1% (noise) |
| first build | 246ms (239ms-260ms) | 243ms (239ms-260ms) | -1.2% (noise) |
| later builds (max) | 248ms (242ms-271ms) | 249ms (245ms-251ms) | +0.5% (noise) |
| phys_footprint @ before build 2 (MB) | 581 (562-587) | 168 (168-169) | -71.1% (-413 MB) |
| phys_footprint @ before build 5 (MB) | 1106 (1043-1126) | 204 (203-207) | -81.6% (-903 MB) |
| phys_footprint @ before build 10 (MB) | 1649 (1563-1651) | 205 (203-208) | -87.6% (-1443 MB) |

## three10x

three.js x10, one build: peak, output held, after GC, idle.

### three10x:plain

5 rounds, load 2 to 2.4.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 478 (476-485) | 472 (467-475) | -1.2% (-5.7 MB) |
| process cpu time | 900ms (895ms-926ms) | 939ms (936ms-952ms) | +4.3% |
| build | 193ms (192ms-203ms) | 197ms (192ms-203ms) | +2.1% (noise) |
| phys_footprint @ output held (MB) | 436 (434-443) | 430 (426-434) | -1.3% (-5.6 MB) |
| phys_footprint @ after gc (MB) | 436 (434-444) | 431 (426-434) | -1.2% (-5.4 MB, noise) |
| phys_footprint @ idle 2s (MB) | 436 (434-444) | 35.5 (35.1-35.7) | -91.9% (-401 MB) |
| mimalloc @ output held (MB) | 410 (409-418) | 405 (401-409) | -1.4% (-5.8 MB, noise) |
| mimalloc @ after gc (MB) | 410 (409-418) | 405 (401-409) | -1.4% (-5.8 MB, noise) |
| mimalloc @ idle 2s (MB) | 410 (409-418) | 9.7 (9.5-9.7) | -97.6% (-401 MB) |

### three10x:sourcemap

5 rounds, load 1.8 to 2.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 611 (606-618) | 585 (582-592) | -4.1% (-25.3 MB) |
| process cpu time | 976ms (954ms-984ms) | 1.00s (987ms-1.04s) | +2.5% |
| build | 241ms (236ms-255ms) | 239ms (237ms-246ms) | -0.7% (noise) |
| phys_footprint @ output held (MB) | 579 (564-586) | 516 (494-543) | -10.9% (-63.0 MB) |
| phys_footprint @ after gc (MB) | 579 (564-586) | 516 (495-543) | -10.9% (-63.3 MB) |
| phys_footprint @ idle 2s (MB) | 579 (564-586) | 35.9 (35.6-36.3) | -93.8% (-543 MB) |
| mimalloc @ output held (MB) | 553 (538-560) | 490 (469-518) | -11.4% (-62.9 MB) |
| mimalloc @ after gc (MB) | 553 (538-560) | 490 (469-518) | -11.4% (-62.9 MB) |
| mimalloc @ idle 2s (MB) | 553 (538-560) | 10.3 (9.9-10.5) | -98.1% (-543 MB) |

### three10x:sourcemap-minify

5 rounds, load 1.8 to 1.9.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 656 (655-662) | 637 (633-642) | -2.8% (-18.3 MB) |
| process cpu time | 1.05s (1.03s-1.06s) | 1.08s (1.06s-1.09s) | +3.2% |
| build | 311ms (310ms-317ms) | 313ms (309ms-321ms) | +0.6% (noise) |
| phys_footprint @ output held (MB) | 538 (536-557) | 524 (516-564) | -2.5% (-13.7 MB, noise) |
| phys_footprint @ after gc (MB) | 538 (537-557) | 524 (516-565) | -2.6% (-13.8 MB, noise) |
| phys_footprint @ idle 2s (MB) | 538 (537-557) | 36.3 (35.9-36.8) | -93.3% (-502 MB) |
| mimalloc @ output held (MB) | 512 (511-531) | 499 (490-538) | -2.6% (-13.5 MB, noise) |
| mimalloc @ after gc (MB) | 512 (511-531) | 499 (490-538) | -2.6% (-13.5 MB, noise) |
| mimalloc @ idle 2s (MB) | 512 (511-531) | 10.4 (10.1-10.6) | -98.0% (-502 MB) |

## issue-11189

Bundled dev rebuilds (synthetic React app, 1,500 modules). Issues: [#11189](https://github.com/rolldown/rolldown/issues/11189).

### issue-11189:bundled

3 rounds, load 1.1 to 2.2.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 494 (486-500) | 286 (212-287) | -42.2% (-208 MB) |
| process cpu time | 2.45s (2.42s-2.52s) | 2.96s (2.88s-3.01s) | +20.5% |
| ready | 513ms (513ms-515ms) | 513ms (505ms-514ms) | 0.0% (noise) |
| crawled urls | 2 (2-2) | 2 (2-2) | 0.0% (noise) |
| phys_footprint @ after load (MB) | 151 (149-152) | 120 (119-120) | -20.7% (-31.2 MB) |
| phys_footprint @ edit 5 (MB) | 281 (264-283) | 157 (151-157) | -44.3% (-125 MB) |
| phys_footprint @ edit 10 (MB) | 381 (362-383) | 242 (136-243) | -36.5% (-139 MB) |
| phys_footprint @ edit 15 (MB) | 435 (431-440) | 136 (124-150) | -68.8% (-299 MB) |
| phys_footprint @ edit 20 (MB) | 494 (486-500) | 140 (127-154) | -71.6% (-354 MB) |
| mimalloc @ after load (MB) | 73.3 (71.9-74.2) | 42.4 (42.1-43.2) | -42.2% (-30.9 MB) |
| mimalloc @ edit 5 (MB) | 196 (179-198) | 71.4 (70.9-71.5) | -63.5% (-124 MB) |
| mimalloc @ edit 10 (MB) | 278 (258-279) | 138 (59.6-139) | -50.5% (-140 MB) |
| mimalloc @ edit 15 (MB) | 330 (326-334) | 59.1 (58.9-61.2) | -82.1% (-271 MB) |
| mimalloc @ edit 20 (MB) | 373 (365-379) | 61.1 (60.6-62.1) | -83.6% (-312 MB) |

### issue-11189:unbundled

3 rounds, load 1.2 to 1.8.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 198 (190-205) | 203 (201-203) | +2.5% (+5.0 MB, noise) |
| process cpu time | 2.91s (2.85s-2.99s) | 2.91s (2.85s-2.92s) | -0.1% (noise) |
| ready | 526ms (525ms-527ms) | 526ms (524ms-527ms) | 0.0% (noise) |
| crawled urls | 1542 (1542-1542) | 1542 (1542-1542) | 0.0% (noise) |
| phys_footprint @ after load (MB) | 181 (180-182) | 179 (177-179) | -1.3% (-2.4 MB) |
| phys_footprint @ edit 5 (MB) | 189 (184-197) | 197 (196-197) | +4.0% (+7.6 MB, noise) |
| phys_footprint @ edit 10 (MB) | 183 (176-187) | 191 (189-195) | +4.1% (+7.5 MB) |
| phys_footprint @ edit 15 (MB) | 174 (161-177) | 190 (161-191) | +9.1% (+15.8 MB, noise) |
| phys_footprint @ edit 20 (MB) | 174 (165-179) | 187 (176-190) | +7.5% (+13.0 MB, noise) |
| mimalloc @ after load (MB) | 13.2 (13.0-14.2) | 9.6 (9.3-9.6) | -27.3% (-3.6 MB) |
| mimalloc @ edit 5 (MB) | 13.4 (13.0-14.5) | 11.2 (11.0-11.3) | -16.4% (-2.2 MB) |
| mimalloc @ edit 10 (MB) | 13.8 (13.5-14.2) | 11.5 (11.1-11.8) | -16.7% (-2.3 MB) |
| mimalloc @ edit 15 (MB) | 14.0 (13.7-14.2) | 11.6 (11.2-11.9) | -17.1% (-2.4 MB) |
| mimalloc @ edit 20 (MB) | 13.8 (13.7-14.4) | 11.7 (11.3-12.0) | -15.2% (-2.1 MB) |

### issue-11189:bundled-gc

3 rounds, load 1.9 to 3.6.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 418 (397-425) | 187 (179-193) | -55.3% (-231 MB) |
| process cpu time | 2.74s (2.72s-2.76s) | 3.28s (3.23s-3.35s) | +19.6% |
| ready | 511ms (509ms-512ms) | 514ms (509ms-515ms) | +0.6% (noise) |
| crawled urls | 2 (2-2) | 2 (2-2) | 0.0% (noise) |
| phys_footprint @ after load (MB) | 145 (142-148) | 118 (117-118) | -19.1% (-27.8 MB) |
| phys_footprint @ edit 5 (MB) | 247 (238-255) | 121 (121-122) | -51.0% (-126 MB) |
| phys_footprint @ edit 10 (MB) | 305 (305-319) | 123 (123-124) | -59.6% (-182 MB) |
| phys_footprint @ edit 15 (MB) | 368 (356-371) | 125 (124-125) | -66.2% (-244 MB) |
| phys_footprint @ edit 20 (MB) | 418 (397-419) | 120 (119-124) | -71.4% (-299 MB) |
| mimalloc @ after load (MB) | 70.0 (67.8-73.5) | 43.2 (43.1-43.3) | -38.3% (-26.8 MB) |
| mimalloc @ edit 5 (MB) | 182 (170-190) | 57.6 (57.4-58.1) | -68.3% (-124 MB) |
| mimalloc @ edit 10 (MB) | 238 (237-253) | 59.2 (58.9-59.6) | -75.2% (-179 MB) |
| mimalloc @ edit 15 (MB) | 305 (289-305) | 59.7 (59.3-60.7) | -80.4% (-245 MB) |
| mimalloc @ edit 20 (MB) | 349 (330-351) | 60.0 (60.0-60.0) | -82.8% (-289 MB) |

### issue-11189:bundled-tailwind-leaf

3 rounds, load 0.9 to 1.4.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 170 (167-172) | 156 (151-158) | -8.5% (-14.5 MB) |
| process cpu time | 890ms (887ms-907ms) | 891ms (864ms-894ms) | +0.1% (noise) |
| ready | 509ms (509ms-515ms) | 510ms (507ms-511ms) | +0.2% (noise) |
| crawled urls | 7 (7-7) | 7 (7-7) | 0.0% (noise) |
| phys_footprint @ after load (MB) | 153 (151-154) | 126 (124-126) | -17.6% (-27.0 MB) |
| phys_footprint @ edit 5 (MB) | 169 (167-169) | 142 (140-142) | -16.0% (-27.0 MB) |
| phys_footprint @ edit 10 (MB) | 142 (140-143) | 115 (113-115) | -19.2% (-27.2 MB) |
| phys_footprint @ edit 15 (MB) | 135 (133-142) | 114 (112-114) | -15.8% (-21.4 MB) |
| phys_footprint @ edit 20 (MB) | 135 (133-142) | 107 (106-114) | -21.3% (-28.8 MB) |
| mimalloc @ after load (MB) | 72.0 (70.1-73.1) | 44.9 (43.0-45.4) | -37.6% (-27.1 MB) |
| mimalloc @ edit 5 (MB) | 72.0 (70.1-73.1) | 44.9 (43.0-45.4) | -37.6% (-27.1 MB) |
| mimalloc @ edit 10 (MB) | 72.0 (70.1-73.1) | 44.9 (43.0-45.4) | -37.6% (-27.1 MB) |
| mimalloc @ edit 15 (MB) | 72.0 (70.1-73.1) | 44.9 (43.0-45.4) | -37.6% (-27.1 MB) |
| mimalloc @ edit 20 (MB) | 72.0 (70.1-73.1) | 44.9 (43.0-45.4) | -37.6% (-27.1 MB) |

## lobehub

lobehub SPA. Issues: [#9330](https://github.com/rolldown/rolldown/issues/9330).

### lobehub:build

3 rounds, load 2.1 to 5.7.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 5138 (5122-5174) | 4792 (4694-4812) | -6.7% (-346 MB) |
| process wall time | 22.42s (22.03s-22.82s) | 22.41s (22.35s-22.58s) | -0.0% (noise) |
| process cpu time | 45.91s (45.47s-46.22s) | 45.90s (45.77s-46.30s) | -0.0% (noise) |

### lobehub:build-sourcemap

9 rounds, load 4.1 to 6.4.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 6060 (5846-6360) | 5585 (5234-5909) | -7.8% (-475 MB, noise) |
| process wall time | 24.30s (24.00s-24.64s) | 24.10s (23.87s-24.38s) | -0.8% (noise) |
| process cpu time | 49.11s (48.65s-49.56s) | 49.29s (48.81s-49.46s) | +0.4% (noise) |

### lobehub:dev

3 rounds, load 0.9 to 10.6.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 2869 (2854-2871) | 2540 (2460-3201) | -11.5% (-329 MB, noise) |
| process cpu time | 62.81s (62.69s-63.88s) | 62.97s (62.30s-63.31s) | +0.3% (noise) |
| ready | 1.46s (1.46s-1.50s) | 1.55s (1.51s-1.57s) | +6.1% |
| page load | 12.22s (12.13s-12.59s) | 12.11s (11.87s-12.18s) | -1.0% (noise) |
| page requests | 11323 (11261-11393) | 11295 (11268-11360) | -0.2% (noise) |
| failed requests | 6 (6-7) | 7 (7-7) | +16.7% (noise) |
| phys_footprint @ ready (MB) | 731 (726-821) | 830 (818-856) | +13.6% (+99.1 MB, noise) |
| phys_footprint @ page closed (MB) | 2705 (2664-2720) | 2150 (2128-2183) | -20.5% (-555 MB) |
| phys_footprint @ idle 90s (MB) | 2713 (2664-2720) | 2128 (2015-2150) | -21.6% (-585 MB) |
| phys_footprint @ idle 180s (MB) | 1990 (1959-2006) | 1262 (1225-1402) | -36.6% (-728 MB) |
| phys_footprint @ idle 270s (MB) | 1851 (1843-1875) | 1180 (1160-1311) | -36.2% (-671 MB) |
| mimalloc @ ready (MB) | 371 (370-446) | 453 (443-479) | +22.2% (+82.4 MB, noise) |
| mimalloc @ page closed (MB) | 876 (842-903) | 238 (232-245) | -72.9% (-639 MB) |
| mimalloc @ idle 90s (MB) | 876 (842-909) | 238 (232-245) | -72.9% (-639 MB) |
| mimalloc @ idle 180s (MB) | 876 (842-909) | 238 (232-245) | -72.9% (-639 MB) |
| mimalloc @ idle 270s (MB) | 876 (842-909) | 238 (232-245) | -72.9% (-639 MB) |

### lobehub:dev-warm

3 rounds, load 1.1 to 2.8.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1978 (1878-2003) | 1875 (1857-1923) | -5.2% (-103 MB, noise) |
| process cpu time | 49.64s (49.23s-49.66s) | 49.51s (49.39s-50.11s) | -0.3% (noise) |
| ready | 1.02s (1.02s-1.02s) | 1.02s (1.02s-1.02s) | -0.1% (noise) |
| page load | 8.87s (8.82s-8.95s) | 8.79s (8.77s-8.91s) | -0.8% (noise) |
| page requests | 11455 (11447-11480) | 11455 (11380-11534) | 0.0% (noise) |
| failed requests | 6 (6-7) | 6 (6-7) | 0.0% (noise) |
| phys_footprint @ ready (MB) | 257 (257-261) | 256 (256-257) | -0.5% (-1.3 MB, noise) |
| phys_footprint @ page closed (MB) | 1964 (1867-1993) | 1864 (1846-1911) | -5.1% (-99.8 MB, noise) |
| phys_footprint @ idle 90s (MB) | 1964 (1867-1994) | 1864 (1846-1911) | -5.1% (-99.8 MB, noise) |
| phys_footprint @ idle 180s (MB) | 1178 (1033-1194) | 1163 (1013-1179) | -1.3% (-15.5 MB, noise) |
| phys_footprint @ idle 270s (MB) | 1044 (967-1051) | 1033 (947-1044) | -1.1% (-11.4 MB, noise) |
| mimalloc @ ready (MB) | 18.5 (18.3-18.7) | 17.2 (17.0-17.5) | -7.0% (-1.3 MB) |
| mimalloc @ page closed (MB) | 117 (114-119) | 110 (105-112) | -6.1% (-7.2 MB) |
| mimalloc @ idle 90s (MB) | 117 (114-119) | 110 (105-112) | -6.1% (-7.2 MB) |
| mimalloc @ idle 180s (MB) | 117 (114-119) | 110 (105-112) | -6.1% (-7.2 MB) |
| mimalloc @ idle 270s (MB) | 117 (114-119) | 110 (105-112) | -6.1% (-7.2 MB) |

## rolldown-9330-repro

Small #9330 repro, vite dev with @lobehub/ui. Issues: [#9330](https://github.com/rolldown/rolldown/issues/9330).

### rolldown-9330-repro:dev

3 rounds, load 1.1 to 1.8.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 2076 (2071-2097) | 1942 (1930-1944) | -6.4% (-134 MB) |
| process cpu time | 4.64s (4.51s-4.72s) | 4.44s (4.36s-4.75s) | -4.3% (noise) |
| ready | 517ms (515ms-518ms) | 514ms (513ms-518ms) | -0.6% (noise) |
| page load | 1.35s (1.21s-1.50s) | 1.27s (1.14s-1.34s) | -5.7% (noise) |
| page requests | 7 (7-7) | 7 (7-7) | 0.0% (noise) |
| failed requests | 0 (0-0) | 0 (0-0) | - |
| phys_footprint @ ready (MB) | 760 (752-772) | 753 (741-756) | -0.9% (-6.7 MB, noise) |
| phys_footprint @ page closed (MB) | 2076 (2071-2097) | 840 (838-842) | -59.5% (-1236 MB) |
| phys_footprint @ idle 90s (MB) | 1527 (1513-1540) | 285 (283-287) | -81.3% (-1242 MB) |
| mimalloc @ ready (MB) | 670 (668-727) | 673 (666-680) | +0.5% (+3.6 MB, noise) |
| mimalloc @ page closed (MB) | 1258 (1245-1271) | 17.8 (17.8-19.3) | -98.6% (-1240 MB) |
| mimalloc @ idle 90s (MB) | 1258 (1245-1271) | 17.8 (17.8-19.3) | -98.6% (-1240 MB) |

## vinext

vinext, Next.js on Vite.

### vinext:build

3 rounds, load 2.9 to 3.5.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 636 (631-676) | 592 (579-607) | -6.9% (-44.1 MB) |
| process wall time | 1.23s (1.23s-1.26s) | 1.23s (1.23s-1.23s) | -0.2% (noise) |
| process cpu time | 2.54s (2.54s-2.58s) | 2.54s (2.54s-2.55s) | -0.2% (noise) |

### vinext:playground-build

3 rounds, load 4.7 to 5.4.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1362 (1358-1369) | 1268 (1235-1292) | -7.0% (-94.7 MB) |
| process wall time | 3.68s (3.66s-3.68s) | 3.67s (3.63s-3.67s) | -0.3% (noise) |
| process cpu time | 7.39s (7.33s-7.43s) | 7.34s (7.34s-7.35s) | -0.6% (noise) |

## vue-vben-admin

vue-vben-admin, the web-antd app.

### vue-vben-admin:build

3 rounds, load 2.5 to 3.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak phys_footprint (MB) | 1602 (1598-1632) | 1577 (1577-1584) | -1.5% (-24.8 MB) |
| process wall time | 2.72s (2.71s-2.76s) | 2.76s (2.74s-2.80s) | +1.3% (noise) |
| process cpu time | 6.92s (6.89s-6.97s) | 6.87s (6.84s-6.95s) | -0.7% (noise) |
