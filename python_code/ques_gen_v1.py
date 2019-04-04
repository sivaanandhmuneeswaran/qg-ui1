import subprocess
import re
import sys
import json
file_name = sys.argv[1]
# file_name = "temp.json"
# with open(file_name) as json_file:
#     input = json.load(json_file)

input = json.loads(file_name)

for i in range(0,len(input)):
    c1 = "STR=\""+input[i]["tagged_sentence"]+"\""
    c2 = """curl -i -X POST -H "Content-Type: application/json" -d "[{\\"src\\":\\"$STR\\", \\"id\\": 1}]"  http://0.0.0.0:5000/translator/translate"""
    commands = c1+'\n'+c2
    process = subprocess.Popen('/bin/bash', stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    out, err = process.communicate(commands.encode('utf-8'))
    res_str = out.decode('utf-8')
    res = re.search(r"{(.*)}",res_str)
    res_json = json.loads("{" + res.group(1) + "}")
    input[i]["question"] = res_json['tgt']
    input[i]["score"] = res_json['pred_score']

# str = ''
data = json.dumps(input,ensure_ascii=False)
# for i in range(0,len(input)):
#     str = str + "'" +input[i]['answer'] + "'" +','
# print(str)
print(data)
# with open('out.json','w') as out:
#     json.dump(input,out,ensure_ascii=False)
