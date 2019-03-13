import subprocess
import re
import sys
import json
file_name = sys.argv[1]
# file_name = "temp.json"
with open(file_name) as json_file:
    input = json.load(json_file)

# inputc = []
# inputc.append(input[0])
# inputc.append(input[1])
# inputc[0]["question"] = "What is question1?"
# inputc[1]["question"] = "What is question2"
for i in range(0,len(input)):
    c1 = "STR=\""+input[i]["tagged_sentence"]+"\""
    c2 = """curl -i -X POST -H "Content-Type: application/json" -d "[{\\"src\\":\\"$STR\\", \\"id\\": 1}]"  http://10.129.2.77:5002/translator/translate"""
    commands = c1+'\n'+c2
    process = subprocess.Popen('/bin/bash', stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    out, err = process.communicate(commands.encode('utf-8'))
    res_str = out.decode('utf-8')
    res = re.search(r"\"tgt\":\"(.*)\"",res_str)
    input[i]["question"] = res.group(1)

data = json.dumps(input,ensure_ascii=False)
print(data)
# with open('out.json','w') as out:
#     json.dump(input,out,ensure_ascii=False)
