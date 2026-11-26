# Benchmarks

`just bench` writes this file after every run, and `just report <results.json> ...` writes it again from saved runs.

- Machine: linux arm64 (7.2.12-orbstack-00394-gbecdd6130068), unknown, 13 cores, 16 GB, Node v22.22.1, transparent huge pages `madvise`
- Run 2026-11-26 08:51 UTC: `just bench quick --bin base=/Users/shulaoda/workspace/voidzero/rolldown-wt-base --bin pr=/Users/shulaoda/workspace/voidzero/rolldown-memory-reclaim --out BENCHMARKS-LINUX.md`
- Memory: `RssAnon`, peak: the highest `VmHWM` of the process. Numbers compare only on the same machine.
- Load average (1 min) when a run started: 0.1 to 3.8, on 13 cores

| Bin | rolldown | From | Commit |
| --- | --- | --- | --- |
| base | 1.3.3 | repo `/Users/shulaoda/workspace/voidzero/rolldown-wt-base` | e641a934ec |
| pr | 1.3.3 | repo `/Users/shulaoda/workspace/voidzero/rolldown-memory-reclaim` | ce99614c34 |

Every number is the median over the rounds, with the range in parentheses. A change is from `base`. A change marked noise is not a clear difference: its ranges overlap, or a side has fewer than 3 rounds.

## Summary

| Case | Peak | CPU time | Time | Memory at the last mark |
| --- | ---: | ---: | ---: | ---: |
| held-outputs:sourcemap | -22.8% (-512 MB) | +3.5% (noise) | all builds: -0.1% (noise) | idle 2s: -92.1% (-1944 MB) |
| issue-10985-tight-loop:close | -49.0% (-564 MB) | +1.1% (noise) | all builds: -0.1% (noise) | idle 5s: -88.4% (-962 MB) |
| issue-11143-api-idle:6-builds | -21.7% (-422 MB) | -0.3% (noise) | all builds: -0.7% (noise) | idle 12s: -89.7% (-1660 MB) |
| issue-11233-optimizer-threads:default-threads | -31.0% (-245 MB) | -2.1% (noise) | build: -3.7% (noise) | idle 10s: -82.3% (-571 MB) |
| many-chunks:sourcemap | -28.8% (-314 MB) | +3.8% (noise) | build: +4.4% | idle 2s: -82.5% (-847 MB) |
| rebuild-gaps:gap-0 | -44.0% (-957 MB) | +2.1% (noise) | later builds (median): -1.4% (noise) | before build 10: -45.6% (-906 MB) |
| rebuild-gaps:gap-300ms | -42.2% (-893 MB) | +0.6% (noise) | later builds (median): +0.0% (noise) | before build 10: -52.1% (-971 MB) |
| rebuild-gaps:gap-1s | -49.9% (-926 MB) | +6.6% | later builds (median): +1.9% (noise) | before build 10: -77.4% (-1058 MB) |
| rebuild-gaps:gap-3s | -48.5% (-883 MB) | -0.6% (noise) | later builds (median): -1.0% (noise) | before build 10: -79.6% (-1259 MB) |
| three10x:sourcemap | -22.2% (-247 MB) | +3.1% | build: -1.2% (noise) | idle 2s: -84.0% (-845 MB) |
| issue-11189:bundled | -57.1% (-528 MB) | +16.8% | ready: 0.0% (noise) | edit 20: -66.8% (-568 MB) |
| lobehub:build | -16.5% (-978 MB) | -1.3% | process wall time: -1.2% | - |
| lobehub:build-sourcemap | -19.3% (-1337 MB) | +1.1% (noise) | process wall time: +0.6% (noise) | - |
| lobehub:dev | -25.6% (-990 MB) | +0.1% (noise) | ready: +12.4% (noise) | idle 270s: -56.7% (-1605 MB) |
| rolldown-9330-repro:dev | -24.9% (-682 MB) | -7.1% | ready: 0.0% (noise) | idle 90s: -74.8% (-1596 MB) |
| vinext:build | -25.8% (-285 MB) | +0.2% (noise) | process wall time: +1.9% (noise) | - |
| vue-vben-admin:build | -20.6% (-449 MB) | -1.2% (noise) | process wall time: -0.8% (noise) | - |

## held-outputs

three.js x10, 10 back-to-back builds that keep their outputs (dashboard shape).

### held-outputs:sourcemap

3 rounds, load 0.8 to 1.1.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2244 (2220-2264) | 1732 (1731-1759) | -22.8% (-512 MB) |
| process cpu time | 5.81s (5.67s-5.94s) | 6.01s (5.71s-6.05s) | +3.5% (noise) |
| all builds | 2.25s (2.24s-2.32s) | 2.24s (2.18s-2.36s) | -0.1% (noise) |
| RssAnon @ 10 outputs held (MB) | 2109 (2083-2129) | 1623 (1593-1648) | -23.1% (-486 MB) |
| RssAnon @ after gc (MB) | 2110 (2083-2130) | 1623 (1593-1648) | -23.1% (-487 MB) |
| RssAnon @ idle 2s (MB) | 2110 (2083-2130) | 166 (163-173) | -92.1% (-1944 MB) |

## issue-10985-tight-loop

Memory across 150 builds in a tight loop, then idle. Issues: [#10985](https://github.com/rolldown/rolldown/issues/10985), [#10984](https://github.com/rolldown/rolldown/issues/10984).

### issue-10985-tight-loop:close

3 rounds, load 0.7 to 0.9.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1151 (1133-1167) | 587 (586-588) | -49.0% (-564 MB) |
| process cpu time | 8.06s (8.05s-8.17s) | 8.15s (8.10s-8.24s) | +1.1% (noise) |
| all builds | 3.36s (3.32s-3.38s) | 3.35s (3.28s-3.44s) | -0.1% (noise) |
| RssAnon @ build 25 (MB) | 893 (820-946) | 454 (441-473) | -49.2% (-440 MB) |
| RssAnon @ build 50 (MB) | 1024 (950-1028) | 505 (490-508) | -50.6% (-519 MB) |
| RssAnon @ build 75 (MB) | 1038 (1000-1050) | 524 (524-525) | -49.5% (-514 MB) |
| RssAnon @ build 100 (MB) | 1054 (1010-1080) | 524 (524-525) | -50.3% (-530 MB) |
| RssAnon @ build 125 (MB) | 1072 (1038-1102) | 524 (524-525) | -51.1% (-548 MB) |
| RssAnon @ build 150 (MB) | 1088 (1070-1104) | 524 (524-525) | -51.8% (-564 MB) |
| RssAnon @ idle 5s (MB) | 1088 (1070-1104) | 126 (123-134) | -88.4% (-962 MB) |

## issue-11143-api-idle

API builds with in-memory files and maps, then outputs dropped and idle. Issues: [#11143](https://github.com/rolldown/rolldown/issues/11143).

### issue-11143-api-idle:6-builds

3 rounds, load 0.4 to 0.6.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1946 (1939-1964) | 1524 (1514-1539) | -21.7% (-422 MB) |
| process cpu time | 4.09s (4.06s-4.14s) | 4.08s (4.07s-4.08s) | -0.3% (noise) |
| all builds | 1.80s (1.80s-1.90s) | 1.79s (1.77s-1.80s) | -0.7% (noise) |
| RssAnon @ before builds (MB) | 123 (123-124) | 124 (123-124) | +0.5% (+0.6 MB, noise) |
| RssAnon @ outputs held (MB) | 1851 (1830-1855) | 1396 (1395-1402) | -24.6% (-455 MB) |
| RssAnon @ idle 1.5s (MB) | 1851 (1830-1855) | 185 (184-189) | -90.0% (-1666 MB) |
| RssAnon @ idle 4s (MB) | 1851 (1830-1855) | 185 (184-189) | -90.0% (-1666 MB) |
| RssAnon @ idle 12s (MB) | 1851 (1830-1855) | 191 (185-194) | -89.7% (-1660 MB) |

## issue-11233-optimizer-threads

One optimizer-like pass over typescript, codemirror and vue, then idle. Issues: [#11233](https://github.com/rolldown/rolldown/issues/11233).

### issue-11233-optimizer-threads:default-threads

3 rounds, load 0.1 to 0.3.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 792 (774-810) | 547 (543-549) | -31.0% (-245 MB) |
| process cpu time | 480ms (480ms-509ms) | 470ms (463ms-495ms) | -2.1% (noise) |
| build | 267ms (258ms-283ms) | 257ms (257ms-259ms) | -3.7% (noise) |
| RssAnon @ output held (MB) | 697 (697-712) | 454 (452-466) | -35.0% (-244 MB) |
| RssAnon @ idle 2s (MB) | 698 (697-713) | 126 (124-127) | -82.0% (-572 MB) |
| RssAnon @ idle 10s (MB) | 694 (693-709) | 123 (121-123) | -82.3% (-571 MB) |

## many-chunks

three.js x10 with one dynamic import per file (about 3,700 chunks), one build.

### many-chunks:sourcemap

3 rounds, load 0.1 to 0.1.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1090 (1086-1099) | 777 (765-777) | -28.8% (-314 MB) |
| process cpu time | 901ms (875ms-921ms) | 935ms (914ms-965ms) | +3.8% (noise) |
| build | 184ms (184ms-186ms) | 192ms (190ms-194ms) | +4.4% |
| chunks | 3692 (3692-3692) | 3692 (3692-3692) | 0.0% (noise) |
| RssAnon @ output held (MB) | 1022 (1019-1032) | 711 (700-711) | -30.4% (-311 MB) |
| RssAnon @ after gc (MB) | 1027 (1022-1036) | 714 (702-714) | -30.5% (-313 MB) |
| RssAnon @ idle 2s (MB) | 1027 (1022-1036) | 180 (178-184) | -82.5% (-847 MB) |

## rebuild-gaps

three.js x10 with sourcemap, 10 builds with a pause between them.

### rebuild-gaps:gap-0

3 rounds, load 0.1 to 0.3.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2174 (2172-2273) | 1217 (1217-1280) | -44.0% (-957 MB) |
| process cpu time | 5.54s (5.48s-5.72s) | 5.65s (5.62s-5.66s) | +2.1% (noise) |
| later builds (median) | 217ms (212ms-232ms) | 214ms (214ms-216ms) | -1.4% (noise) |
| first build | 213ms (209ms-214ms) | 215ms (212ms-216ms) | +0.9% (noise) |
| later builds (max) | 222ms (221ms-245ms) | 222ms (221ms-222ms) | -0.1% (noise) |
| RssAnon @ before build 2 (MB) | 1004 (999-1047) | 733 (729-757) | -27.0% (-271 MB) |
| RssAnon @ before build 5 (MB) | 1435 (1397-1488) | 1032 (1031-1073) | -28.1% (-403 MB) |
| RssAnon @ before build 10 (MB) | 1988 (1957-2042) | 1082 (1080-1139) | -45.6% (-906 MB) |

### rebuild-gaps:gap-300ms

3 rounds, load 0.3 to 0.3.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2117 (2104-2134) | 1224 (1216-1267) | -42.2% (-893 MB) |
| process cpu time | 6.79s (6.49s-6.90s) | 6.83s (6.69s-6.93s) | +0.6% (noise) |
| later builds (median) | 232ms (229ms-239ms) | 233ms (232ms-236ms) | +0.0% (noise) |
| first build | 217ms (217ms-221ms) | 214ms (213ms-216ms) | -1.2% |
| later builds (max) | 244ms (238ms-263ms) | 240ms (237ms-246ms) | -1.6% (noise) |
| RssAnon @ before build 2 (MB) | 1008 (1006-1019) | 741 (731-760) | -26.5% (-267 MB) |
| RssAnon @ before build 5 (MB) | 1449 (1428-1456) | 1034 (1032-1115) | -28.6% (-415 MB) |
| RssAnon @ before build 10 (MB) | 1863 (1848-1901) | 892 (889-896) | -52.1% (-971 MB) |

### rebuild-gaps:gap-1s

3 rounds, load 0.3 to 1.9.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1857 (1800-1862) | 931 (923-935) | -49.9% (-926 MB) |
| process cpu time | 6.62s (6.59s-6.74s) | 7.05s (6.91s-7.08s) | +6.6% |
| later builds (median) | 232ms (230ms-239ms) | 237ms (230ms-242ms) | +1.9% (noise) |
| first build | 216ms (215ms-225ms) | 221ms (216ms-249ms) | +2.1% (noise) |
| later builds (max) | 254ms (243ms-353ms) | 250ms (248ms-260ms) | -1.4% (noise) |
| RssAnon @ before build 2 (MB) | 1011 (996-1011) | 306 (301-309) | -69.8% (-705 MB) |
| RssAnon @ before build 5 (MB) | 1453 (1418-1491) | 298 (294-310) | -79.5% (-1155 MB) |
| RssAnon @ before build 10 (MB) | 1367 (1357-1372) | 309 (296-311) | -77.4% (-1058 MB) |

### rebuild-gaps:gap-3s

3 rounds, load 0.4 to 1.3.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1819 (1812-1858) | 936 (928-950) | -48.5% (-883 MB) |
| process cpu time | 7.14s (6.88s-7.30s) | 7.10s (6.95s-7.37s) | -0.6% (noise) |
| later builds (median) | 244ms (234ms-245ms) | 241ms (236ms-243ms) | -1.0% (noise) |
| first build | 234ms (216ms-253ms) | 221ms (219ms-236ms) | -5.5% (noise) |
| later builds (max) | 287ms (245ms-295ms) | 266ms (259ms-271ms) | -7.2% (noise) |
| RssAnon @ before build 2 (MB) | 1013 (1008-1023) | 310 (308-318) | -69.4% (-703 MB) |
| RssAnon @ before build 5 (MB) | 1289 (1261-1295) | 313 (302-320) | -75.8% (-977 MB) |
| RssAnon @ before build 10 (MB) | 1581 (1538-1612) | 322 (322-326) | -79.6% (-1259 MB) |

## three10x

three.js x10, one build: peak, output held, after GC, idle.

### three10x:sourcemap

3 rounds, load 0.2 to 0.3.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1112 (1098-1119) | 865 (863-866) | -22.2% (-247 MB) |
| process cpu time | 645ms (611ms-646ms) | 665ms (664ms-676ms) | +3.1% |
| build | 213ms (212ms-216ms) | 210ms (210ms-214ms) | -1.2% (noise) |
| RssAnon @ output held (MB) | 1005 (991-1013) | 736 (734-752) | -26.8% (-269 MB) |
| RssAnon @ after gc (MB) | 1006 (992-1013) | 736 (734-752) | -26.8% (-270 MB) |
| RssAnon @ idle 2s (MB) | 1006 (992-1013) | 161 (146-162) | -84.0% (-845 MB) |

## issue-11189

Bundled dev rebuilds (synthetic React app, 1,500 modules). Issues: [#11189](https://github.com/rolldown/rolldown/issues/11189).

### issue-11189:bundled

3 rounds, load 0.1 to 0.1.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 926 (912-932) | 397 (394-405) | -57.1% (-528 MB) |
| process cpu time | 1.85s (1.72s-1.87s) | 2.17s (2.12s-2.26s) | +16.8% |
| ready | 516ms (516ms-526ms) | 516ms (515ms-518ms) | 0.0% (noise) |
| crawled urls | 2 (2-2) | 2 (2-2) | 0.0% (noise) |
| RssAnon @ after load (MB) | 382 (370-391) | 260 (259-267) | -32.0% (-122 MB) |
| RssAnon @ edit 5 (MB) | 583 (578-604) | 250 (244-251) | -57.2% (-333 MB) |
| RssAnon @ edit 10 (MB) | 718 (709-720) | 270 (268-271) | -62.4% (-448 MB) |
| RssAnon @ edit 15 (MB) | 801 (788-808) | 274 (258-278) | -65.8% (-527 MB) |
| RssAnon @ edit 20 (MB) | 851 (836-860) | 282 (266-297) | -66.8% (-568 MB) |

## lobehub

lobehub SPA. Issues: [#9330](https://github.com/rolldown/rolldown/issues/9330).

### lobehub:build

3 rounds, load 0.8 to 3.8.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 5947 (5890-6223) | 4969 (4772-5134) | -16.5% (-978 MB) |
| process wall time | 25.45s (25.29s-25.67s) | 25.14s (25.07s-25.15s) | -1.2% |
| process cpu time | 45.46s (45.20s-45.69s) | 44.89s (44.84s-45.01s) | -1.3% |

### lobehub:build-sourcemap

3 rounds, load 2.7 to 3.7.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 6931 (6928-7355) | 5594 (5196-5645) | -19.3% (-1337 MB) |
| process wall time | 27.78s (27.46s-27.97s) | 27.95s (27.15s-28.14s) | +0.6% (noise) |
| process cpu time | 49.40s (48.53s-49.49s) | 49.92s (48.58s-50.17s) | +1.1% (noise) |

### lobehub:dev

3 rounds, load 0.3 to 3.1.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 3870 (3859-3902) | 2880 (2879-2972) | -25.6% (-990 MB) |
| process cpu time | 64.97s (64.11s-67.07s) | 65.00s (64.20s-67.06s) | +0.1% (noise) |
| ready | 2.37s (1.67s-2.75s) | 2.66s (2.54s-2.70s) | +12.4% (noise) |
| page load | 15.70s (15.38s-18.01s) | 16.15s (15.32s-16.46s) | +2.8% (noise) |
| page requests | 10307 (9935-10539) | 10270 (10266-10465) | -0.4% (noise) |
| failed requests | 6 (6-6) | 6 (6-6) | 0.0% (noise) |
| RssAnon @ ready (MB) | 841 (480-1372) | 1107 (892-1151) | +31.7% (+267 MB, noise) |
| RssAnon @ page closed (MB) | 3694 (3531-3782) | 1895 (1890-2873) | -48.7% (-1799 MB) |
| RssAnon @ idle 90s (MB) | 2707 (2677-2767) | 1043 (1024-1075) | -61.5% (-1664 MB) |
| RssAnon @ idle 180s (MB) | 2764 (2760-2840) | 1114 (1111-1143) | -59.7% (-1650 MB) |
| RssAnon @ idle 270s (MB) | 2829 (2808-2869) | 1224 (1199-1238) | -56.7% (-1605 MB) |

## rolldown-9330-repro

Small #9330 repro, vite dev with @lobehub/ui. Issues: [#9330](https://github.com/rolldown/rolldown/issues/9330).

### rolldown-9330-repro:dev

3 rounds, load 0.2 to 0.3.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2737 (2710-2797) | 2055 (2039-2059) | -24.9% (-682 MB) |
| process cpu time | 3.79s (3.66s-3.88s) | 3.52s (3.52s-3.65s) | -7.1% |
| ready | 523ms (519ms-524ms) | 523ms (514ms-526ms) | 0.0% (noise) |
| page load | 1.32s (1.25s-1.40s) | 1.26s (1.23s-1.28s) | -4.8% (noise) |
| page requests | 7 (7-7) | 7 (7-7) | 0.0% (noise) |
| failed requests | 0 (0-0) | 0 (0-0) | - |
| RssAnon @ ready (MB) | 1526 (1512-1552) | 1286 (1276-1302) | -15.7% (-240 MB) |
| RssAnon @ page closed (MB) | 2133 (2108-2195) | 446 (435-452) | -79.1% (-1687 MB) |
| RssAnon @ idle 90s (MB) | 2133 (2108-2195) | 537 (523-538) | -74.8% (-1596 MB) |

## vinext

vinext, Next.js on Vite.

### vinext:build

3 rounds, load 0.1 to 0.2.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1101 (1079-1122) | 817 (804-826) | -25.8% (-285 MB) |
| process wall time | 1.44s (1.42s-1.45s) | 1.47s (1.44s-1.48s) | +1.9% (noise) |
| process cpu time | 2.52s (2.47s-2.54s) | 2.53s (2.50s-2.57s) | +0.2% (noise) |

## vue-vben-admin

vue-vben-admin, the web-antd app.

### vue-vben-admin:build

3 rounds, load 0.3 to 1.1.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2179 (2154-2192) | 1730 (1724-1750) | -20.6% (-449 MB) |
| process wall time | 3.11s (3.06s-3.13s) | 3.09s (3.08s-3.20s) | -0.8% (noise) |
| process cpu time | 6.29s (6.24s-6.36s) | 6.22s (6.21s-6.33s) | -1.2% (noise) |
