import json
with open("output.json") as json_file:
    input = json.load(json_file)
question = []
possibility = []
res = []
score = []
for i in range(0,len(input)):
    flag = 1
    index = int(input[i]["index"])//10
    s_index = int(input[i]["index"])%10
    question.append(input[i]["question"])
    score.append(input[i]["score"])
    possibility.append(True)
    if(index != int(input[i+1]["index"])//10 ):
        flag = 0
        res.append({'index':index,'original_sentence':input[i]["original_sentence"],'tagged_sentence':input[i]["tagged_sentence"],'answer':input[i]["answer"],'question':question,'possibility':possibility,'score':score})
        possibility = []
        question = []
        score = []
if(flag == 1):
    res.append({'index':index,'original_sentence':input[i]["original_sentence"],'tagged_sentence':input[i]["tagged_sentence"],'answer':input[i]["answer"],'question':question,'possibility':possibility,'score':score})
print(res)
# print(input[0])