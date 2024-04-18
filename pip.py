import requests

b = "https://mainnet-idx.algonode.cloud/v2/transactions?address=MWR7GSIW2VYSXXQ6METWOPZDWOTAXJCOL3OVL7PBJIGG5POXESLAT5QOQE"

def transactions():
 a = requests.get(b)
 print(a)
 
 
transactions()