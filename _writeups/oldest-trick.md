---
title: HTB Cyber Apocalpyse - Oldest Trick in the Book
date: 2021-04-19
tags: [wireshark, firefox]
---

We are given a network traffic file, `older_trick.pcap`.

The ICMP requests seemed to carry some hex data.

```bash
$ tshark -r older_trick.pcap -T fields -e data.data -Y "icmp && ip.src == 192.168.1.7" > icmp
$ cat icmp | head -n4
b7ae040000000000504b0304140000000000729e8d52659b504b0304140000000000729e8d52659b504b030414000000
ead10400000000004c6b18000000180000001000000066694c6b18000000180000001000000066694c6b180000001800
99e80400000000006e692f6164646f6e732e6a736f6e7b226e692f6164646f6e732e6a736f6e7b226e692f6164646f6e
cafb040000000000736368656d61223a362c226164646f6e736368656d61223a362c226164646f6e736368656d61223a
```

The decoded hex of the first four lines:
```
·®......PK........r..Re.PK........r..Re.PK......
êÑ......Lk............fiLk............fiLk......
.è......ni/addons.json{"ni/addons.json{"ni/addon
Êû......schema":6,"addonschema":6,"addonschema":
```

It seems that a zip file was transported in the data. In addition, the bytes are repeated within each line. Taking the unique, non-truncated, repeated substring from each line and converting from hex yields a valid zip file. Looking at the files within, the contents of this zip file seems to be a Firefox profile directory.

One can extract saved login credentials from said directory using a tool like [firepwd](https://github.com/lclevy/firepwd):
```
globalSalt: b'01b140d77ce01478d4624b9ab8c56863690c0d02'
 SEQUENCE {
   SEQUENCE {
     OBJECTIDENTIFIER 1.2.840.113549.1.5.13 pkcs5 pbes2
     SEQUENCE {
       SEQUENCE {
         OBJECTIDENTIFIER 1.2.840.113549.1.5.12 pkcs5 PBKDF2
         SEQUENCE {
           OCTETSTRING b'95fda1dba9f24c707651b3c291b4a6deea35a8e887e189b2227d0c31fc16571e'
           INTEGER b'01'
           INTEGER b'20'
           SEQUENCE {
             OBJECTIDENTIFIER 1.2.840.113549.2.9 hmacWithSHA256
           }
         }
       }
       SEQUENCE {
         OBJECTIDENTIFIER 2.16.840.1.101.3.4.1.42 aes256-CBC
         OCTETSTRING b'aee249439295a35492e7f82793ce'
       }
     }
   }
   OCTETSTRING b'2d6447a1bd0a44f0d94b1afa1753322b'
 }
clearText b'70617373776f72642d636865636b0202'
password check? True
 SEQUENCE {
   SEQUENCE {
     OBJECTIDENTIFIER 1.2.840.113549.1.5.13 pkcs5 pbes2
     SEQUENCE {
       SEQUENCE {
         OBJECTIDENTIFIER 1.2.840.113549.1.5.12 pkcs5 PBKDF2
         SEQUENCE {
           OCTETSTRING b'08232f129076d8fab086cb388d7dac6aa53e8c32a038b70125bbac5a6f182b46'
           INTEGER b'01'
           INTEGER b'20'
           SEQUENCE {
             OBJECTIDENTIFIER 1.2.840.113549.2.9 hmacWithSHA256
           }
         }
       }
       SEQUENCE {
         OBJECTIDENTIFIER 2.16.840.1.101.3.4.1.42 aes256-CBC
         OCTETSTRING b'8983d65efa45b8eabcf57b89e189'
       }
     }
   }
   OCTETSTRING b'69e97dfca361120925a41e8f92855b628785df1a44e7ec42655a97b8cbf42e48'
 }
clearText b'ea61ad386b1fba7c23fb584391c1d30815c4da082fdcce0d0808080808080808'
decrypting login/password pairs
https://rabbitmq.makelarid.es:b'Frank_B',b'CHTB{long_time_no_s33_icmp}'
```

Evidently, the flag lies in the password.
