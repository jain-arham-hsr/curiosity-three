import os

with open("output.txt", "w+") as file:
    file.write(os.environ['TEST_STRING'])