# Benchmarks

`just bench` writes this file after every run, and `just report <results.json> ...` writes it again from saved runs.

- Machine: win32 x64 (10.0.26200), 13th Gen Intel(R) Core(TM) i5-13600KF, 20 cores, 32 GB, Node v24.12.0
- Run 2026-11-24 03:25 UTC: `just bench all --bin base=commit:ab231fbad5 --bin pr-11655=../voidzero/rolldown-wt-bench --out BENCHMARKS-WINDOWS.md`
- Memory: `private working set`, peak: the highest `PeakWorkingSet` of the process. Numbers compare only on the same machine.

| Bin | rolldown | From | Commit |
| --- | --- | --- | --- |
| base | 1.3.3 | pkg.pr.new `commit:ab231fbad5` | ab231fb |
| pr-11655 | 1.3.3 | repo `../voidzero/rolldown-wt-bench` | 12b8d0663a |

Every number is the median over the rounds, with the range in parentheses. A change is from `base`. A change marked noise is not a clear difference: its ranges overlap, or a side has fewer than 3 rounds.

## Summary

| Case | Peak | CPU time | Time | Memory at the last mark |
| --- | ---: | ---: | ---: | ---: |
| held-outputs:sourcemap | -12.5% (-232 MB) | -1.0% (noise) | all builds: -0.5% (noise) | idle 2s: -98.1% (-1749 MB) |
| held-outputs:plain | -12.9% (-145 MB) | +0.8% (noise) | all builds: -0.1% (noise) | idle 2s: -96.8% (-1007 MB) |
| issue-10985-tight-loop:close | -42.6% (-331 MB) | +3.1% (noise) | all builds: -1.7% | idle 5s: -95.8% (-678 MB) |
| issue-10985-tight-loop:generate | -42.0% (-339 MB) | +6.7% (noise) | all builds: -1.7% | idle 5s: -95.8% (-663 MB) |
| issue-11143-api-idle:6-builds | -16.8% (-292 MB) | +5.0% (noise) | all builds: +0.2% (noise) | idle 12s: -95.7% (-1465 MB) |
| issue-11143-api-idle:1-build | -2.1% (-15.9 MB) | +20.3% (noise) | all builds: +1.3% (noise) | idle 12s: -89.4% (-539 MB) |
| issue-11233-optimizer-threads:default-threads | -11.7% (-45.0 MB) | +10.0% (noise) | build: -0.4% (noise) | idle 10s: -92.2% (-295 MB) |
| issue-11233-optimizer-threads:4-threads | -7.3% (-25.9 MB) | -6.6% (noise) | build: -0.8% (noise) | idle 10s: -93.0% (-276 MB) |
| many-chunks:plain | -5.2% (-25.1 MB) | +2.4% (noise) | build: +2.3% (noise) | idle 2s: -86.5% (-376 MB) |
| many-chunks:sourcemap | -9.4% (-57.6 MB) | +11.7% (noise) | build: +1.9% (noise) | idle 2s: -86.7% (-491 MB) |
| rebuild-gaps:gap-0 | -43.8% (-817 MB) | +1.2% (noise) | later builds (median): -1.8% (noise) | before build 10: -44.2% (-773 MB) |
| rebuild-gaps:gap-300ms | -44.2% (-788 MB) | +1.1% (noise) | later builds (median): -2.4% (noise) | before build 10: -45.4% (-743 MB) |
| rebuild-gaps:gap-1s | -50.9% (-719 MB) | +2.6% (noise) | later builds (median): +3.8% | before build 10: -82.2% (-972 MB) |
| rebuild-gaps:gap-3s | -53.0% (-784 MB) | +0.9% (noise) | later builds (median): +2.5% (noise) | before build 10: -83.5% (-1067 MB) |
| three10x:plain | -1.8% (-8.1 MB) | +9.1% (noise) | build: +2.8% (noise) | idle 2s: -92.4% (-347 MB) |
| three10x:sourcemap | -4.2% (-25.5 MB) | +12.7% (noise) | build: +2.1% (noise) | idle 2s: -94.5% (-507 MB) |
| three10x:sourcemap-minify | -5.0% (-32.3 MB) | +9.2% (noise) | build: +2.0% (noise) | idle 2s: -94.7% (-531 MB) |
| issue-11189:bundled | -64.0% (-339 MB) | +12.6% | ready: +1.0% (noise) | edit 20: -77.7% (-357 MB) |
| issue-11189:unbundled | -9.0% (-25.3 MB, noise) | -0.8% (noise) | ready: +0.4% | edit 20: -11.1% (-22.6 MB, noise) |
| issue-11189:bundled-gc | -55.8% (-258 MB) | +22.6% | ready: -0.8% (noise) | edit 20: -71.0% (-285 MB) |
| issue-11189:bundled-tailwind-leaf | -2.1% (-4.0 MB) | +1.6% (noise) | ready: -0.6% (noise) | edit 20: -24.0% (-28.8 MB) |
| lobehub:build | -5.8% (-293 MB) | +0.6% (noise) | process wall time: -0.0% (noise) | - |
| lobehub:build-sourcemap | -7.9% (-490 MB) | +0.7% (noise) | process wall time: -0.7% (noise) | - |
| lobehub:dev | -13.1% (-402 MB, noise) | -0.2% (noise) | ready: -1.0% (noise) | idle 270s: -38.7% (-703 MB) |
| lobehub:dev-warm | +0.3% (+6.0 MB, noise) | -5.5% | ready: +0.3% (noise) | idle 270s: +1.9% (+18.2 MB, noise) |
| rolldown-9330-repro:dev | -36.5% (-732 MB) | -3.0% (noise) | ready: -0.7% (noise) | idle 90s: -71.3% (-934 MB) |
| vinext:build | -6.6% (-43.3 MB) | -4.0% (noise) | process wall time: -1.1% (noise) | - |
| vinext:playground-build | -8.3% (-129 MB) | +3.5% (noise) | process wall time: +0.4% (noise) | - |
| vue-vben-admin:build | -4.0% (-57.9 MB) | +7.5% | process wall time: -0.5% (noise) | - |

## held-outputs

three.js x10, 10 back-to-back builds that keep their outputs (dashboard shape).

### held-outputs:sourcemap

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 1860 (1834-1945) | 1628 (1584-1656) | -12.5% (-232 MB) |
| peak commit (MB) | 2577 (2527-2613) | 1732 (1689-1756) | -32.8% (-846 MB) |
| process cpu time | 16.27s (14.42s-17.83s) | 16.11s (15.80s-16.70s) | -1.0% (noise) |
| all builds | 4.09s (4.04s-4.19s) | 4.07s (4.03s-4.10s) | -0.5% (noise) |
| private working set @ 10 outputs held (MB) | 1783 (1667-1841) | 1509 (1473-1564) | -15.4% (-275 MB) |
| private working set @ after gc (MB) | 1784 (1667-1842) | 1509 (1473-1564) | -15.4% (-275 MB) |
| private working set @ idle 2s (MB) | 1784 (1667-1842) | 34.6 (33.5-34.9) | -98.1% (-1749 MB) |
| commit @ 10 outputs held (MB) | 2413 (2323-2482) | 1566 (1529-1626) | -35.1% (-847 MB) |
| commit @ after gc (MB) | 2413 (2324-2483) | 1566 (1529-1626) | -35.1% (-847 MB) |
| commit @ idle 2s (MB) | 2413 (2324-2483) | 48.5 (47.3-48.8) | -98.0% (-2365 MB) |

### held-outputs:plain

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 1124 (1084-1167) | 979 (945-984) | -12.9% (-145 MB) |
| peak commit (MB) | 1693 (1665-1739) | 1055 (1013-1076) | -37.7% (-638 MB) |
| process cpu time | 14.37s (13.52s-15.16s) | 14.48s (13.55s-15.83s) | +0.8% (noise) |
| all builds | 3.22s (3.22s-3.24s) | 3.22s (3.21s-3.25s) | -0.1% (noise) |
| private working set @ 10 outputs held (MB) | 1040 (1001-1083) | 895 (861-900) | -13.9% (-145 MB) |
| private working set @ after gc (MB) | 1040 (1001-1084) | 895 (861-900) | -14.0% (-145 MB) |
| private working set @ idle 2s (MB) | 1040 (1001-1084) | 33.1 (32.6-33.7) | -96.8% (-1007 MB) |
| commit @ 10 outputs held (MB) | 1597 (1569-1639) | 959 (917-973) | -40.0% (-638 MB) |
| commit @ after gc (MB) | 1597 (1570-1639) | 959 (917-973) | -40.0% (-639 MB) |
| commit @ idle 2s (MB) | 1597 (1570-1639) | 46.0 (45.4-46.5) | -97.1% (-1551 MB) |

## issue-10985-tight-loop

Memory across 150 builds in a tight loop, then idle. Issues: [#10985](https://github.com/rolldown/rolldown/issues/10985), [#10984](https://github.com/rolldown/rolldown/issues/10984).

### issue-10985-tight-loop:close

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 778 (765-866) | 446 (441-474) | -42.6% (-331 MB) |
| peak commit (MB) | 1181 (1161-1247) | 429 (425-474) | -63.7% (-753 MB) |
| process cpu time | 21.59s (19.27s-24.70s) | 22.27s (16.78s-23.50s) | +3.1% (noise) |
| all builds | 5.01s (4.97s-5.05s) | 4.93s (4.90s-4.94s) | -1.7% |
| rss @ build 25 (MB) | 593 (576-610) | 408 (386-430) | -31.1% (-184 MB) |
| rss @ build 50 (MB) | 682 (661-738) | 434 (402-459) | -36.4% (-248 MB) |
| rss @ build 75 (MB) | 728 (716-807) | 441 (409-468) | -39.5% (-288 MB) |
| rss @ build 100 (MB) | 756 (743-852) | 444 (434-471) | -41.2% (-312 MB) |
| rss @ build 125 (MB) | 730 (683-794) | 386 (378-398) | -47.1% (-344 MB) |
| rss @ build 150 (MB) | 750 (713-839) | 409 (404-414) | -45.4% (-341 MB) |
| private working set @ idle 5s (MB) | 708 (671-797) | 29.5 (29.2-29.8) | -95.8% (-678 MB) |
| commit @ idle 5s (MB) | 1124 (1079-1197) | 42.4 (41.8-42.7) | -96.2% (-1082 MB) |

### issue-10985-tight-loop:generate

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 809 (800-833) | 470 (446-476) | -42.0% (-339 MB) |
| peak commit (MB) | 1234 (1207-1241) | 468 (432-472) | -62.1% (-766 MB) |
| process cpu time | 20.89s (19.47s-23.30s) | 22.30s (16.80s-30.08s) | +6.7% (noise) |
| all builds | 5.04s (5.03s-5.07s) | 4.95s (4.92s-4.97s) | -1.7% |
| rss @ build 25 (MB) | 587 (579-618) | 395 (389-417) | -32.7% (-192 MB) |
| rss @ build 50 (MB) | 702 (662-742) | 437 (412-445) | -37.7% (-265 MB) |
| rss @ build 75 (MB) | 753 (745-774) | 450 (440-468) | -40.2% (-303 MB) |
| rss @ build 100 (MB) | 791 (775-809) | 457 (444-472) | -42.2% (-334 MB) |
| rss @ build 125 (MB) | 766 (751-781) | 397 (316-413) | -48.2% (-370 MB) |
| rss @ build 150 (MB) | 734 (712-818) | 413 (402-445) | -43.8% (-321 MB) |
| private working set @ idle 5s (MB) | 692 (670-776) | 29.0 (28.7-29.8) | -95.8% (-663 MB) |
| commit @ idle 5s (MB) | 1068 (1039-1207) | 41.9 (41.4-42.4) | -96.1% (-1026 MB) |

## issue-11143-api-idle

API builds with in-memory files and maps, then outputs dropped and idle. Issues: [#11143](https://github.com/rolldown/rolldown/issues/11143).

### issue-11143-api-idle:6-builds

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 1736 (1651-1750) | 1444 (1407-1507) | -16.8% (-292 MB) |
| peak commit (MB) | 2474 (2433-2483) | 1595 (1568-1660) | -35.5% (-879 MB) |
| process cpu time | 9.06s (8.75s-9.73s) | 9.52s (8.61s-10.47s) | +5.0% (noise) |
| all builds | 3.03s (3.01s-3.05s) | 3.04s (3.03s-3.07s) | +0.2% (noise) |
| private working set @ before builds (MB) | 61.8 (61.7-62.4) | 61.3 (60.8-61.6) | -0.8% (-0.5 MB) |
| private working set @ outputs held (MB) | 1651 (1567-1665) | 1347 (1304-1378) | -18.4% (-304 MB) |
| private working set @ idle 1.5s (MB) | 1651 (1566-1663) | 157 (157-159) | -90.5% (-1493 MB) |
| private working set @ idle 4s (MB) | 1651 (1566-1663) | 157 (157-159) | -90.5% (-1493 MB) |
| private working set @ idle 12s (MB) | 1532 (1447-1545) | 66.6 (66.5-67.5) | -95.7% (-1465 MB) |
| commit @ before builds (MB) | 120 (120-121) | 117 (116-119) | -2.7% (-3.3 MB) |
| commit @ outputs held (MB) | 2337 (2305-2354) | 1450 (1410-1485) | -38.0% (-887 MB) |
| commit @ idle 1.5s (MB) | 2337 (2304-2354) | 218 (217-219) | -90.7% (-2119 MB) |
| commit @ idle 4s (MB) | 2337 (2304-2354) | 218 (216-219) | -90.7% (-2119 MB) |
| commit @ idle 12s (MB) | 2194 (2163-2212) | 79.9 (79.3-81.2) | -96.4% (-2114 MB) |

### issue-11143-api-idle:1-build

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 745 (743-753) | 729 (727-733) | -2.1% (-15.9 MB) |
| peak commit (MB) | 1548 (1504-1574) | 941 (935-951) | -39.2% (-607 MB) |
| process cpu time | 1.69s (1.44s-1.81s) | 2.03s (1.73s-2.48s) | +20.3% (noise) |
| all builds | 523ms (513ms-537ms) | 530ms (509ms-532ms) | +1.3% (noise) |
| private working set @ before builds (MB) | 61.9 (61.5-62.0) | 61.4 (61.3-62.0) | -0.8% (-0.5 MB, noise) |
| private working set @ outputs held (MB) | 668 (655-680) | 586 (581-647) | -12.2% (-81.7 MB) |
| private working set @ idle 1.5s (MB) | 669 (656-680) | 132 (130-133) | -80.3% (-537 MB) |
| private working set @ idle 4s (MB) | 669 (656-680) | 131 (130-133) | -80.4% (-537 MB) |
| private working set @ idle 12s (MB) | 603 (587-614) | 63.8 (63.2-64.0) | -89.4% (-539 MB) |
| commit @ before builds (MB) | 120 (119-121) | 118 (118-118) | -1.8% (-2.2 MB) |
| commit @ outputs held (MB) | 1403 (1381-1435) | 754 (748-818) | -46.3% (-649 MB) |
| commit @ idle 1.5s (MB) | 1403 (1381-1435) | 214 (214-215) | -84.8% (-1189 MB) |
| commit @ idle 4s (MB) | 1403 (1381-1435) | 214 (212-215) | -84.8% (-1189 MB) |
| commit @ idle 12s (MB) | 1266 (1244-1297) | 77.0 (76.2-77.5) | -93.9% (-1189 MB) |

## issue-11233-optimizer-threads

One optimizer-like pass over typescript, codemirror and vue, then idle. Issues: [#11233](https://github.com/rolldown/rolldown/issues/11233).

### issue-11233-optimizer-threads:default-threads

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 386 (374-395) | 341 (334-349) | -11.7% (-45.0 MB) |
| peak commit (MB) | 1170 (1163-1190) | 404 (387-425) | -65.5% (-766 MB) |
| process cpu time | 781ms (578ms-890ms) | 859ms (640ms-1.08s) | +10.0% (noise) |
| build | 493ms (492ms-496ms) | 491ms (489ms-499ms) | -0.4% (noise) |
| private working set @ output held (MB) | 321 (302-324) | 283 (271-294) | -11.9% (-38.2 MB) |
| private working set @ idle 2s (MB) | 322 (302-324) | 26.9 (25.3-28.4) | -91.6% (-295 MB) |
| private working set @ idle 10s (MB) | 320 (300-323) | 24.9 (23.3-26.4) | -92.2% (-295 MB) |
| commit @ output held (MB) | 1105 (1084-1110) | 336 (323-353) | -69.6% (-769 MB) |
| commit @ idle 2s (MB) | 1105 (1084-1111) | 40.2 (39.1-41.9) | -96.4% (-1065 MB) |
| commit @ idle 10s (MB) | 1102 (1082-1107) | 37.1 (36.0-38.3) | -96.6% (-1065 MB) |

### issue-11233-optimizer-threads:4-threads

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 354 (340-371) | 328 (321-334) | -7.3% (-25.9 MB) |
| peak commit (MB) | 720 (705-737) | 381 (375-386) | -47.1% (-339 MB) |
| process cpu time | 702ms (655ms-781ms) | 656ms (609ms-796ms) | -6.6% (noise) |
| build | 490ms (486ms-513ms) | 486ms (485ms-499ms) | -0.8% (noise) |
| private working set @ output held (MB) | 299 (285-316) | 272 (266-279) | -9.1% (-27.2 MB) |
| private working set @ idle 2s (MB) | 299 (286-316) | 22.9 (22.4-23.4) | -92.3% (-276 MB) |
| private working set @ idle 10s (MB) | 297 (283-314) | 20.9 (20.5-21.5) | -93.0% (-276 MB) |
| commit @ output held (MB) | 655 (641-673) | 315 (309-320) | -51.9% (-340 MB) |
| commit @ idle 2s (MB) | 655 (642-674) | 35.1 (34.4-36.0) | -94.6% (-620 MB) |
| commit @ idle 10s (MB) | 652 (639-671) | 31.7 (31.3-32.7) | -95.1% (-621 MB) |

## many-chunks

three.js x10 with one dynamic import per file (about 3,700 chunks), one build.

### many-chunks:plain

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 478 (476-484) | 453 (449-462) | -5.2% (-25.1 MB) |
| peak commit (MB) | 1191 (1179-1207) | 524 (519-532) | -56.0% (-668 MB) |
| process cpu time | 1.94s (1.69s-2.39s) | 1.98s (1.87s-2.42s) | +2.4% (noise) |
| build | 276ms (271ms-277ms) | 283ms (274ms-284ms) | +2.3% (noise) |
| chunks | 3692 (3692-3692) | 3692 (3692-3692) | 0.0% (noise) |
| private working set @ output held (MB) | 432 (430-438) | 408 (404-417) | -5.6% (-24.4 MB) |
| private working set @ after gc (MB) | 435 (432-440) | 410 (406-418) | -5.8% (-25.0 MB) |
| private working set @ idle 2s (MB) | 435 (432-440) | 58.5 (57.9-58.8) | -86.5% (-376 MB) |
| commit @ output held (MB) | 1185 (1173-1201) | 519 (514-528) | -56.2% (-666 MB) |
| commit @ after gc (MB) | 1191 (1179-1206) | 523 (518-532) | -56.1% (-668 MB) |
| commit @ idle 2s (MB) | 1191 (1179-1206) | 89.6 (89.1-90.2) | -92.5% (-1102 MB) |

### many-chunks:sourcemap

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 610 (596-613) | 553 (546-558) | -9.4% (-57.6 MB) |
| peak commit (MB) | 1507 (1479-1512) | 604 (594-609) | -59.9% (-903 MB) |
| process cpu time | 2.14s (1.94s-2.67s) | 2.39s (2.11s-2.92s) | +11.7% (noise) |
| build | 330ms (323ms-336ms) | 336ms (332ms-344ms) | +1.9% (noise) |
| chunks | 3692 (3692-3692) | 3692 (3692-3692) | 0.0% (noise) |
| private working set @ output held (MB) | 563 (549-566) | 501 (495-507) | -11.0% (-62.2 MB) |
| private working set @ after gc (MB) | 566 (552-568) | 508 (502-514) | -10.2% (-57.7 MB) |
| private working set @ idle 2s (MB) | 566 (552-568) | 75.3 (74.9-76.1) | -86.7% (-491 MB) |
| commit @ output held (MB) | 1465 (1437-1470) | 592 (583-596) | -59.6% (-873 MB) |
| commit @ after gc (MB) | 1506 (1478-1512) | 603 (594-608) | -59.9% (-903 MB) |
| commit @ idle 2s (MB) | 1506 (1479-1512) | 101 (99.5-101) | -93.3% (-1406 MB) |

## rebuild-gaps

three.js x10 with sourcemap, 10 builds with a pause between them.

### rebuild-gaps:gap-0

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 1865 (1822-1942) | 1048 (1035-1065) | -43.8% (-817 MB) |
| peak commit (MB) | 2579 (2511-2637) | 1165 (1145-1175) | -54.8% (-1414 MB) |
| process cpu time | 15.95s (15.25s-17.06s) | 16.14s (15.72s-16.98s) | +1.2% (noise) |
| later builds (median) | 400ms (395ms-405ms) | 393ms (391ms-395ms) | -1.8% (noise) |
| first build | 427ms (421ms-441ms) | 436ms (425ms-445ms) | +2.3% (noise) |
| later builds (max) | 412ms (402ms-431ms) | 412ms (403ms-421ms) | -0.1% (noise) |
| rss @ before build 2 (MB) | 584 (505-590) | 534 (494-542) | -8.6% (-50.4 MB, noise) |
| rss @ before build 5 (MB) | 1126 (1115-1169) | 900 (882-927) | -20.1% (-227 MB) |
| rss @ before build 10 (MB) | 1747 (1695-1771) | 974 (965-993) | -44.2% (-773 MB) |

### rebuild-gaps:gap-300ms

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 1785 (1769-1798) | 997 (980-1015) | -44.2% (-788 MB) |
| peak commit (MB) | 2524 (2492-2568) | 1118 (1094-1129) | -55.7% (-1406 MB) |
| process cpu time | 16.16s (15.53s-16.87s) | 16.33s (15.65s-17.44s) | +1.1% (noise) |
| later builds (median) | 407ms (396ms-411ms) | 397ms (394ms-401ms) | -2.4% (noise) |
| first build | 419ms (415ms-426ms) | 426ms (419ms-441ms) | +1.7% (noise) |
| later builds (max) | 425ms (423ms-430ms) | 436ms (432ms-446ms) | +2.6% |
| rss @ before build 2 (MB) | 581 (565-589) | 537 (485-542) | -7.5% (-43.3 MB) |
| rss @ before build 5 (MB) | 1100 (1037-1119) | 900 (881-907) | -18.2% (-200 MB) |
| rss @ before build 10 (MB) | 1635 (1618-1653) | 892 (867-918) | -45.4% (-743 MB) |

### rebuild-gaps:gap-1s

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 1413 (1373-1466) | 694 (692-697) | -50.9% (-719 MB) |
| peak commit (MB) | 2233 (2194-2286) | 851 (848-853) | -61.9% (-1382 MB) |
| process cpu time | 16.94s (15.94s-17.31s) | 17.37s (16.66s-17.83s) | +2.6% (noise) |
| later builds (median) | 406ms (401ms-412ms) | 421ms (420ms-423ms) | +3.8% |
| first build | 420ms (416ms-423ms) | 422ms (420ms-423ms) | +0.4% (noise) |
| later builds (max) | 441ms (434ms-451ms) | 429ms (426ms-430ms) | -2.8% |
| rss @ before build 2 (MB) | 574 (551-582) | 203 (201-204) | -64.7% (-371 MB) |
| rss @ before build 5 (MB) | 1053 (1008-1066) | 210 (209-211) | -80.1% (-843 MB) |
| rss @ before build 10 (MB) | 1182 (1140-1261) | 210 (210-213) | -82.2% (-972 MB) |

### rebuild-gaps:gap-3s

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 1480 (1464-1507) | 696 (691-696) | -53.0% (-784 MB) |
| peak commit (MB) | 2233 (2199-2275) | 851 (849-853) | -61.9% (-1382 MB) |
| process cpu time | 17.33s (16.59s-17.78s) | 17.48s (17.22s-18.14s) | +0.9% (noise) |
| later builds (median) | 411ms (408ms-417ms) | 422ms (417ms-423ms) | +2.5% (noise) |
| first build | 419ms (417ms-426ms) | 424ms (415ms-427ms) | +1.2% (noise) |
| later builds (max) | 429ms (423ms-434ms) | 429ms (423ms-432ms) | -0.1% (noise) |
| rss @ before build 2 (MB) | 559 (506-579) | 204 (202-204) | -63.5% (-355 MB) |
| rss @ before build 5 (MB) | 998 (936-1027) | 209 (208-213) | -79.0% (-789 MB) |
| rss @ before build 10 (MB) | 1278 (1258-1299) | 211 (210-212) | -83.5% (-1067 MB) |

## three10x

three.js x10, one build: peak, output held, after GC, idle.

### three10x:plain

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 459 (458-470) | 451 (449-455) | -1.8% (-8.1 MB) |
| peak commit (MB) | 1184 (1174-1192) | 587 (576-596) | -50.4% (-597 MB) |
| process cpu time | 1.55s (1.38s-1.83s) | 1.69s (1.44s-1.78s) | +9.1% (noise) |
| build | 330ms (327ms-341ms) | 340ms (336ms-341ms) | +2.8% (noise) |
| private working set @ output held (MB) | 376 (375-387) | 368 (366-372) | -2.2% (-8.1 MB) |
| private working set @ after gc (MB) | 376 (375-387) | 368 (366-372) | -2.2% (-8.2 MB) |
| private working set @ idle 2s (MB) | 376 (375-387) | 28.7 (28.3-29.5) | -92.4% (-347 MB) |
| commit @ output held (MB) | 1088 (1078-1096) | 491 (480-501) | -54.9% (-597 MB) |
| commit @ after gc (MB) | 1089 (1079-1097) | 492 (481-502) | -54.9% (-597 MB) |
| commit @ idle 2s (MB) | 1089 (1079-1097) | 42.1 (41.6-43.4) | -96.1% (-1047 MB) |

### three10x:sourcemap

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 603 (600-611) | 577 (574-582) | -4.2% (-25.5 MB) |
| peak commit (MB) | 1450 (1437-1482) | 738 (727-738) | -49.1% (-713 MB) |
| process cpu time | 1.73s (1.70s-2.14s) | 1.95s (1.69s-2.14s) | +12.7% (noise) |
| build | 424ms (408ms-442ms) | 433ms (431ms-439ms) | +2.1% (noise) |
| private working set @ output held (MB) | 536 (465-543) | 492 (442-499) | -8.2% (-43.8 MB, noise) |
| private working set @ after gc (MB) | 537 (465-544) | 492 (442-499) | -8.2% (-44.1 MB, noise) |
| private working set @ idle 2s (MB) | 537 (465-544) | 29.4 (29.3-30.2) | -94.5% (-507 MB) |
| commit @ output held (MB) | 1338 (1263-1381) | 600 (538-608) | -55.2% (-739 MB) |
| commit @ after gc (MB) | 1339 (1263-1381) | 600 (538-608) | -55.2% (-739 MB) |
| commit @ idle 2s (MB) | 1339 (1263-1381) | 42.9 (42.5-43.8) | -96.8% (-1296 MB) |

### three10x:sourcemap-minify

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 651 (647-662) | 618 (604-630) | -5.0% (-32.3 MB) |
| peak commit (MB) | 1534 (1501-1573) | 793 (770-804) | -48.3% (-741 MB) |
| process cpu time | 1.89s (1.66s-1.97s) | 2.06s (1.86s-2.23s) | +9.2% (noise) |
| build | 551ms (543ms-558ms) | 562ms (556ms-577ms) | +2.0% (noise) |
| private working set @ output held (MB) | 561 (494-577) | 462 (438-533) | -17.6% (-98.9 MB, noise) |
| private working set @ after gc (MB) | 561 (495-577) | 462 (439-533) | -17.6% (-98.9 MB, noise) |
| private working set @ idle 2s (MB) | 561 (495-577) | 29.6 (28.9-30.1) | -94.7% (-531 MB) |
| commit @ output held (MB) | 1383 (1329-1415) | 580 (557-642) | -58.0% (-803 MB) |
| commit @ after gc (MB) | 1384 (1330-1416) | 582 (558-643) | -58.0% (-802 MB) |
| commit @ idle 2s (MB) | 1384 (1330-1416) | 43.3 (42.1-43.9) | -96.9% (-1341 MB) |

## issue-11189

Bundled dev rebuilds (synthetic React app, 1,500 modules). Issues: [#11189](https://github.com/rolldown/rolldown/issues/11189).

### issue-11189:bundled

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 530 (471-555) | 191 (189-202) | -64.0% (-339 MB) |
| peak commit (MB) | 1325 (1274-1345) | 271 (268-281) | -79.6% (-1054 MB) |
| process cpu time | 2.48s (2.28s-2.63s) | 2.80s (2.65s-3.34s) | +12.6% |
| ready | 513ms (512ms-527ms) | 518ms (514ms-523ms) | +1.0% (noise) |
| crawled urls | 2 (2-2) | 2 (2-2) | 0.0% (noise) |
| private working set @ after load (MB) | 134 (127-134) | 101 (99.9-101) | -24.6% (-32.9 MB) |
| private working set @ edit 5 (MB) | 238 (234-249) | 99.0 (96.8-101) | -58.5% (-139 MB) |
| private working set @ edit 10 (MB) | 337 (320-338) | 99.7 (98.6-102) | -70.4% (-237 MB) |
| private working set @ edit 15 (MB) | 392 (376-395) | 104 (102-105) | -73.5% (-288 MB) |
| private working set @ edit 20 (MB) | 460 (420-488) | 103 (101-106) | -77.7% (-357 MB) |
| commit @ after load (MB) | 532 (518-541) | 202 (202-203) | -62.1% (-330 MB) |
| commit @ edit 5 (MB) | 869 (862-899) | 185 (184-186) | -78.8% (-685 MB) |
| commit @ edit 10 (MB) | 1084 (1023-1149) | 187 (185-188) | -82.8% (-897 MB) |
| commit @ edit 15 (MB) | 1189 (1174-1246) | 188 (188-192) | -84.2% (-1001 MB) |
| commit @ edit 20 (MB) | 1321 (1270-1324) | 188 (188-192) | -85.7% (-1133 MB) |

### issue-11189:unbundled

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 280 (250-299) | 255 (254-256) | -9.0% (-25.3 MB, noise) |
| peak commit (MB) | 357 (354-363) | 324 (323-324) | -9.2% (-32.8 MB) |
| process cpu time | 4.08s (3.87s-9.98s) | 4.05s (3.92s-4.08s) | -0.8% (noise) |
| ready | 522ms (521ms-522ms) | 524ms (523ms-532ms) | +0.4% |
| crawled urls | 1542 (1542-1542) | 1542 (1542-1542) | 0.0% (noise) |
| private working set @ after load (MB) | 156 (147-218) | 154 (152-154) | -1.8% (-2.8 MB, noise) |
| private working set @ edit 5 (MB) | 183 (175-224) | 179 (178-181) | -2.1% (-3.9 MB, noise) |
| private working set @ edit 10 (MB) | 205 (176-224) | 182 (181-183) | -11.5% (-23.5 MB, noise) |
| private working set @ edit 15 (MB) | 207 (175-225) | 180 (179-181) | -12.9% (-26.7 MB, noise) |
| private working set @ edit 20 (MB) | 205 (178-228) | 182 (182-184) | -11.1% (-22.6 MB, noise) |
| commit @ after load (MB) | 254 (243-305) | 223 (222-223) | -12.4% (-31.6 MB) |
| commit @ edit 5 (MB) | 322 (318-327) | 291 (290-292) | -9.8% (-31.5 MB) |
| commit @ edit 10 (MB) | 325 (319-329) | 294 (292-295) | -9.5% (-30.8 MB) |
| commit @ edit 15 (MB) | 324 (322-332) | 292 (291-293) | -9.9% (-32.1 MB) |
| commit @ edit 20 (MB) | 328 (326-330) | 295 (294-295) | -10.2% (-33.5 MB) |

### issue-11189:bundled-gc

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 463 (407-486) | 205 (204-205) | -55.8% (-258 MB) |
| peak commit (MB) | 1201 (1172-1228) | 293 (290-294) | -75.6% (-908 MB) |
| process cpu time | 2.62s (2.48s-2.75s) | 3.22s (3.12s-3.62s) | +22.6% |
| ready | 520ms (516ms-521ms) | 516ms (513ms-518ms) | -0.8% (noise) |
| crawled urls | 2 (2-2) | 2 (2-2) | 0.0% (noise) |
| private working set @ after load (MB) | 127 (122-130) | 102 (102-103) | -19.4% (-24.7 MB) |
| private working set @ edit 5 (MB) | 231 (219-232) | 113 (112-114) | -51.1% (-118 MB) |
| private working set @ edit 10 (MB) | 304 (270-315) | 115 (113-115) | -62.1% (-188 MB) |
| private working set @ edit 15 (MB) | 363 (331-369) | 116 (115-116) | -68.2% (-247 MB) |
| private working set @ edit 20 (MB) | 402 (352-425) | 117 (114-117) | -71.0% (-285 MB) |
| commit @ after load (MB) | 512 (511-522) | 204 (203-204) | -60.2% (-308 MB) |
| commit @ edit 5 (MB) | 854 (842-874) | 216 (215-216) | -74.8% (-638 MB) |
| commit @ edit 10 (MB) | 1040 (1013-1043) | 217 (217-217) | -79.1% (-823 MB) |
| commit @ edit 15 (MB) | 1126 (1102-1149) | 218 (218-218) | -80.7% (-908 MB) |
| commit @ edit 20 (MB) | 1192 (1169-1219) | 218 (218-218) | -81.7% (-974 MB) |

### issue-11189:bundled-tailwind-leaf

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 188 (188-190) | 184 (184-185) | -2.1% (-4.0 MB) |
| peak commit (MB) | 552 (543-554) | 258 (258-259) | -53.2% (-294 MB) |
| process cpu time | 1.01s (843ms-1.11s) | 1.03s (1.03s-1.06s) | +1.6% (noise) |
| ready | 520ms (514ms-521ms) | 517ms (515ms-525ms) | -0.6% (noise) |
| crawled urls | 7 (7-7) | 7 (7-7) | 0.0% (noise) |
| private working set @ after load (MB) | 133 (132-136) | 117 (104-118) | -12.2% (-16.2 MB) |
| private working set @ edit 5 (MB) | 120 (119-123) | 91.1 (91.1-91.8) | -24.1% (-28.9 MB) |
| private working set @ edit 10 (MB) | 120 (118-123) | 91.1 (91.0-91.6) | -24.0% (-28.8 MB) |
| private working set @ edit 15 (MB) | 120 (118-123) | 91.2 (91.0-91.7) | -23.9% (-28.7 MB) |
| private working set @ edit 20 (MB) | 120 (118-123) | 91.1 (91.0-91.7) | -24.0% (-28.8 MB) |
| commit @ after load (MB) | 544 (535-546) | 223 (208-224) | -59.0% (-321 MB) |
| commit @ edit 5 (MB) | 510 (500-512) | 178 (177-178) | -65.2% (-333 MB) |
| commit @ edit 10 (MB) | 509 (499-511) | 177 (177-177) | -65.2% (-332 MB) |
| commit @ edit 15 (MB) | 509 (499-511) | 177 (177-177) | -65.2% (-332 MB) |
| commit @ edit 20 (MB) | 509 (499-511) | 177 (177-177) | -65.2% (-332 MB) |

## lobehub

lobehub SPA. Issues: [#9330](https://github.com/rolldown/rolldown/issues/9330).

### lobehub:build

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 5077 (4821-5276) | 4784 (4514-4811) | -5.8% (-293 MB) |
| peak commit (MB) | 7067 (6842-7255) | 5411 (5150-5446) | -23.4% (-1655 MB) |
| process wall time | 37.89s (37.38s-38.32s) | 37.87s (37.45s-38.09s) | -0.0% (noise) |
| process cpu time | 76.80s (76.70s-78.83s) | 77.27s (75.64s-78.45s) | +0.6% (noise) |

### lobehub:build-sourcemap

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 6160 (6117-6523) | 5670 (5592-5683) | -7.9% (-490 MB) |
| peak commit (MB) | 8018 (8015-8401) | 6153 (6126-6162) | -23.3% (-1865 MB) |
| process wall time | 41.68s (41.57s-42.70s) | 41.38s (41.33s-41.99s) | -0.7% (noise) |
| process cpu time | 85.22s (84.69s-86.31s) | 85.80s (83.59s-85.87s) | +0.7% (noise) |

### lobehub:dev

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 3075 (2921-3128) | 2673 (2664-3175) | -13.1% (-402 MB, noise) |
| peak commit (MB) | 4893 (4700-4922) | 3007 (2986-3243) | -38.5% (-1886 MB) |
| process cpu time | 92.22s (90.37s-97.42s) | 92.05s (90.44s-92.09s) | -0.2% (noise) |
| ready | 4.03s (4.00s-7.15s) | 3.99s (3.98s-4.02s) | -1.0% (noise) |
| page load | 21.17s (21.17s-43.67s) | 21.43s (21.42s-21.72s) | +1.2% (noise) |
| page requests | 9765 (9753-9771) | 9702 (9672-9770) | -0.6% (noise) |
| failed requests | 6 (6-6) | 6 (6-6) | 0.0% (noise) |
| private working set @ ready (MB) | 471 (467-557) | 456 (451-466) | -3.1% (-14.8 MB) |
| private working set @ page closed (MB) | 2639 (2586-2706) | 1920 (1865-2943) | -27.3% (-719 MB, noise) |
| private working set @ idle 90s (MB) | 1818 (1748-1917) | 1114 (1095-1249) | -38.7% (-703 MB) |
| private working set @ idle 180s (MB) | 1818 (1749-1917) | 1114 (1095-1248) | -38.7% (-703 MB) |
| private working set @ idle 270s (MB) | 1818 (1749-1917) | 1115 (1095-1248) | -38.7% (-703 MB) |
| commit @ ready (MB) | 680 (679-790) | 528 (523-539) | -22.3% (-152 MB) |
| commit @ page closed (MB) | 3861 (3846-4021) | 2025 (1969-3065) | -47.6% (-1837 MB) |
| commit @ idle 90s (MB) | 3057 (2951-3216) | 1202 (1182-1338) | -60.7% (-1856 MB) |
| commit @ idle 180s (MB) | 3057 (2951-3215) | 1201 (1182-1337) | -60.7% (-1856 MB) |
| commit @ idle 270s (MB) | 3057 (2952-3215) | 1202 (1182-1337) | -60.7% (-1856 MB) |

### lobehub:dev-warm

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 1889 (1876-1890) | 1895 (1832-1912) | +0.3% (+6.0 MB, noise) |
| peak commit (MB) | 2150 (2110-2153) | 1948 (1883-1965) | -9.4% (-202 MB) |
| process cpu time | 67.89s (66.22s-67.92s) | 64.12s (64.12s-65.81s) | -5.5% |
| ready | 3.95s (3.91s-3.98s) | 3.97s (3.95s-3.99s) | +0.3% (noise) |
| page load | 16.00s (15.77s-17.60s) | 15.92s (15.91s-15.95s) | -0.5% (noise) |
| page requests | 9761 (9615-9768) | 9767 (9761-9771) | +0.1% (noise) |
| failed requests | 6 (6-7) | 6 (6-7) | 0.0% (noise) |
| private working set @ ready (MB) | 471 (453-473) | 452 (449-463) | -4.0% (-19.0 MB, noise) |
| private working set @ page closed (MB) | 1768 (1766-1783) | 1789 (1732-1809) | +1.2% (+21.3 MB, noise) |
| private working set @ idle 90s (MB) | 951 (931-970) | 981 (969-982) | +3.2% (+30.1 MB, noise) |
| private working set @ idle 180s (MB) | 954 (931-970) | 972 (969-982) | +1.9% (+17.9 MB, noise) |
| private working set @ idle 270s (MB) | 954 (932-971) | 972 (969-982) | +1.9% (+18.2 MB, noise) |
| commit @ ready (MB) | 679 (660-679) | 524 (521-535) | -22.7% (-154 MB) |
| commit @ page closed (MB) | 2105 (2072-2109) | 1901 (1845-1924) | -9.7% (-205 MB) |
| commit @ idle 90s (MB) | 1258 (1217-1291) | 1074 (1062-1076) | -14.6% (-184 MB) |
| commit @ idle 180s (MB) | 1260 (1217-1291) | 1065 (1062-1074) | -15.5% (-195 MB) |
| commit @ idle 270s (MB) | 1260 (1217-1291) | 1065 (1063-1074) | -15.5% (-195 MB) |

## rolldown-9330-repro

Small #9330 repro, vite dev with @lobehub/ui. Issues: [#9330](https://github.com/rolldown/rolldown/issues/9330).

### rolldown-9330-repro:dev

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 2005 (2003-2054) | 1273 (1257-1276) | -36.5% (-732 MB) |
| peak commit (MB) | 3736 (3722-3740) | 1553 (1552-1558) | -58.4% (-2184 MB) |
| process cpu time | 8.98s (8.75s-9.09s) | 8.72s (8.45s-9.37s) | -3.0% (noise) |
| ready | 604ms (603ms-636ms) | 600ms (552ms-624ms) | -0.7% (noise) |
| page load | 2.73s (2.71s-2.81s) | 2.87s (2.87s-2.91s) | +5.4% |
| page requests | 7 (7-7) | 7 (7-7) | 0.0% (noise) |
| failed requests | 0 (0-0) | 0 (0-0) | - |
| private working set @ ready (MB) | 813 (808-813) | 803 (739-809) | -1.2% (-10.0 MB, noise) |
| private working set @ page closed (MB) | 1311 (1301-1349) | 377 (376-387) | -71.3% (-934 MB) |
| private working set @ idle 90s (MB) | 1311 (1301-1350) | 377 (376-387) | -71.3% (-934 MB) |
| commit @ ready (MB) | 1775 (1747-1788) | 1128 (1044-1135) | -36.4% (-646 MB) |
| commit @ page closed (MB) | 3022 (3001-3027) | 456 (455-471) | -84.9% (-2566 MB) |
| commit @ idle 90s (MB) | 3022 (3001-3027) | 457 (455-471) | -84.9% (-2565 MB) |

## vinext

vinext, Next.js on Vite.

### vinext:build

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 661 (646-695) | 618 (617-618) | -6.6% (-43.3 MB) |
| peak commit (MB) | 1733 (1678-1782) | 708 (708-710) | -59.2% (-1025 MB) |
| process wall time | 1.99s (1.97s-1.99s) | 1.96s (1.95s-1.97s) | -1.1% (noise) |
| process cpu time | 3.94s (3.94s-3.98s) | 3.78s (3.72s-3.95s) | -4.0% (noise) |

### vinext:playground-build

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 1557 (1510-1671) | 1428 (1425-1434) | -8.3% (-129 MB) |
| peak commit (MB) | 2703 (2670-2834) | 1542 (1535-1545) | -43.0% (-1161 MB) |
| process wall time | 5.68s (5.65s-13.67s) | 5.70s (5.67s-5.75s) | +0.4% (noise) |
| process cpu time | 10.72s (10.52s-13.52s) | 11.09s (10.52s-11.92s) | +3.5% (noise) |

## vue-vben-admin

vue-vben-admin, the web-antd app.

### vue-vben-admin:build

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak PeakWorkingSet (MB) | 1434 (1433-1486) | 1377 (1368-1392) | -4.0% (-57.9 MB) |
| peak commit (MB) | 2744 (2742-2883) | 1576 (1570-1592) | -42.5% (-1167 MB) |
| process wall time | 5.41s (5.38s-5.43s) | 5.39s (5.34s-5.42s) | -0.5% (noise) |
| process cpu time | 10.39s (10.28s-11.02s) | 11.17s (11.11s-11.25s) | +7.5% |
