#! /bin/bash
set -e

find . -name deploy.sh | while read script
do 
    echo Running "$script":
    (cd $(dirname $script); ./$(basename "$script"))
done
