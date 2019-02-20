#!/bin/bash
set -e
#exit 0

ROOT="MacDown_App_Location"
APP_NAME="MacDown"

VERSION=$(/usr/libexec/plistbuddy -c Print:CFBundleShortVersionString: "$ROOT/${APP_NAME}.app/Contents/Info.plist")

VOL_NAME="${APP_NAME}-v${VERSION}"
DMG_TMP="${VOL_NAME}-temp.dmg"
DMG_FINAL="${VOL_NAME}.dmg"
STAGING_DIR="./Install"

echo "=== Copy app ..."
rm -rf "${STAGING_DIR}" "${DMG_TMP}" "${DMG_FINAL}"
mkdir -p "${STAGING_DIR}"
cp -rpf "$ROOT/${APP_NAME}.app" "${STAGING_DIR}"
SIZE=`du -sh "${STAGING_DIR}" | awk '{print $1}' | sed 's#\([0-9]*\).*#\1#'` 
SIZE=`echo "${SIZE} + 10.0" | bc | awk '{print int($1+0.5)}'`
if [ $? -ne 0 ]; then
	echo "Error: Cannot compute size of staging dir"
	exit 1
fi
echo "=== App size: ${SIZE}M"

echo "=== Create dmg: ${DMG_TMP}"
hdiutil create -srcfolder "${STAGING_DIR}" -volname "${VOL_NAME}" -fs HFS+ -fsargs "-c c=64,a=16,e=16" -format UDRW -size ${SIZE}M "${DMG_TMP}"
[ ! -e ${DMG_TMP} ] && exit 1

echo "=== Get device ..."
DEVICE=$(hdiutil attach -readwrite -noverify "${DMG_TMP}" | egrep '^/dev/' | sed 1q | awk '{print $1}')
echo "=== Get device: $DEVICE"
sleep 2

echo "=== Add link to /Applications"
pushd "/Volumes/$VOL_NAME"
ln -fs /Applications
popd

# set window prop
echo '
   tell application "Finder"
     tell disk "'${VOL_NAME}'"
           open
           set current view of container window to icon view
           set toolbar visible of container window to false
           set statusbar visible of container window to false
           set the bounds of container window to {400, 100, 938, 432}
           set viewOptions to the icon view options of container window
           set arrangement of viewOptions to not arranged
           set icon size of viewOptions to 72
           set position of item "'${APP_NAME}'.app" of container window to {160, 195}
           set position of item "Applications" of container window to {360, 195}
           close
           update without registering applications
           delay 2
     end tell
   end tell
' | osascript

echo "=== detach device: $DEVICE"
sync
hdiutil detach "${DEVICE}"

echo "=== Creating compressed image"
hdiutil convert "${DMG_TMP}" -format UDZO -imagekey zlib-level=9 -o "${DMG_FINAL}"
rm -rf "${DMG_TMP}"
rm -rf "${STAGING_DIR}"

exit 0
