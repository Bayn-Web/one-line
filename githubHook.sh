#!/bin/bash

# 读取 package.json 文件内容
file_content=$(<./package.json)

# 替换 name 字段
updated_json=$(echo "$file_content" | sed 's/"name": "[^"]*"/"name": "@bayn-web\/oneline"/')

# 将更新后的内容写回 package.json
echo "$updated_json" > ./package.json