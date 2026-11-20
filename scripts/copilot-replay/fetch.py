import json, sys, fsspec, pyarrow.parquet as pq, pyarrow.compute as pc, pyarrow as pa
BASE = "https://huggingface.co/datasets/xxparthparekhxx/indian-stock-market-minute-data/resolve/main/minute/train-%05d.parquet"
idx = json.load(open(sys.argv[1])); outdir = sys.argv[2]
SYMS = ['RELIANCE','HDFCBANK','ICICIBANK','INFY','TCS','SBIN','BHARTIARTL','ITC','LT','NIFTY']
fs = fsspec.filesystem("https", block_size=2**22, client_kwargs={"trust_env": True})
need = {}
for s in SYMS:
    for r in idx:
        if r['min'] and r['min'] <= s <= r['max']:
            need.setdefault(r['shard'], set()).add(r['rg'])
for shard, rgs in sorted(need.items()):
    with fs.open(BASE % shard, "rb") as f:
        pf = pq.ParquetFile(f)
        t = pf.read_row_groups(sorted(rgs))
    for s in SYMS:
        sub = t.filter(pc.equal(t['symbol'], s))
        if sub.num_rows == 0: continue
        cutoff = pc.max(sub['timestamp']).as_py()
        import datetime as dt
        sub = sub.filter(pc.greater_equal(sub['timestamp'], pa.scalar(cutoff - dt.timedelta(days=95), type=sub.schema.field('timestamp').type)))
        pq.write_table(sub, f"{outdir}/{s}.parquet")
        print(s, sub.num_rows, file=sys.stderr)
