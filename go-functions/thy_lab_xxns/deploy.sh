#! /bin/bash
set -e

gcloud functions deploy parse_${PWD##*/} --entry-point Parse --project hkraft-iot --trigger-http --runtime go111
