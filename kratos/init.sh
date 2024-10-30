#!/bin/sh

kratos migrate sql -c /etc/config/kratos/kratos.yml -e --yes
kratos serve -c /etc/config/kratos/kratos.yml --dev --watch-courier

# Wait for serve process to exit
wait -n

# Exit with serve status
exit $?
