import { ch16 } from "../../../../data/ch16";
import { TRY_LINES, ch17 } from "../../../../data/ch17";
import { FOLD_TABLE, ch18 } from "../../../../data/ch18";
import { ch19 } from "../../../../data/ch19";
import { GRADED, ch20 } from "../../../../data/ch20";
import { ch21 } from "../../../../data/ch21";
import { RUNS, ch22 } from "../../../../data/ch22";
import { ch23 } from "../../../../data/ch23";
import { ONLY_A, ch24 } from "../../../../data/ch24";
import { ch25 } from "../../../../data/ch25";
import { ch26 } from "../../../../data/ch26";
import { TOOLS2, ch27 } from "../../../../data/ch27";
import { DATASETS } from "../../../../data/part2-boss";
import { FEATURES, SPICE_PTS, STORES } from "../../../../data/part2-toy";
import type { BuiltChapter } from "../../../../scenes/built";
import { Ch16Scene } from "../../../../scenes/Ch16Scene";
import { Ch17Scene } from "../../../../scenes/Ch17Scene";
import { Ch18Scene } from "../../../../scenes/Ch18Scene";
import { Ch19Scene } from "../../../../scenes/Ch19Scene";
import { Ch20Scene } from "../../../../scenes/Ch20Scene";
import { Ch21Scene } from "../../../../scenes/Ch21Scene";
import { Ch22Scene } from "../../../../scenes/Ch22Scene";
import { Ch23Scene } from "../../../../scenes/Ch23Scene";
import { Ch24Scene } from "../../../../scenes/Ch24Scene";
import { Ch25Scene } from "../../../../scenes/Ch25Scene";
import { Ch26Scene } from "../../../../scenes/Ch26Scene";
import { Ch27Scene } from "../../../../scenes/Ch27Scene";

// Part 2 chapters in chapter order. Owned by the Part 2 build; see CHAPTER_GUIDE.md.
export const PART2: BuiltChapter[] = [
  { spec: ch16, Scene: Ch16Scene, corpus: [FEATURES, STORES, "辣度 排队 价格"] },
  { spec: ch17, Scene: Ch17Scene, corpus: [SPICE_PTS, TRY_LINES, "GELU"] },
  { spec: ch18, Scene: Ch18Scene, corpus: [FOLD_TABLE] },
  { spec: ch19, Scene: Ch19Scene, corpus: ["学校 图书馆 公园", FEATURES] },
  { spec: ch20, Scene: Ch20Scene, corpus: [GRADED, "学校 图书馆 公园"] },
  { spec: ch21, Scene: Ch21Scene, corpus: [] },
  { spec: ch22, Scene: Ch22Scene, corpus: [RUNS] },
  { spec: ch23, Scene: Ch23Scene, corpus: [] },
  { spec: ch24, Scene: Ch24Scene, corpus: [ONLY_A, "○"] },
  { spec: ch25, Scene: Ch25Scene, corpus: [] },
  { spec: ch26, Scene: Ch26Scene, corpus: ["⋮ ↻ 10,000"] },
  { spec: ch27, Scene: Ch27Scene, corpus: [TOOLS2, DATASETS.map((d) => [d.good, d.bad]), "ReLU × 8 2×8 + 8 + 8 + 1 = 33"] },
];
