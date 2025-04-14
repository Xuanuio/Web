import pandas as pd

# Đọc file JSON
df = pd.read_json("data.json")

# Ép tất cả cột về chuỗi
df = df.astype(str)

df["phone"] = df["phone"].apply(lambda x: "0" + x)

df["bankAccount"] = df["bankAccount"].apply(lambda x: "0" + x)

# Cắt 10 ký tự đầu của timestamp
df["timestamp"] = df["timestamp"].str[:10]

# Ghi ra CSV
df.to_csv("data.csv", index=False)

print('File: data.csv')