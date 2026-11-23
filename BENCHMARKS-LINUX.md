# Benchmarks

`just bench` writes this file after every run, and `just report <results.json> ...` writes it again from saved runs.

- Machine: linux arm64 (7.2.12-orbstack-00394-gbecdd6130068), unknown, 13 cores, 16 GB, Node v26.0.0
- Run 2026-11-20 05:38 UTC: `just bench all --bin base=commit:872275c --bin pr-11655=/Users/shulaoda/workspace/voidzero/rolldown-memory-reclaim`
- Memory: `RssAnon`, peak: the highest `VmHWM` of the process. Numbers compare only on the same machine.

| Bin | rolldown | From | Commit |
| --- | --- | --- | --- |
| base | 1.3.3 | pkg.pr.new `commit:872275c` | 872275c |
| pr-11655 | 1.3.3 | repo `/Users/shulaoda/workspace/voidzero/rolldown-memory-reclaim` | 727aecdc83 |

Every number is the median over the rounds, with the range in parentheses. A change is from `base`. A change marked noise is not a clear difference: its ranges overlap, or a side has fewer than 3 rounds.

## Summary

| Case | Peak | CPU time | Time | Memory at the last mark |
| --- | ---: | ---: | ---: | ---: |
| held-outputs:sourcemap | +1.0% (+21.6 MB, noise) | +2.3% (noise) | all builds: +0.3% (noise) | idle 2s: -93.8% (-1980 MB) |
| held-outputs:plain | +0.7% (+10.3 MB, noise) | -0.3% (noise) | all builds: -1.8% (noise) | idle 2s: -90.7% (-1245 MB) |
| issue-10985-tight-loop:close | +1.6% (+17.6 MB, noise) | +0.2% (noise) | all builds: -0.8% (noise) | idle 5s: -88.6% (-958 MB) |
| issue-10985-tight-loop:generate | -1.5% (-17.1 MB, noise) | -0.6% (noise) | all builds: -0.1% (noise) | idle 5s: -89.0% (-993 MB) |
| issue-11143-api-idle:6-builds | -6.5% (-136 MB) | -1.3% (noise) | all builds: -5.4% (noise) | idle 12s: -88.5% (-1740 MB) |
| issue-11143-api-idle:1-build | -4.0% (-49.8 MB, noise) | +3.5% (noise) | all builds: +3.1% (noise) | idle 12s: -80.9% (-921 MB) |
| issue-11233-optimizer-threads:default-threads | +2.4% (+18.3 MB, noise) | +2.8% (noise) | build: +1.1% (noise) | idle 10s: -82.5% (-581 MB) |
| issue-11233-optimizer-threads:4-threads | -1.0% (-6.0 MB, noise) | -3.4% (noise) | build: -5.9% (noise) | idle 10s: -86.5% (-445 MB) |
| many-chunks:plain | -0.6% (-5.5 MB, noise) | +8.2% (noise) | build: -0.7% (noise) | idle 2s: -84.3% (-791 MB) |
| many-chunks:sourcemap | +0.5% (+5.9 MB, noise) | +8.4% | build: +4.2% (noise) | idle 2s: -85.7% (-933 MB) |
| rebuild-gaps:gap-0 | -26.9% (-607 MB) | +1.1% (noise) | later builds (median): -0.0% (noise) | before build 10: -25.6% (-521 MB) |
| rebuild-gaps:gap-300ms | -24.6% (-534 MB) | -0.2% (noise) | later builds (median): -0.8% (noise) | before build 10: -32.7% (-632 MB) |
| rebuild-gaps:gap-1s | -45.2% (-977 MB) | +2.0% (noise) | later builds (median): +0.6% (noise) | before build 10: -85.0% (-1660 MB) |
| rebuild-gaps:gap-3s | -45.7% (-1000 MB) | +0.6% (noise) | later builds (median): -2.1% (noise) | before build 10: -85.3% (-1661 MB) |
| three10x:plain | -0.8% (-7.5 MB, noise) | +8.8% (noise) | build: +1.0% (noise) | idle 2s: -86.3% (-761 MB) |
| three10x:sourcemap | +1.3% (+14.7 MB, noise) | +6.3% (noise) | build: +2.1% (noise) | idle 2s: -88.7% (-952 MB) |
| three10x:sourcemap-minify | -0.6% (-7.7 MB, noise) | +5.6% (noise) | build: -1.3% (noise) | idle 2s: -88.3% (-921 MB) |
| issue-11189:bundled | -52.4% (-499 MB) | +17.2% | ready: -0.4% (noise) | edit 20: -66.1% (-581 MB) |
| issue-11189:unbundled | -2.9% (-10.3 MB) | +1.8% (noise) | ready: -0.2% (noise) | edit 20: -1.3% (-3.7 MB, noise) |
| issue-11189:bundled-gc | -49.0% (-437 MB) | +15.5% | ready: -0.2% (noise) | edit 20: -63.1% (-516 MB) |
| issue-11189:bundled-tailwind-leaf | +0.9% (+4.1 MB, noise) | +2.4% (noise) | ready: +0.6% (noise) | edit 20: -15.9% (-60.6 MB) |
| lobehub:build | -1.1% (-70.8 MB, noise) | -2.4% (noise) | process wall time: -2.6% (noise) | - |
| lobehub:build-sourcemap | -1.9% (-142 MB, noise) | +0.6% (noise) | process wall time: -0.5% (noise) | - |
| lobehub:dev | -6.0% (-244 MB) | +1.2% (noise) | ready: -1.9% (noise) | idle 30s: -43.3% (-1623 MB) |
| rolldown-9330-repro:dev | -0.0% (-1.1 MB, noise) | -4.3% (noise) | ready: -0.8% (noise) | idle 30s: -66.1% (-1913 MB) |
| vinext:build | +0.5% (+6.0 MB, noise) | -0.2% (noise) | process wall time: -0.2% (noise) | - |
| vinext:playground-build | -1.5% (-29.8 MB, noise) | -0.4% (noise) | process wall time: +1.2% (noise) | - |
| vue-vben-admin:build | -1.1% (-27.2 MB, noise) | -0.2% (noise) | process wall time: +0.1% (noise) | - |

## held-outputs

three.js x10, 10 back-to-back builds that keep their outputs (dashboard shape).

### held-outputs:sourcemap

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2209 (2205-2272) | 2230 (2214-2311) | +1.0% (+21.6 MB, noise) |
| process cpu time | 5.62s (5.59s-5.95s) | 5.75s (5.69s-5.83s) | +2.3% (noise) |
| all builds | 2.27s (2.24s-2.51s) | 2.28s (2.25s-2.35s) | +0.3% (noise) |
| RssAnon @ 10 outputs held (MB) | 2110 (2085-2152) | 2113 (2110-2231) | +0.1% (+2.9 MB, noise) |
| RssAnon @ after gc (MB) | 2110 (2085-2152) | 2113 (2110-2231) | +0.1% (+2.8 MB, noise) |
| RssAnon @ idle 2s (MB) | 2110 (2085-2152) | 130 (129-132) | -93.8% (-1980 MB) |

### held-outputs:plain

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1469 (1452-1477) | 1479 (1448-1501) | +0.7% (+10.3 MB, noise) |
| process cpu time | 5.02s (4.93s-5.17s) | 5.00s (4.88s-5.09s) | -0.3% (noise) |
| all builds | 1.90s (1.87s-1.97s) | 1.86s (1.85s-1.88s) | -1.8% (noise) |
| RssAnon @ 10 outputs held (MB) | 1372 (1355-1381) | 1382 (1352-1404) | +0.8% (+10.4 MB, noise) |
| RssAnon @ after gc (MB) | 1372 (1355-1381) | 1382 (1352-1404) | +0.8% (+10.4 MB, noise) |
| RssAnon @ idle 2s (MB) | 1372 (1355-1381) | 127 (126-139) | -90.7% (-1245 MB) |

## issue-10985-tight-loop

Memory across 150 builds in a tight loop, then idle. Issues: [#10985](https://github.com/rolldown/rolldown/issues/10985), [#10984](https://github.com/rolldown/rolldown/issues/10984).

### issue-10985-tight-loop:close

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1134 (1131-1139) | 1152 (1139-1181) | +1.6% (+17.6 MB, noise) |
| process cpu time | 8.08s (8.07s-8.18s) | 8.10s (8.09s-8.13s) | +0.2% (noise) |
| all builds | 3.41s (3.36s-3.44s) | 3.39s (3.36s-3.42s) | -0.8% (noise) |
| RssAnon @ build 25 (MB) | 852 (832-860) | 928 (825-931) | +9.0% (+76.9 MB, noise) |
| RssAnon @ build 50 (MB) | 937 (896-952) | 1025 (932-1045) | +9.4% (+87.9 MB, noise) |
| RssAnon @ build 75 (MB) | 965 (952-1000) | 1057 (980-1061) | +9.5% (+91.8 MB, noise) |
| RssAnon @ build 100 (MB) | 1048 (1011-1050) | 1067 (1030-1077) | +1.9% (+19.4 MB, noise) |
| RssAnon @ build 125 (MB) | 1071 (1066-1076) | 1091 (1052-1095) | +1.9% (+20.5 MB, noise) |
| RssAnon @ build 150 (MB) | 1081 (1078-1086) | 1099 (1086-1129) | +1.7% (+18.4 MB) |
| RssAnon @ idle 5s (MB) | 1081 (1078-1086) | 123 (122-123) | -88.6% (-958 MB) |

### issue-10985-tight-loop:generate

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1169 (1136-1188) | 1152 (1144-1178) | -1.5% (-17.1 MB, noise) |
| process cpu time | 8.21s (8.13s-8.21s) | 8.16s (8.12s-8.31s) | -0.6% (noise) |
| all builds | 3.40s (3.38s-3.47s) | 3.39s (3.37s-3.53s) | -0.1% (noise) |
| RssAnon @ build 25 (MB) | 912 (878-941) | 908 (803-927) | -0.4% (-4.0 MB, noise) |
| RssAnon @ build 50 (MB) | 1048 (1009-1060) | 1027 (903-1051) | -2.0% (-21.1 MB, noise) |
| RssAnon @ build 75 (MB) | 1062 (1053-1074) | 1057 (1004-1069) | -0.5% (-5.0 MB, noise) |
| RssAnon @ build 100 (MB) | 1083 (1069-1096) | 1080 (1074-1087) | -0.3% (-3.0 MB, noise) |
| RssAnon @ build 125 (MB) | 1091 (1077-1112) | 1092 (1080-1119) | +0.1% (+0.9 MB, noise) |
| RssAnon @ build 150 (MB) | 1116 (1083-1135) | 1100 (1092-1125) | -1.4% (-16.1 MB, noise) |
| RssAnon @ idle 5s (MB) | 1116 (1083-1135) | 123 (120-123) | -89.0% (-993 MB) |

## issue-11143-api-idle

API builds with in-memory files and maps, then outputs dropped and idle. Issues: [#11143](https://github.com/rolldown/rolldown/issues/11143).

### issue-11143-api-idle:6-builds

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2093 (2021-2097) | 1958 (1948-1973) | -6.5% (-136 MB) |
| process cpu time | 4.00s (3.90s-4.11s) | 3.95s (3.90s-4.02s) | -1.3% (noise) |
| all builds | 1.76s (1.70s-1.83s) | 1.67s (1.63s-1.73s) | -5.4% (noise) |
| RssAnon @ before builds (MB) | 105 (103-105) | 104 (104-105) | -0.3% (-0.3 MB, noise) |
| RssAnon @ outputs held (MB) | 1966 (1866-1969) | 1844 (1824-1869) | -6.2% (-122 MB, noise) |
| RssAnon @ idle 1.5s (MB) | 1966 (1865-1971) | 226 (225-228) | -88.5% (-1740 MB) |
| RssAnon @ idle 4s (MB) | 1966 (1865-1971) | 226 (225-228) | -88.5% (-1740 MB) |
| RssAnon @ idle 12s (MB) | 1966 (1866-1971) | 226 (225-228) | -88.5% (-1740 MB) |

### issue-11143-api-idle:1-build

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1260 (1235-1266) | 1211 (1192-1252) | -4.0% (-49.8 MB, noise) |
| process cpu time | 781ms (743ms-822ms) | 808ms (797ms-870ms) | +3.5% (noise) |
| all builds | 280ms (266ms-296ms) | 289ms (276ms-293ms) | +3.1% (noise) |
| RssAnon @ before builds (MB) | 104 (103-105) | 104 (103-104) | -0.4% (-0.4 MB, noise) |
| RssAnon @ outputs held (MB) | 1138 (1133-1181) | 1113 (1092-1153) | -2.2% (-24.9 MB, noise) |
| RssAnon @ idle 1.5s (MB) | 1138 (1133-1181) | 217 (214-219) | -80.9% (-921 MB) |
| RssAnon @ idle 4s (MB) | 1138 (1133-1181) | 217 (214-219) | -80.9% (-921 MB) |
| RssAnon @ idle 12s (MB) | 1138 (1133-1181) | 217 (214-219) | -80.9% (-921 MB) |

## issue-11233-optimizer-threads

One optimizer-like pass over typescript, codemirror and vue, then idle. Issues: [#11233](https://github.com/rolldown/rolldown/issues/11233).

### issue-11233-optimizer-threads:default-threads

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 771 (759-804) | 789 (712-800) | +2.4% (+18.3 MB, noise) |
| process cpu time | 423ms (394ms-425ms) | 435ms (414ms-471ms) | +2.8% (noise) |
| build | 262ms (260ms-282ms) | 265ms (260ms-294ms) | +1.1% (noise) |
| RssAnon @ output held (MB) | 704 (693-737) | 710 (646-739) | +0.9% (+6.3 MB, noise) |
| RssAnon @ idle 2s (MB) | 704 (693-737) | 122 (118-126) | -82.6% (-582 MB) |
| RssAnon @ idle 10s (MB) | 704 (693-737) | 123 (119-139) | -82.5% (-581 MB) |

### issue-11233-optimizer-threads:4-threads

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 595 (562-615) | 589 (588-607) | -1.0% (-6.0 MB, noise) |
| process cpu time | 411ms (369ms-417ms) | 397ms (386ms-398ms) | -3.4% (noise) |
| build | 272ms (253ms-273ms) | 256ms (254ms-260ms) | -5.9% (noise) |
| RssAnon @ output held (MB) | 514 (495-548) | 522 (490-532) | +1.6% (+8.3 MB, noise) |
| RssAnon @ idle 2s (MB) | 514 (495-548) | 69.5 (66.5-70.5) | -86.5% (-445 MB) |
| RssAnon @ idle 10s (MB) | 514 (495-548) | 69.5 (66.6-70.5) | -86.5% (-445 MB) |

## many-chunks

three.js x10 with one dynamic import per file (about 3,700 chunks), one build.

### many-chunks:plain

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 996 (978-1019) | 991 (968-1007) | -0.6% (-5.5 MB, noise) |
| process cpu time | 756ms (741ms-861ms) | 818ms (769ms-837ms) | +8.2% (noise) |
| build | 166ms (162ms-193ms) | 164ms (163ms-174ms) | -0.7% (noise) |
| chunks | 3692 (3692-3692) | 3692 (3692-3692) | 0.0% (noise) |
| RssAnon @ output held (MB) | 936 (917-959) | 929 (909-948) | -0.7% (-7.0 MB, noise) |
| RssAnon @ after gc (MB) | 938 (920-961) | 932 (911-950) | -0.7% (-6.6 MB, noise) |
| RssAnon @ idle 2s (MB) | 938 (920-961) | 147 (143-149) | -84.3% (-791 MB) |

### many-chunks:sourcemap

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1147 (1114-1161) | 1153 (1116-1163) | +0.5% (+5.9 MB, noise) |
| process cpu time | 858ms (840ms-867ms) | 930ms (910ms-980ms) | +8.4% |
| build | 188ms (184ms-196ms) | 195ms (195ms-217ms) | +4.2% (noise) |
| chunks | 3692 (3692-3692) | 3692 (3692-3692) | 0.0% (noise) |
| RssAnon @ output held (MB) | 1087 (1054-1101) | 1094 (1057-1105) | +0.6% (+6.3 MB, noise) |
| RssAnon @ after gc (MB) | 1089 (1056-1103) | 1095 (1059-1106) | +0.6% (+6.3 MB, noise) |
| RssAnon @ idle 2s (MB) | 1089 (1056-1103) | 156 (155-157) | -85.7% (-933 MB) |

## rebuild-gaps

three.js x10 with sourcemap, 10 builds with a pause between them.

### rebuild-gaps:gap-0

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2257 (2229-2286) | 1650 (1610-1799) | -26.9% (-607 MB) |
| process cpu time | 5.52s (5.46s-5.99s) | 5.58s (5.56s-5.62s) | +1.1% (noise) |
| later builds (median) | 222ms (219ms-249ms) | 222ms (214ms-223ms) | -0.0% (noise) |
| first build | 227ms (215ms-248ms) | 220ms (220ms-221ms) | -3.0% (noise) |
| later builds (max) | 230ms (226ms-264ms) | 234ms (230ms-245ms) | +1.7% (noise) |
| RssAnon @ before build 2 (MB) | 1055 (1022-1072) | 1070 (1058-1097) | +1.4% (+14.3 MB, noise) |
| RssAnon @ before build 5 (MB) | 1487 (1474-1534) | 1407 (1373-1440) | -5.3% (-79.5 MB) |
| RssAnon @ before build 10 (MB) | 2041 (2028-2063) | 1519 (1462-1670) | -25.6% (-521 MB) |

### rebuild-gaps:gap-300ms

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2170 (2157-2206) | 1636 (1589-1715) | -24.6% (-534 MB) |
| process cpu time | 6.77s (6.56s-6.86s) | 6.76s (6.67s-6.92s) | -0.2% (noise) |
| later builds (median) | 243ms (237ms-250ms) | 241ms (238ms-243ms) | -0.8% (noise) |
| first build | 222ms (216ms-227ms) | 223ms (218ms-232ms) | +0.3% (noise) |
| later builds (max) | 269ms (244ms-283ms) | 257ms (249ms-272ms) | -4.5% (noise) |
| RssAnon @ before build 2 (MB) | 1047 (1041-1061) | 1062 (1036-1075) | +1.4% (+14.8 MB, noise) |
| RssAnon @ before build 5 (MB) | 1515 (1500-1555) | 1390 (1362-1434) | -8.3% (-125 MB) |
| RssAnon @ before build 10 (MB) | 1934 (1911-1940) | 1302 (1239-1336) | -32.7% (-632 MB) |

### rebuild-gaps:gap-1s

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2161 (2129-2211) | 1184 (1167-1206) | -45.2% (-977 MB) |
| process cpu time | 6.85s (6.46s-7.01s) | 6.99s (6.83s-7.06s) | +2.0% (noise) |
| later builds (median) | 242ms (234ms-255ms) | 243ms (236ms-246ms) | +0.6% (noise) |
| first build | 218ms (217ms-224ms) | 222ms (218ms-225ms) | +2.1% (noise) |
| later builds (max) | 252ms (242ms-273ms) | 254ms (249ms-266ms) | +0.7% (noise) |
| RssAnon @ before build 2 (MB) | 1072 (1026-1087) | 299 (295-309) | -72.1% (-773 MB) |
| RssAnon @ before build 5 (MB) | 1522 (1469-1548) | 296 (282-304) | -80.6% (-1227 MB) |
| RssAnon @ before build 10 (MB) | 1954 (1903-1979) | 294 (285-296) | -85.0% (-1660 MB) |

### rebuild-gaps:gap-3s

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2187 (2135-2222) | 1187 (1180-1200) | -45.7% (-1000 MB) |
| process cpu time | 7.16s (7.07s-7.33s) | 7.20s (6.88s-7.49s) | +0.6% (noise) |
| later builds (median) | 250ms (248ms-260ms) | 245ms (236ms-248ms) | -2.1% (noise) |
| first build | 222ms (215ms-229ms) | 226ms (216ms-243ms) | +1.8% (noise) |
| later builds (max) | 266ms (260ms-307ms) | 268ms (257ms-276ms) | +0.9% (noise) |
| RssAnon @ before build 2 (MB) | 1059 (1043-1080) | 304 (297-306) | -71.3% (-755 MB) |
| RssAnon @ before build 5 (MB) | 1491 (1382-1518) | 283 (275-303) | -81.0% (-1208 MB) |
| RssAnon @ before build 10 (MB) | 1949 (1913-1985) | 287 (280-322) | -85.3% (-1661 MB) |

## three10x

three.js x10, one build: peak, output held, after GC, idle.

### three10x:plain

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 977 (963-1002) | 969 (963-987) | -0.8% (-7.5 MB, noise) |
| process cpu time | 534ms (525ms-603ms) | 581ms (560ms-618ms) | +8.8% (noise) |
| build | 183ms (178ms-204ms) | 184ms (174ms-191ms) | +1.0% (noise) |
| RssAnon @ output held (MB) | 882 (869-908) | 877 (871-895) | -0.6% (-5.2 MB, noise) |
| RssAnon @ after gc (MB) | 882 (869-908) | 878 (872-895) | -0.6% (-4.9 MB, noise) |
| RssAnon @ idle 2s (MB) | 882 (869-908) | 121 (120-122) | -86.3% (-761 MB) |

### three10x:sourcemap

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1149 (1136-1162) | 1164 (1157-1173) | +1.3% (+14.7 MB, noise) |
| process cpu time | 603ms (597ms-619ms) | 641ms (609ms-673ms) | +6.3% (noise) |
| build | 219ms (218ms-233ms) | 223ms (218ms-228ms) | +2.1% (noise) |
| RssAnon @ output held (MB) | 1073 (1040-1085) | 1048 (1036-1084) | -2.3% (-24.7 MB, noise) |
| RssAnon @ after gc (MB) | 1073 (1040-1085) | 1048 (1036-1084) | -2.3% (-24.8 MB, noise) |
| RssAnon @ idle 2s (MB) | 1073 (1040-1085) | 121 (118-122) | -88.7% (-952 MB) |

### three10x:sourcemap-minify

5 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1220 (1198-1226) | 1212 (1196-1233) | -0.6% (-7.7 MB, noise) |
| process cpu time | 675ms (660ms-704ms) | 713ms (691ms-722ms) | +5.6% (noise) |
| build | 295ms (288ms-296ms) | 291ms (290ms-300ms) | -1.3% (noise) |
| RssAnon @ output held (MB) | 1043 (1035-1096) | 1077 (1048-1106) | +3.2% (+33.8 MB, noise) |
| RssAnon @ after gc (MB) | 1043 (1035-1096) | 1077 (1048-1106) | +3.2% (+33.7 MB, noise) |
| RssAnon @ idle 2s (MB) | 1043 (1035-1096) | 122 (121-123) | -88.3% (-921 MB) |

## issue-11189

Bundled dev rebuilds (synthetic React app, 1,500 modules). Issues: [#11189](https://github.com/rolldown/rolldown/issues/11189).

### issue-11189:bundled

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 951 (937-953) | 452 (434-521) | -52.4% (-499 MB) |
| process cpu time | 1.65s (1.62s-1.67s) | 1.94s (1.78s-2.04s) | +17.2% |
| ready | 525ms (521ms-526ms) | 523ms (511ms-524ms) | -0.4% (noise) |
| RssAnon @ after load (MB) | 359 (347-361) | 286 (277-296) | -20.4% (-73.4 MB) |
| RssAnon @ edit 5 (MB) | 610 (607-616) | 294 (285-319) | -51.7% (-315 MB) |
| RssAnon @ edit 10 (MB) | 719 (712-730) | 297 (294-347) | -58.7% (-422 MB) |
| RssAnon @ edit 15 (MB) | 790 (789-792) | 297 (293-362) | -62.4% (-493 MB) |
| RssAnon @ edit 20 (MB) | 879 (865-883) | 298 (295-325) | -66.1% (-581 MB) |

### issue-11189:unbundled

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 361 (360-550) | 350 (335-360) | -2.9% (-10.3 MB) |
| process cpu time | 2.58s (2.54s-3.08s) | 2.63s (2.55s-2.63s) | +1.8% (noise) |
| ready | 536ms (531ms-537ms) | 535ms (522ms-537ms) | -0.2% (noise) |
| RssAnon @ after load (MB) | 266 (255-465) | 242 (240-256) | -8.9% (-23.7 MB, noise) |
| RssAnon @ edit 5 (MB) | 277 (271-470) | 262 (259-267) | -5.1% (-14.2 MB) |
| RssAnon @ edit 10 (MB) | 279 (273-440) | 263 (258-265) | -5.8% (-16.3 MB) |
| RssAnon @ edit 15 (MB) | 275 (256-453) | 272 (256-275) | -1.0% (-2.7 MB, noise) |
| RssAnon @ edit 20 (MB) | 278 (273-454) | 274 (258-283) | -1.3% (-3.7 MB, noise) |

### issue-11189:bundled-gc

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 892 (875-909) | 455 (440-458) | -49.0% (-437 MB) |
| process cpu time | 2.05s (1.95s-2.05s) | 2.36s (2.31s-2.46s) | +15.5% |
| ready | 520ms (514ms-522ms) | 519ms (513ms-523ms) | -0.2% (noise) |
| RssAnon @ after load (MB) | 366 (365-367) | 292 (292-292) | -20.2% (-73.8 MB) |
| RssAnon @ edit 5 (MB) | 617 (593-619) | 290 (282-292) | -53.0% (-327 MB) |
| RssAnon @ edit 10 (MB) | 695 (673-706) | 292 (282-296) | -58.0% (-403 MB) |
| RssAnon @ edit 15 (MB) | 779 (753-796) | 295 (280-303) | -62.2% (-484 MB) |
| RssAnon @ edit 20 (MB) | 818 (797-838) | 302 (283-302) | -63.1% (-516 MB) |

### issue-11189:bundled-tailwind-leaf

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 471 (467-493) | 475 (474-483) | +0.9% (+4.1 MB, noise) |
| process cpu time | 790ms (790ms-794ms) | 809ms (788ms-869ms) | +2.4% (noise) |
| ready | 522ms (520ms-523ms) | 525ms (520ms-531ms) | +0.6% (noise) |
| RssAnon @ after load (MB) | 390 (386-410) | 307 (306-325) | -21.4% (-83.6 MB) |
| RssAnon @ edit 5 (MB) | 404 (400-426) | 326 (323-329) | -19.3% (-78.1 MB) |
| RssAnon @ edit 10 (MB) | 381 (377-403) | 305 (300-318) | -20.1% (-76.4 MB) |
| RssAnon @ edit 15 (MB) | 380 (377-403) | 317 (313-318) | -16.6% (-63.2 MB) |
| RssAnon @ edit 20 (MB) | 380 (377-403) | 320 (317-324) | -15.9% (-60.6 MB) |

## lobehub

lobehub SPA. Issues: [#9330](https://github.com/rolldown/rolldown/issues/9330).

### lobehub:build

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 6574 (6412-6626) | 6503 (6147-6643) | -1.1% (-70.8 MB, noise) |
| process wall time | 21.85s (21.62s-22.52s) | 21.27s (21.18s-21.66s) | -2.6% (noise) |
| process cpu time | 39.12s (38.51s-42.38s) | 38.17s (37.76s-38.80s) | -2.4% (noise) |

### lobehub:build-sourcemap

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 7489 (7390-7564) | 7347 (6992-7443) | -1.9% (-142 MB, noise) |
| process wall time | 23.46s (23.16s-23.47s) | 23.36s (23.09s-23.58s) | -0.5% (noise) |
| process cpu time | 41.73s (41.34s-41.84s) | 41.99s (41.50s-42.51s) | +0.6% (noise) |

### lobehub:dev

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 4073 (4063-6082) | 3829 (3795-3886) | -6.0% (-244 MB) |
| process cpu time | 55.89s (55.28s-57.10s) | 56.58s (56.01s-57.41s) | +1.2% (noise) |
| ready | 1.96s (1.89s-1.97s) | 1.93s (1.66s-1.93s) | -1.9% (noise) |
| RssAnon @ ready (MB) | 1054 (1049-1106) | 988 (581-1004) | -6.3% (-66.1 MB) |
| RssAnon @ page +25s (MB) | 3724 (3699-4355) | 2126 (1516-2128) | -42.9% (-1598 MB) |
| RssAnon @ idle 30s (MB) | 3749 (3699-4355) | 2126 (1516-2128) | -43.3% (-1623 MB) |

## rolldown-9330-repro

Small #9330 repro, vite dev with @lobehub/ui. Issues: [#9330](https://github.com/rolldown/rolldown/issues/9330).

### rolldown-9330-repro:dev

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2991 (2985-3002) | 2990 (2980-3012) | -0.0% (-1.1 MB, noise) |
| process cpu time | 3.31s (3.12s-4.08s) | 3.17s (3.09s-3.36s) | -4.3% (noise) |
| ready | 521ms (515ms-522ms) | 517ms (515ms-517ms) | -0.8% (noise) |
| RssAnon @ ready (MB) | 1801 (1664-2068) | 2035 (1800-2067) | +13.0% (+233 MB, noise) |
| RssAnon @ page +25s (MB) | 2893 (2888-2905) | 979 (970-980) | -66.1% (-1913 MB) |
| RssAnon @ idle 30s (MB) | 2893 (2888-2905) | 979 (970-980) | -66.1% (-1913 MB) |

## vinext

vinext, Next.js on Vite.

### vinext:build

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1222 (1175-1285) | 1228 (1189-1231) | +0.5% (+6.0 MB, noise) |
| process wall time | 1.15s (1.15s-1.39s) | 1.15s (1.15s-1.16s) | -0.2% (noise) |
| process cpu time | 2.00s (1.99s-2.21s) | 2.00s (1.99s-2.04s) | -0.2% (noise) |

### vinext:playground-build

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1971 (1952-2147) | 1942 (1918-2049) | -1.5% (-29.8 MB, noise) |
| process wall time | 3.41s (3.37s-23.97s) | 3.45s (3.38s-3.46s) | +1.2% (noise) |
| process cpu time | 5.82s (5.69s-6.10s) | 5.79s (5.71s-5.83s) | -0.4% (noise) |

## vue-vben-admin

vue-vben-admin, the web-antd app.

### vue-vben-admin:build

3 rounds.

|  | base | pr-11655 | pr-11655 vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2394 (2388-2428) | 2367 (2357-2391) | -1.1% (-27.2 MB, noise) |
| process wall time | 2.39s (2.37s-3.05s) | 2.39s (2.38s-2.46s) | +0.1% (noise) |
| process cpu time | 4.71s (4.63s-5.35s) | 4.69s (4.67s-4.81s) | -0.2% (noise) |
