import json, sys, fsspec, pyarrow.parquet as pq
BASE = "https://huggingface.co/datasets/xxparthparekhxx/indian-stock-market-minute-data/resolve/main/minute/train-%05d.parquet"
fs = fsspec.filesystem("https", block_size=2**20, client_kwargs={"trust_env": True})
out = []
for i in range(10):
    url = BASE % i
    with fs.open(url, "rb") as f:
        pf = pq.ParquetFile(f)
        md = pf.metadata
        col = [md.schema.column(c).name for c in range(md.num_columns)].index("symbol")
        for rg in range(md.num_row_groups):
            st = md.row_group(rg).column(col).statistics
            out.append({"shard": i, "rg": rg, "rows": md.row_group(rg).num_rows, "min": st.min if st else None, "max": st.max if st else None})
    print(i, md.num_row_groups, "row groups", file=sys.stderr)
json.dump(out, open(sys.argv[1], "w"))
