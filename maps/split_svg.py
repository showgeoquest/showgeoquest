# split_svg.py
# usage: python3 split_svg.py japan.svg out_maps

import os
import sys
import copy
import xml.etree.ElementTree as ET

REGIONS = {
    "01hokkaido-tohoku": ["01","02","03","04","05","06","07"],
    "02kanto": ["08","09","10","11","12","13","14"],
    "03chubu": ["15","16","17","18","19","20","21","22","23"],
    "04kinki": ["24","25","26","27","28","29","30"],
    "05chugoku-shikoku": ["31","32","33","34","35","36","37","38","39"],
    "06kyushu-okinawa": ["40","41","42","43","44","45","46","47"],
}

def find_prefectures_group(root: ET.Element) -> ET.Element:
    # class="prefectures" を探す（namespace無視で走査）
    for el in root.iter():
        cls = el.attrib.get("class", "")
        if "prefectures" in cls.split():
            return el
    raise RuntimeError('Could not find <g class="prefectures"> in SVG.')

def main():
    if len(sys.argv) < 3:
        print("usage: python3 split_svg.py japan.svg out_maps")
        sys.exit(1)

    src_svg = sys.argv[1]
    out_dir = sys.argv[2]
    os.makedirs(out_dir, exist_ok=True)

    # Parse
    tree = ET.parse(src_svg)
    root = tree.getroot()

    # Grab prefectures group and its prefecture children (data-code)
    pref_group = find_prefectures_group(root)

    # data-code を持つ直下の要素（通常は都道府県の <g>）
    all_children = list(pref_group)
    pref_nodes = []
    for ch in all_children:
        code = ch.attrib.get("data-code")
        if code is not None:
            # "1" -> "01" に正規化
            code2 = code.zfill(2)
            pref_nodes.append((code2, ch))

    if len(pref_nodes) < 47:
        # 47未満なら構造が想定と違う可能性
        # ただし沖縄などが別階層でも動く場合はあるので、警告だけ出す
        print(f"warning: found {len(pref_nodes)} prefecture nodes with data-code (expected ~47).")

    # Map code -> original element
    code_to_node = {c: n for c, n in pref_nodes}

    # Produce region svgs
    for region_name, codes in REGIONS.items():
        # deep copy whole root
        new_root = copy.deepcopy(root)

        # find prefectures group in copied tree
        new_pref_group = find_prefectures_group(new_root)

        # remove all existing children under prefectures group
        for child in list(new_pref_group):
            new_pref_group.remove(child)

        # re-add only requested prefectures, in code order
        for code in codes:
            if code not in code_to_node:
                raise RuntimeError(f"missing data-code={code} in source SVG")
            new_pref_group.append(copy.deepcopy(code_to_node[code]))

        out_path = os.path.join(out_dir, f"{region_name}.svg")
        ET.ElementTree(new_root).write(out_path, encoding="utf-8", xml_declaration=True)
        print("wrote:", out_path)

if __name__ == "__main__":
    main()