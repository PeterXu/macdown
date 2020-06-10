#!/bin/bash
set -e

if [ $# -ne 1 -o ! -d "$1" ]; then
    echo "usage: $0 export_path" && echo 
    exit 1
fi

ROOT="$1"
NAME="MacDown"
APP="$ROOT/${NAME}.app"
if [ ! -e "$APP" ]; then
    echo "usage: $0 export_path" && echo
    exit 1
fi

VER=$(/usr/libexec/plistbuddy -c Print:CFBundleShortVersionString: "$APP/Contents/Info.plist")
VOL="${NAME}-v${VER}"
DMG="${VOL}.dmg"

rm -f ${DMG}

opts="--no-internet-enable"
opts="$opts --window-pos 100 100 --window-size 800 360 --app-drop-link 500 30"
opts="$opts --hdiutil-quiet"
create-dmg $opts --volname "${VOL}" "${DMG}" "${APP}"

exit 0
