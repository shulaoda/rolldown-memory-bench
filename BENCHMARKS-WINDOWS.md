# Benchmarks

`just bench` writes this file after every run, and `just report <results.json> ...` writes it again from saved runs.

- Machine: win32 x64 (10.0.26200), 13th Gen Intel(R) Core(TM) i5-13600KF, 20 cores, 32 GB, Node v24.12.0
- Run 2026-11-26 08:52 UTC: `just bench quick --bin base=../voidzero/rolldown-wt-base --bin pr-11655=../voidzero/rolldown-wt-bench --out BENCHMARKS-WINDOWS.md`
- Memory: `private working set`, peak: the highest `PeakWorkingSet` of the process. Numbers compare only on the same machine.

| Bin | rolldown | From | Commit |
| --- | --- | --- | --- |
| base | 1.3.3 | repo `../voidzero/rolldown-wt-base` | e641a934ec |
| pr-11655 | 1.3.3 | repo `../voidzero/rolldown-wt-bench` | ce99614c34 |

Every number is the median over the rounds, with the range in parentheses. A change is from `base`. A change marked noise is not a clear difference: its ranges overlap, or a side has fewer than 3 rounds.

## Summary

| Case | Peak | CPU time | Time | Memory at the last mark |
| --- | ---: | ---: | ---: | ---: |
| held-outputs:sourcemap | -13.5% (-250 MB) | +0.3% (noise) | all builds: -0.3% (noise) | idle 2s: -97.7% (-1724 MB) |
| issue-10985-tight-loop:close | -45.7% (-387 MB) | -11.3% (noise) | all builds: -2.1% | idle 5s: -96.1% (-754 MB) |
| issue-11143-api-idle:6-builds | -11.2% (-185 MB) | -4.7% (noise) | all builds: -1.8% | idle 12s: -95.4% (-1375 MB) |
| issue-11233-optimizer-threads:default-threads | -8.7% (-33.3 MB) | +9.8% (noise) | build: 0.0% (noise) | idle 10s: -92.8% (-302 MB) |
| many-chunks:sourcemap | -8.7% (-52.1 MB) | +3.6% (noise) | build: +3.4% | idle 2s: -85.8% (-473 MB) |
| rebuild-gaps:gap-0 | -43.7% (-799 MB) | -3.7% (noise) | later builds (median): -3.2% | before build 10: -44.4% (-748 MB) |
| rebuild-gaps:gap-300ms | -44.4% (-788 MB) | +1.4% (noise) | later builds (median): -2.4% | before build 10: -46.4% (-757 MB) |
| rebuild-gaps:gap-1s | -49.9% (-682 MB) | +3.9% (noise) | later builds (median): +3.1% | before build 10: -81.7% (-969 MB) |
| rebuild-gaps:gap-3s | -53.0% (-777 MB) | +11.8% | later builds (median): +3.2% | before build 10: -83.0% (-1065 MB) |
| three10x:sourcemap | -4.0% (-23.9 MB) | -6.8% (noise) | build: -2.5% (noise) | idle 2s: -93.4% (-483 MB) |
| issue-11189:bundled | -62.0% (-317 MB) | +3.7% | ready: +1.0% (noise) | edit 20: -77.4% (-355 MB) |
| lobehub:build | -6.0% (-294 MB, noise) | +1.6% (noise) | process wall time: +0.1% (noise) | - |
| lobehub:build-sourcemap | -11.0% (-682 MB) | -0.1% (noise) | process wall time: -0.8% (noise) | - |
| lobehub:dev | -14.7% (-450 MB) | -1.2% (noise) | ready: -0.6% (noise) | idle 270s: -39.9% (-734 MB) |
| rolldown-9330-repro:dev | -17.3% (-340 MB) | -0.7% (noise) | ready: -3.4% (noise) | idle 90s: -89.4% (-1138 MB) |
| vinext:build | -5.9% (-38.1 MB, noise) | +1.2% (noise) | process wall time: +1.8% (noise) | - |
| vue-vben-admin:build | -4.0% (-60.2 MB) | +3.7% (noise) | process wall time: +0.3% (noise) | - |

## held-outputs

three.js x10, 10 back-to-back builds that keep their outputs (dashboard shape).

### held-outputs:sourcemap

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 1856 (1826-1861) | 1606 (1598-1619) | -13.5% (-250 MB) |
| peak commit (MB) | 2587 (2533-2588) | 1707 (1700-1719) | -34.0% (-880 MB) |
| process cpu time | 16.47s (16.38s-16.61s) | 16.52s (15.59s-17.23s) | +0.3% (noise) |
| all builds | 4.06s (4.03s-4.07s) | 4.05s (4.04s-4.06s) | -0.3% (noise) |
| private working set @ 10 outputs held (MB) | 1764 (1749-1775) | 1480 (1461-1505) | -16.1% (-285 MB) |
| private working set @ after gc (MB) | 1765 (1749-1775) | 1480 (1462-1505) | -16.1% (-285 MB) |
| private working set @ idle 2s (MB) | 1765 (1749-1775) | 40.6 (39.1-41.8) | -97.7% (-1724 MB) |
| commit @ 10 outputs held (MB) | 2443 (2402-2457) | 1536 (1518-1561) | -37.1% (-907 MB) |
| commit @ after gc (MB) | 2443 (2403-2458) | 1536 (1518-1561) | -37.1% (-907 MB) |
| commit @ idle 2s (MB) | 2443 (2403-2458) | 55.9 (54.3-56.7) | -97.7% (-2388 MB) |

## issue-10985-tight-loop

Memory across 150 builds in a tight loop, then idle. Issues: [#10985](https://github.com/rolldown/rolldown/issues/10985), [#10984](https://github.com/rolldown/rolldown/issues/10984).

### issue-10985-tight-loop:close

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 846 (811-846) | 459 (442-475) | -45.7% (-387 MB) |
| peak commit (MB) | 1217 (1184-1223) | 448 (426-458) | -63.2% (-769 MB) |
| process cpu time | 25.89s (21.47s-29.59s) | 22.97s (18.08s-25.45s) | -11.3% (noise) |
| all builds | 5.04s (5.03s-5.09s) | 4.94s (4.88s-4.97s) | -2.1% |
| rss @ build 25 (MB) | 605 (605-606) | 395 (372-422) | -34.7% (-210 MB) |
| rss @ build 50 (MB) | 720 (697-762) | 435 (386-465) | -39.7% (-286 MB) |
| rss @ build 75 (MB) | 762 (761-801) | 450 (433-471) | -41.0% (-313 MB) |
| rss @ build 100 (MB) | 828 (792-835) | 457 (441-474) | -44.8% (-371 MB) |
| rss @ build 125 (MB) | 788 (756-800) | 378 (376-395) | -52.0% (-410 MB) |
| rss @ build 150 (MB) | 828 (736-835) | 410 (398-425) | -50.4% (-417 MB) |
| private working set @ idle 5s (MB) | 784 (693-791) | 30.3 (29.9-30.4) | -96.1% (-754 MB) |
| commit @ idle 5s (MB) | 1173 (1064-1185) | 42.9 (42.5-43.5) | -96.3% (-1130 MB) |

## issue-11143-api-idle

API builds with in-memory files and maps, then outputs dropped and idle. Issues: [#11143](https://github.com/rolldown/rolldown/issues/11143).

### issue-11143-api-idle:6-builds

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 1647 (1627-1671) | 1462 (1430-1482) | -11.2% (-185 MB) |
| peak commit (MB) | 2370 (2357-2393) | 1611 (1570-1652) | -32.0% (-759 MB) |
| process cpu time | 8.98s (8.86s-9.73s) | 8.56s (8.53s-8.90s) | -4.7% (noise) |
| all builds | 3.08s (3.06s-3.08s) | 3.02s (3.01s-3.02s) | -1.8% |
| private working set @ before builds (MB) | 61.1 (60.9-61.8) | 61.4 (61.0-61.7) | +0.5% (+0.3 MB, noise) |
| private working set @ outputs held (MB) | 1559 (1522-1591) | 1345 (1299-1375) | -13.7% (-214 MB) |
| private working set @ idle 1.5s (MB) | 1560 (1521-1590) | 157 (155-159) | -89.9% (-1402 MB) |
| private working set @ idle 4s (MB) | 1560 (1522-1590) | 157 (155-159) | -89.9% (-1403 MB) |
| private working set @ idle 12s (MB) | 1441 (1404-1461) | 66.0 (65.1-66.1) | -95.4% (-1375 MB) |
| commit @ before builds (MB) | 120 (119-120) | 118 (118-118) | -1.9% (-2.3 MB) |
| commit @ outputs held (MB) | 2225 (2179-2261) | 1460 (1394-1481) | -34.4% (-766 MB) |
| commit @ idle 1.5s (MB) | 2227 (2179-2259) | 216 (216-218) | -90.3% (-2010 MB) |
| commit @ idle 4s (MB) | 2227 (2179-2259) | 216 (216-218) | -90.3% (-2010 MB) |
| commit @ idle 12s (MB) | 2085 (2039-2117) | 79.0 (79.0-79.6) | -96.2% (-2006 MB) |

## issue-11233-optimizer-threads

One optimizer-like pass over typescript, codemirror and vue, then idle. Issues: [#11233](https://github.com/rolldown/rolldown/issues/11233).

### issue-11233-optimizer-threads:default-threads

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 384 (375-387) | 350 (338-352) | -8.7% (-33.3 MB) |
| peak commit (MB) | 1137 (1119-1159) | 406 (394-415) | -64.3% (-730 MB) |
| process cpu time | 796ms (781ms-811ms) | 874ms (780ms-937ms) | +9.8% (noise) |
| build | 493ms (487ms-501ms) | 493ms (492ms-499ms) | 0.0% (noise) |
| private working set @ output held (MB) | 327 (317-330) | 294 (281-294) | -10.0% (-32.8 MB) |
| private working set @ idle 2s (MB) | 327 (317-331) | 25.4 (25.4-25.5) | -92.2% (-302 MB) |
| private working set @ idle 10s (MB) | 325 (315-329) | 23.5 (23.4-23.8) | -92.8% (-302 MB) |
| commit @ output held (MB) | 1073 (1055-1095) | 341 (330-351) | -68.2% (-732 MB) |
| commit @ idle 2s (MB) | 1074 (1056-1096) | 39.7 (39.7-40.4) | -96.3% (-1034 MB) |
| commit @ idle 10s (MB) | 1071 (1053-1093) | 36.4 (36.2-36.8) | -96.6% (-1034 MB) |

## many-chunks

three.js x10 with one dynamic import per file (about 3,700 chunks), one build.

### many-chunks:sourcemap

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 597 (594-600) | 545 (544-548) | -8.7% (-52.1 MB) |
| peak commit (MB) | 1482 (1461-1494) | 588 (588-593) | -60.3% (-894 MB) |
| process cpu time | 2.15s (2.05s-2.94s) | 2.23s (1.87s-2.50s) | +3.6% (noise) |
| build | 330ms (330ms-337ms) | 341ms (339ms-348ms) | +3.4% |
| chunks | 3692 (3692-3692) | 3692 (3692-3692) | 0.0% (noise) |
| private working set @ output held (MB) | 549 (545-551) | 492 (491-496) | -10.4% (-56.9 MB) |
| private working set @ after gc (MB) | 552 (548-554) | 500 (499-503) | -9.4% (-51.8 MB) |
| private working set @ idle 2s (MB) | 552 (548-555) | 78.3 (78.2-78.5) | -85.8% (-473 MB) |
| commit @ output held (MB) | 1440 (1418-1451) | 576 (575-581) | -60.0% (-864 MB) |
| commit @ after gc (MB) | 1482 (1461-1493) | 588 (587-593) | -60.3% (-894 MB) |
| commit @ idle 2s (MB) | 1482 (1461-1493) | 105 (105-105) | -92.9% (-1377 MB) |

## rebuild-gaps

three.js x10 with sourcemap, 10 builds with a pause between them.

### rebuild-gaps:gap-0

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 1828 (1776-1882) | 1030 (1015-1057) | -43.7% (-799 MB) |
| peak commit (MB) | 2536 (2485-2552) | 1140 (1132-1148) | -55.0% (-1396 MB) |
| process cpu time | 16.66s (15.62s-17.05s) | 16.05s (14.69s-17.30s) | -3.7% (noise) |
| later builds (median) | 407ms (401ms-411ms) | 394ms (393ms-395ms) | -3.2% |
| first build | 428ms (426ms-429ms) | 430ms (428ms-443ms) | +0.4% (noise) |
| later builds (max) | 418ms (408ms-421ms) | 421ms (408ms-426ms) | +0.8% (noise) |
| rss @ before build 2 (MB) | 570 (480-578) | 526 (478-528) | -7.8% (-44.6 MB, noise) |
| rss @ before build 5 (MB) | 1056 (1051-1113) | 886 (827-903) | -16.1% (-170 MB) |
| rss @ before build 10 (MB) | 1685 (1620-1713) | 938 (895-956) | -44.4% (-748 MB) |

### rebuild-gaps:gap-300ms

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 1776 (1746-1803) | 988 (987-1000) | -44.4% (-788 MB) |
| peak commit (MB) | 2521 (2506-2541) | 1102 (1094-1119) | -56.3% (-1419 MB) |
| process cpu time | 16.37s (15.66s-16.41s) | 16.61s (16.03s-17.20s) | +1.4% (noise) |
| later builds (median) | 405ms (404ms-407ms) | 396ms (391ms-399ms) | -2.4% |
| first build | 428ms (415ms-429ms) | 433ms (420ms-436ms) | +1.2% (noise) |
| later builds (max) | 422ms (413ms-423ms) | 440ms (427ms-447ms) | +4.1% |
| rss @ before build 2 (MB) | 560 (531-576) | 500 (474-530) | -10.8% (-60.2 MB) |
| rss @ before build 5 (MB) | 1121 (1103-1136) | 890 (871-895) | -20.6% (-231 MB) |
| rss @ before build 10 (MB) | 1631 (1607-1647) | 874 (860-878) | -46.4% (-757 MB) |

### rebuild-gaps:gap-1s

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 1368 (1367-1400) | 685 (683-688) | -49.9% (-682 MB) |
| peak commit (MB) | 2241 (2195-2263) | 837 (835-842) | -62.7% (-1404 MB) |
| process cpu time | 16.86s (16.12s-18.09s) | 17.52s (16.87s-17.84s) | +3.9% (noise) |
| later builds (median) | 408ms (406ms-411ms) | 420ms (417ms-422ms) | +3.1% |
| first build | 416ms (410ms-419ms) | 421ms (414ms-427ms) | +1.1% (noise) |
| later builds (max) | 437ms (417ms-441ms) | 428ms (427ms-433ms) | -1.9% (noise) |
| rss @ before build 2 (MB) | 551 (518-554) | 207 (207-209) | -62.4% (-344 MB) |
| rss @ before build 5 (MB) | 979 (925-985) | 216 (216-219) | -77.9% (-763 MB) |
| rss @ before build 10 (MB) | 1186 (1176-1201) | 217 (217-218) | -81.7% (-969 MB) |

### rebuild-gaps:gap-3s

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 1467 (1463-1495) | 689 (687-690) | -53.0% (-777 MB) |
| peak commit (MB) | 2197 (2183-2226) | 839 (835-841) | -61.8% (-1358 MB) |
| process cpu time | 15.72s (15.42s-16.89s) | 17.58s (17.01s-18.03s) | +11.8% |
| later builds (median) | 405ms (400ms-410ms) | 418ms (417ms-418ms) | +3.2% |
| first build | 421ms (418ms-432ms) | 426ms (425ms-436ms) | +1.3% (noise) |
| later builds (max) | 430ms (426ms-432ms) | 427ms (426ms-430ms) | -0.7% (noise) |
| rss @ before build 2 (MB) | 567 (557-569) | 206 (205-209) | -63.7% (-361 MB) |
| rss @ before build 5 (MB) | 951 (938-966) | 218 (217-218) | -77.1% (-733 MB) |
| rss @ before build 10 (MB) | 1283 (1270-1303) | 218 (218-219) | -83.0% (-1065 MB) |

## three10x

three.js x10, one build: peak, output held, after GC, idle.

### three10x:sourcemap

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 593 (590-602) | 569 (567-570) | -4.0% (-23.9 MB) |
| peak commit (MB) | 1452 (1425-1489) | 726 (725-727) | -50.0% (-725 MB) |
| process cpu time | 1.83s (1.56s-2.25s) | 1.70s (1.41s-2.00s) | -6.8% (noise) |
| build | 427ms (426ms-431ms) | 417ms (416ms-436ms) | -2.5% (noise) |
| private working set @ output held (MB) | 517 (508-525) | 486 (484-502) | -6.0% (-31.1 MB) |
| private working set @ after gc (MB) | 517 (508-525) | 486 (484-502) | -6.1% (-31.6 MB) |
| private working set @ idle 2s (MB) | 517 (508-525) | 34.2 (33.2-35.0) | -93.4% (-483 MB) |
| commit @ output held (MB) | 1317 (1289-1373) | 588 (587-607) | -55.3% (-728 MB) |
| commit @ after gc (MB) | 1318 (1289-1373) | 589 (587-607) | -55.3% (-729 MB) |
| commit @ idle 2s (MB) | 1318 (1289-1373) | 48.8 (47.7-49.3) | -96.3% (-1269 MB) |

## issue-11189

Bundled dev rebuilds (synthetic React app, 1,500 modules). Issues: [#11189](https://github.com/rolldown/rolldown/issues/11189).

### issue-11189:bundled

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 512 (491-520) | 194 (193-208) | -62.0% (-317 MB) |
| peak commit (MB) | 1295 (1266-1303) | 271 (271-279) | -79.0% (-1023 MB) |
| process cpu time | 2.55s (2.48s-2.56s) | 2.64s (2.59s-2.80s) | +3.7% |
| ready | 515ms (513ms-527ms) | 520ms (512ms-522ms) | +1.0% (noise) |
| crawled urls | 2 (2-2) | 2 (2-2) | 0.0% (noise) |
| private working set @ after load (MB) | 138 (134-139) | 103 (103-104) | -25.4% (-35.2 MB) |
| private working set @ edit 5 (MB) | 232 (224-240) | 101 (100-103) | -56.4% (-131 MB) |
| private working set @ edit 10 (MB) | 302 (292-318) | 102 (102-104) | -66.1% (-199 MB) |
| private working set @ edit 15 (MB) | 382 (381-396) | 105 (102-108) | -72.6% (-278 MB) |
| private working set @ edit 20 (MB) | 459 (438-468) | 104 (103-108) | -77.4% (-355 MB) |
| commit @ after load (MB) | 534 (513-538) | 206 (205-208) | -61.4% (-328 MB) |
| commit @ edit 5 (MB) | 849 (811-852) | 188 (187-188) | -77.9% (-661 MB) |
| commit @ edit 10 (MB) | 1023 (1017-1030) | 189 (188-189) | -81.5% (-834 MB) |
| commit @ edit 15 (MB) | 1178 (1178-1190) | 190 (188-193) | -83.9% (-988 MB) |
| commit @ edit 20 (MB) | 1295 (1264-1303) | 190 (190-193) | -85.3% (-1104 MB) |

## lobehub

lobehub SPA. Issues: [#9330](https://github.com/rolldown/rolldown/issues/9330).

### lobehub:build

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 4930 (4798-4953) | 4636 (4630-4815) | -6.0% (-294 MB, noise) |
| peak commit (MB) | 6841 (6621-6878) | 5175 (5170-5349) | -24.3% (-1665 MB) |
| process wall time | 37.87s (37.46s-38.04s) | 37.90s (37.69s-38.06s) | +0.1% (noise) |
| process cpu time | 77.34s (76.98s-79.66s) | 78.56s (77.72s-78.80s) | +1.6% (noise) |

### lobehub:build-sourcemap

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 6187 (6028-6425) | 5505 (5172-5510) | -11.0% (-682 MB) |
| peak commit (MB) | 7900 (7800-8251) | 5911 (5596-5913) | -25.2% (-1989 MB) |
| process wall time | 41.85s (41.49s-42.77s) | 41.50s (41.37s-41.57s) | -0.8% (noise) |
| process cpu time | 84.50s (84.00s-86.77s) | 84.45s (83.61s-85.61s) | -0.1% (noise) |

### lobehub:dev

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 3060 (3001-3192) | 2610 (2601-2620) | -14.7% (-450 MB) |
| peak commit (MB) | 4769 (4747-4861) | 2931 (2890-2937) | -38.5% (-1838 MB) |
| process cpu time | 92.31s (89.72s-93.80s) | 91.20s (89.51s-93.06s) | -1.2% (noise) |
| ready | 4.04s (4.01s-6.73s) | 4.02s (4.01s-4.03s) | -0.6% (noise) |
| page load | 21.50s (21.35s-21.56s) | 21.79s (21.38s-21.82s) | +1.4% (noise) |
| page requests | 9745 (9733-9750) | 9751 (9690-9771) | +0.1% (noise) |
| failed requests | 6 (6-6) | 6 (6-6) | 0.0% (noise) |
| private working set @ ready (MB) | 480 (476-560) | 453 (452-456) | -5.6% (-26.8 MB) |
| private working set @ page closed (MB) | 2647 (2620-2784) | 1895 (1872-1943) | -28.4% (-753 MB) |
| private working set @ idle 90s (MB) | 1837 (1704-1872) | 1103 (1050-1115) | -40.0% (-734 MB) |
| private working set @ idle 180s (MB) | 1837 (1704-1872) | 1103 (1050-1115) | -40.0% (-734 MB) |
| private working set @ idle 270s (MB) | 1838 (1704-1873) | 1104 (1050-1115) | -39.9% (-734 MB) |
| commit @ ready (MB) | 690 (681-771) | 526 (525-527) | -23.8% (-164 MB) |
| commit @ page closed (MB) | 3928 (3831-4058) | 2004 (1981-2048) | -49.0% (-1923 MB) |
| commit @ idle 90s (MB) | 3100 (2895-3127) | 1190 (1136-1206) | -61.6% (-1909 MB) |
| commit @ idle 180s (MB) | 3100 (2895-3127) | 1190 (1136-1206) | -61.6% (-1909 MB) |
| commit @ idle 270s (MB) | 3100 (2896-3127) | 1190 (1136-1206) | -61.6% (-1909 MB) |

## rolldown-9330-repro

Small #9330 repro, vite dev with @lobehub/ui. Issues: [#9330](https://github.com/rolldown/rolldown/issues/9330).

### rolldown-9330-repro:dev

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 1971 (1960-1977) | 1630 (1622-1669) | -17.3% (-340 MB) |
| peak commit (MB) | 3653 (3646-3654) | 1828 (1826-1876) | -50.0% (-1825 MB) |
| process cpu time | 9.66s (9.34s-9.70s) | 9.59s (9.28s-10.11s) | -0.7% (noise) |
| ready | 597ms (581ms-630ms) | 577ms (539ms-604ms) | -3.4% (noise) |
| page load | 2.63s (2.57s-2.88s) | 2.60s (2.59s-2.62s) | -1.2% (noise) |
| page requests | 7 (7-7) | 7 (7-7) | 0.0% (noise) |
| failed requests | 0 (0-0) | 0 (0-0) | - |
| private working set @ ready (MB) | 795 (787-801) | 793 (701-798) | -0.3% (-2.3 MB, noise) |
| private working set @ page closed (MB) | 1273 (1263-1281) | 135 (134-136) | -89.4% (-1138 MB) |
| private working set @ idle 90s (MB) | 1273 (1264-1281) | 135 (135-136) | -89.4% (-1138 MB) |
| commit @ ready (MB) | 1754 (1736-1777) | 1105 (976-1108) | -37.0% (-649 MB) |
| commit @ page closed (MB) | 2942 (2935-2942) | 201 (201-201) | -93.2% (-2741 MB) |
| commit @ idle 90s (MB) | 2942 (2935-2942) | 201 (201-201) | -93.2% (-2741 MB) |

## vinext

vinext, Next.js on Vite.

### vinext:build

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 648 (639-654) | 610 (606-646) | -5.9% (-38.1 MB, noise) |
| peak commit (MB) | 1687 (1677-1702) | 702 (696-737) | -58.4% (-984 MB) |
| process wall time | 2.01s (2.00s-2.02s) | 2.05s (1.97s-2.06s) | +1.8% (noise) |
| process cpu time | 3.97s (3.70s-4.03s) | 4.01s (3.94s-4.56s) | +1.2% (noise) |

## vue-vben-admin

vue-vben-admin, the web-antd app.

### vue-vben-admin:build

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 1494 (1459-1535) | 1434 (1427-1444) | -4.0% (-60.2 MB) |
| peak commit (MB) | 2854 (2836-2860) | 1617 (1606-1626) | -43.3% (-1237 MB) |
| process wall time | 5.41s (5.40s-5.45s) | 5.43s (5.37s-5.43s) | +0.3% (noise) |
| process cpu time | 10.59s (10.38s-11.52s) | 10.98s (10.36s-11.11s) | +3.7% (noise) |
