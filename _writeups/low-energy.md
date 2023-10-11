---
title: HTB Cyber Apocalpyse - Low Energy Crypto
date: 2021-04-19
tags: [wireshark, bluetooth]
---

The Attribute Protocol (`btatt`), a part of the Bluetooth Low Energy Protocol stack, has some interesting data in four packets:
```
Frame 204, UART Tx:
    REQUESTING_PUBLIC_KEY
Frame 215, UART Rx:
    -----BEGIN PUBLIC KEY-----\nMGowDQYJKoZIhvcNAQEBBQADWQAwVgJBAKKPHxnmkWVC4fje7KMbWZf07zR10D0m\nB9fjj4tlG
Frame 223, UART Rx:
    kPOW+f8JGzgYJRWboekcnZfiQrLRhA3REn1lUKkRAnUqAkCEQDL/3Li\n4l+RI2g0FqJvf3ff\n-----END PUBLIC KEY-----\n
Frame 230, UART Tx:
    9)i�\030�����^E����\a\016x�9��\023w��bm\177�@�9*��\023��"�B���\177c������\020\026��pw�\n�8
```

It seems that we have a public key and some ciphertext. We could seek to decrypt the latter.

Full public key:
```
-----BEGIN PUBLIC KEY-----
MGowDQYJKoZIhvcNAQEBBQADWQAwVgJBAKKPHxnmkWVC4fje7KMbWZf07zR10D0m
B9fjj4tlGkPOW+f8JGzgYJRWboekcnZfiQrLRhA3REn1lUKkRAnUqAkCEQDL/3Li
4l+RI2g0FqJvf3ff
-----END PUBLIC KEY-----
```

Converted to RSA (`openssl rsa -pubin -in key.pub -RSAPublicKey_out`):
```
-----BEGIN RSA PUBLIC KEY-----
MFYCQQCijx8Z5pFlQuH43uyjG1mX9O80ddA9JgfX44+LZRpDzlvn/CRs4GCUVm6H
pHJ2X4kKy0YQN0RJ9ZVCpEQJ1KgJAhEAy/9y4uJfkSNoNBaib3933w==
-----END RSA PUBLIC KEY-----
```

To decrypt the ciphertext, the private key is needed. [`RsaCtfTool`](https://github.com/Ganapati/RsaCtfTool) served useful:
```
$ python3 RsaCtfTool.py --publickey key.pub --private

[*] Testing key key.pub.
[*] Performing factordb attack on key.pub.
[*] Performing smallq attack on key.pub.
[*] Performing boneh_durfee attack on key.pub.
Can't load boneh_durfee because sage binary is not installed
[*] Performing comfact_cn attack on key.pub.
[*] Performing cube_root attack on key.pub.
[*] Performing ecm2 attack on key.pub.
Can't load ecm2 because sage binary is not installed
[*] Performing fermat attack on key.pub.
[*] Attack success with fermat method !

Results for key.pub:

Private key :
-----BEGIN RSA PRIVATE KEY-----
MIIBSAIBAAJBAKKPHxnmkWVC4fje7KMbWZf07zR10D0mB9fjj4tlGkPOW+f8JGzg
YJRWboekcnZfiQrLRhA3REn1lUKkRAnUqAkCEQDL/3Li4l+RI2g0FqJvf3ffAkBY
f1ugn3b6H1bdtLy+J6LCgPH+K1E0clPrprjPjFO1pPUkxafxs8OysMDdT5VBx7dZ
RSLx7cCfTVWRTKSjwYKPAiEAy/9y4uJfkSNoNBaib393y3GZu+QkufE43A3BMLPC
NbcCIQDL/3Li4l+RI2g0FqJvf3fLcZm75CS58TjcDcEws8IQPwIgOPH5FJgQJVqt
p4YbY7+/yIp7p2fUakxUZS5op5whICsCICV6ZBfopz4GRE41SnXnOlBoO+WcFt1k
zxKFQDbsdw7HAiEAl75cvn4PGBPnzNuQy0356OtfwK/Q6QFWdxAaWm6ncSM=
-----END RSA PRIVATE KEY-----
```

After stripping the trailing null bytes from the ciphertext, this yielded the flag:
```
$ openssl rsautl -decrypt -in f.data -inkey key.sec
CHTB{5p34k_fr13nd_4nd_3n73r}
```
