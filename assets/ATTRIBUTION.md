# Stillpoint anatomical models

Derived from MakeHuman's hm08 base mesh and macrodetail targets, explicitly released under CC0 in September 2020 by Data Collection AB, Joel Palmius, and Jonas Hauquier. The full asset license is in LICENSE-CC0.txt.

Source: https://github.com/makehumancommunity/makehuman/tree/master/makehuman/data

Included source groups: body, helper-l-eye, helper-r-eye. All other helper geometry is excluded.

Each model combines the three ancestry macrodetail targets equally, its female/male young-adult target, and an 80/20 blend of average/max muscle at average weight. Models receive one Catmull–Clark subdivision and uniform height normalization. Original quad edges provide the contour overlay.

To rebuild: download 3dobjs/base.obj and the macrodetails targets listed in scripts/build_anatomy.py into a source directory, then run `python3 scripts/build_anatomy.py SOURCE_DIRECTORY` from this project.

These are artistic human models, not diagnostic anatomical scans.
