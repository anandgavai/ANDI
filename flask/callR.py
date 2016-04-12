import subprocess
import json

i = open('Jtests.json').read()
print i
exit()
p = subprocess.Popen(["Rscript", "functionforandi1.R"], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
result = p.communicate(i)
print result
