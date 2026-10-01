"""Build browser meshes from MakeHuman CC0 sources. See assets/ATTRIBUTION.md."""
import json
from pathlib import Path
from collections import defaultdict
import sys

source = Path(sys.argv[1] if len(sys.argv)>1 else '/tmp/stillpoint-mh-research')
output = Path(__file__).resolve().parents[1] / 'assets/anatomy.json'
verts, faces = [], []
group = ''
for line in (source/'base.obj').read_text().splitlines():
    parts = line.split()
    if not parts: continue
    if parts[0] == 'v': verts.append(tuple(map(float, parts[1:4])))
    elif parts[0] == 'g': group = parts[1]
    elif parts[0] == 'f' and group in ('body','helper-l-eye','helper-r-eye'):
        faces.append([int(v.split('/')[0])-1 for v in parts[1:]])

def mean(points): return tuple(sum(p[c] for p in points)/len(points) for c in range(3))
def subdivide(vs, fs):
    fp = [mean([vs[i] for i in f]) for f in fs]
    edges, vf, ve = {}, defaultdict(list), defaultdict(list)
    for fi,f in enumerate(fs):
        for j,a in enumerate(f):
            vf[a].append(fi)
            edge = tuple(sorted((a,f[(j+1)%len(f)])))
            edges.setdefault(edge,[]).append(fi)
    for edge in edges:
        for a in edge: ve[a].append(edge)
    moved = []
    for i,p in enumerate(vs):
        boundary=[e for e in ve[i] if len(edges[e])==1]
        if boundary:
            neighbors = [vs[e[1] if e[0]==i else e[0]] for e in boundary]
            avg=mean(neighbors)
            moved.append(tuple(.75*p[c]+.25*avg[c] for c in range(3)))
        else:
            n=len(vf[i]); f=mean([fp[j] for j in vf[i]])
            r=mean([mean([vs[e[0]],vs[e[1]]]) for e in ve[i]])
            moved.append(tuple((f[c]+2*r[c]+(n-3)*p[c])/n for c in range(3)))
    edgeids={}
    for e,adj in edges.items():
        edgeids[e]=len(moved)
        moved.append(mean([vs[e[0]],vs[e[1]]]+[fp[j] for j in adj]) if len(adj)==2 else mean([vs[e[0]],vs[e[1]]]))
    offset=len(moved); moved.extend(fp)
    quads=[]
    for fi,f in enumerate(fs):
        for j,a in enumerate(f):
            quads.append([a,edgeids[tuple(sorted((a,f[(j+1)%len(f)])))],offset+fi,edgeids[tuple(sorted((a,f[j-1])))]] )
    contours=[]
    for (a,b),mid in edgeids.items(): contours.extend([a,mid,mid,b])
    return moved,quads,contours

models={}
for sex in ('female','male'):
    v=[list(p) for p in verts]
    # Each target is an additive delta on the common hm08 base.
    for target,weight in [(source/f'{ancestry}-{sex}-young.target',1/3) for ancestry in ('african','asian','caucasian')] + [(source/f'universal-{sex}-young-averagemuscle-averageweight.target',0.8),(source/f'universal-{sex}-young-maxmuscle-averageweight.target',0.2)]:
        for line in target.read_text().splitlines():
            if not line or line.startswith('#'): continue
            parts=line.split(); i=int(parts[0])
            for c in range(3): v[i][c]+=float(parts[c+1])*weight
    used=sorted({i for f in faces for i in f}); remap={old:new for new,old in enumerate(used)}
    vv=[v[i] for i in used]; ff=[[remap[i] for i in f] for f in faces]
    vv,ff,edges=subdivide(vv,ff)
    low=min(p[1] for p in vv); high=max(p[1] for p in vv); scale=4.2/(high-low)
    vv=[(p[0]*scale,(p[1]-low)*scale-2.32,p[2]*scale) for p in vv]
    triangles=[]
    for f in ff:
        for j in range(1,len(f)-1): triangles.extend([f[0],f[j],f[j+1]])
    models[sex]={'positions':[round(c,6) for p in vv for c in p],'indices':triangles,'edges':edges}
    print(sex,len(vv),'vertices',len(triangles)//3,'triangles')
output.write_text(json.dumps(models,separators=(',',':')))
print(output,output.stat().st_size,'bytes')
