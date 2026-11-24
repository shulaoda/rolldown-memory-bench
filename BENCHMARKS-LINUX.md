# Benchmarks

`just bench` writes this file after every run, and `just report <results.json> ...` writes it again from saved runs.

- Machine: linux arm64 (7.2.12-orbstack-00394-gbecdd6130068), unknown, 13 cores, 16 GB, Node v22.22.1, transparent huge pages `madvise`
- Run 2026-11-24 05:27 UTC: `just bench all --bin base=/Users/shulaoda/workspace/voidzero/rolldown-wt-base --bin pr=/Users/shulaoda/workspace/voidzero/rolldown-memory-reclaim --out BENCHMARKS-LINUX.md`
- Run 2026-11-24 07:41 UTC: `just bench lobehub:build-sourcemap --rounds 9 --bin base=/Users/shulaoda/workspace/voidzero/rolldown-wt-base --bin pr=/Users/shulaoda/workspace/voidzero/rolldown-memory-reclaim --out /private/tmp/claude-501/-Users-shulaoda-workspace-voidzero-rolldown/0d96d600-5850-4860-a1fc-044942e0aa9f/scratchpad/newbench/linux-sm9.md`
- Memory: `RssAnon`, peak: the highest `VmHWM` of the process. Numbers compare only on the same machine.
- Load average (1 min) when a run started: 0.1 to 3.8, on 13 cores

| Bin | rolldown | From | Commit |
| --- | --- | --- | --- |
| base | 1.3.3 | repo `/Users/shulaoda/workspace/voidzero/rolldown-wt-base` | ab231fbad5 |
| pr | 1.3.3 | repo `/Users/shulaoda/workspace/voidzero/rolldown-memory-reclaim` | 12b8d0663a |

Every number is the median over the rounds, with the range in parentheses. A change is from `base`. A change marked noise is not a clear difference: its ranges overlap, or a side has fewer than 3 rounds.

## Summary

| Case | Peak | CPU time | Time | Memory at the last mark |
| --- | ---: | ---: | ---: | ---: |
| held-outputs:sourcemap | -20.1% (-444 MB) | +2.0% (noise) | all builds: -1.7% (noise) | idle 2s: -93.7% (-1987 MB) |
| held-outputs:plain | -18.8% (-273 MB) | +0.5% (noise) | all builds: -0.3% (noise) | idle 2s: -90.3% (-1216 MB) |
| issue-10985-tight-loop:close | -49.6% (-579 MB) | +0.5% (noise) | all builds: -0.6% (noise) | idle 5s: -89.0% (-983 MB) |
| issue-10985-tight-loop:generate | -49.5% (-576 MB) | -0.2% (noise) | all builds: -0.1% (noise) | idle 5s: -89.0% (-979 MB) |
| issue-11143-api-idle:6-builds | -19.7% (-378 MB) | +3.1% | all builds: +2.2% (noise) | idle 12s: -89.2% (-1607 MB) |
| issue-11143-api-idle:1-build | -20.4% (-239 MB) | -1.5% (noise) | all builds: -2.7% (noise) | idle 12s: -85.1% (-875 MB) |
| issue-11233-optimizer-threads:default-threads | -28.1% (-220 MB) | -3.6% (noise) | build: -3.5% (noise) | idle 10s: -82.9% (-574 MB) |
| issue-11233-optimizer-threads:4-threads | -24.4% (-147 MB) | 0.0% (noise) | build: +0.8% (noise) | idle 10s: -86.0% (-432 MB) |
| many-chunks:plain | -22.8% (-221 MB) | +6.0% (noise) | build: -1.0% (noise) | idle 2s: -83.5% (-757 MB) |
| many-chunks:sourcemap | -27.5% (-302 MB) | +1.6% (noise) | build: +2.2% (noise) | idle 2s: -85.3% (-885 MB) |
| rebuild-gaps:gap-0 | -44.2% (-989 MB) | +1.6% (noise) | later builds (median): +0.8% (noise) | before build 10: -45.2% (-918 MB) |
| rebuild-gaps:gap-300ms | -42.3% (-905 MB) | +1.2% (noise) | later builds (median): -1.4% (noise) | before build 10: -52.3% (-1005 MB) |
| rebuild-gaps:gap-1s | -50.4% (-942 MB) | +2.8% (noise) | later builds (median): -1.7% (noise) | before build 10: -81.0% (-1172 MB) |
| rebuild-gaps:gap-3s | -50.4% (-940 MB) | +4.7% (noise) | later builds (median): +0.4% (noise) | before build 10: -82.9% (-1316 MB) |
| three10x:plain | -19.4% (-188 MB) | +4.4% (noise) | build: -0.7% (noise) | idle 2s: -85.6% (-739 MB) |
| three10x:sourcemap | -22.4% (-252 MB) | +3.4% (noise) | build: -1.8% (noise) | idle 2s: -87.9% (-897 MB) |
| three10x:sourcemap-minify | -20.2% (-234 MB) | +4.2% (noise) | build: -1.3% (noise) | idle 2s: -88.2% (-906 MB) |
| issue-11189:bundled | -58.7% (-552 MB) | +15.8% | ready: -0.6% (noise) | edit 20: -69.5% (-602 MB) |
| issue-11189:unbundled | -2.9% (-10.1 MB, noise) | -0.4% (noise) | ready: +1.5% (noise) | edit 20: +0.5% (+1.3 MB, noise) |
| issue-11189:bundled-gc | -55.5% (-504 MB) | +15.1% | ready: +1.6% (noise) | edit 20: -66.2% (-548 MB) |
| issue-11189:bundled-tailwind-leaf | -17.7% (-87.0 MB) | +12.6% (noise) | ready: +1.4% (noise) | edit 20: -30.7% (-124 MB) |
| lobehub:build | -16.8% (-1016 MB) | +0.3% (noise) | process wall time: +1.0% (noise) | - |
| lobehub:build-sourcemap | -15.8% (-1122 MB) | -0.5% (noise) | process wall time: -0.8% (noise) | - |
| lobehub:dev | -24.7% (-965 MB) | -0.4% (noise) | ready: +0.2% (noise) | idle 270s: -60.2% (-1680 MB) |
| lobehub:dev-warm | -10.4% (-233 MB) | -1.0% (noise) | ready: -1.2% (noise) | idle 270s: -8.8% (-85.1 MB) |
| rolldown-9330-repro:dev | -26.5% (-746 MB) | +0.8% (noise) | ready: +0.4% (noise) | idle 90s: -77.0% (-1705 MB) |
| vinext:build | -30.6% (-345 MB) | +1.2% (noise) | process wall time: -0.8% (noise) | - |
| vinext:playground-build | -16.8% (-341 MB) | -10.8% | process wall time: -11.0% | - |
| vue-vben-admin:build | -19.4% (-421 MB) | +1.5% (noise) | process wall time: +3.1% (noise) | - |

## held-outputs

three.js x10, 10 back-to-back builds that keep their outputs (dashboard shape).

### held-outputs:sourcemap

5 rounds, load 0.3 to 0.5.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2212 (2194-2267) | 1768 (1750-1797) | -20.1% (-444 MB) |
| process cpu time | 5.64s (5.59s-5.94s) | 5.75s (5.73s-5.83s) | +2.0% (noise) |
| all builds | 2.24s (2.20s-2.34s) | 2.20s (2.18s-2.26s) | -1.7% (noise) |
| RssAnon @ 10 outputs held (MB) | 2122 (2074-2136) | 1639 (1609-1662) | -22.7% (-482 MB) |
| RssAnon @ after gc (MB) | 2122 (2074-2136) | 1639 (1609-1662) | -22.7% (-483 MB) |
| RssAnon @ idle 2s (MB) | 2122 (2074-2136) | 135 (127-140) | -93.7% (-1987 MB) |

### held-outputs:plain

5 rounds, load 1.5 to 2.2.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1454 (1412-1533) | 1180 (1164-1220) | -18.8% (-273 MB) |
| process cpu time | 4.99s (4.94s-5.17s) | 5.01s (5.01s-5.18s) | +0.5% (noise) |
| all builds | 1.80s (1.78s-1.87s) | 1.79s (1.78s-1.80s) | -0.3% (noise) |
| RssAnon @ 10 outputs held (MB) | 1347 (1305-1426) | 1074 (1057-1114) | -20.3% (-273 MB) |
| RssAnon @ after gc (MB) | 1347 (1305-1427) | 1074 (1057-1114) | -20.3% (-273 MB) |
| RssAnon @ idle 2s (MB) | 1347 (1305-1427) | 131 (130-135) | -90.3% (-1216 MB) |

## issue-10985-tight-loop

Memory across 150 builds in a tight loop, then idle. Issues: [#10985](https://github.com/rolldown/rolldown/issues/10985), [#10984](https://github.com/rolldown/rolldown/issues/10984).

### issue-10985-tight-loop:close

5 rounds, load 1 to 1.8.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1167 (1149-1193) | 588 (584-618) | -49.6% (-579 MB) |
| process cpu time | 8.11s (7.99s-8.19s) | 8.14s (8.09s-8.27s) | +0.5% (noise) |
| all builds | 3.34s (3.32s-3.40s) | 3.32s (3.30s-3.35s) | -0.6% (noise) |
| RssAnon @ build 25 (MB) | 883 (876-960) | 461 (440-489) | -47.8% (-422 MB) |
| RssAnon @ build 50 (MB) | 995 (987-1054) | 500 (497-525) | -49.8% (-496 MB) |
| RssAnon @ build 75 (MB) | 1046 (1030-1084) | 500 (497-533) | -52.2% (-546 MB) |
| RssAnon @ build 100 (MB) | 1072 (1052-1112) | 512 (497-543) | -52.3% (-560 MB) |
| RssAnon @ build 125 (MB) | 1093 (1076-1124) | 526 (522-554) | -51.9% (-568 MB) |
| RssAnon @ build 150 (MB) | 1104 (1086-1130) | 526 (522-556) | -52.4% (-578 MB) |
| RssAnon @ idle 5s (MB) | 1104 (1086-1130) | 121 (121-123) | -89.0% (-983 MB) |

### issue-10985-tight-loop:generate

5 rounds, load 0.7 to 2.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1163 (1143-1169) | 587 (584-620) | -49.5% (-576 MB) |
| process cpu time | 8.17s (8.13s-8.23s) | 8.15s (8.04s-8.24s) | -0.2% (noise) |
| all builds | 3.36s (3.33s-3.40s) | 3.35s (3.30s-3.40s) | -0.1% (noise) |
| RssAnon @ build 25 (MB) | 893 (859-926) | 468 (442-471) | -47.6% (-425 MB) |
| RssAnon @ build 50 (MB) | 997 (964-1028) | 514 (505-523) | -48.5% (-484 MB) |
| RssAnon @ build 75 (MB) | 1039 (1017-1068) | 523 (521-546) | -49.7% (-516 MB) |
| RssAnon @ build 100 (MB) | 1061 (1053-1078) | 525 (522-546) | -50.6% (-537 MB) |
| RssAnon @ build 125 (MB) | 1074 (1069-1094) | 525 (522-546) | -51.2% (-550 MB) |
| RssAnon @ build 150 (MB) | 1100 (1080-1106) | 525 (522-558) | -52.3% (-575 MB) |
| RssAnon @ idle 5s (MB) | 1100 (1080-1106) | 121 (120-134) | -89.0% (-979 MB) |

## issue-11143-api-idle

API builds with in-memory files and maps, then outputs dropped and idle. Issues: [#11143](https://github.com/rolldown/rolldown/issues/11143).

### issue-11143-api-idle:6-builds

5 rounds, load 0.4 to 2.2.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1921 (1873-1978) | 1543 (1521-1576) | -19.7% (-378 MB) |
| process cpu time | 4.02s (4.00s-4.06s) | 4.15s (4.09s-4.53s) | +3.1% |
| all builds | 1.78s (1.75s-1.84s) | 1.82s (1.76s-2.00s) | +2.2% (noise) |
| RssAnon @ before builds (MB) | 124 (122-125) | 124 (123-124) | -0.1% (-0.1 MB, noise) |
| RssAnon @ outputs held (MB) | 1802 (1764-1869) | 1415 (1397-1477) | -21.5% (-387 MB) |
| RssAnon @ idle 1.5s (MB) | 1802 (1764-1869) | 194 (191-198) | -89.3% (-1608 MB) |
| RssAnon @ idle 4s (MB) | 1802 (1764-1869) | 195 (191-205) | -89.2% (-1607 MB) |
| RssAnon @ idle 12s (MB) | 1802 (1764-1869) | 195 (191-208) | -89.2% (-1607 MB) |

### issue-11143-api-idle:1-build

5 rounds, load 0.1 to 0.3.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1170 (1159-1202) | 931 (930-947) | -20.4% (-239 MB) |
| process cpu time | 955ms (886ms-968ms) | 941ms (929ms-988ms) | -1.5% (noise) |
| all builds | 314ms (294ms-326ms) | 305ms (297ms-311ms) | -2.7% (noise) |
| RssAnon @ before builds (MB) | 123 (123-124) | 123 (123-124) | +0.1% (+0.1 MB, noise) |
| RssAnon @ outputs held (MB) | 1063 (1052-1093) | 799 (787-841) | -24.8% (-264 MB) |
| RssAnon @ idle 1.5s (MB) | 1063 (1052-1093) | 188 (182-190) | -82.3% (-874 MB) |
| RssAnon @ idle 4s (MB) | 1063 (1052-1093) | 188 (182-190) | -82.3% (-874 MB) |
| RssAnon @ idle 12s (MB) | 1028 (1017-1058) | 153 (146-154) | -85.1% (-875 MB) |

## issue-11233-optimizer-threads

One optimizer-like pass over typescript, codemirror and vue, then idle. Issues: [#11233](https://github.com/rolldown/rolldown/issues/11233).

### issue-11233-optimizer-threads:default-threads

5 rounds, load 0.1 to 0.1.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 782 (731-791) | 562 (540-581) | -28.1% (-220 MB) |
| process cpu time | 503ms (458ms-524ms) | 485ms (468ms-514ms) | -3.6% (noise) |
| build | 271ms (258ms-287ms) | 262ms (255ms-289ms) | -3.5% (noise) |
| RssAnon @ output held (MB) | 696 (650-711) | 471 (454-508) | -32.3% (-225 MB) |
| RssAnon @ idle 2s (MB) | 697 (651-711) | 122 (120-125) | -82.4% (-574 MB) |
| RssAnon @ idle 10s (MB) | 692 (647-707) | 118 (116-128) | -82.9% (-574 MB) |

### issue-11233-optimizer-threads:4-threads

5 rounds, load 0.1 to 0.2.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 603 (585-620) | 456 (442-476) | -24.4% (-147 MB) |
| process cpu time | 476ms (460ms-489ms) | 476ms (455ms-486ms) | 0.0% (noise) |
| build | 261ms (252ms-273ms) | 264ms (254ms-271ms) | +0.8% (noise) |
| RssAnon @ output held (MB) | 506 (500-531) | 378 (366-401) | -25.2% (-128 MB) |
| RssAnon @ idle 2s (MB) | 507 (500-532) | 73.8 (68.2-75.4) | -85.4% (-433 MB) |
| RssAnon @ idle 10s (MB) | 503 (496-528) | 70.2 (64.2-71.3) | -86.0% (-432 MB) |

## many-chunks

three.js x10 with one dynamic import per file (about 3,700 chunks), one build.

### many-chunks:plain

5 rounds, load 0.1 to 0.1.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 969 (958-984) | 749 (743-767) | -22.8% (-221 MB) |
| process cpu time | 811ms (777ms-846ms) | 860ms (841ms-873ms) | +6.0% (noise) |
| build | 160ms (156ms-167ms) | 158ms (157ms-163ms) | -1.0% (noise) |
| chunks | 3692 (3692-3692) | 3692 (3692-3692) | 0.0% (noise) |
| RssAnon @ output held (MB) | 905 (894-920) | 685 (678-702) | -24.3% (-220 MB) |
| RssAnon @ after gc (MB) | 906 (895-921) | 686 (680-704) | -24.3% (-220 MB) |
| RssAnon @ idle 2s (MB) | 906 (895-921) | 149 (143-150) | -83.5% (-757 MB) |

### many-chunks:sourcemap

5 rounds, load 0.2 to 0.2.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1101 (1092-1119) | 799 (792-818) | -27.5% (-302 MB) |
| process cpu time | 932ms (893ms-939ms) | 947ms (929ms-1.03s) | +1.6% (noise) |
| build | 184ms (182ms-187ms) | 188ms (187ms-197ms) | +2.2% (noise) |
| chunks | 3692 (3692-3692) | 3692 (3692-3692) | 0.0% (noise) |
| RssAnon @ output held (MB) | 1032 (1025-1053) | 733 (727-753) | -29.0% (-300 MB) |
| RssAnon @ after gc (MB) | 1038 (1029-1056) | 736 (730-756) | -29.1% (-302 MB) |
| RssAnon @ idle 2s (MB) | 1038 (1029-1056) | 153 (152-155) | -85.3% (-885 MB) |

## rebuild-gaps

three.js x10 with sourcemap, 10 builds with a pause between them.

### rebuild-gaps:gap-0

5 rounds, load 0.1 to 0.6.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2239 (2180-2246) | 1250 (1221-1292) | -44.2% (-989 MB) |
| process cpu time | 5.55s (5.48s-5.72s) | 5.64s (5.56s-5.66s) | +1.6% (noise) |
| later builds (median) | 214ms (212ms-219ms) | 216ms (214ms-217ms) | +0.8% (noise) |
| first build | 214ms (210ms-229ms) | 216ms (213ms-218ms) | +0.8% (noise) |
| later builds (max) | 231ms (219ms-247ms) | 222ms (219ms-229ms) | -4.0% (noise) |
| RssAnon @ before build 2 (MB) | 1029 (1005-1048) | 741 (741-743) | -28.0% (-288 MB) |
| RssAnon @ before build 5 (MB) | 1444 (1440-1487) | 1046 (1018-1075) | -27.6% (-398 MB) |
| RssAnon @ before build 10 (MB) | 2032 (1905-2040) | 1114 (1086-1157) | -45.2% (-918 MB) |

### rebuild-gaps:gap-300ms

5 rounds, load 0.6 to 3.2.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2140 (2115-2166) | 1235 (1194-1255) | -42.3% (-905 MB) |
| process cpu time | 6.72s (6.71s-7.29s) | 6.80s (6.67s-7.17s) | +1.2% (noise) |
| later builds (median) | 239ms (232ms-242ms) | 236ms (233ms-239ms) | -1.4% (noise) |
| first build | 217ms (212ms-239ms) | 215ms (211ms-224ms) | -0.7% (noise) |
| later builds (max) | 248ms (239ms-315ms) | 243ms (238ms-251ms) | -1.9% (noise) |
| RssAnon @ before build 2 (MB) | 1018 (997-1025) | 737 (717-788) | -27.6% (-281 MB) |
| RssAnon @ before build 5 (MB) | 1476 (1447-1531) | 1056 (1012-1079) | -28.4% (-420 MB) |
| RssAnon @ before build 10 (MB) | 1920 (1888-1922) | 915 (897-921) | -52.3% (-1005 MB) |

### rebuild-gaps:gap-1s

5 rounds, load 1.8 to 3.8.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1869 (1846-1920) | 927 (916-933) | -50.4% (-942 MB) |
| process cpu time | 6.92s (6.85s-7.13s) | 7.11s (6.77s-7.14s) | +2.8% (noise) |
| later builds (median) | 243ms (230ms-245ms) | 238ms (237ms-243ms) | -1.7% (noise) |
| first build | 218ms (211ms-270ms) | 219ms (217ms-238ms) | +0.6% (noise) |
| later builds (max) | 255ms (246ms-260ms) | 247ms (242ms-253ms) | -3.1% (noise) |
| RssAnon @ before build 2 (MB) | 1015 (997-1042) | 278 (274-283) | -72.6% (-737 MB) |
| RssAnon @ before build 5 (MB) | 1499 (1429-1504) | 271 (270-279) | -81.9% (-1228 MB) |
| RssAnon @ before build 10 (MB) | 1447 (1368-1511) | 275 (264-282) | -81.0% (-1172 MB) |

### rebuild-gaps:gap-3s

5 rounds, load 0.1 to 1.5.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1866 (1820-1882) | 926 (916-927) | -50.4% (-940 MB) |
| process cpu time | 6.81s (6.76s-7.07s) | 7.13s (6.73s-7.30s) | +4.7% (noise) |
| later builds (median) | 234ms (231ms-238ms) | 235ms (234ms-243ms) | +0.4% (noise) |
| first build | 219ms (210ms-242ms) | 218ms (208ms-224ms) | -0.4% (noise) |
| later builds (max) | 249ms (243ms-252ms) | 255ms (248ms-260ms) | +2.2% (noise) |
| RssAnon @ before build 2 (MB) | 1035 (1029-1045) | 276 (270-281) | -73.3% (-759 MB) |
| RssAnon @ before build 5 (MB) | 1308 (1283-1333) | 271 (270-280) | -79.3% (-1038 MB) |
| RssAnon @ before build 10 (MB) | 1588 (1566-1626) | 272 (267-277) | -82.9% (-1316 MB) |

## three10x

three.js x10, one build: peak, output held, after GC, idle.

### three10x:plain

5 rounds, load 0.1 to 0.1.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 967 (950-979) | 779 (774-787) | -19.4% (-188 MB) |
| process cpu time | 589ms (579ms-596ms) | 615ms (582ms-654ms) | +4.4% (noise) |
| build | 174ms (172ms-185ms) | 172ms (171ms-184ms) | -0.7% (noise) |
| RssAnon @ output held (MB) | 863 (845-875) | 677 (672-685) | -21.6% (-186 MB) |
| RssAnon @ after gc (MB) | 863 (845-875) | 677 (672-685) | -21.6% (-186 MB) |
| RssAnon @ idle 2s (MB) | 863 (845-875) | 124 (123-126) | -85.6% (-739 MB) |

### three10x:sourcemap

5 rounds.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1126 (1099-1142) | 874 (873-896) | -22.4% (-252 MB) |
| process cpu time | 639ms (623ms-687ms) | 661ms (621ms-701ms) | +3.4% (noise) |
| build | 215ms (207ms-236ms) | 212ms (207ms-221ms) | -1.8% (noise) |
| RssAnon @ output held (MB) | 1020 (993-1035) | 763 (742-791) | -25.2% (-257 MB) |
| RssAnon @ after gc (MB) | 1020 (993-1036) | 763 (742-791) | -25.2% (-257 MB) |
| RssAnon @ idle 2s (MB) | 1020 (993-1036) | 123 (122-126) | -87.9% (-897 MB) |

### three10x:sourcemap-minify

5 rounds, load 1.1 to 1.3.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1162 (1152-1178) | 928 (924-945) | -20.2% (-234 MB) |
| process cpu time | 709ms (701ms-802ms) | 739ms (724ms-822ms) | +4.2% (noise) |
| build | 286ms (283ms-308ms) | 282ms (279ms-293ms) | -1.3% (noise) |
| RssAnon @ output held (MB) | 1027 (1012-1040) | 751 (748-770) | -26.9% (-276 MB) |
| RssAnon @ after gc (MB) | 1028 (1012-1040) | 751 (749-771) | -26.9% (-276 MB) |
| RssAnon @ idle 2s (MB) | 1028 (1012-1040) | 122 (121-124) | -88.2% (-906 MB) |

## issue-11189

Bundled dev rebuilds (synthetic React app, 1,500 modules). Issues: [#11189](https://github.com/rolldown/rolldown/issues/11189).

### issue-11189:bundled

3 rounds, load 0.1 to 0.6.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 941 (927-967) | 389 (382-395) | -58.7% (-552 MB) |
| process cpu time | 1.81s (1.79s-1.90s) | 2.09s (2.07s-2.33s) | +15.8% |
| ready | 521ms (517ms-522ms) | 518ms (511ms-518ms) | -0.6% (noise) |
| crawled urls | 2 (2-2) | 2 (2-2) | 0.0% (noise) |
| RssAnon @ after load (MB) | 388 (369-393) | 260 (254-264) | -33.0% (-128 MB) |
| RssAnon @ edit 5 (MB) | 605 (598-609) | 246 (232-251) | -59.4% (-359 MB) |
| RssAnon @ edit 10 (MB) | 732 (723-747) | 259 (252-270) | -64.7% (-474 MB) |
| RssAnon @ edit 15 (MB) | 832 (793-846) | 283 (247-284) | -66.0% (-549 MB) |
| RssAnon @ edit 20 (MB) | 866 (852-894) | 264 (263-280) | -69.5% (-602 MB) |

### issue-11189:unbundled

3 rounds, load 0.1 to 0.2.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 346 (333-349) | 335 (329-341) | -2.9% (-10.1 MB, noise) |
| process cpu time | 3.39s (3.24s-3.40s) | 3.38s (3.33s-3.44s) | -0.4% (noise) |
| ready | 521ms (518ms-528ms) | 529ms (528ms-534ms) | +1.5% (noise) |
| crawled urls | 1542 (1542-1542) | 1542 (1542-1542) | 0.0% (noise) |
| RssAnon @ after load (MB) | 235 (223-238) | 219 (217-221) | -6.7% (-15.7 MB) |
| RssAnon @ edit 5 (MB) | 247 (238-250) | 240 (235-247) | -3.0% (-7.3 MB, noise) |
| RssAnon @ edit 10 (MB) | 249 (238-252) | 240 (237-248) | -3.5% (-8.8 MB, noise) |
| RssAnon @ edit 15 (MB) | 238 (237-249) | 243 (240-251) | +2.3% (+5.5 MB, noise) |
| RssAnon @ edit 20 (MB) | 244 (225-251) | 246 (245-251) | +0.5% (+1.3 MB, noise) |

### issue-11189:bundled-gc

3 rounds, load 0.1 to 1.1.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 909 (840-951) | 404 (394-409) | -55.5% (-504 MB) |
| process cpu time | 2.08s (2.07s-2.18s) | 2.40s (2.29s-2.41s) | +15.1% |
| ready | 516ms (514ms-521ms) | 524ms (519ms-527ms) | +1.6% (noise) |
| crawled urls | 2 (2-2) | 2 (2-2) | 0.0% (noise) |
| RssAnon @ after load (MB) | 373 (366-374) | 250 (250-254) | -32.8% (-122 MB) |
| RssAnon @ edit 5 (MB) | 576 (547-605) | 255 (250-255) | -55.7% (-321 MB) |
| RssAnon @ edit 10 (MB) | 701 (665-727) | 268 (262-290) | -61.8% (-433 MB) |
| RssAnon @ edit 15 (MB) | 755 (728-818) | 261 (258-263) | -65.4% (-494 MB) |
| RssAnon @ edit 20 (MB) | 828 (764-871) | 280 (275-282) | -66.2% (-548 MB) |

### issue-11189:bundled-tailwind-leaf

3 rounds, load 0.1 to 0.5.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 492 (484-514) | 405 (398-406) | -17.7% (-87.0 MB) |
| process cpu time | 1.05s (976ms-1.15s) | 1.19s (1.05s-1.21s) | +12.6% (noise) |
| ready | 511ms (509ms-517ms) | 518ms (513ms-524ms) | +1.4% (noise) |
| crawled urls | 7 (7-7) | 7 (7-7) | 0.0% (noise) |
| RssAnon @ after load (MB) | 416 (410-439) | 287 (285-288) | -31.0% (-129 MB) |
| RssAnon @ edit 5 (MB) | 403 (399-423) | 264 (262-270) | -34.6% (-140 MB) |
| RssAnon @ edit 10 (MB) | 404 (400-424) | 264 (264-270) | -34.5% (-139 MB) |
| RssAnon @ edit 15 (MB) | 404 (400-424) | 270 (264-275) | -33.1% (-134 MB) |
| RssAnon @ edit 20 (MB) | 404 (400-424) | 280 (265-286) | -30.7% (-124 MB) |

## lobehub

lobehub SPA. Issues: [#9330](https://github.com/rolldown/rolldown/issues/9330).

### lobehub:build

3 rounds, load 1 to 2.7.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 6061 (5958-6128) | 5045 (4969-5050) | -16.8% (-1016 MB) |
| process wall time | 24.84s (24.65s-25.69s) | 25.08s (24.79s-25.59s) | +1.0% (noise) |
| process cpu time | 44.49s (44.21s-45.57s) | 44.63s (44.40s-45.38s) | +0.3% (noise) |

### lobehub:build-sourcemap

9 rounds, load 1.6 to 2.6.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 7109 (6831-7890) | 5988 (5483-6416) | -15.8% (-1122 MB) |
| process wall time | 27.64s (27.17s-28.48s) | 27.43s (27.06s-27.86s) | -0.8% (noise) |
| process cpu time | 48.65s (47.82s-50.59s) | 48.42s (47.95s-49.39s) | -0.5% (noise) |

### lobehub:dev

3 rounds, load 0.1 to 1.6.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 3913 (3898-3957) | 2948 (2928-2961) | -24.7% (-965 MB) |
| process cpu time | 62.95s (62.82s-63.13s) | 62.72s (62.46s-63.07s) | -0.4% (noise) |
| ready | 2.72s (1.71s-2.72s) | 2.72s (2.69s-2.77s) | +0.2% (noise) |
| page load | 14.53s (14.26s-15.17s) | 14.36s (14.24s-14.70s) | -1.2% (noise) |
| page requests | 10536 (10534-10541) | 10526 (10221-10569) | -0.1% (noise) |
| failed requests | 6 (6-7) | 6 (6-6) | 0.0% (noise) |
| RssAnon @ ready (MB) | 1325 (497-1381) | 1247 (1153-1257) | -5.9% (-77.6 MB, noise) |
| RssAnon @ page closed (MB) | 3682 (3654-3729) | 1912 (1858-2850) | -48.1% (-1771 MB) |
| RssAnon @ idle 90s (MB) | 2701 (2670-2819) | 1010 (974-1055) | -62.6% (-1691 MB) |
| RssAnon @ idle 180s (MB) | 2703 (2670-2845) | 1015 (1003-1143) | -62.4% (-1688 MB) |
| RssAnon @ idle 270s (MB) | 2792 (2720-2913) | 1112 (1091-1244) | -60.2% (-1680 MB) |

### lobehub:dev-warm

3 rounds.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2234 (2039-3048) | 2001 (1908-2005) | -10.4% (-233 MB) |
| process cpu time | 52.35s (51.95s-52.99s) | 51.85s (51.47s-53.43s) | -1.0% (noise) |
| ready | 1.46s (1.45s-1.48s) | 1.44s (1.43s-1.48s) | -1.2% (noise) |
| page load | 11.59s (11.39s-11.66s) | 11.52s (11.36s-11.73s) | -0.6% (noise) |
| page requests | 10459 (10174-10539) | 10582 (10529-10637) | +1.2% (noise) |
| failed requests | 6 (6-6) | 6 (6-6) | 0.0% (noise) |
| RssAnon @ ready (MB) | 484 (479-495) | 406 (391-417) | -16.1% (-78.2 MB) |
| RssAnon @ page closed (MB) | 2145 (1959-2967) | 1914 (1804-1920) | -10.8% (-231 MB) |
| RssAnon @ idle 90s (MB) | 967 (941-1014) | 856 (848-877) | -11.5% (-111 MB) |
| RssAnon @ idle 180s (MB) | 962 (954-967) | 867 (848-877) | -9.8% (-94.5 MB) |
| RssAnon @ idle 270s (MB) | 962 (957-967) | 877 (867-884) | -8.8% (-85.1 MB) |

## rolldown-9330-repro

Small #9330 repro, vite dev with @lobehub/ui. Issues: [#9330](https://github.com/rolldown/rolldown/issues/9330).

### rolldown-9330-repro:dev

3 rounds, load 0.1 to 0.1.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2814 (2776-2838) | 2067 (2012-2087) | -26.5% (-746 MB) |
| process cpu time | 3.57s (3.53s-3.71s) | 3.59s (3.49s-3.79s) | +0.8% (noise) |
| ready | 522ms (513ms-523ms) | 524ms (522ms-525ms) | +0.4% (noise) |
| page load | 1.28s (1.22s-1.33s) | 1.27s (1.25s-1.42s) | -0.5% (noise) |
| page requests | 7 (7-7) | 7 (7-7) | 0.0% (noise) |
| failed requests | 0 (0-0) | 0 (0-0) | - |
| RssAnon @ ready (MB) | 1586 (1549-1595) | 1313 (1308-1315) | -17.2% (-273 MB) |
| RssAnon @ page closed (MB) | 2212 (2172-2233) | 412 (405-427) | -81.4% (-1801 MB) |
| RssAnon @ idle 90s (MB) | 2212 (2172-2233) | 508 (492-533) | -77.0% (-1705 MB) |

## vinext

vinext, Next.js on Vite.

### vinext:build

3 rounds, load 1 to 1.1.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 1129 (1099-1130) | 784 (777-802) | -30.6% (-345 MB) |
| process wall time | 1.44s (1.42s-1.44s) | 1.43s (1.42s-1.45s) | -0.8% (noise) |
| process cpu time | 2.46s (2.46s-2.54s) | 2.50s (2.45s-2.55s) | +1.2% (noise) |

### vinext:playground-build

3 rounds, load 1.1 to 1.7.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2032 (2025-2244) | 1691 (1656-1709) | -16.8% (-341 MB) |
| process wall time | 4.83s (4.74s-4.86s) | 4.30s (4.28s-4.32s) | -11.0% |
| process cpu time | 8.09s (7.97s-8.15s) | 7.22s (7.16s-7.28s) | -10.8% |

## vue-vben-admin

vue-vben-admin, the web-antd app.

### vue-vben-admin:build

3 rounds, load 1.6 to 1.8.

|  | base | pr | pr vs base |
| --- | ---: | ---: | ---: |
| peak VmHWM (MB) | 2164 (2150-2199) | 1743 (1699-1755) | -19.4% (-421 MB) |
| process wall time | 3.05s (3.05s-3.09s) | 3.15s (3.06s-3.20s) | +3.1% (noise) |
| process cpu time | 6.19s (6.11s-6.28s) | 6.28s (6.20s-6.39s) | +1.5% (noise) |
